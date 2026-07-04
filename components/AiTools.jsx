"use client";

import { useState } from "react";
import { LOADING_MESSAGES } from "@/lib/constants";

const endpoints = {
  discover: "/api/discover",
  story: "/api/story",
  itinerary: "/api/itinerary",
  culture: "/api/culture",
  phrases: "/api/phrases",
  quiz: "/api/quiz",
  etiquette: "/api/etiquette",
  cheats: "/api/cheats",
};

export function DiscoverTool() {
  return (
    <AiTool
      type="discover"
      title="AI Destination Discovery"
      description="Enter a place or travel mood and Gemini returns attractions, hidden gems, neighborhoods, viewpoints, markets, and authentic experiences."
      fields={[
        ["query", "Destination or mood", "I want peaceful mountains"],
      ]}
      render={(data) => (
        <div className="space-y-6">
          <div className="grid-auto">
            <ResultList title="Attractions" items={data.attractions} />
            <ResultList title="Hidden gems" items={data.hiddenGems} />
            <ResultList title="Local neighborhoods" items={data.neighborhoods} nameKey="name" detailKey="knownFor" />
            <ResultList title="Authentic experiences" items={data.experiences} detailKey="why" />
            <ResultList title="Local food suggestions" items={data.localFood} />
            <ResultList title="Festivals and events" items={data.festivalsEvents} />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <SaveTripButton
              destination={data.destination || "this destination"}
              summary={data.vibe || `Explored attractions and gems in ${data.destination}`}
              tags={(data.hiddenGems || []).slice(0, 3).map((g) => g.name) || []}
            />
            <ClaimStampButton destination={data.destination || "this destination"} />
          </div>
        </div>
      )}
    />
  );
}

export function StoryTool() {
  return (
    <AiTool
      type="story"
      title="AI Storytelling"
      description="Generate emotional, historical, story-driven cultural writing."
      fields={[["destination", "Destination", "Kyoto"]]}
      render={(data) => <article className="surface whitespace-pre-line p-5 leading-8">{data.story || data.data}</article>}
    />
  );
}

export function ItineraryTool() {
  return (
    <AiTool
      type="itinerary"
      title="AI One-Day Itinerary"
      description="Plan morning, afternoon, evening, and night around your budget, hours, walking preference, and interests."
      fields={[
        ["destination", "Destination", "Hanoi"],
        ["budget", "Budget", "Budget"],
        ["hours", "Available hours", "10"],
        ["walkingPreference", "Walking preference", "High"],
        ["interests", "Travel interests", "Food, markets, heritage"],
      ]}
      render={(data) => (
        <div className="space-y-6">
          <div className="grid-auto">
            {["morning", "afternoon", "evening", "night"].map((part) => {
              const partData = data[part] || data[part.charAt(0).toUpperCase() + part.slice(1)];
              const title = partData?.title || partData?.Title || partData?.name || partData?.Name || "";
              const plan = partData?.plan || partData?.Plan || partData?.description || partData?.Description || "";
              const cost = partData?.estimatedCost || partData?.EstimatedCost || partData?.cost || partData?.Cost || "";
              return (
                <article key={part} className="surface p-5">
                  <p className="kicker">{part}</p>
                  <h3 className="mt-2 font-black">{title}</h3>
                  <p className="muted mt-2">{plan}</p>
                  <p className="mt-3 font-bold">{cost}</p>
                </article>
              );
            })}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <SaveTripButton
              destination={data.destination || "this destination"}
              summary={data.summary || `One day custom itinerary in ${data.destination}`}
              tags={["Itinerary", data.transportSuggestion ? "Transit" : ""].filter(Boolean)}
            />
            <ClaimStampButton destination={data.destination || "this destination"} />
          </div>
        </div>
      )}
    />
  );
}

export function CultureTool() {
  return (
    <AiTool
      type="culture"
      title="AI Cultural Companion"
      description="Learn customs, greetings, religion, traditions, dress code, photography rules, dining etiquette, gift etiquette, and what to avoid."
      fields={[["destination", "Destination", "Kyoto"]]}
      render={(data) => (
        <div className="space-y-6">
          <div className="grid-auto">
            {Object.entries(data).filter(([key]) => !["destination", "thingsToAvoid", "emergencyTips"].includes(key)).map(([key, value]) => (
              <article key={key} className="surface p-4">
                <h3 className="font-black capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
                <p className="muted mt-2">{value}</p>
              </article>
            ))}
            <ResultList title="Things tourists should avoid" items={(data.thingsToAvoid || []).map((name) => ({ name }))} />
            <ResultList title="Emergency tips" items={(data.emergencyTips || []).map((name) => ({ name }))} />
          </div>
          <ClaimStampButton destination={data.destination || "this destination"} />
        </div>
      )}
    />
  );
}

export function PhrasesTool() {
  return (
    <AiTool
      type="phrases"
      title="Learn Local Phrases"
      description="Get basics, taxi phrases, restaurant phrases, shopping phrases, emergency phrases, and pronunciation help."
      fields={[["destination", "Destination", "Thailand"]]}
      render={(data) => {
        const langCode = LANG_MAP[String(data.language || "").toLowerCase().trim()] || "en-US";
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {data.language && (
                <p className="surface p-3 font-bold text-sm">
                  Language: <span className="text-[var(--primary-strong)]">{data.language}</span> {data.note && `(${data.note})`}
                </p>
              )}
              <div className="grid-auto">
                {["basics", "taxi", "restaurant", "shopping", "emergency"].map((group) => (
                  <ResultListWithSpeech key={group} title={group} items={data[group]} langCode={langCode} />
                ))}
              </div>
            </div>
            <ClaimStampButton destination={data.destination || "this destination"} />
          </div>
        );
      }}
    />
  );
}

export function QuizTool() {
  return (
    <AiTool
      type="quiz"
      title="AI Culture Quiz"
      description="Generate five destination-specific questions and learn from the explanations."
      fields={[["destination", "Destination", "Japan"]]}
      render={(data) => (
        <QuizPlayer destination={data.destination || "this destination"} questions={data.questions || []} />
      )}
    />
  );
}

function AiTool({ type, title, description, fields, render }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData(event.currentTarget);
      const body = Object.fromEntries(fields.map(([name]) => [name, form.get(name)]));
      const response = await fetch(endpoints[type], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "Gemini could not complete this request.");
        return;
      }
      setResult(payload.data || payload);
    } catch (error) {
      console.error(`[AiTool] submit ${type} failed:`, error);
      setError("Network connection issue. Gemini could not complete this request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="card p-6">
        <p className="kicker">Powered by Gemini AI</p>
        <h1 className="page-title mt-3">{title}</h1>
        <p className="muted mt-4 max-w-3xl text-lg">{description}</p>
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          {fields.map(([name, label, placeholder]) => (
            <div key={name}>
              <label className="label" htmlFor={name}>{label}</label>
              <input id={name} name={name} type="text" className="input" placeholder={placeholder} required={name === "query" || name === "destination"} />
            </div>
          ))}
          <div className="md:col-span-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? LOADING_MESSAGES[type] || "Gemini is working..." : "Generate with Gemini"}
            </button>
          </div>
        </form>
      </div>
      {error && <p className="surface p-4 font-bold text-[var(--accent)]" role="alert">{error}</p>}
      {result && <section aria-live="polite">{render(result)}</section>}
    </section>
  );
}

function ResultList({ title, items = [], nameKey = "name", detailKey = "description" }) {
  return (
    <section className="surface p-4">
      <h2 className="font-black capitalize">{title}</h2>
      <ul className="mt-3 space-y-3">
        {items.map((item, index) => (
          <li key={`${item[nameKey] || item.english || title}-${index}`}>
            <p className="font-bold">{item[nameKey] || item.english}</p>
            <p className="muted text-sm">{item[detailKey] || item.details || item.local || item.tip}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const LANG_MAP = {
  spanish: "es-ES",
  french: "fr-FR",
  japanese: "ja-JP",
  thai: "th-TH",
  german: "de-DE",
  italian: "it-IT",
  korean: "ko-KR",
  chinese: "zh-CN",
  portuguese: "pt-PT",
  vietnamese: "vi-VN",
  arabic: "ar-SA",
  hindi: "hi-IN",
};

function ResultListWithSpeech({ title, items = [], langCode }) {
  function speak(text) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section className="surface p-4">
      <h2 className="font-black capitalize">{title}</h2>
      <ul className="mt-3 space-y-3">
        {(items || []).map((item, index) => (
          <li key={`${item.english || title}-${index}`} className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2 last:border-0 last:pb-0">
            <div>
              <p className="font-bold">{item.english}</p>
              <p className="text-[var(--primary-strong)] font-semibold text-sm">{item.local}</p>
              <p className="muted text-xs italic">&ldquo;{item.pronunciation}&rdquo;</p>
            </div>
            <button
              onClick={() => speak(item.local || item.english)}
              className="btn-secondary rounded-full p-2 flex items-center justify-center min-h-[1.8rem] w-8 h-8 text-xs cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-colors"
              title="Speak phrase"
              aria-label={`Speak ${item.english}`}
              type="button"
            >
              🔊
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EtiquetteCheckerTool() {
  const statusColors = {
    GREEN: "border-green-600 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800",
    YELLOW: "border-yellow-600 bg-yellow-50 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300 dark:border-yellow-800",
    RED: "border-red-600 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800",
  };
  
  const statusLabels = {
    GREEN: "🟢 Green Light (Respectful)",
    YELLOW: "🟡 Yellow Light (Caution/Neutral)",
    RED: "🔴 Red Light (Taboo/Rude)",
  };

  return (
    <AiTool
      type="etiquette"
      title="Cultural Etiquette Checker"
      description="Check if an action is culturally appropriate in a destination. Receive a Green, Yellow, or Red light rating with local context."
      fields={[
        ["destination", "Destination", "Japan"],
        ["action", "What are you planning to do?", "Tipping a taxi driver"],
      ]}
      render={(data) => {
        const colorClass = statusColors[data.status] || statusColors.YELLOW;
        const label = statusLabels[data.status] || statusLabels.YELLOW;
        return (
          <article className={`card p-6 border-l-4 ${colorClass}`}>
            <h3 className="text-xl font-bold flex items-center gap-2">{label}</h3>
            <p className="mt-4 leading-7 text-lg">{data.explanation}</p>
          </article>
        );
      }}
    />
  );
}

export function SavingCheatsTool() {
  return (
    <AiTool
      type="cheats"
      title="Local Savings Cheat Sheet"
      description="Get 5 highly specific, non-obvious hacks to save money and avoid tourist traps at your destination."
      fields={[["destination", "Destination", "Venice"]]}
      render={(data) => (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {(data.cheats || []).map((item, index) => (
              <article key={index} className="surface p-5 animate-fade-in">
                <h3 className="font-black text-lg flex items-center gap-2 text-[var(--primary)]">
                  <span className="flex items-center justify-center bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] rounded-full w-8 h-8 text-sm">{index + 1}</span>
                  {item.title}
                </h3>
                <p className="muted mt-3 leading-7 text-sm">{item.hack}</p>
              </article>
            ))}
          </div>
          <ClaimStampButton destination={data.destination || "this destination"} />
        </div>
      )}
    />
  );
}

export function SaveTripButton({ destination, summary, tags }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/saved-trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, summary, tags }),
      });
      const data = await response.json();
      if (response.ok) {
        setSaved(true);
        setMessage("Trip saved to your Dashboard! ✈️");
      } else {
        setMessage(data.error || "Could not save trip.");
      }
    } catch (e) {
      setMessage("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <button
        onClick={handleSave}
        disabled={loading || saved}
        className={`btn w-full md:w-auto md:max-w-xs font-black transition-all ${
          saved ? "btn-secondary text-green-700 bg-green-50" : "btn-primary"
        }`}
        type="button"
      >
        {loading ? "Saving..." : saved ? "✓ Saved to Dashboard" : "✈️ Save this Trip"}
      </button>
      {message && <p className="text-sm font-bold text-[var(--accent)] mt-1">{message}</p>}
    </div>
  );
}

export function ClaimStampButton({ destination }) {
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleClaim() {
    setLoading(true);
    setMessage("");
    try {
      const emojis = ["📍", "🛬", "🗼", "🏯", "🕌", "⛩️", "🏝️", "⛰️"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const response = await fetch("/api/passport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, emoji }),
      });
      const data = await response.json();
      if (response.ok) {
        setClaimed(true);
        let alertMsg = `Stamped passport for ${destination}! 📍`;
        if (data.earnedBadges && data.earnedBadges.length > 0) {
          alertMsg += ` Unlocked Badges: ${data.earnedBadges.join(", ")}! 🏆`;
        }
        setMessage(alertMsg);
      } else {
        setMessage(data.error || "Could not claim stamp.");
      }
    } catch (e) {
      setMessage("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <button
        onClick={handleClaim}
        disabled={loading || claimed}
        className={`btn w-full md:w-auto md:max-w-xs font-black transition-all ${
          claimed ? "btn-secondary text-green-700 bg-green-50" : "btn-primary"
        }`}
        type="button"
      >
        {loading ? "Claiming..." : claimed ? "✓ Stamp Claimed" : "📍 Claim Passport Stamp"}
      </button>
      {message && <p className="text-sm font-bold text-[var(--accent)] mt-1">{message}</p>}
    </div>
  );
}

export function QuizPlayer({ destination, questions = [] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!questions.length) return <p className="muted">No questions available.</p>;

  const currentQuestion = questions[currentIdx];

  function handleOptionClick(optIdx) {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIdx);
    if (optIdx === currentQuestion.answerIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    setSelectedOpt(null);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      setQuizFinished(true);
    }
  }

  async function handleSaveResult() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, score, total: questions.length }),
      });
      const data = await response.json();
      if (response.ok) {
        setSaved(true);
        let alertMsg = `Quiz result saved to Passport! 📚`;
        if (data.earnedBadges && data.earnedBadges.length > 0) {
          alertMsg += ` Unlocked Badges: ${data.earnedBadges.join(", ")}! 🏆`;
        }
        setMessage(alertMsg);
      } else {
        setMessage(data.error || "Could not save result.");
      }
    } catch (e) {
      setMessage("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  if (quizFinished) {
    return (
      <article className="surface p-6 text-center animate-fade-in">
        <h3 className="text-2xl font-black">Quiz Completed! 🏆</h3>
        <p className="text-4xl font-extrabold text-[var(--primary-strong)] mt-4">
          {score} / {questions.length}
        </p>
        <p className="muted mt-2">
          {score >= 4
            ? "Fantastic! You are a true Culture Scholar!"
            : "Nice try! Keep exploring to learn more local culture."}
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleSaveResult}
            disabled={loading || saved}
            className={`btn w-full md:w-auto md:max-w-xs font-black transition-all ${
              saved ? "btn-secondary text-green-700 bg-green-50" : "btn-primary"
            }`}
            type="button"
          >
            {loading ? "Saving..." : saved ? "✓ Score Saved" : "📚 Save Score & Claim Stamp"}
          </button>
          {message && <p className="text-sm font-bold text-[var(--accent)] mt-1">{message}</p>}
        </div>
      </article>
    );
  }

  return (
    <article className="surface p-6 space-y-5 animate-fade-in">
      <div className="flex justify-between items-center text-sm font-bold border-b border-[var(--line)] pb-3">
        <span className="kicker">Question {currentIdx + 1} of {questions.length}</span>
        <span className="text-[var(--primary)]">Score: {score}</span>
      </div>

      <h3 className="text-lg font-black">{currentQuestion.question}</h3>

      <div className="grid gap-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOpt === idx;
          const isCorrect = idx === currentQuestion.answerIndex;
          const isIncorrectSelected = isSelected && !isCorrect;

          let btnClass = "btn-secondary hover:bg-[color-mix(in_srgb,var(--primary)_8%,var(--card-strong))]";
          if (selectedOpt !== null) {
            if (isCorrect) {
              btnClass = "border-green-600 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300";
            } else if (isIncorrectSelected) {
              btnClass = "border-red-600 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300";
            } else {
              btnClass = "opacity-50 btn-secondary";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={`btn text-left font-semibold py-3 px-4 rounded-xl transition-all border ${btnClass}`}
              type="button"
              disabled={selectedOpt !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedOpt !== null && (
        <div className="mt-4 p-4 border border-[var(--line)] rounded-xl bg-[color-mix(in_srgb,var(--primary)_4%,transparent)] animate-fade-in">
          <p className="font-bold text-sm">
            {selectedOpt === currentQuestion.answerIndex ? "✅ Correct!" : "❌ Incorrect"}
          </p>
          <p className="muted text-sm mt-2">{currentQuestion.explanation}</p>
          <button onClick={handleNext} className="btn btn-primary mt-4 w-full md:w-auto text-xs" type="button">
            {currentIdx + 1 === questions.length ? "Finish Quiz" : "Next Question →"}
          </button>
        </div>
      )}
    </article>
  );
}
