import React from "react";

export default function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  const { summary, strengths = [], weaknesses = [], suggestions = [], highlights = [] } = feedback;

  return (
    <div className="card feedback-card">
      <h3>Resumo & Recomendações</h3>

      {summary && <p className="lead">{summary}</p>}

      <div className="flex-grid">
        <div>
          <h4>Pontos Fortes</h4>
          {strengths.length ? (
            <ul>
              {strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : <p className="muted">Nenhum identificado</p>}
        </div>

        <div>
          <h4>Pontos Fracos</h4>
          {weaknesses.length ? (
            <ul>
              {weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          ) : <p className="muted">Nenhum identificado</p>}
        </div>
      </div>

      <h4>Sugestões</h4>
      {suggestions.length ? (
        <ol>
          {suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      ) : <p className="muted">Nenhuma sugestão</p>}

      {highlights.length > 0 && (
        <>
          <h4>Trechos Relevantes</h4>
          <ul>
            {highlights.map((h, i) => (
              <li key={i}><strong>Turn {h.turn}:</strong> {h.text} <em>({h.reason})</em></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
