import React, { useState } from "react";
import Question from "./Question";

export default function Questionnaire({ data, code }) {
  const [answers, setAnswers] = useState({});
  const [pageIndex, setPageIndex] = useState(0);

  const groups = data.groups || [];

  const currentGroup = groups[pageIndex];

  const onAnswer = (questionId, value) => {
    setAnswers((a) => ({ ...a, [questionId]: value }));
  };

  const onNext = () => {
    if (pageIndex < groups.length - 1) setPageIndex(pageIndex + 1);
  };

  const onPrev = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  const onSubmit = () => {
    // Hier sendest du die Antworten an den Server
    const payload = { code, answers, timestamp: new Date().toISOString() };
    fetch("/api/save-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      alert("Danke für deine Teilnahme!");
      window.location.reload();
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.meta.title}</h1>
      <h2 className="text-xl font-semibold mb-2">{currentGroup.title}</h2>
      {currentGroup.info && (
        <p className="mb-4 italic text-gray-600">{currentGroup.info}</p>
      )}
      {currentGroup.questions.map((q) => (
        <Question key={q.id} question={q} onAnswer={onAnswer} answer={answers[q.id]} />
      ))}

      <div className="mt-6 flex justify-between">
        <button
          onClick={onPrev}
          disabled={pageIndex === 0}
          className="bg-gray-300 py-2 px-4 rounded disabled:opacity-50"
        >
          Zurück
        </button>
        {pageIndex === groups.length - 1 ? (
          <button
            onClick={onSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Absenden
          </button>
        ) : (
          <button
            onClick={onNext}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Weiter
          </button>
        )}
      </div>
    </div>
  );
}
