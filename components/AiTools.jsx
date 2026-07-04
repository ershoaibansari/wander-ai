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
        <div className="grid-auto">
          <ResultList title="Attractions" items={data.attractions} />
          <ResultList title="Hidden gems" items={data.hiddenGems} />
          <ResultList title="Local neighborhoods" items={data.neighborhoods} nameKey="name" detailKey="knownFor" />
          <ResultList title="Authentic experiences" items={data.experiences} detailKey="why" />
          <ResultList title="Local food suggestions" items={data.localFood} />
          <ResultList title="Festivals and events" items={data.festivalsEvents} />
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
        <div className="grid-auto">
          {["morning", "afternoon", "evening", "night"].map((part) => (
            <article key={part} className="surface p-4">
              <p className="kicker">{part}</p>
              <h3 className="mt-2 font-black">{data[part]?.title}</h3>
              <p className="muted mt-2">{data[part]?.plan}</p>
              <p className="mt-3 font-bold">{data[part]?.estimatedCost}</p>
            </article>
          ))}
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
      render={(data) => (
        <div className="grid-auto">
          {["basics", "taxi", "restaurant", "shopping", "emergency"].map((group) => (
            <ResultList key={group} title={group} items={data[group]} detailKey="pronunciation" />
          ))}
        </div>
      )}
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
        <ol className="space-y-4">
          {(data.questions || []).map((question, index) => (
            <li key={question.question} className="surface p-4">
              <h3 className="font-black">{index + 1}. {question.question}</h3>
              <p className="muted mt-2">{question.options?.[question.answerIndex]}</p>
              <p className="mt-2 text-sm">{question.explanation}</p>
            </li>
          ))}
        </ol>
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
