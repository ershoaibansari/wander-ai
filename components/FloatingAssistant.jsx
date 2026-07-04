"use client";

import { useState } from "react";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("What local dish should I try?");
  const [answer, setAnswer] = useState("Ask me about dress codes, food, etiquette, bargaining, or hidden cultural context.");
  const [loading, setLoading] = useState(false);

  async function askAssistant(event) {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: question }] }),
    });
    const payload = await response.json();
    setAnswer(payload.reply || payload.data?.reply || payload.data || "Gemini could not answer just now.");
    setLoading(false);
  }

  if (!open) {
    return (
      <button className="assistant-launcher" type="button" onClick={() => setOpen(true)} aria-label="Open AI travel assistant">
        AI Assistant
      </button>
    );
  }

  return (
    <aside className="chat-float assistant-panel" aria-label="Floating AI travel assistant">
      <div className="assistant-header">
        <div>
          <p className="assistant-eyebrow">Gemini cultural guide</p>
          <h2 className="assistant-title">AI Travel Assistant</h2>
        </div>
        <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close AI travel assistant">
          ×
        </button>
      </div>
      <form onSubmit={askAssistant} className="assistant-body">
        <label className="label" htmlFor="assistant-question">
          Ask a travel question
        </label>
        <input
          id="assistant-question"
          type="text"
          className="input assistant-input"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button className="btn btn-primary w-full assistant-submit" disabled={loading} type="submit">
          {loading ? "Gemini is thinking..." : "Ask Gemini"}
        </button>
        <p className="assistant-answer" aria-live="polite">
          {answer}
        </p>
      </form>
    </aside>
  );
}
