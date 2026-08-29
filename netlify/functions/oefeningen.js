// Netlify Function: bewaart en levert de leerkracht-aanpassingen aan oefeningen
// (zowel de handboekreeksen als de gewone tt/vt/geenpv-reeksen) in een gedeelde
// Netlify Blobs-store. Alle leerlingen, op elk toestel, krijgen zo automatisch
// dezelfde (eventueel aangepaste) inhoud te zien — in tegenstelling tot
// localStorage, dat enkel op één browser/toestel geldt.
//
// GET      -> geeft alle aanpassingen in één keer terug: { "<key>": <data>, ... }
//             (geen wachtwoord nodig, want leerlingen moeten dit ook kunnen lezen)
// POST     -> body { key, data, password } slaat/overschrijft de aanpassing voor
//             die ene reeks op (wél wachtwoord nodig)
// DELETE   -> query ?key=...&password=... verwijdert de aanpassing voor die reeks,
//             zodat de oorspronkelijke inhoud (uit handboek.js / data.js) weer geldt
//
// Vereist: het pakket "@netlify/blobs" (npm install @netlify/blobs) en een
// environment variable TEACHER_PASSWORD in Netlify > Site settings > Environment
// variables, met exact dezelfde waarde als TEACHER_PASSWORD in app.js.

const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'oefeningen';
const BLOB_KEY = 'overrides';

exports.handler = async function (event) {
  const store = getStore(STORE_NAME);

  if (event.httpMethod === 'GET') {
    try {
      const data = await store.get(BLOB_KEY, { type: 'json' });
      return { statusCode: 200, body: JSON.stringify(data || {}) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Kon aanpassingen niet ophalen: ' + err.message }) };
    }
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) };
    }
    const { key, data, password } = payload;
    if (!checkPassword(password)) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Fout wachtwoord.' }) };
    }
    if (!key || typeof key !== 'string' || data === undefined) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Geen geldige reekssleutel of inhoud.' }) };
    }
    try {
      const all = (await store.get(BLOB_KEY, { type: 'json' })) || {};
      all[key] = data;
      await store.setJSON(BLOB_KEY, all);
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Kon niet opslaan: ' + err.message }) };
    }
  }

  if (event.httpMethod === 'DELETE') {
    const params = event.queryStringParameters || {};
    if (!checkPassword(params.password)) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Fout wachtwoord.' }) };
    }
    const key = params.key;
    if (!key) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Geen geldige reekssleutel.' }) };
    }
    try {
      const all = (await store.get(BLOB_KEY, { type: 'json' })) || {};
      delete all[key];
      await store.setJSON(BLOB_KEY, all);
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Kon niet verwijderen: ' + err.message }) };
    }
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Methode niet toegestaan.' }) };
};

function checkPassword(pw) {
  const expected = process.env.TEACHER_PASSWORD;
  if (!expected) return false; // niet geconfigureerd op de server -> altijd weigeren, nooit stilzwijgend toelaten
  return pw === expected;
}
