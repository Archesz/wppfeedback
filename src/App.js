import React, { useState } from "react";
import "./global.scss";

import UploadCard from "./components/UploadCard/UploadCard";
import ScoreCard from "./components/ScoreCard/ScoreCard";
import FeedbackCard from "./components/FeedbackCard/FeedbackCard";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function App() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [returnPdf, setReturnPdf] = useState(false);

  function handleFileChange(f) {
    setFile(f);
    setFeedback(null);
    setError(null);
  }

  // trecho dentro de App.js (substituir a função handleSubmit anterior)
  async function handleSubmit(fileArg, pastedText) {
    // fileArg: File | null
    // pastedText: string | null/empty
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (fileArg) {
        formData.append("file", fileArg);
      } else if (pastedText && pastedText.trim().length > 0) {
        // transforma o texto colado num arquivo .txt
        const blob = new Blob([pastedText], { type: "text/plain;charset=utf-8" });
        // cria um File (opcional) para fornecer nome de arquivo
        const fileFromText = new File([blob], "conversation_pasted.txt", { type: "text/plain" });
        formData.append("file", fileFromText);
      } else {
        setError("Selecione arquivo ou cole o texto da conversa.");
        setLoading(false);
        return;
      }

      const query = returnPdf ? "?return_pdf=true" : "";

      const response = await fetch(`${API_URL}/evaluate${query}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // tenta ler texto para debug
        const text = await response.text();
        throw new Error(text || "Erro ao avaliar conversa");
      }

      if (returnPdf) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "relatorio.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setFeedback(null);
      } else {
        const data = await response.json();
        setFeedback(data.result || data);
      }
    } catch (err) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">WhatsApp Feedback</div>
        <div className="top-actions">
          <label className="small-muted">Gerar PDF</label>
        </div>
      </header>

      <main className="main-grid">
        <section className="left-column">
          <UploadCard
            file={file}
            onFileChange={setFile}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />


          {feedback && (
            <FeedbackCard
              feedback={feedback}
            />
          )}
        </section>

        <aside className="right-column">
          <div className="sticky">
            <ScoreCard scores={feedback?.scores} confidence={feedback?.confidence} />
            {/* você pode adicionar aqui: histórico, filtros, estatísticas */}
          </div>
        </aside>
      </main>

      <footer className="footer">
        <small>Feito por João Vitor - DEMO MVP</small>
      </footer>
    </div>
  );
}
