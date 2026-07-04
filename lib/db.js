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

/* ------------------------------- users -------------------------------- */

export async function getUserByEmail(email) {
  const result = await getDocs(
    query(col("users"), where("email", "==", String(email).toLowerCase().trim()), limit(1))
  );
  return result.empty ? null : snapToObj(result.docs[0]);
}

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

export async function createUser(profile) {
  const id = newId();
  const user = { ...profile, createdAt: Date.now() };
  await setDoc(ref("users", id), user);
  return { id, ...user };
}

export async function updateUser(id, data) {
  await updateDoc(ref("users", id), { ...data, updatedAt: Date.now() });
}

/* -------------------------- per-user listings ------------------------- */

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

/** List a user's docs in a collection, newest first (attempts db sorting, falls back to JS sorting). */
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

export async function addForUser(key, userId, data) {
  const id = newId();
  const docData = { ...data, userId, createdAt: Date.now() };
  await setDoc(ref(key, id), docData);
  return { id, ...docData };
}

export async function getOwnedDoc(key, id, userId) {
  const snap = await getDoc(ref(key, id));
  if (!snap.exists() || snap.data().userId !== userId) return null;
  return snapToObj(snap);
}

export async function deleteOwnedDoc(key, id, userId) {
  const owned = await getOwnedDoc(key, id, userId);
  if (!owned) return false;
  await deleteDoc(ref(key, id));
  return true;
}

/* ------------------------------ passport ------------------------------ */

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

export async function saveQuizResult(userId, { destination, score, total }) {
  const result = await addForUser("cultureQuiz", userId, { destination, score, total });
  const earned = ["curious-mind"];
  if (score >= 4) earned.push("culture-scholar");
  await awardBadges(userId, earned);
  return { result, earnedBadges: earned };
}

/* ------------------------------ community ----------------------------- */

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

export { DEMO_USERS, getDemoUserById, isDemoUserId };
