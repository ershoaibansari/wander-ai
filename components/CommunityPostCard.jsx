"use client";

import Image from "next/image";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

export function CommunityPostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likeCount || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: `${post.id}-starter-comment`,
      author: "WanderAI",
      text: "Thanks for sharing a culture-first travel tip.",
    },
  ]);

  function toggleLike() {
    setLiked((value) => !value);
    setLikes((value) => value + (liked ? -1 : 1));
  }

  function submitComment(event) {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setComments((items) => [
      ...items,
      {
        id: `${post.id}-${Date.now()}`,
        author: "You",
        text,
      },
    ]);
    setCommentText("");
    setCommentsOpen(true);
  }

  return (
    <article className="post-card">
      <div className="post-media-wrap">
        {post.photoUrl && (
          <Image src={post.photoUrl} alt={`${post.destination} travel memory`} width={900} height={520} className="post-media" />
        )}
        <div className="post-destination">{post.destination}</div>
      </div>
      <div className="post-content">
        <div className="post-meta">
          <div className="flex items-center gap-3">
            {post.userAvatar && (
              <Image src={post.userAvatar} alt={`${post.userName} avatar`} width={42} height={42} className="rounded-full" />
            )}
            <div>
              <p className="font-black">{post.userName}</p>
              <p className="muted text-sm">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <button
            className="save-button"
            type="button"
            onClick={() => setBookmarked((value) => !value)}
            aria-pressed={bookmarked}
            aria-label={`Bookmark ${post.title}`}
          >
            {bookmarked ? "Saved" : "Save"}
          </button>
        </div>
        <h2 className="post-title">{post.title}</h2>
        <p className="post-body">{post.body}</p>
        <div className="post-tags">
          {(post.tags || []).map((tag) => <span className="brand-chip" key={tag}>{tag}</span>)}
        </div>
        <div className="post-actions">
          <button className="action-button" type="button" onClick={toggleLike} aria-pressed={liked} aria-label={`Like ${post.title}`}>
            {liked ? "Liked" : "Like"} · {likes}
          </button>
          <button
            className="action-button"
            type="button"
            onClick={() => setCommentsOpen((value) => !value)}
            aria-expanded={commentsOpen}
            aria-controls={`${post.id}-comments`}
            aria-label={`Comment on ${post.title}`}
          >
            Comment · {comments.length + (post.commentCount || 0)}
          </button>
        </div>
        {commentsOpen && (
          <section className="comment-panel" id={`${post.id}-comments`} aria-label={`Comments on ${post.title}`}>
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <strong>{comment.author}</strong>
                  <span>{comment.text}</span>
                </li>
              ))}
            </ul>
            <form className="comment-form" onSubmit={submitComment}>
              <label className="sr-only" htmlFor={`${post.id}-comment-input`}>
                Add a comment
              </label>
              <input
                id={`${post.id}-comment-input`}
                className="input"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Share a thoughtful travel note..."
              />
              <button className="btn btn-primary" type="submit">
                Post
              </button>
            </form>
          </section>
        )}
      </div>
    </article>
  );
}
