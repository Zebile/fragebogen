// src/lib/docxParser.js

export default async function DocxParser(file) {
  // Dummy Parser: hier würdest du das Word-DOCX lesen und in JSON übersetzen.
  // Zur Demo: gib ein statisches Beispiel zurück.

  return {
    meta: {
      title: 'Beispiel Fragebogen',
      outro: 'Danke fürs Mitmachen!',
    },
    groups: [
      {
        title: 'Gesundheit',
        info: 'Bitte beantworte die Fragen ehrlich.',
        questions: [
          {
            id: 'q1',
            text: 'Wie fühlst du dich heute?',
            type: 'single_choice',
            options: ['Gut', 'Schlecht', 'Neutral'],
            required: true,
          },
          {
            id: 'q2',
            text: 'Welche Sportarten machst du?',
            type: 'multiple_choice',
            options: ['Fußball', 'Basketball', 'Schwimmen', 'Laufen'],
            required: false,
          },
          {
            id: 'q3',
            text: 'Ordne die Lebensmittel nach Geschmack (Drag & Drop).',
            type: 'ranking',
            options: ['Apfel', 'Banane', 'Orange', 'Traube'],
            required: true,
          },
          {
            id: 'q4',
            text: 'Wie zufrieden bist du mit deinem Schlaf?',
            type: 'matrix',
            rows: ['Qualität', 'Dauer', 'Regelmäßigkeit'],
            columns: [
              'Sehr gut',
              'Gut',
              'Neutral',
              'Schlecht',
              'Sehr schlecht',
            ],
            required: true,
          },
          {
            id: 'q5',
            text: 'Dein Alter?',
            type: 'number',
            required: true,
          },
          {
            id: 'q6',
            text: 'Wann hast du Geburtstag?',
            type: 'date',
            required: false,
          },
          {
            id: 'q7',
            text: 'Dein Kommentar',
            type: 'text',
            required: false,
          },
        ],
      },
    ],
  };
}
