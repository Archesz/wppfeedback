import React, { useState } from "react";

export default function UploadCard({ file, onFileChange, onSubmit, loading, error }) {
  const [tab, setTab] = useState("file"); // "file" | "paste"
  const [pastedText, setPastedText] = useState("");

  const handleFileInput = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    onFileChange(f);
    // clear pasted text if a file selected
    if (f) setPastedText("");
  };

  const handleClear = () => {
    onFileChange(null);
    setPastedText("");
  };

  const charCount = pastedText.length;
  const maxChars = 20000; // limite razoável (ajuste conforme desejar)

  const submit = () => {
    // Chama onSubmit(file, pastedText). App decide o que fazer.
    onSubmit(file, pastedText.trim());
  };

  return (
    <div className="card upload-card">
      <div className="tabs">
        <button
          type="button"
          className={`tab ${tab === "file" ? "active" : ""}`}
          onClick={() => setTab("file")}
          aria-pressed={tab === "file"}
        >
          Arquivo
        </button>
        <button
          type="button"
          className={`tab ${tab === "paste" ? "active" : ""}`}
          onClick={() => setTab("paste")}
          aria-pressed={tab === "paste"}
        >
          Colar texto
        </button>
      </div>

      {tab === "file" && (
        <>
          <h3>Enviar conversa (.txt)</h3>
          <p className="muted">Formato esperado: <code>[HH:MM, DD/MM/YYYY] Nome: Mensagem</code></p>

          <label className="file-input" aria-label="Selecione arquivo .txt">
            <input
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileInput}
            />
            <span className="file-label">{file ? file.name : "Arraste ou selecione um arquivo"}</span>
          </label>
        </>
      )}

      {tab === "paste" && (
        <>
          <h3>Colar conversa (texto)</h3>
          <p className="muted">Cole aqui o conteúdo exportado do WhatsApp (o formato com colchetes funciona).</p>

          <textarea
            className="paste-area"
            placeholder="[11:46, 04/08/2025] +55 19 99264-3030: Bom dia\n[11:47, 04/08/2025] +55 19 99264-3030: Queria..."
            value={pastedText}
            onChange={(e) => {
              // opcional: limitar caracteres
              if (e.target.value.length <= maxChars) setPastedText(e.target.value);
              else setPastedText(e.target.value.slice(0, maxChars));
              // se colou texto, limpa file
              if (file) onFileChange(null);
            }}
            rows={10}
            aria-label="Área para colar texto da conversa"
          />
          <div className="paste-footer">
            <small className="muted">{charCount} caracteres{charCount >= maxChars ? " (limite atingido)" : ""}</small>
          </div>
        </>
      )}

      {error && <div className="alert error" role="alert">{error}</div>}

      <div className="row">
        <button
          className="btn primary"
          onClick={submit}
          disabled={loading || (tab === "file" && !file) || (tab === "paste" && pastedText.trim().length === 0)}
          title={tab === "file" ? (file ? "Enviar arquivo selecionado" : "Selecione um arquivo .txt") : (pastedText.trim().length ? "Enviar texto colado" : "Cole o texto da conversa antes de enviar")}
        >
          {loading ? "Avaliando..." : "Enviar e Avaliar"}
        </button>

        <button
          className="btn ghost"
          onClick={handleClear}
          type="button"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
