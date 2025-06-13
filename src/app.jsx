import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import Admin from './components/Admin';
import DocxParser from './lib/docxParser';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminWrapper />} />
        <Route path="/*" element={<MainWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainWrapper() {
  const [userCode, setUserCode] = useState(null);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const navigate = useNavigate();

  // Lade Word-Datei vom Server beim Start
  useEffect(() => {
    fetch('/api/get-word')
      .then((res) => {
        if (res.ok) return res.blob();
        else throw new Error('No Word file uploaded');
      })
      .then((blob) => {
        const file = new File([blob], 'questionnaire.docx');
        return DocxParser(file);
      })
      .then((parsed) => setQuestionnaireData(parsed))
      .catch(() => setQuestionnaireData(null));
  }, []);

  if (!questionnaireData) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Fragebogen App</h1>
        <p>
          Keine Fragebogendatei hochgeladen. Bitte Admin kontaktieren oder
          selbst hochladen.
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Zum Admin Bereich
        </button>
      </div>
    );
  }

  if (!userCode) {
    return <CodeScreen onComplete={setUserCode} />;
  }

  return <Questionnaire data={questionnaireData} code={userCode} />;
}

function AdminWrapper() {
  const navigate = useNavigate();
  return <Admin onExit={() => navigate('/')} />;
}

function CodeScreen({ onComplete }) {
  const [mother, setMother] = useState('');
  const [day, setDay] = useState('');
  const [lastname, setLastname] = useState('');
  const [code, setCode] = useState('');

  const generateCode = () => {
    const c = `${mother.slice(0, 2)}${day}${lastname.slice(0, 2)}`;
    setCode(c);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Anonymer Zuordnungscode</h2>
      <input
        placeholder="Erste 2 Buchstaben der Mutter"
        value={mother}
        onChange={(e) => setMother(e.target.value.toUpperCase())}
        className="border p-2 rounded w-full"
      />
      <input
        placeholder="Geburtstag (Tag, z.B. 27)"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="border p-2 rounded w-full"
        maxLength={2}
      />
      <input
        placeholder="Erste 2 Buchstaben Nachname"
        value={lastname}
        onChange={(e) => setLastname(e.target.value.toUpperCase())}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={generateCode}
        disabled={
          mother.length < 2 || lastname.length < 2 || !/^\d{1,2}$/.test(day)
        }
        className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        Code generieren
      </button>

      {code && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="font-semibold">Dein Code:</p>
          <p className="text-xl font-bold">{code}</p>
          <button
            onClick={() => onComplete(code)}
            className="mt-3 bg-green-600 text-white py-2 px-4 rounded"
          >
            Zum Fragebogen
          </button>
        </div>
      )}
    </div>
  );
}