// Netlify Function: bewaart en levert de leerkracht-aanpassingen aan oefeningen
// (zowel de handboekreeksen als de gewone tt/vt/geenpv-reeksen) in een gedeelde
// Netlify Blobs-store. Alle leerlingen, op elk toestel, krijgen zo automatisch
// dezelfde (eventueel aangepaste) inhoud te zien — in tegenstelling tot
// localStorage, dat enkel op één browser/toestel geldt.
//
// GET      -> geeft alle aanpassingen in één keer terug: { "<key>": <data>, ... }
//             (geen wachtwoord nodig, want leerlingen moeten dit ook kunnen lezen)
// POST     -> body { key, data, token } slaat/overschrijft de aanpassing voor
//             die ene reeks op (enkel een beheerder van MELK)
// DELETE   -> query ?key=... + kop x-melk-lk: <token> verwijdert de aanpassing voor die reeks,
//             zodat de oorspronkelijke inhoud (uit handboek.js / data.js) weer geldt
//
// Toegang (november 2026): geen wachtwoord meer. Het toegangsbewijs van de leerkracht (MELK)
// wordt bij MELK nagekeken (actie lkWie via de deur van MELK-start); enkel een beheerder mag schrijven.
// Vereist: het pakket "@netlify/blobs". De oude environment variable TEACHER_PASSWORD wordt niet meer gebruikt.
//
// BELANGRIJK: dit bestand gebruikt het klassieke exports.handler(event)-formaat
// ("Lambda compatibility mode"). In die modus initialiseert Netlify Blobs zich
// NIET automatisch — connectLambda(event) moet als allereerste ding in de
// handler aangeroepen worden, anders kan schrijven/lezen naar de verkeerde
// (niet echt gedeelde) plek gaan zonder dat dit meteen een duidelijke fout geeft.

const { getStore, connectLambda } = require('@netlify/blobs');

const STORE_NAME = 'oefeningen';
const BLOB_KEY = 'overrides';

exports.handler = async function (event) {
  connectLambda(event); // moet vóór elke getStore()-aanroep gebeuren

  const store = getStore(STORE_NAME);

  if (event.httpMethod === 'GET') {
    try {
      const data = await store.get(BLOB_KEY, { type: 'json' });
      console.log('[oefeningen] GET -> aantal opgeslagen reeksen:', data ? Object.keys(data).length : 0);
      return {
        statusCode: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        body: JSON.stringify(data || {}),
      };
    } catch (err) {
      console.error('[oefeningen] GET-fout:', err);
      return { statusCode: 500, headers: { 'Cache-Control': 'no-store' }, body: JSON.stringify({ error: 'Kon aanpassingen niet ophalen: ' + err.message }) };
    }
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) };
    }
    const { key, data, token } = payload;
    const toegang = await isBeheerder(token);
    if (!toegang.ok) {
      return { statusCode: 401, body: JSON.stringify({ error: toegang.fout }) };
    }
    if (!key || typeof key !== 'string' || data === undefined) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Geen geldige reekssleutel of inhoud.' }) };
    }
    try {
      const all = (await store.get(BLOB_KEY, { type: 'json' })) || {};
      all[key] = data;
      await store.setJSON(BLOB_KEY, all);
      // meteen terug uitlezen als controle, zodat we in de logs zien dat het écht is weggeschreven
      const check = await store.get(BLOB_KEY, { type: 'json' });
      console.log('[oefeningen] POST', key, '-> opgeslagen. Totaal aantal reeksen nu:', check ? Object.keys(check).length : 0, '- bevat de nieuwe key?', !!(check && check[key]));
      return { statusCode: 200, headers: { 'Cache-Control': 'no-store' }, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      console.error('[oefeningen] POST-fout:', err);
      return { statusCode: 500, headers: { 'Cache-Control': 'no-store' }, body: JSON.stringify({ error: 'Kon niet opslaan: ' + err.message }) };
    }
  }

  if (event.httpMethod === 'DELETE') {
    const params = event.queryStringParameters || {};
    const kop = event.headers || {};
    const toegang = await isBeheerder(kop['x-melk-lk'] || kop['X-Melk-Lk']);
    if (!toegang.ok) {
      return { statusCode: 401, body: JSON.stringify({ error: toegang.fout }) };
    }
    const key = params.key;
    if (!key) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Geen geldige reekssleutel.' }) };
    }
    try {
      const all = (await store.get(BLOB_KEY, { type: 'json' })) || {};
      delete all[key];
      await store.setJSON(BLOB_KEY, all);
      return { statusCode: 200, headers: { 'Cache-Control': 'no-store' }, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      console.error('[oefeningen] DELETE-fout:', err);
      return { statusCode: 500, headers: { 'Cache-Control': 'no-store' }, body: JSON.stringify({ error: 'Kon niet verwijderen: ' + err.message }) };
    }
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Methode niet toegestaan.' }) };
};

// Vraagt aan MELK of dit toegangsbewijs van een beheerder is. Bij twijfel: weigeren, nooit stilzwijgend toelaten.
const MELK_DEUR = process.env.MELK_DEUR || 'https://melk-start.netlify.app/api/deur';
async function isBeheerder(token) {
  if (!token || typeof token !== 'string' || token.length > 2000) return { ok: false, fout: 'Meld je eerst aan als leerkracht (MELK).' };
  try {
    const r = await fetch(MELK_DEUR, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actie: 'lkWie', token, app: 'werkwoorden' }) });
    const d = await r.json();
    if (!d || !d.ok) return { ok: false, fout: (d && d.opnieuwInloggen) ? 'Je bent afgemeld. Meld je opnieuw aan als leerkracht.' : 'MELK herkent je niet als leerkracht.' };
    if (!d.beheerder) return { ok: false, fout: 'Enkel een beheerder van MELK mag oefeningen bewaren.' };
    return { ok: true };
  } catch (e) {
    console.error('[oefeningen] MELK niet bereikbaar:', e);
    return { ok: false, fout: 'MELK is even niet bereikbaar. Probeer het zo meteen opnieuw.' };
  }
}
