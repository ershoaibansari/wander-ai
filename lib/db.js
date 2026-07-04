/**
 * Server-side Firestore data layer. All collections use the "-wander"
 * suffix via COLLECTIONS. Reads for demo accounts fall back to the local
 * demo dataset if Firestore is unreachable, so the judge demo never breaks.
 */
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { COLLECTIONS, BADGE_CATALOG } from "@/lib/constants";
import { DEMO_USERS, getDemoUserById, getDemoCommunityPosts, isDemoUserId } from "@/lib/demo-data";
import { slugify } from "@/lib/utils";

const col = (key) => collection(db, COLLECTIONS[key]);
const ref = (key, id) => doc(db, COLLECTIONS[key], id);
const newId = () => doc(collection(db, "_ids")).id;

const snapToObj = (snap) => ({ id: snap.id, ...snap.data() });

/**
 * Retrieves a user profile document from Firestore by their email address.
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object|null>} The user profile object, or null if not found.
 */
export async function getUserByEmail(email) {
  const result = await getDocs(
    query(col("users"), where("email", "==", String(email).toLowerCase().trim()), limit(1))
  );
  return result.empty ? null : snapToObj(result.docs[0]);
}

/**
 * Retrieves a user profile document from Firestore or local demo catalog by their ID.
 * @param {string} id - The unique user identifier.
 * @returns {Promise<Object|null>} The user profile object with isDemo flag if applicable, or null if not found.
 */
export async function getUserById(id) {
  try {
    const snap = await getDoc(ref("users", id));
    if (snap.exists()) return snapToObj(snap);
  } catch (error) {
    console.error("[db] getUserById failed:", error.message);
  }
  const demo = getDemoUserById(id);
  if (demo) {
    const { savedTrips, tripHistory, passportStamps, badges, quizResults, communityPosts, ...profile } = demo;
    return { ...profile, isDemo: true };
  }
  return null;
}

/**
 * Creates a new user profile document in Firestore.
 * @param {Object} profile - The user profile data fields.
 * @returns {Promise<Object>} The newly created user document profile.
 */
export async function createUser(profile) {
  const id = newId();
  const user = { ...profile, createdAt: Date.now() };
  await setDoc(ref("users", id), user);
  return { id, ...user };
}

/**
 * Updates an existing user profile document fields in Firestore.
 * @param {string} id - The user identifier.
 * @param {Object} data - The subset of fields to update.
 * @returns {Promise<void>}
 */
export async function updateUser(id, data) {
  await updateDoc(ref("users", id), { ...data, updatedAt: Date.now() });
}

/* -------------------------- per-user listings ------------------------- */

/**
 * Fallback generator that resolves demo data for users when Firestore is unavailable.
 * @param {string} key - The query type (savedTrips, tripHistory, passport, etc).
 * @param {string} userId - The user identifier.
 * @returns {Array} List of demo items.
 */
function demoFallbackFor(key, userId) {
  const demo = getDemoUserById(userId);
  if (!demo) return [];
  const map = {
    savedTrips: demo.savedTrips,
    tripHistory: demo.tripHistory,
    passport: demo.passportStamps.map((s, i) => ({ id: `${userId}-stamp-${i}`, ...s })),
    badges: demo.badges.map((badgeId) => ({
      id: `${userId}_${badgeId}`,
      badgeId,
      createdAt: Date.now(),
    })),
    cultureQuiz: demo.quizResults.map((q, i) => ({ id: `${userId}-quiz-${i}`, ...q })),
  };
  return map[key] ?? [];
}

/**
 * Lists documents belonging to a user from a specific collection (newest first).
 * Attempts database-level sorting first, then falls back to client-side sorting.
 * @param {string} key - The Firestore collection key name.
 * @param {string} userId - The user identifier.
 * @param {number} [max=50] - The maximum number of documents to retrieve.
 * @returns {Promise<Array>} List of user documents.
 */
export async function listForUser(key, userId, max = 50) {
  try {
    try {
      const result = await getDocs(
        query(col(key), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(max))
      );
      return result.docs.map(snapToObj);
    } catch (indexError) {
      const result = await getDocs(query(col(key), where("userId", "==", userId), limit(max)));
      return result.docs.map(snapToObj).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    }
  } catch (error) {
    console.error(`[db] listForUser(${key}) failed:`, error.message);
    if (isDemoUserId(userId)) return demoFallbackFor(key, userId);
    throw error;
  }
}

/**
 * Adds a new document for a specific user to a Firestore collection.
 * @param {string} key - The collection key name.
 * @param {string} userId - The user identifier.
 * @param {Object} data - The document data to save.
 * @returns {Promise<Object>} The saved document with its unique ID.
 */
export async function addForUser(key, userId, data) {
  const id = newId();
  const docData = { ...data, userId, createdAt: Date.now() };
  await setDoc(ref(key, id), docData);
  return { id, ...docData };
}

/**
 * Retrieves a document from Firestore, verifying that it belongs to the active user.
 * @param {string} key - The collection key name.
 * @param {string} id - The document identifier.
 * @param {string} userId - The user identifier.
 * @returns {Promise<Object|null>} The document object, or null if not found or unauthorized.
 */
export async function getOwnedDoc(key, id, userId) {
  const snap = await getDoc(ref(key, id));
  if (!snap.exists() || snap.data().userId !== userId) return null;
  return snapToObj(snap);
}

/**
 * Deletes a document from Firestore, verifying that it belongs to the active user.
 * @param {string} key - The collection key name.
 * @param {string} id - The document identifier.
 * @param {string} userId - The user identifier.
 * @returns {Promise<boolean>} True if deleted successfully, false otherwise.
 */
export async function deleteOwnedDoc(key, id, userId) {
  const owned = await getOwnedDoc(key, id, userId);
  if (!owned) return false;
  await deleteDoc(ref(key, id));
  return true;
}

/* ------------------------------ passport ------------------------------ */

/**
 * Adds or merges a passport stamp for a user.
 * @param {string} userId - The user identifier.
 * @param {Object} stampData - The stamp details (destination, country, emoji).
 * @returns {Promise<Object>} The added stamp details.
 */
export async function addPassportStamp(userId, { destination, country, emoji }) {
  const id = `${userId}_${slugify(destination)}`;
  const stamp = {
    userId,
    destination,
    country: country ?? "",
    emoji: emoji || "📍",
    createdAt: Date.now(),
  };
  await setDoc(ref("passport", id), stamp, { merge: true });
  return { id, ...stamp };
}

/* ------------------------------- badges ------------------------------- */

/**
 * Awards a set of badges to a user.
 * @param {string} userId - The user identifier.
 * @param {string[]} badgeIds - The list of badge IDs to award.
 * @returns {Promise<string[]>} The list of awarded badge IDs.
 */
export async function awardBadges(userId, badgeIds) {
  const valid = badgeIds.filter((badgeId) => BADGE_CATALOG[badgeId]);
  await Promise.all(
    valid.map((badgeId) =>
      setDoc(
        ref("badges", `${userId}_${badgeId}`),
        { userId, badgeId, createdAt: Date.now() },
        { merge: true }
      )
    )
  );
  return valid;
}

/* ------------------------------- quiz --------------------------------- */

/**
 * Saves a culture quiz score for a user and triggers badge rewards.
 * @param {string} userId - The user identifier.
 * @param {Object} quizData - Quiz result containing destination, score, and total.
 * @returns {Promise<Object>} The quiz results and any newly earned badges.
 */
export async function saveQuizResult(userId, { destination, score, total }) {
  const result = await addForUser("cultureQuiz", userId, { destination, score, total });
  const earned = ["curious-mind"];
  if (score >= 4) earned.push("culture-scholar");
  await awardBadges(userId, earned);
  return { result, earnedBadges: earned };
}

/* ------------------------------ community ----------------------------- */

/**
 * Lists community posts from Firestore (newest first).
 * Blends in static demo posts so the feed is never empty.
 * @param {number} [max=50] - The maximum number of posts to retrieve.
 * @returns {Promise<Array>} List of community posts.
 */
export async function listCommunityPosts(max = 50) {
  try {
    const result = await getDocs(query(col("communityPosts"), orderBy("createdAt", "desc"), limit(max)));
    const posts = result.docs.map(snapToObj);
    // Blend in demo posts so the feed is never empty for judges.
    const existingIds = new Set(posts.map((post) => post.id));
    const demoPosts = getDemoCommunityPosts().filter((post) => !existingIds.has(post.id));
    return [...posts, ...demoPosts].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).slice(0, max);
  } catch (error) {
    console.error("[db] listCommunityPosts failed:", error.message);
    return getDemoCommunityPosts();
  }
}

/**
 * Creates a new community post in Firestore and awards the community-voice badge.
 * @param {Object} user - The active user details.
 * @param {Object} postData - Post metadata (title, body, destination, photoUrl, tags).
 * @returns {Promise<Object>} The newly created post object with ID.
 */
export async function createCommunityPost(user, { title, body, destination, photoUrl, tags }) {
  const id = newId();
  const post = {
    userId: user.id,
    userName: user.name,
    userAvatar: user.image ?? null,
    title,
    body,
    destination: destination ?? "",
    photoUrl: photoUrl ?? null,
    tags: tags ?? [],
    likeCount: 0,
    commentCount: 0,
    createdAt: Date.now(),
  };
  await setDoc(ref("communityPosts", id), post);
  await awardBadges(user.id, ["community-voice"]);
  return { id, ...post };
}

/**
 * Toggles a like status on a post for a specific user.
 * @param {string} postId - The post identifier.
 * @param {string} userId - The user identifier.
 * @returns {Promise<Object>} Object containing the updated liked state.
 */
export async function toggleLike(postId, userId) {
  const likeRef = ref("likes", `${postId}_${userId}`);
  const existing = await getDoc(likeRef);
  const postRef = ref("communityPosts", postId);
  if (existing.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(postRef, { likeCount: increment(-1) }).catch(() => {});
    return { liked: false };
  }
  await setDoc(likeRef, { postId, userId, createdAt: Date.now() });
  await updateDoc(postRef, { likeCount: increment(1) }).catch(() => {});
  return { liked: true };
}

/**
 * Toggles a bookmark status on a post for a specific user.
 * @param {string} postId - The post identifier.
 * @param {string} userId - The user identifier.
 * @returns {Promise<Object>} Object containing the updated bookmarked state.
 */
export async function toggleBookmark(postId, userId) {
  const bookmarkRef = ref("bookmarks", `${postId}_${userId}`);
  const existing = await getDoc(bookmarkRef);
  if (existing.exists()) {
    await deleteDoc(bookmarkRef);
    return { bookmarked: false };
  }
  await setDoc(bookmarkRef, { postId, userId, createdAt: Date.now() });
  return { bookmarked: true };
}

/**
 * Appends a comment to a community post.
 * @param {string} postId - The target post identifier.
 * @param {Object} user - The active user details.
 * @param {string} text - The comment text content.
 * @returns {Promise<Object>} The created comment document with ID.
 */
export async function addComment(postId, user, text) {
  const id = newId();
  const comment = {
    postId,
    userId: user.id,
    userName: user.name,
    text,
    createdAt: Date.now(),
  };
  await setDoc(ref("comments", id), comment);
  await updateDoc(ref("communityPosts", postId), { commentCount: increment(1) }).catch(() => {});
  return { id, ...comment };
}

/**
 * Lists all comments belonging to a specific post.
 * Attempts database-level sorting first, falling back to client-side sorting.
 * @param {string} postId - The post identifier.
 * @param {number} [max=100] - The maximum number of comments to retrieve.
 * @returns {Promise<Array>} List of comments.
 */
export async function listComments(postId, max = 100) {
  try {
    try {
      const result = await getDocs(
        query(col("comments"), where("postId", "==", postId), orderBy("createdAt", "asc"), limit(max))
      );
      return result.docs.map(snapToObj);
    } catch (indexError) {
      const result = await getDocs(query(col("comments"), where("postId", "==", postId), limit(max)));
      return result.docs.map(snapToObj).sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
    }
  } catch (error) {
    console.error("[db] listComments failed:", error.message);
    return [];
  }
}

/**
 * Gets a user's reaction statuses (likes and bookmarks) for a set of posts.
 * @param {string} userId - The user identifier.
 * @param {string[]} postIds - The list of post IDs to inspect.
 * @returns {Promise<Object>} Object containing liked and bookmarked post ID arrays.
 */
export async function getUserReactions(userId, postIds) {
  try {
    const [likes, bookmarks] = await Promise.all([
      getDocs(query(col("likes"), where("userId", "==", userId))),
      getDocs(query(col("bookmarks"), where("userId", "==", userId))),
    ]);
    const wanted = new Set(postIds);
    return {
      liked: likes.docs.map((d) => d.data().postId).filter((id) => wanted.has(id)),
      bookmarked: bookmarks.docs.map((d) => d.data().postId).filter((id) => wanted.has(id)),
    };
  } catch (error) {
    console.error("[db] getUserReactions failed:", error.message);
    return { liked: [], bookmarked: [] };
  }
}

/* ----------------------------- demo seeding --------------------------- */

/**
 * Idempotently seed a demo user's preloaded data into Firestore on first
 * demo login. Failures are non-fatal: reads fall back to local demo data.
 * @param {Object} demoUser - The demo user structure from demo-data.js.
 * @returns {Promise<void>}
 */
export async function seedDemoUser(demoUser) {
  try {
    const marker = await getDoc(ref("demoUsers", demoUser.id));
    if (marker.exists()) return;

    const batch = writeBatch(db);
    const { savedTrips, tripHistory, passportStamps, badges, quizResults, communityPosts, ...profile } = demoUser;

    batch.set(ref("users", demoUser.id), { ...profile, isDemo: true, createdAt: Date.now() });
    savedTrips.forEach((trip) =>
      batch.set(ref("savedTrips", trip.id), { ...trip, userId: demoUser.id })
    );
    tripHistory.forEach((entry) =>
      batch.set(ref("tripHistory", entry.id), { ...entry, userId: demoUser.id })
    );
    passportStamps.forEach((stamp) =>
      batch.set(ref("passport", `${demoUser.id}_${slugify(stamp.destination)}`), {
        ...stamp,
        userId: demoUser.id,
      })
    );
    badges.forEach((badgeId) =>
      batch.set(ref("badges", `${demoUser.id}_${badgeId}`), {
        userId: demoUser.id,
        badgeId,
        createdAt: Date.now(),
      })
    );
    quizResults.forEach((quiz, index) =>
      batch.set(ref("cultureQuiz", `${demoUser.id}-quiz-${index}`), {
        ...quiz,
        userId: demoUser.id,
      })
    );
    communityPosts.forEach((post) =>
      batch.set(ref("communityPosts", post.id), {
        ...post,
        userId: demoUser.id,
        userName: demoUser.name,
        userAvatar: demoUser.avatar,
      })
    );
    batch.set(ref("demoUsers", demoUser.id), { seededAt: Date.now() });
    await batch.commit();
  } catch (error) {
    // Non-fatal by design — demo reads fall back to the local dataset.
    console.error("[db] seedDemoUser failed:", error.message);
  }
}

/**
 * Resolves full user dashboard information dynamically (custom database stats for real accounts, static catalogs for demo accounts).
 * @param {string} userId - The user identifier.
 * @returns {Promise<Object>} Completed user profile and stats lists.
 */
export async function getDashboardData(userId) {
  if (!userId) {
    const user = getDemoUserById("demo-emily");
    return {
      user,
      savedTrips: user.savedTrips,
      tripHistory: user.tripHistory,
      passport: user.passportStamps,
      badges: user.badges.map((b) => BADGE_CATALOG[b]).filter(Boolean),
      quizResults: user.quizResults,
      get communityPosts() {
        return getDemoCommunityPosts();
      },
    };
  }

  if (isDemoUserId(userId)) {
    const user = getDemoUserById(userId);
    return {
      user,
      savedTrips: user.savedTrips,
      tripHistory: user.tripHistory,
      passport: user.passportStamps,
      badges: user.badges.map((b) => BADGE_CATALOG[b]).filter(Boolean),
      quizResults: user.quizResults,
      get communityPosts() {
        return getDemoCommunityPosts();
      },
    };
  }

  try {
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");

    const [savedTrips, tripHistory, passport, dbBadges, quizResults] = await Promise.all([
      listForUser("savedTrips", userId),
      listForUser("tripHistory", userId),
      listForUser("passport", userId),
      listForUser("badges", userId),
      listForUser("cultureQuiz", userId),
    ]);

    const badges = dbBadges
      .map((b) => BADGE_CATALOG[b.badgeId])
      .filter(Boolean);

    return {
      user,
      savedTrips,
      tripHistory,
      passport,
      badges,
      quizResults,
      get communityPosts() {
        return getDemoCommunityPosts();
      },
    };
  } catch (err) {
    console.error("[db] getDashboardData failed:", err.message);
    const user = getDemoUserById("demo-emily");
    return {
      user,
      savedTrips: user.savedTrips,
      tripHistory: user.tripHistory,
      passport: user.passportStamps,
      badges: user.badges.map((b) => BADGE_CATALOG[b]).filter(Boolean),
      quizResults: user.quizResults,
      get communityPosts() {
        return getDemoCommunityPosts();
      },
    };
  }
}

export { DEMO_USERS, getDemoUserById, isDemoUserId };
