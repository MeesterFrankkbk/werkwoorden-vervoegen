// Netlify Function: genereert invuloefeningen voor werkwoordvervoeging via de Gemini API.
// Verwacht een GEMINI_API_KEY als environment variable in Netlify (dezelfde als bij Niveaulezer).
// De sleutel blijft hier op de server en wordt nooit naar de browser gestuurd.

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

  const { verbs, tense, level, count } = payload;
  if (!Array.isArray(verbs) || verbs.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Geef minstens één werkwoord op.' }) };
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY ontbreekt op de server (zet deze in Netlify > Site settings > Environment variables).' }) };
  }

  const tenseLabels = {
    tt: 'de tegenwoordige tijd',
    vt: 'de verleden tijd',
    geenpv: 'geen persoonsvorm (dus als voltooid deelwoord óf als bijvoeglijk naamwoord)'
  };
  const tenseLabel = tenseLabels[tense] || tenseLabels.tt;
  const n = Math.min(Math.max(parseInt(count, 10) || 8, 1), 20);
  const levelHint = level === '***'
    ? 'Niveau ***: gebruik iets langere zinnen en iets minder frequente werkwoorden of zinsconstructies.'
    : level === '**'
    ? 'Niveau **: gemiddelde moeilijkheidsgraad.'
    : 'Niveau *: korte, eenvoudige zinnen.';

  const prompt = `Je maakt invuloefeningen Nederlandse werkwoordspelling voor leerlingen van 9 tot 13 jaar (Vlaanderen, 4de-6de leerjaar).

Maak ${n} verschillende zinnen, telkens met precies één werkwoord dat vervoegd moet worden. Gebruik uitsluitend (een vervoeging van) deze werkwoorden, verdeeld over de zinnen: ${verbs.join(', ')}.
Vervoeg steeds in ${tenseLabel}.
${levelHint}
Varieer de onderwerpen (ik, jij, hij/zij, wij, jullie, een naam, een zelfstandig naamwoord, ...) en zinsvormen (gewone zin, vraagzin).

Geef voor elke zin een object met:
- "prefix": het deel van de zin VOOR het werkwoord (zonder het werkwoord zelf)
- "suffix": het deel van de zin NA het werkwoord, inclusief het leesteken op het einde
- "answer": de correcte vervoeging op deze plek
- "options": een lijst van precies 3 mogelijke vormen (de juiste + 2 aannemelijke foute vervoegingen van hetzelfde werkwoord)
- "infinitief": de infinitief van het gebruikte werkwoord

Antwoord ALLEEN met geldige JSON in dit exacte formaat, zonder verdere uitleg of markdown:
{"exercises": [{"prefix": "...", "suffix": "...", "answer": "...", "options": ["...", "...", "..."], "infinitief": "..."}]}`;

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.8 }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'De AI-service gaf een fout terug.', details: errText.slice(0, 400) }) };
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
      return { statusCode: 502, body: JSON.stringify({ error: 'Het AI-antwoord kon niet gelezen worden.', raw: text.slice(0, 400) }) };
    }

    const exercises = (parsed.exercises || []).filter(
      (e) => e && typeof e.prefix === 'string' && typeof e.answer === 'string' && Array.isArray(e.options)
    );

    if (exercises.length === 0) {
      return { statusCode: 502, body: JSON.stringify({ error: 'De AI leverde geen bruikbare oefeningen op. Probeer het opnieuw of pas de werkwoorden aan.' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ exercises, level, tense }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Onverwachte fout: ' + err.message }) };
  }
};
