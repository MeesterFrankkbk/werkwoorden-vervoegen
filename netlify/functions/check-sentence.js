// Netlify Function: laat de AI een vrij geschreven zin controleren (voor de ***-oefeningen
// zoals "Zinnen knutselen" uit de handboeklessen, waar geen vast juist antwoord bestaat).
// Gebruikt dezelfde GEMINI_API_KEY als generate-exercises.js.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Enkel POST toegestaan.' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) };
  }

  const { infinitief, zin } = payload;
  if (!infinitief || !zin || !zin.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Geef zowel het werkwoord als een zin op.' }) };
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY ontbreekt op de server.' }) };
  }

  const prompt = `Je bent een vriendelijke Nederlandse taalleerkracht die het werk van een leerling (9-13 jaar, Vlaanderen) nakijkt.

De leerling kreeg de opdracht: gebruik het werkwoord "${infinitief}" in een goede, correcte zin, met een persoonsvorm (vervoegde vorm) van dat werkwoord.

De zin van de leerling is: "${zin.replace(/"/g, "'")}"

Controleer:
1. Bevat de zin een correct vervoegde persoonsvorm van het werkwoord "${infinitief}"? (dus niet de infinitief zelf, en geen ander werkwoord)
2. Is de zin een volledige, grammaticaal correcte Nederlandse zin?
3. Is de werkwoordspelling correct?

Antwoord ALLEEN met geldige JSON, zonder uitleg erbuiten:
{"correct": true of false, "feedback": "een kort, vriendelijk, opbouwend zinnetje voor de leerling (max 2 zinnen), in het Nederlands, dat uitlegt wat goed was of wat er verbeterd kan worden"}`;

  const model = 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: `AI-service gaf fout ${res.status} terug.`, details: errText.slice(0, 400) }) };
    }

    const data = await res.json();
    const text = data && data.candidates && data.candidates[0] && data.candidates[0].content
      && data.candidates[0].content.parts && data.candidates[0].content.parts[0]
      && data.candidates[0].content.parts[0].text;

    if (!text) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Geen antwoord ontvangen van de AI.' }) };
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Het AI-antwoord kon niet gelezen worden.' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ correct: !!parsed.correct, feedback: parsed.feedback || '' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Onverwachte fout: ' + err.message }) };
  }
};
