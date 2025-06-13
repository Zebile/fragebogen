import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function Admin({ onExit }) {
  const [file, setFile] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetch('/api/download-excel')
      .then(res => res.json())
      .then(setAnswers)
      .catch(() => setAnswers([]));
  }, []);

  const onFileChange = e => {
    setFile(e.target.files[0]);
  };

  const uploadFile = () => {
    if (!file) return alert('Bitte Datei auswählen');
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload-word', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) alert('Datei erfolgreich hochgeladen!');
        else alert('Upload fehlgeschlagen');
      })
      .catch(() => alert('Upload fehlgeschlagen'));
  };

  const exportExcel = () => {
    if (answers.length === 0) {
      alert('Keine Antworten zum Exportieren');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(answers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Antworten');
    XLSX.writeFile(wb, 'antworten.xlsx');
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold">Admin Bereich</h2>

      <section>
        <h3 className="text-xl font-semibold mb-2">Word-Datei hochladen</h3>
        <input type="file" accept=".docx" onChange={onFileChange} />
        <button
          onClick={uploadFile}
          disabled={!file}
          className="ml-4 bg-blue-600 text-white py-1 px-3 rounded disabled:opacity-50"
        >
          Hochladen
        </button>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Antworten exportieren</h3>
        <button
          onClick={exportExcel}
          class
