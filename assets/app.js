/* ===== Werkwoorden vervoegen — app.js (v2) ===== */
const root = document.getElementById('app');
const levelColors = {'*':'#e8f5ee','**':'#eaf1ff','***':'#fff2e0'};
const levelText = {'*':'#166534','**':'#1e40af','***':'#9a3412'};
const TEACHER_PASSWORD = 'STA werkt!'; // centraal ingesteld wachtwoord voor Meester Frank

let state = {
  fontSize: 1,
  voorlezen: false,
  voice: null,
  student: null, // {voornaam, naam, klas, klasnummer}
  teacherMode: false,
};

const sizeSteps = [16,19,23];

function setFontSize(i){
  state.fontSize = i;
  document.documentElement.style.setProperty('--fs', sizeSteps[i]+'px');
  document.querySelectorAll('.sizebtns button').forEach((b,idx)=>{
    b.style.fontWeight = idx===i ? '800':'400';
    b.style.background = idx===i ? '#e8e2d0':'#fff';
  });
}

function speak(text){
  if(!state.voorlezen || !text) return;
  speakForce(text);
}
function speakForce(text){
  if(!text || !window.speechSynthesis) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if(state.voice) u.voice = state.voice;
    u.lang = state.voice ? state.voice.lang : 'nl-BE';
    window.speechSynthesis.speak(u);
  }catch(e){}
}
/* Stopt onmiddellijk elk lopend voorlezen (bv. bij doorklikken naar de volgende
   oefening of bij het verlaten van een reeks), zodat de stem nooit blijft
   doorpraten over een scherm dat niet meer klopt. */
function stopSpeech(){
  if(window.speechSynthesis){
    try{ window.speechSynthesis.cancel(); }catch(e){}
  }
}
function mkUtterance(t){
  const u = new SpeechSynthesisUtterance(t);
  if(state.voice) u.voice = state.voice;
  u.lang = state.voice ? state.voice.lang : 'nl-BE';
  return u;
}
/* Leest een reeks stukjes na elkaar voor, met een natuurlijke pauze tussen elk stuk
   in plaats van een symbool (___ / ...) letterlijk uit te spreken. */
function speakQueueParts(verbHint, parts){
  if(!state.voorlezen || !window.speechSynthesis) return;
  try{
    window.speechSynthesis.cancel();
    if(verbHint) window.speechSynthesis.speak(mkUtterance('Werkwoord: ' + verbHint + '.'));
    parts.filter(p=>p && p.trim()).forEach(p=> window.speechSynthesis.speak(mkUtterance(p.trim())));
  }catch(e){}
}
/* Haalt "12) " en "(werkwoord)" uit een prefix, en leest prefix/suffix als twee
   aparte zinsdelen voor (met de vraag om zelf de juiste vorm te bedenken ertussen). */
function speakBlankAware(rawPrefix, rawSuffix){
  let verbHint = null;
  let prefix = (rawPrefix||'').replace(/^\d+\)\s*/, '');
  const m = prefix.match(/^\(([^)]+)\)\s*/);
  if(m){ verbHint = m[1]; prefix = prefix.replace(/^\([^)]+\)\s*/, ''); }
  speakQueueParts(verbHint, [prefix, rawSuffix]);
}
/* Voor Herkennen-oefeningen: "Vul de zin aan: Mama ... de dokter." -> twee zinsdelen. */
function speakBlankPrompt(prompt){
  const text = (prompt||'').replace(/^Vul de zin aan:\s*/i,'');
  const parts = text.split('...');
  speakQueueParts(null, parts);
}

function populateVoices(select){
  const voices = window.speechSynthesis.getVoices().filter(v=>v.lang && v.lang.toLowerCase().startsWith('nl'));
  select.innerHTML = '';
  if(voices.length===0){
    const opt = document.createElement('option');
    opt.textContent = 'Geen Nederlandse stem gevonden';
    select.appendChild(opt);
    return;
  }
  voices.forEach((v,i)=>{
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = v.name + ' (' + v.lang + ')';
    select.appendChild(opt);
  });
  state.voice = voices[0];
  select.onchange = ()=>{ state.voice = voices[select.value]; speakForce('Zo klinkt deze stem.'); };
}

/* ---------- gedeelde opslag (Netlify Blobs, via een Netlify Function) ----------
   Alle aanpassingen van de leerkracht (reeksnamen ÉN de inhoud van oefeningen,
   zowel handboekreeksen als de gewone tt/vt/geenpv-reeksen) staan centraal
   opgeslagen, niet per browser/toestel. Bij het opstarten van de app wordt
   dit één keer volledig opgehaald in "sharedOverrides"; dat blijft nadien in
   het geheugen zitten, dus reeksNaam() bijvoorbeeld kan gewoon synchroon
   blijven werken. Opslaan/verwijderen gaat wél via de server (met wachtwoord). */
let sharedOverrides = null; // null = nog niet opgehaald; daarna altijd een object
let overridesPromise = null;
async function loadSharedOverrides(){
  try{
    const res = await fetch('/.netlify/functions/oefeningen');
    sharedOverrides = res.ok ? await res.json() : {};
  }catch(e){
    sharedOverrides = {};
  }
  return sharedOverrides;
}
async function ensureOverrides(){
  if(sharedOverrides === null) await overridesPromise;
  return sharedOverrides;
}
async function saveOverride(key, data){
  const res = await fetch('/.netlify/functions/oefeningen', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ key, data, password: TEACHER_PASSWORD })
  });
  if(!res.ok){
    const info = await res.json().catch(()=>({}));
    throw new Error(info.error || ('Opslaan mislukt (status ' + res.status + ').'));
  }
  if(!sharedOverrides) sharedOverrides = {};
  sharedOverrides[key] = data; // meteen lokaal bijwerken, geen nieuwe fetch nodig
}
async function deleteOverride(key){
  const res = await fetch('/.netlify/functions/oefeningen?key=' + encodeURIComponent(key) + '&password=' + encodeURIComponent(TEACHER_PASSWORD), { method: 'DELETE' });
  if(!res.ok){
    const info = await res.json().catch(()=>({}));
    throw new Error(info.error || ('Verwijderen mislukt (status ' + res.status + ').'));
  }
  if(sharedOverrides) delete sharedOverrides[key];
}

/* ---------- reeks-namen (leerkracht kan hernoemen, geldt voor alle leerlingen) ---------- */
function reeksNaam(key, setNum){
  const stored = sharedOverrides && sharedOverrides['naam_'+key+'_'+setNum];
  if(stored) return stored;
  if(key==='allin') return 'All-in';
  if(key.startsWith('hb_')) return key.slice(3); // standaard: de bestandscode zelf, bv. "TK060106"
  return 'Reeks ' + setNum;
}
async function hernoemReeks(key, setNum){
  if(!state.teacherMode) return; // enkel zichtbaar/klikbaar als Meester Frank is ingelogd
  const huidige = reeksNaam(key, setNum);
  const nieuw = prompt('Nieuwe naam voor deze reeks:', huidige);
  if(nieuw && nieuw.trim()){
    try{
      await saveOverride('naam_'+key+'_'+setNum, nieuw.trim());
    }catch(e){
      alert('Kon de naam niet opslaan: ' + e.message);
      return;
    }
    const inPanel = document.querySelector('h2') && document.querySelector('h2').textContent.includes('beheerpaneel');
    if(inPanel) renderTeacherPanel();
    else if(key==='allin') renderAllInNiveau();
    else renderTopic(key);
  }
}

/* ---------- Meester Frank (leerkracht-login) ---------- */
function openTeacherLogin(){
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.onclick = (e)=>{ if(e.target===bg) bg.remove(); };
  bg.innerHTML = `
    <div class="modal" style="max-width:360px">
      <button class="modal-close" onclick="this.closest('.modal-bg').remove()">✖</button>
      <h2>👨‍🏫 Meester Frank</h2>
      <p>Log in om reeksen te hernoemen en (later) meer te beheren.</p>
      <input type="password" id="teacherPass" placeholder="Wachtwoord" style="width:100%;padding:.6rem;border:2px solid var(--line);border-radius:10px;font-family:inherit" onkeydown="if(event.key==='Enter')doTeacherLogin()">
      <button class="bigbtn" style="margin-top:.8rem" onclick="doTeacherLogin()">Inloggen</button>
      <p id="teacherError" style="color:#b91c1c;font-size:.85rem;min-height:1.2em"></p>
    </div>`;
  document.body.appendChild(bg);
  document.getElementById('teacherPass').focus();
}
function doTeacherLogin(){
  const val = document.getElementById('teacherPass').value;
  if(val === TEACHER_PASSWORD){
    state.teacherMode = true;
    document.querySelector('.modal-bg').remove();
    if(!state.student) document.querySelector('header.topbar').style.display = 'flex';
    renderHeader();
    renderTeacherPanel();
  } else {
    document.getElementById('teacherError').textContent = 'Wachtwoord klopt niet.';
  }
}
function teacherLogout(){
  state.teacherMode = false;
  renderHeader();
  renderHome();
}
function renderTeacherPanel(){
  if(!state.teacherMode){ openTeacherLogin(); return; }
  const rows = Object.keys(WERKWOORDEN_DATA).map(key=>{
    const t = WERKWOORDEN_DATA[key];
    const reeksen = ['1','2'].map(s=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.4rem">
        <span><b>${reeksNaam(key,s)}</b> <span style="color:#888;font-size:.85rem">(oorspronkelijk: Reeks ${s})</span></span>
        <span><button class="renamebtn" onclick="hernoemReeks('${key}','${s}')">✏️ Hernoemen</button> <button class="renamebtn" onclick="openReeksEditor('${key}','${s}')">🛠️ Oefeningen bewerken</button></span>
      </div>`).join('');
    return `<div class="card topic-${key}" style="cursor:default">
      <h2>${t.title}</h2>
      ${reeksen}
    </div>`;
  }).join('');
  const allInCard = `<div class="card topic-allin" style="cursor:default">
      <h2>🧠 ${reeksNaam('allin','1')} <button class="renamebtn" onclick="hernoemReeks('allin','1')">✏️</button></h2>
      <p style="font-size:.85rem;color:#555;margin-top:0">Dit onderdeel heeft (nog) geen vaste inhoud zoals de andere — het stelt telkens een nieuwe, willekeurige selectie samen uit alle zinnen. Er komen later mogelijk meerdere van deze reeksen; elk krijgt dan een eigen naam.</p>
      <div style="padding:.5rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.4rem">★ 15 herkennen + 5 dictee (20 zinnen)</div>
      <div style="padding:.5rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.4rem">★★ 20 herkennen + 10 dictee (30 zinnen)</div>
      <div style="padding:.5rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.4rem">★★★ 25 herkennen + 15 dictee (40 zinnen)</div>
    </div>`;
  const tenseGroupNames = {tt:'Tegenwoordige tijd', vt:'Verleden tijd', geenpv:'Geen persoonsvorm', allin:'All-in'};
  const handboekByTense = {};
  Object.keys(HANDBOEK_DATA).forEach(code=>{
    const tense = HANDBOEK_DATA[code].tense;
    (handboekByTense[tense] = handboekByTense[tense] || []).push(code);
  });
  const handboekRows = Object.keys(handboekByTense).sort().map(tense=>{
    const items = handboekByTense[tense].sort().map(code=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.4rem">
        <span><b>${reeksNaam('hb_'+code,'1')}</b> <span style="color:#888;font-size:.85rem">(${code})</span></span>
        <span><button class="renamebtn" onclick="hernoemReeks('hb_${code}','1')">✏️ Hernoemen</button> <button class="renamebtn" onclick="openHandboekEditor('${code}')">🛠️ Oefeningen bewerken</button></span>
      </div>`).join('');
    return `<div class="card" style="cursor:default">
      <h2>📘 ${tenseGroupNames[tense] || tense}</h2>
      ${items}
    </div>`;
  }).join('');
  root.innerHTML = `
    <button class="backbtn" onclick="renderHome()">← Terug</button>
    <h2>⚙️ Meester Frank — beheerpaneel</h2>
    <p>Hier kan je de naam van elke reeks aanpassen, en via "🛠️ Oefeningen bewerken" ook de inhoud zelf.</p>
    <div class="grid">${rows}${allInCard}</div>
    <h2 style="margin-top:2rem">📘 Handboeklessen (TK...)</h2>
    <div class="grid">${handboekRows}</div>
    <h2 style="margin-top:2rem">🤖 AI-oefeningen maken</h2>
    <p>Geef één of meer werkwoorden op, kies de tijd en het niveau, en laat de AI passende invulzinnen bedenken. Je kan ze meteen met de leerlingen starten (voor deze sessie) of als JSON kopiëren om door te sturen zodat ze permanent aan de app toegevoegd worden.</p>
    <div id="aiPanel"></div>`;
  renderAIGenerator();
}

/* ---------- AI-oefeningen genereren (via Netlify Function + Gemini) ---------- */
function renderAIGenerator(){
  const wrap = document.getElementById('aiPanel');
  wrap.innerHTML = `
    <div class="report">
      <label>Naam voor deze reeks</label>
      <input type="text" id="aiName" placeholder="bv. Fietsen - tegenwoordige tijd" style="width:100%;padding:.6rem;border:2px solid var(--line);border-radius:10px;font-family:inherit;margin-top:.3rem">
      <label style="margin-top:.8rem">Werkwoorden (komma-gescheiden)</label>
      <input type="text" id="aiVerbs" placeholder="bv. fietsen, lachen, vinden" style="width:100%;padding:.6rem;border:2px solid var(--line);border-radius:10px;font-family:inherit;margin-top:.3rem">
      <div style="display:flex;gap:.8rem;margin-top:.8rem;flex-wrap:wrap">
        <div>
          <label>Tijd</label><br>
          <select id="aiTense" style="padding:.5rem;border:2px solid var(--line);border-radius:8px;font-family:inherit">
            <option value="tt">Tegenwoordige tijd</option>
            <option value="vt">Verleden tijd</option>
            <option value="geenpv">Geen persoonsvorm</option>
          </select>
        </div>
        <div>
          <label>Niveau</label><br>
          <select id="aiLevel" style="padding:.5rem;border:2px solid var(--line);border-radius:8px;font-family:inherit">
            <option value="*">*</option><option value="**">**</option><option value="***">***</option>
          </select>
        </div>
        <div>
          <label>Aantal</label><br>
          <input type="number" id="aiCount" value="8" min="1" max="25" style="width:70px;padding:.5rem;border:2px solid var(--line);border-radius:8px;font-family:inherit">
        </div>
      </div>
      <button class="bigbtn" style="margin-top:1rem;width:auto;padding:.7rem 1.4rem" onclick="generateAIExercises()">✨ Genereer</button>
      <div id="aiStatus" style="margin-top:.6rem;font-size:.9rem"></div>
      <div id="aiResults"></div>
    </div>
    <div id="aiSavedList" style="margin-top:1.5rem"></div>`;
  renderSavedAIReeksen();
}
let aiGenerated = [];
async function generateAIExercises(){
  const naam = document.getElementById('aiName').value.trim();
  const verbs = document.getElementById('aiVerbs').value.split(',').map(v=>v.trim()).filter(Boolean);
  const tense = document.getElementById('aiTense').value;
  const level = document.getElementById('aiLevel').value;
  const count = document.getElementById('aiCount').value;
  const status = document.getElementById('aiStatus');
  const results = document.getElementById('aiResults');
  results.innerHTML = '';
  if(verbs.length === 0){ status.textContent = 'Geef minstens één werkwoord op.'; status.style.color = '#b91c1c'; return; }
  if(!naam){ status.textContent = 'Geef deze reeks eerst een naam.'; status.style.color = '#b91c1c'; return; }
  status.textContent = '⏳ Bezig met genereren... (dit kan enkele seconden duren)';
  status.style.color = '#666';
  try{
    const res = await fetch('/.netlify/functions/generate-exercises', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ verbs, tense, level, count })
    });
    const data = await res.json();
    if(!res.ok){
      status.textContent = '❌ ' + (data.error || 'Er ging iets mis.') + (data.details ? ' — ' + data.details : '');
      status.style.color = '#b91c1c';
      return;
    }
    aiGenerated = data.exercises.map(e => ({...e, level}));
    status.textContent = `✅ ${aiGenerated.length} oefeningen gegenereerd. Vink uit wat je niet wil gebruiken.`;
    status.style.color = '#15803d';
    renderAIResults(tense, naam);
  }catch(e){
    status.textContent = '❌ Kon de AI-functie niet bereiken. Werkt deze site via de GitHub-gekoppelde Netlify-deploy met GEMINI_API_KEY ingesteld?';
    status.style.color = '#b91c1c';
  }
}
function renderAIResults(tense, naam){
  const results = document.getElementById('aiResults');
  const items = aiGenerated.map((ex,idx)=>`
    <div style="display:flex;align-items:flex-start;gap:.5rem;padding:.4rem 0;border-bottom:1px solid var(--line)">
      <input type="checkbox" id="aiKeep${idx}" checked style="margin-top:.3rem">
      <label for="aiKeep${idx}" style="flex:1">${ex.prefix} <b>${ex.answer}</b> ${ex.suffix} <span style="color:#888;font-size:.8rem">(${(ex.options||[]).join(' / ')})</span></label>
    </div>`).join('');
  results.innerHTML = `
    <div style="margin-top:1rem">${items}</div>
    <div class="report-actions">
      <button onclick="saveAIReeks('${tense}', ${JSON.stringify(naam).replace(/"/g,'&quot;')})">💾 Bewaar als "${naam}"</button>
      <button onclick="startAIRun('${tense}', ${JSON.stringify(naam).replace(/"/g,'&quot;')})">▶ Start meteen met leerlingen</button>
      <button onclick="copyAIJson()">📋 Kopieer als JSON</button>
    </div>`;
}
function getKeptAIExercises(){
  return aiGenerated.filter((ex,idx)=>{
    const cb = document.getElementById('aiKeep'+idx);
    return cb ? cb.checked : true;
  });
}

/* ---------- opgeslagen AI-reeksen (gedeeld, net als reeksnamen en oefeningeninhoud) ---------- */
function loadAIReeksen(){
  return (sharedOverrides && sharedOverrides['ai_reeksen']) || [];
}
async function saveAIReeksenList(list){
  await saveOverride('ai_reeksen', list);
}
async function saveAIReeks(tense, naam){
  const kept = getKeptAIExercises();
  if(kept.length === 0){ alert('Vink minstens één oefening aan.'); return; }
  const list = loadAIReeksen();
  const bestaande = list.find(r=> r.tense===tense && r.naam.trim().toLowerCase()===naam.trim().toLowerCase());
  try{
    if(bestaande){
      bestaande.exercises.push(...kept);
      await saveAIReeksenList(list);
      renderSavedAIReeksen();
      alert(`Toegevoegd aan de bestaande reeks "${bestaande.naam}" (nu ${bestaande.exercises.length} zinnen in totaal, verdeeld over de niveaus).`);
    } else {
      list.push({ id: Date.now(), naam, tense, exercises: kept, createdAt: new Date().toLocaleDateString('nl-BE') });
      await saveAIReeksenList(list);
      renderSavedAIReeksen();
      alert(`Reeks "${naam}" is bewaard en meteen zichtbaar voor leerlingen, op elk toestel. Bewaar later nog eens onder exact dezelfde naam om er niveaus aan toe te voegen.`);
    }
  }catch(e){
    alert('Kon niet opslaan: ' + e.message);
  }
}
function renderSavedAIReeksen(){
  const wrap = document.getElementById('aiSavedList');
  if(!wrap) return;
  const list = loadAIReeksen();
  if(list.length === 0){ wrap.innerHTML = ''; return; }
  const tenseNames = {tt:'Tegenwoordige tijd', vt:'Verleden tijd', geenpv:'Geen persoonsvorm'};
  const rows = list.map(r=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.5rem">
      <span><b>${r.naam}</b> <span style="color:#888;font-size:.85rem">(${tenseNames[r.tense]||r.tense} · ${r.exercises.length} zinnen · ${r.createdAt})</span></span>
      <span>
        <button class="renamebtn" onclick="hernoemAIReeks(${r.id})">✏️</button>
        <button class="renamebtn" onclick="openAIReeksEditor(${r.id})">🛠️ Bewerken</button>
        <button class="renamebtn" onclick="renderAIReeksNiveau(${r.id})">▶ Start</button>
        <button class="renamebtn" onclick="deleteAIReeks(${r.id})">🗑️</button>
      </span>
    </div>`).join('');
  wrap.innerHTML = `<h3>Bewaarde AI-reeksen (zichtbaar voor leerlingen)</h3>${rows}`;
}
async function hernoemAIReeks(id){
  const list = loadAIReeksen();
  const item = list.find(r=>r.id===id);
  if(!item) return;
  const nieuw = prompt('Nieuwe naam voor deze reeks:', item.naam);
  if(nieuw && nieuw.trim()){
    item.naam = nieuw.trim();
    try{
      await saveAIReeksenList(list);
      renderSavedAIReeksen();
    }catch(e){
      alert('Kon niet opslaan: ' + e.message);
    }
  }
}
async function deleteAIReeks(id){
  if(!confirm('Deze bewaarde reeks verwijderen? Dit verwijdert ze voor iedereen.')) return;
  try{
    await saveAIReeksenList(loadAIReeksen().filter(r=>r.id!==id));
    renderSavedAIReeksen();
  }catch(e){
    alert('Kon niet verwijderen: ' + e.message);
  }
}
/* In plaats van een bewaarde AI-reeks meteen volledig te starten, tonen we nu
   eerst een niveau-scherm (★/★★/★★★), net als bij de handboekreeksen en de
   gewone tt/vt/geenpv-reeksen. Elke losse zin in de reeks draagt al een eigen
   "level"-veld (meegegeven bij het genereren) — cumulatief filteren op dat
   niveau geeft dus exact hetzelfde gedrag als elders in de app. */

/* ---------- Werkbladgenerator (printbaar op papier, 2 pagina's, met aparte correctiesleutel) ----------
   Belangrijke ontwerpkeuzes:
   - Niet alles wat digitaal bestaat past op papier: enkel meerkeuze (identify) en
     invuloefeningen (persoonsvorm/fillin/stam/written/AI-zinnen) worden gebruikt.
     Het geheugenspel, de klik-in-tekst-oefening en de AI-nagekeken vrije tekst
     laten we dus bewust weg.
   - Eén werkblad toont alle drie de niveaus (★/★★/★★★) samen, elk als een eigen,
     duidelijk afgebakende sectie — net als in het originele handboek. Elke sectie
     gebruikt enkel oefeningen die STRIKT bij dat niveau horen (dus niet cumulatief),
     zodat dezelfde oefening nooit in twee secties tegelijk verschijnt.
   - We gebruiken bewust MINDER oefeningen dan er digitaal beschikbaar zijn (zie
     WERKBLAD_BUDGET) — net dat maakt "gegarandeerd op 2 pagina's" mogelijk, en
     geeft de leerling ruimte om een antwoord te schrijven i.p.v. een drukke bladzijde.
   - De verdeling over pagina 1/2 ligt vast (WERKBLAD_SPLIT), niet aan de browser
     overgelaten: zo kan een oefening nooit in twee stukken knippen. Een sectie zelf
     mag wel over de paginagrens lopen (bv. ★★ begint onderaan pagina 1 en loopt
     door op pagina 2) — enkel losse oefeningen blijven altijd heel.
   - Dit is getest op correcte HTML/structuur, maar NIET op een echte printer/browser
     (dat kan ik hier niet). De aantallen hieronder zijn een voorzichtige eerste
     inschatting — test 1x live af en geef door of het geheel iets te kort of te lang
     uitvalt op papier, dan stel ik deze tabel in één regel bij.
*/
const WERKBLAD_BUDGET = { '*': 16, '**': 8, '***': 8 }; // aantal oefeningen per sectie (niet cumulatief); leest een leerling alle 3 secties, dan ziet die 16 -> 24 -> 32 in totaal (jullie afspraak van 15/20/25 was het absolute minimum, dit ligt daar telkens boven)
const WERKBLAD_SPLIT  = 15; // hoeveel oefeningen (over alle secties heen) op pagina 1; de rest naar pagina 2

/* Een gewone shuffle() geeft elke keer een andere volgorde (prima voor een
   digitale oefenreeks, die mag/moet variëren). Voor het werkblad willen we
   net het omgekeerde: dezelfde les moet altijd exact dezelfde oefeningen (en
   dus dezelfde correctiesleutel) opleveren, ongeacht hoe vaak je het opnieuw
   opent. Daarvoor gebruiken we een kleine, seed-bare generator (mulberry32)
   i.p.v. Math.random(): dezelfde seed geeft altijd dezelfde "willekeurige"
   volgorde. */
function stringHash(str){
  let h = 0;
  for(let i=0;i<str.length;i++){ h = (Math.imul(31,h) + str.charCodeAt(i))|0; }
  return h>>>0;
}
function mulberry32(seed){
  return function(){
    seed |= 0; seed = (seed + 0x6D2B79F5)|0;
    let t = Math.imul(seed ^ seed>>>15, 1 | seed);
    t = (t + Math.imul(t ^ t>>>7, 61 | t)) ^ t;
    return ((t ^ t>>>14) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, seed){
  const rng = mulberry32(seed);
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
/* Husselt enkel de LETTERS van het (correcte!) antwoord door elkaar — er wordt
   dus nooit een foute spelling getoond, in tegenstelling tot een eerder idee
   (een "foutenjacht" met een bewust foute vorm) dat de leerkracht terecht
   afkeurde: leerlingen mogen nooit een foute spelling te zien krijgen, ook niet
   als opdracht. */
function schudLetters(woord, seed){
  const rng = mulberry32(seed);
  const letters = woord.split('');
  for(let i=letters.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [letters[i],letters[j]]=[letters[j],letters[i]]; }
  let resultaat = letters.join('');
  if(resultaat.toLowerCase()===woord.toLowerCase()) resultaat = letters.reverse().join(''); // vangnet bij korte woorden
  return resultaat;
}
// * = basisaantal, ** = dat + 3 extra, *** = dat + nog eens 2 extra (zoals gevraagd)
const GEHUSSELD_COUNT = { '*': 3, '**': 3, '***': 2 };

/* Verzamelt, voor één specifiek niveau (dus NIET cumulatief), een eerlijk
   gemengde selectie oefeningen: max. 40% meerkeuze, max. 30% korte
   stam-oefeningen, de rest altijd echte zin-invuloefeningen (met automatische
   aanvulling vanuit een andere pool als er ergens te weinig materiaal is). */
function kiesVoorNiveau(deelA, deelZinnen, deelStam, budget, seedBasis){
  deelA = seededShuffle(deelA, seedBasis + 1);
  deelZinnen = seededShuffle(deelZinnen, seedBasis + 2);
  deelStam = seededShuffle(deelStam, seedBasis + 3);
  const nemenA = Math.min(deelA.length, Math.round(budget*0.4));
  let restBudget = budget - nemenA;
  const nemenStam = Math.min(deelStam.length, Math.round(restBudget*0.3));
  restBudget -= nemenStam;
  let nemenZinnen = Math.min(deelZinnen.length, restBudget);
  let tekort = restBudget - nemenZinnen;
  const extraStam = Math.min(deelStam.length - nemenStam, tekort);
  tekort -= extraStam;
  const extraA = Math.min(deelA.length - nemenA, tekort);
  const gekozenA = deelA.slice(0, nemenA + extraA);
  let gekozenB = [...deelZinnen.slice(0, nemenZinnen), ...deelStam.slice(0, nemenStam + extraStam)];
  gekozenB = seededShuffle(gekozenB, seedBasis + 4); // stam en zinnen door elkaar, niet als twee blokken na elkaar
  return [...gekozenA, ...gekozenB];
}

async function gatherWerkbladSecties(source, srcId){
  const cleanPrompt = (t)=> (t||'').replace(/^\d+\)\s*/, '').trim();
  let titel = '';
  // per niveau een eigen, NIET-cumulatieve pool (dus enkel items die exact dat niveau dragen)
  const perNiveau = { '*': {A:[],Z:[],S:[]}, '**': {A:[],Z:[],S:[]}, '***': {A:[],Z:[],S:[]} };

  if(source==='handboek'){
    const d = await getLesData(srcId);
    titel = (d.titel||'').replace(/\s*\(TK\d+\)\s*$/, '');
    (d.identify||[]).filter(it=>!it.plain && perNiveau[it.level]).forEach(it=>
      perNiveau[it.level].A.push({ prompt: cleanPrompt(it.prompt), options: it.options, correct: it.options[it.correctIndex] }));
    (d.persoonsvorm||[]).forEach(it=>{ const lvl = it.level||'*'; if(perNiveau[lvl]) perNiveau[lvl].Z.push({ prompt: cleanPrompt(it.prompt), answer: it.answer }); });
    (d.fillin||[]).forEach(it=>{
      const lvl = it.level||'**'; // zelfde standaardwaarde als de echte oefeningen-motor gebruikt
      if(perNiveau[lvl]) perNiveau[lvl].Z.push({ prompt: `${it.prefix} ... ${it.suffix}`.trim(), answer: it.answer });
    });
    // "stam" geldt in de digitale app als niveau *-materiaal -> enkel bij ★
    (d.stam||[]).forEach(it=>
      perNiveau['*'].S.push({ prompt: `Geef de stam van "${it.infinitief}".`, answer: it.antwoord }));
    if(d.vrijezin && d.vrijezin.length){
      const v = d.vrijezin[0];
      perNiveau['***'].Z.push({ prompt: `Schrijf zelf een goede zin met het werkwoord "${v.infinitief}".`, answer: '(eigen antwoord)' });
    }
  } else if(source==='reeks'){
    const t = WERKWOORDEN_DATA[srcId.key];
    const s = await getSet(srcId.key, srcId.setNum);
    titel = t.title + ' — ' + reeksNaam(srcId.key, srcId.setNum);
    (s.identify||[]).filter(it=>perNiveau[it.level]).forEach(it=>
      perNiveau[it.level].A.push({ prompt: cleanPrompt(it.prompt), options: it.options, correct: it.options[it.correctIndex] }));
    (s.fillin||[]).filter(it=>perNiveau[it.level]).forEach(it=>
      perNiveau[it.level].Z.push({ prompt: `${it.prefix} ... ${it.suffix}`.trim(), answer: it.answer }));
    (s.written||[]).forEach(it=> perNiveau['***'].Z.push({ prompt: cleanPrompt(it.prompt), answer: it.answer }));
  } else if(source==='ai'){
    const item = loadAIReeksen().find(r=>r.id===srcId);
    titel = '✨ ' + item.naam;
    item.exercises.forEach(ex=>{
      const lvl = ex.level||'*';
      if(perNiveau[lvl]) perNiveau[lvl].Z.push({ prompt: `${ex.prefix||''} ... ${ex.suffix||''}`.trim(), answer: ex.answer });
    });
  }

  const seedBasis = stringHash(source + '|' + JSON.stringify(srcId));

  // "Gehusseld woord"-oefeningen: reserveer dit EERST (vast, niet willekeurig
  // bij elke keer openen), vóór de gewone secties samengesteld worden — zo
  // staan ze gegarandeerd op het werkblad en komt dezelfde zin niet ook nog
  // eens gewoon voor. BELANGRIJK: hier wordt nooit een foute spelling getoond
  // (in tegenstelling tot een eerdere versie met een "foutenjacht") — enkel de
  // letters van het correcte antwoord worden door elkaar gehusseld.
  const gehusseldPerNiveau = { '*':[], '**':[], '***':[] };
  ['*','**','***'].forEach((lvl,i)=>{
    const gewenst = GEHUSSELD_COUNT[lvl];
    if(gewenst<=0) return;
    const kandidaten = seededShuffle(perNiveau[lvl].Z.filter(it=>it.answer && it.answer.length>=3 && !it.answer.includes(' ') && it.answer!=='(eigen antwoord)'), seedBasis + 500 + i);
    const gekozen = kandidaten.slice(0, gewenst);
    const gekozenKeys = new Set(gekozen.map(it=>it.prompt+'|'+it.answer));
    perNiveau[lvl].Z = perNiveau[lvl].Z.filter(it=> !gekozenKeys.has(it.prompt+'|'+it.answer));
    gehusseldPerNiveau[lvl] = gekozen.map((it,j)=>({
      prompt: it.prompt,
      answer: it.answer,
      gehusseld: schudLetters(it.answer, seedBasis + 700 + i*50 + j)
    }));
  });

  const secties = {};
  ['*','**','***'].forEach((lvl,i)=>{
    const p = perNiveau[lvl];
    secties[lvl] = [...kiesVoorNiveau(p.A, p.Z, p.S, WERKBLAD_BUDGET[lvl], seedBasis + i*100), ...gehusseldPerNiveau[lvl]];
  });

  return { titel, secties };
}

function renderWerkbladItemsHTML(items, startNr){
  return items.map((it,i)=>{
    const nr = startNr + i;
    if(it.options){
      return `<li class="oefening" value="${nr}"><span class="opgave">${escHtml(it.prompt)}</span><br>
        <span class="mc-opties">${it.options.map(o=>`<span class="mc-optie">${escHtml(o)}</span>`).join(' &nbsp;–&nbsp; ')}</span></li>`;
    }
    if(it.gehusseld){
      const opgave = escHtml(it.prompt).replace(/\.\.\./, '<span class="leemte"></span>');
      return `<li class="oefening" value="${nr}"><span class="opgave"><span class="hussel">(${escHtml(it.gehusseld)})</span> ${opgave}</span></li>`;
    }
    const opgave = escHtml(it.prompt).replace(/\.\.\./, '<span class="leemte"></span>');
    return `<li class="oefening" value="${nr}"><span class="opgave">${opgave}</span></li>`;
  }).join('');
}

const WERKBLAD_STYLE = `
<style>
  @page { size: A4; margin: 16mm; }
  body { margin:0; }
  .werkblad { font-family: Arial, Helvetica, sans-serif; color:#161616; font-size:14.5px; line-height:1.6; }
  .werkblad-pagina { page-break-after: always; }
  .werkblad-pagina:last-child { page-break-after: auto; }
  .werkblad-header { display:flex; align-items:center; justify-content:space-between; gap:1.2rem; border-bottom:3px solid #222; padding-bottom:12px; margin-bottom:18px; }
  .werkblad-header img { height:58px; }
  .werkblad-veldjes { font-size:14.5px; line-height:2.1; text-align:left; }
  .werkblad-veldjes .lijn { display:inline-block; border-bottom:1px solid #333; min-width:160px; }
  .werkblad h1 { font-size:20px; margin:0 0 4px 0; }
  .werkblad h2 { font-size:13.5px; color:#666; margin:0 0 16px 0; font-weight:normal; font-style:italic; }
  .werkblad .oefeningen { padding-left:24px; margin:0 0 8px 0; }
  .oefening { break-inside: avoid; page-break-inside: avoid; margin-bottom:16px; }
  .opgave { }
  .leemte { display:inline-block; border-bottom:1.5px solid #333; min-width:100px; height:1.1em; vertical-align:middle; }
  .mc-opties { color:#333; }
  .mc-optie { border:1.5px solid #999; border-radius:12px; padding:2px 12px; display:inline-block; margin-top:4px; margin-right:4px; }
  .sectietitel { font-weight:bold; font-size:15.5px; margin:14px 0 8px 0; padding:4px 10px; background:#f0f0f0; border-left:5px solid #333; break-after:avoid; page-break-after:avoid; }
  .sectietitel:first-of-type { margin-top:4px; }
  .hussel { font-weight:bold; letter-spacing:1px; color:#333; }
</style>`;

/* We printen NIET met window.print() op het scherm dat in de app zelf te zien
   is: een SPA-scherm bevat ook de rest van de applicatie, en het "enkel dit
   blok tonen"-trucje (visibility:hidden op de rest) bleek bij het opslaan als
   PDF niet betrouwbaar samen te werken met de pagina-afbreking — dat gaf een
   povere, half-lege afdruk met alles opeengepakt op 1 pagina. In plaats
   daarvan openen we een volledig LOS, leeg venster met daarin uitsluitend het
   werkblad (of de correctiesleutel) als een op zichzelf staand HTML-document.
   Dat pagineert veel voorspelbaarder, want er is niets anders op de pagina om
   mee te interfereren. */
function openInPrintVenster(titel, lichaamHTML){
  const w = window.open('', '_blank');
  if(!w){ alert('Kon geen nieuw venster openen. Sta pop-ups toe voor deze site en probeer opnieuw.'); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escHtml(titel)}</title>${WERKBLAD_STYLE}</head><body>${lichaamHTML}</body></html>`);
  w.document.close();
  w.onload = () => { w.focus(); w.print(); };
  setTimeout(()=>{ try{ w.focus(); w.print(); }catch(e){} }, 400); // vangnet als onload niet vuurt
}

let werkbladCtx = null; // { source, srcId, backAction, titel, secties, volgorde: [{lvl, item}] }

function buildWerkbladPaginasHTML(titel, volgorde){
  const splitAt = Math.min(WERKBLAD_SPLIT, volgorde.length);
  const pagina1 = volgorde.slice(0, splitAt);
  const pagina2 = volgorde.slice(splitAt);

  const headerHTML = `
    <div class="werkblad-header">
      <img src="assets/STA_logo.png" alt="Logo Sint-Theresia">
      <div class="werkblad-veldjes">
        Naam: <span class="lijn">&nbsp;</span> &nbsp;&nbsp; Klas: <span class="lijn" style="min-width:60px">&nbsp;</span> &nbsp;&nbsp; Klasnr.: <span class="lijn" style="min-width:40px">&nbsp;</span><br>
        Datum: <span class="lijn">&nbsp;</span>
      </div>
      <img src="assets/MELK-logo.png" alt="Logo MELK">
    </div>`;

  // Elke pagina toont doorlopend genummerde oefeningen; telkens wanneer het
  // niveau wisselt (bv. van ★ naar ★★) komt er een nieuwe sectietitel, ook al
  // loopt diezelfde sectie gewoon door van pagina 1 naar pagina 2. De
  // gehusseld-woord-oefeningen zitten gewoon tussen de andere items van hun
  // niveau in (ze zijn immers al aan de juiste sectie toegevoegd).
  function buildPaginaHTML(rijen, offsetGlobal){
    let html = '';
    let huidigNiveau = null;
    let buffer = [];
    let nr = offsetGlobal + 1;
    const flush = ()=>{
      if(buffer.length){ html += `<ol class="oefeningen">${renderWerkbladItemsHTML(buffer, nr)}</ol>`; nr += buffer.length; buffer = []; }
    };
    rijen.forEach(({lvl,item})=>{
      if(lvl!==huidigNiveau){
        flush();
        huidigNiveau = lvl;
        html += `<div class="sectietitel">Oefeningen ${lvl}</div>`;
      }
      buffer.push(item);
    });
    flush();
    return html;
  }

  return `<div class="werkblad">
      <div class="werkblad-pagina">
        ${headerHTML}
        <h1>${escHtml(titel)}</h1>
        <h2>Werkblad — vul zelf in wat gevraagd wordt. Bij een woord tussen haakjes staan de letters door elkaar — ontrafel het woord en vul de juiste vorm in.</h2>
        ${buildPaginaHTML(pagina1, 0)}
      </div>
      ${pagina2.length ? `<div class="werkblad-pagina">${buildPaginaHTML(pagina2, pagina1.length)}</div>` : ''}
    </div>`;
}

async function renderWerkbladPreview(source, srcId, backAction){
  if(!state.teacherMode) return;
  stopSpeech();
  root.innerHTML = `<p class="no-print">Werkblad wordt klaargemaakt...</p>`;
  const { titel, secties } = await gatherWerkbladSecties(source, srcId);
  // doorlopende lijst van {lvl, item}, in de vaste volgorde ★ -> ★★ -> ★★★,
  // dit is exact wat er op de 2 pagina's komt (en dus ook in de correctiesleutel)
  const volgorde = [];
  ['*','**','***'].forEach(lvl=> secties[lvl].forEach(item=> volgorde.push({lvl, item})));
  werkbladCtx = { source, srcId, backAction, titel, secties, volgorde };

  const werkbladHTML = buildWerkbladPaginasHTML(titel, volgorde);
  root.innerHTML = `
    <button class="backbtn" onclick="werkbladCtx=null;${backAction}">← Terug</button>
    <div style="margin:1rem 0;display:flex;gap:.6rem;flex-wrap:wrap">
      <button class="nextbtn" onclick="openInPrintVenster(werkbladCtx.titel, buildWerkbladPaginasHTML(werkbladCtx.titel, werkbladCtx.volgorde))">🖨️ Print werkblad (2 pagina's, in nieuw venster)</button>
      <button class="iconbtn" onclick="renderCorrectiesleutel()">🔑 Correctiesleutel bekijken/printen</button>
    </div>
    <p style="color:#777;font-size:.85rem">Onderstaand is een voorbeeldweergave. Gebruik de knop hierboven om écht af te drukken — dat opent een apart, opgekuist venster dat betrouwbaarder pagineert.</p>
    ${WERKBLAD_STYLE}
    ${werkbladHTML}`;
}

function renderCorrectiesleutel(){
  if(!state.teacherMode || !werkbladCtx) return;
  const d = werkbladCtx;
  let html = '';
  ['*','**','***'].forEach(lvl=>{
    const items = d.volgorde.filter(r=>r.lvl===lvl).map(r=>r.item);
    if(!items.length) return;
    const startNr = d.volgorde.findIndex(r=>r.lvl===lvl) + 1;
    html += `<div class="sectietitel">Oefeningen ${lvl}</div><ol class="oefeningen" start="${startNr}">
      ${items.map(item=>`<li>${escHtml(item.options ? item.correct : item.answer)}</li>`).join('')}
    </ol>`;
  });
  const sleutelHTML = `<div class="werkblad"><div class="werkblad-pagina">
      <h1>🔑 Correctiesleutel — ${escHtml(d.titel)}</h1>
      <h2>Enkel voor de leerkracht — niet uitdelen aan leerlingen.</h2>
      ${html}
    </div></div>`;
  root.innerHTML = `
    <button class="backbtn" onclick="renderWerkbladPreview(werkbladCtx.source, werkbladCtx.srcId, werkbladCtx.backAction)">← Terug naar het werkblad</button>
    <div style="margin:1rem 0">
      <button class="nextbtn" onclick="openInPrintVenster('Correctiesleutel — '+werkbladCtx.titel, document.getElementById('sleutelInhoud').innerHTML)">🖨️ Print correctiesleutel (in nieuw venster)</button>
    </div>
    ${WERKBLAD_STYLE}
    <div id="sleutelInhoud">${sleutelHTML}</div>`;
}

function renderAIReeksNiveau(id){
  stopSpeech();
  const item = loadAIReeksen().find(r=>r.id===id);
  if(!item) return renderHome();
  const t = WERKWOORDEN_DATA[item.tense] || {color:'#0891b2', title:'AI-oefening'};
  const order = {'*':1,'**':2,'***':3};
  const countFor = capLevel => item.exercises.filter(ex=>order[ex.level||'*']<=order[capLevel]).length;
  root.innerHTML = `
    <button class="backbtn" onclick="renderTopic('${item.tense}')">← Terug</button>
    <h2>✨ ${item.naam} ${state.teacherMode ? `<button class="iconbtn" onclick="renderWerkbladPreview('ai',${id},\`renderAIReeksNiveau(${id})\`)">🖨️ Werkblad (★+★★+★★★)</button>` : ''}</h2>
    <p>Kies je niveau. Hoe meer sterren, hoe meer zinnen je maakt.</p>
    <div class="niveau-grid">
      <div class="niveau-card" style="border-color:${t.color}" onclick="startAIRunFromSaved(${id},'*')">
        <b>★</b><p>${countFor('*')} zinnen</p>
      </div>
      <div class="niveau-card" style="border-color:${t.color}" onclick="startAIRunFromSaved(${id},'**')">
        <b>★★</b><p>${countFor('**')} zinnen</p>
      </div>
      <div class="niveau-card" style="border-color:${t.color}" onclick="startAIRunFromSaved(${id},'***')">
        <b>★★★</b><p>${countFor('***')} zinnen</p>
      </div>
    </div>`;
}
function startAIRunFromSaved(id, level){
  const item = loadAIReeksen().find(r=>r.id===id);
  if(!item) return;
  const order = {'*':1,'**':2,'***':3};
  const cap = order[level];
  const exercises = shuffle(item.exercises.filter(ex=>order[ex.level||'*']<=cap));
  aiGenerated = exercises;
  startAIRunWithData(item.tense, item.naam, exercises, `renderAIReeksNiveau(${id})`);
}
/* Zelfde als hernoemAIReeks/deleteAIReeks, maar dan gebruikt vanaf het gewone
   onderwerp-scherm (renderTopic), waar geen #aiSavedList bestaat om in te
   verversen — hier herbouwen we dus gewoon dat hele scherm opnieuw. */
async function hernoemAIReeksAndRefresh(id){
  const list = loadAIReeksen();
  const item = list.find(r=>r.id===id);
  if(!item) return;
  const nieuw = prompt('Nieuwe naam voor deze reeks:', item.naam);
  if(nieuw && nieuw.trim()){
    item.naam = nieuw.trim();
    try{
      await saveAIReeksenList(list);
      renderTopic(item.tense);
    }catch(e){
      alert('Kon niet opslaan: ' + e.message);
    }
  }
}
async function deleteAIReeksAndRefresh(id){
  const item = loadAIReeksen().find(r=>r.id===id);
  if(!item || !confirm('Deze bewaarde reeks verwijderen? Dit verwijdert ze voor iedereen.')) return;
  try{
    await saveAIReeksenList(loadAIReeksen().filter(r=>r.id!==id));
    renderTopic(item.tense);
  }catch(e){
    alert('Kon niet verwijderen: ' + e.message);
  }
}
function startAIRunWithData(tense, naam, exercises, backAction){
  const t = WERKWOORDEN_DATA[tense] || {color:'#0891b2', title:'AI-oefening'};
  run = { key: tense, setNum:'AI', level:'AI', seq: exercises.map(ex=>({type:'fillin', data:ex})), i:0, correct:0, total:0, wrong:[], good:[],
    color:t.color, title:naam, streak:0, bestStreak:0,
    backAction: backAction || `renderTopic('${tense}')` };
  run.seq.unshift({type:'info', text:`Deze oefening ("${naam}") werd door de AI gemaakt op vraag van de leerkracht. Veel succes!`});
  run.seq.push({type:'end'});
  renderStep();
}
function startAIRun(tense, naam){
  const kept = getKeptAIExercises();
  if(kept.length === 0){ alert('Vink minstens één oefening aan.'); return; }
  startAIRunWithData(tense, naam || 'AI-oefening', kept);
}
function copyAIJson(){
  const kept = getKeptAIExercises();
  const text = JSON.stringify(kept, null, 1);
  navigator.clipboard ? navigator.clipboard.writeText(text).then(()=>alert('JSON gekopieerd! Plak dit in de chat als je wil dat deze oefeningen permanent aan de app toegevoegd worden.'))
    : prompt('Kopieer deze JSON:', text);
}

/* ---------- leerkracht: inhoud van een bewaarde AI-reeks bewerken ----------
   Elke zin in zo'n reeks heeft dezelfde vorm als een gewone "kies de juiste
   vorm"-oefening (prefix/suffix/answer/options/level), dus deze editor lijkt
   sterk op openReeksEditor hierboven, maar werkt op de AI-reeksenlijst i.p.v.
   op WERKWOORDEN_DATA. */
let aiEditorState = null;
let aiEditorId = null;

function openAIReeksEditor(id){
  if(!state.teacherMode) return;
  stopSpeech();
  const item = loadAIReeksen().find(r=>r.id===id);
  if(!item) return;
  aiEditorId = id;
  aiEditorState = JSON.parse(JSON.stringify(item));
  renderAIReeksEditor();
}
function syncAIEditorFromDOM(){
  const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  aiEditorState.naam = val('aied_naam');
  aiEditorState.exercises.forEach((it,i)=>{
    it.prefix = val('aied_'+i+'_prefix');
    it.suffix = val('aied_'+i+'_suffix');
    it.answer = val('aied_'+i+'_answer');
    it.level = val('aied_'+i+'_level');
    it.options = val('aied_'+i+'_options').split(',').map(s=>s.trim()).filter(Boolean);
  });
}
function aiEditorAdd(){
  syncAIEditorFromDOM();
  aiEditorState.exercises.push({level:'*', prefix:'', suffix:'', answer:'', options:['','','']});
  renderAIReeksEditor();
}
function aiEditorRemove(i){
  syncAIEditorFromDOM();
  aiEditorState.exercises.splice(i,1);
  renderAIReeksEditor();
}
async function aiEditorSave(){
  syncAIEditorFromDOM();
  const btn = document.getElementById('aiEditorSaveBtn');
  if(btn){ btn.disabled = true; btn.textContent = '💾 Bezig met opslaan...'; }
  try{
    const list = loadAIReeksen();
    const idx = list.findIndex(r=>r.id===aiEditorId);
    if(idx===-1) throw new Error('Deze reeks bestaat niet meer.');
    list[idx] = aiEditorState;
    await saveAIReeksenList(list);
    alert('Wijzigingen opgeslagen! Alle leerlingen krijgen vanaf nu deze aangepaste versie te zien.');
  }catch(e){
    alert('Opslaan is mislukt: ' + e.message);
  }
  renderAIReeksEditor();
}
function aiEditorClose(){
  aiEditorState = null; aiEditorId = null;
  renderTeacherPanel();
}
function renderAIReeksEditor(){
  const d = aiEditorState;
  const lvlSel = (id, current) => `<select id="${id}">${['*','**','***'].map(l=>`<option value="${l}" ${l===current?'selected':''}>${l}</option>`).join('')}</select>`;
  let html = `<button class="backbtn" onclick="aiEditorClose()">← Terug zonder verder te bewerken</button>
    <h2>🛠️ AI-reeks bewerken</h2>
    <label>Naam<br><input id="aied_naam" value="${escAttr(d.naam)}" style="width:100%"></label>
    <p style="color:#666;font-size:.85rem">Let op: als je de naam hier wijzigt naar een naam die al bij een andere reeks bestaat, blijven het twee losse reeksen — samenvoegen gebeurt enkel bij het opslaan vanuit de AI-generator zelf.</p>
    <h3 style="margin-top:1rem">Zinnen (${d.exercises.length})</h3>`;
  d.exercises.forEach((it,i)=>{
    html += `<div class="editor-row" style="border-bottom:1px solid #eee;padding:.4rem 0">
      Niveau ${lvlSel('aied_'+i+'_level', it.level||'*')}<br>
      Voor de leemte: <input id="aied_${i}_prefix" value="${escAttr(it.prefix)}"> ... Na de leemte: <input id="aied_${i}_suffix" value="${escAttr(it.suffix)}"><br>
      Juist antwoord: <input id="aied_${i}_answer" value="${escAttr(it.answer)}"><br>
      Alle keuzemogelijkheden (komma-gescheiden, moet het juiste antwoord bevatten): <input id="aied_${i}_options" value="${escAttr((it.options||[]).join(', '))}" style="width:100%">
      <button class="iconbtn" onclick="aiEditorRemove(${i})">🗑️ Verwijderen</button>
    </div>`;
  });
  html += `<button class="iconbtn" onclick="aiEditorAdd()">+ Zin toevoegen</button>
    <div style="margin-top:1.5rem;display:flex;gap:.6rem">
      <button id="aiEditorSaveBtn" class="nextbtn" onclick="aiEditorSave()">💾 Wijzigingen opslaan</button>
      <button class="iconbtn" onclick="aiEditorClose()">Sluiten</button>
    </div>`;
  root.innerHTML = html;
}

/* ---------- login ---------- */
function renderLogin(){
  document.querySelector('header.topbar').style.display = 'none';
  root.innerHTML = `
    <div class="login-wrap">
      <div class="login-logos">
        <img src="assets/sta-logo.png" alt="Sint-Theresia / KBK">
        <img src="assets/melk-logo.png" alt="MELK - Mijn Eigen Leer-Kracht">
      </div>
      <h2>📚 Werkwoorden vervoegen</h2>
      <label>Voornaam</label>
      <input type="text" id="loginVoornaam" autocomplete="off">
      <label>Naam</label>
      <input type="text" id="loginNaam" autocomplete="off">
      <label>Klas</label>
      <select id="loginKlas" onchange="document.getElementById('loginKlasAnders').style.display = this.value==='__ander__' ? 'block':'none'">
        <option value="">Kies je klas...</option>
        <option>2A</option><option>2B</option>
        <option>3A</option><option>3B</option>
        <option>4A</option><option>4B</option>
        <option>5A</option><option>5B</option>
        <option>6A</option><option>6B</option>
        <option value="__ander__">Andere klas...</option>
      </select>
      <input type="text" id="loginKlasAnders" placeholder="Typ je klas" style="display:none;margin-top:.5rem" autocomplete="off">
      <label>Klasnummer</label>
      <input type="number" id="loginNummer" min="1" max="40" autocomplete="off">
      <button class="bigbtn" onclick="doLogin()">Start ▶</button>
      <p id="loginError" style="color:#b91c1c;font-size:.85rem;min-height:1.2em"></p>
      <p style="text-align:center;margin-top:.6rem"><a href="#" onclick="openTeacherLogin();return false;" style="color:#666;font-size:.85rem">👨‍🏫 Meester Frank</a></p>
    </div>`;
  document.getElementById('loginVoornaam').focus();
}
function doLogin(){
  const voornaam = document.getElementById('loginVoornaam').value.trim();
  const naam = document.getElementById('loginNaam').value.trim();
  let klas = document.getElementById('loginKlas').value;
  if(klas === '__ander__') klas = document.getElementById('loginKlasAnders').value.trim();
  const klasnummer = document.getElementById('loginNummer').value;
  if(!voornaam || !naam || !klas || !klasnummer){
    document.getElementById('loginError').textContent = 'Vul alle velden in voor je start.';
    return;
  }
  state.student = {voornaam, naam, klas, klasnummer};
  document.querySelector('header.topbar').style.display = 'flex';
  renderHeader();
  renderHome();
}

/* ---------- header ---------- */
function renderHeader(){
  const el = document.querySelector('header.topbar');
  el.innerHTML = `
    <h1 onclick="renderHome()">📚 Werkwoorden vervoegen</h1>
    <div class="header-logos"><img src="assets/sta-logo.png" alt="STA/KBK"><img src="assets/melk-logo.png" alt="MELK"></div>
    <div class="sizebtns" title="Tekstgrootte">
      <button onclick="setFontSize(0)">A</button>
      <button onclick="setFontSize(1)">A+</button>
      <button onclick="setFontSize(2)">A++</button>
    </div>
    <button class="iconbtn ${state.voorlezen?'active':''}" id="voorleesBtn">🔊 Voorlezen</button>
    <select class="voice-select" id="voiceSelect" style="display:${state.voorlezen?'inline-block':'none'}"></select>
    <button class="iconbtn" onclick="openSpiekbrief()">📋 Spiekbrief</button>
    ${state.teacherMode
      ? `<button class="iconbtn active" onclick="renderTeacherPanel()">⚙️ Beheerpaneel</button><button class="iconbtn" onclick="teacherLogout()">🚪 Uitloggen</button>`
      : `<button class="iconbtn" onclick="openTeacherLogin()">👨‍🏫 Meester Frank</button>`}
  `;
  setFontSize(state.fontSize);
  const vBtn = document.getElementById('voorleesBtn');
  const vSel = document.getElementById('voiceSelect');
  vBtn.onclick = ()=>{
    state.voorlezen = !state.voorlezen;
    vBtn.classList.toggle('active', state.voorlezen);
    vSel.style.display = state.voorlezen ? 'inline-block':'none';
    if(state.voorlezen) speakForce('Voorlezen staat nu aan.');
  };
  populateVoices(vSel);
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = ()=>populateVoices(vSel);
}

/* ---------- spiekbrief ---------- */
const spiekTabs = [
  {key:'tt', label:'Tegenwoordige tijd', img:'assets/schema-tt.png', examples:
    `<ul class="voorbeeld-list">
      <li>De leerling tekent (nu) een kasteel.</li>
      <li>Ik lees (nu) deze tekst.</li>
      <li>Kijk jij (nu) naar de televisie?</li>
      <li>Weten jullie (nu) het antwoord?</li>
      <li>Wij maken (nu) die oefeningen.</li>
    </ul>`},
  {key:'vt', label:'Verleden tijd', img:'assets/schema-vt.png', examples:
    `<ul class="voorbeeld-list">
      <li>De leerling tekende vorige week een kasteel.</li>
      <li>Ik las zopas deze tekst.</li>
      <li>Keek jij gisteren naar de televisie?</li>
      <li>Wisten jullie het antwoord?</li>
      <li>Wij maakten die oefeningen.</li>
    </ul>`},
  {key:'geenpv', label:'Geen persoonsvorm', img:'assets/schema-geenpv.png', examples:
    `<p style="margin-bottom:.3rem"><b>Als voltooid deelwoord:</b></p>
    <ul class="voorbeeld-list">
      <li>De leerling heeft een prachtig kasteel getekend.</li>
      <li>Ik heb die tekst gelezen.</li>
      <li>Heb jij naar de televisie gekeken?</li>
      <li>Hadden jullie het antwoord geweten?</li>
      <li>Wij hebben die oefeningen gemaakt.</li>
      <li>Zijn jullie allemaal op reis geweest?</li>
    </ul>
    <p style="margin:.6rem 0 .3rem"><b>Als bijvoeglijk naamwoord:</b></p>
    <ul class="voorbeeld-list">
      <li>Dat prachtig getekend kasteel is van mij.</li>
      <li>De gelezen tekst is moeilijk.</li>
      <li>Onze gemaakte oefeningen waren allemaal correct.</li>
      <li>Het gevonden geld is niet van mij.</li>
      <li>Het gezonken schip bevatte een kist met goud.</li>
      <li>Het lachende meisje zit in mijn klas.</li>
    </ul>`},
  {key:'allin', label:'Alles samen', img:'assets/schema-allin.png', examples:''},
];
function openSpiekbrief(defaultKey){
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.onclick = (e)=>{ if(e.target===bg) bg.remove(); };
  bg.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="this.closest('.modal-bg').remove()">✖</button>
      <h2>📋 Spiekbrief</h2>
      <div class="modal-tabs" id="spiekTabs"></div>
      <img id="spiekImg" src="">
      <div id="spiekExamples"></div>
    </div>`;
  document.body.appendChild(bg);
  const tabWrap = bg.querySelector('#spiekTabs');
  const img = bg.querySelector('#spiekImg');
  const exWrap = bg.querySelector('#spiekExamples');
  function show(key){
    const tab = spiekTabs.find(t=>t.key===key);
    img.src = tab.img;
    exWrap.innerHTML = tab.examples ? `<h3 style="margin-top:1rem">Voorbeeldzinnen</h3>${tab.examples}` : '';
    tabWrap.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b.dataset.key===key));
  }
  spiekTabs.forEach(t=>{
    const b = document.createElement('button');
    b.textContent = t.label; b.dataset.key = t.key;
    b.onclick = ()=>show(t.key);
    tabWrap.appendChild(b);
  });
  show(defaultKey || 'allin');
}

/* ---------- home ---------- */
const topicMeta = {
  tt: {emoji:'⏱️', desc:'Nu gebeurt het. Ik werk, jij speelt, wij lopen.'},
  vt: {emoji:'🕰️', desc:'Het gebeurde vroeger. Ik werkte, jij speelde, wij liepen.'},
  geenpv: {emoji:'🧩', desc:'Voltooid deelwoord of bijvoeglijk naamwoord: gewerkt, gespeeld, gelopen.'},
};
function renderHome(){
  stopSpeech();
  const cards = Object.keys(WERKWOORDEN_DATA).map(key=>{
    const t = WERKWOORDEN_DATA[key];
    const m = topicMeta[key];
    return `<div class="card topic-${key}" onclick="renderTopic('${key}')">
      <span class="chip">${m.emoji} ${t.title}</span>
      <h2>${t.title}</h2>
      <p>${m.desc}</p>
    </div>`;
  }).join('');
  root.innerHTML = `
    <p style="max-width:640px">Welkom${state.student? ', '+state.student.voornaam : ''}! Juf Ann, meester Ruben en meester Frank wensen jou veel succes bij het inoefenen van de werkwoorden! Kies hieronder welk onderdeel je wil oefenen, of bekijk eerst de <a href="#" onclick="openSpiekbrief();return false;">spiekbrief</a>.</p>
    <div class="grid">
      ${cards}
      <div class="card topic-allin" onclick="renderAllInNiveau()">
        <span class="chip">🧠 Alles samen</span>
        <h2>${reeksNaam('allin','1')}</h2>
        <p>Herken je nu tegenwoordige tijd, verleden tijd én geen persoonsvorm door elkaar?</p>
      </div>
    </div>`;
}

/* ---------- topic (kies reeks) ---------- */
function renderTopic(key){
  stopSpeech();
  const t = WERKWOORDEN_DATA[key];
  const handboekReeksen = Object.keys(HANDBOEK_DATA).filter(code => HANDBOEK_DATA[code].tense === key);
  const handboekBtns = handboekReeksen.map(code=>`<span>
        <button class="bigbtn" style="background:${t.color}" onclick="renderHandboekNiveau('${code}')">${reeksNaam('hb_'+code,'1')}</button>
        ${state.teacherMode ? `<button class="renamebtn" title="Naam wijzigen" onclick="hernoemReeks('hb_${code}','1')">✏️</button>` : ''}
      </span>`).join('');
  const aiReeksen = loadAIReeksen().filter(r=>r.tense===key);
  const aiBtns = aiReeksen.map(r=>`<span>
        <button class="bigbtn" style="background:${t.color}" onclick="renderAIReeksNiveau(${r.id})">✨ ${r.naam}</button>
        ${state.teacherMode ? `<button class="renamebtn" title="Naam wijzigen" onclick="hernoemAIReeksAndRefresh(${r.id})">✏️</button><button class="renamebtn" title="Verwijderen" onclick="deleteAIReeksAndRefresh(${r.id})">🗑️</button>` : ''}
      </span>`).join('');
  root.innerHTML = `
    <button class="backbtn" onclick="renderHome()">← Terug</button>
    <h2>${t.title}</h2>
    <p>Kies een reeks om te starten. Nadien maak je op het contractwerk het bijbehorende werkblad.</p>
    <div class="setbtns">
      ${['1','2'].map(s=>`<span>
        <button class="bigbtn" style="background:${t.color}" onclick="renderNiveau('${key}','${s}')">${reeksNaam(key,s)}</button>
        ${state.teacherMode ? `<button class="renamebtn" title="Naam wijzigen" onclick="hernoemReeks('${key}','${s}')">✏️</button>` : ''}
      </span>`).join('')}
      ${handboekBtns}
    </div>
    ${aiBtns ? `<h3 style="margin-top:1.2rem">✨ Extra AI-oefeningen</h3><div class="setbtns">${aiBtns}</div>` : ''}
    <div style="margin-top:1.2rem">
      <img src="assets/${t.schema}" style="max-width:100%;border-radius:12px;border:2px solid var(--line)">
    </div>`;
}

/* ---------- niveau keuze ---------- */
function renderNiveau(key, setNum){
  const t = WERKWOORDEN_DATA[key];
  root.innerHTML = `
    <button class="backbtn" onclick="renderTopic('${key}')">← Terug</button>
    <h2>${t.title} — ${reeksNaam(key,setNum)} ${state.teacherMode ? `<button class="iconbtn" onclick="openReeksEditor('${key}','${setNum}')">🛠️ Oefeningen bewerken</button> <button class="iconbtn" onclick="renderWerkbladPreview('reeks',{key:'${key}',setNum:'${setNum}'},\`renderNiveau('${key}','${setNum}')\`)">🖨️ Werkblad (★+★★+★★★)</button>` : ''}</h2>
    <p>Kies je niveau. Hoe meer sterren, hoe meer opdrachten je maakt.</p>
    <div class="niveau-grid">
      <div class="niveau-card" style="border-color:${t.color}" onclick="startRun('${key}','${setNum}','*')">
        <b>★</b><p>Basisoefeningen<br>(verkennen + herkennen + invullen, niveau *)</p>
      </div>
      <div class="niveau-card" style="border-color:${t.color}" onclick="startRun('${key}','${setNum}','**')">
        <b>★★</b><p>Ook de uitbreiding<br>(+ niveau ** oefeningen)</p>
      </div>
      <div class="niveau-card" style="border-color:${t.color}" onclick="startRun('${key}','${setNum}','***')">
        <b>★★★</b><p>Alle opdrachten<br>(+ niveau *** en zelf schrijven)</p>
      </div>
    </div>`;
}

/* ---------- exercise run engine ---------- */
async function buildTopicDicteePool(key){
  // combineert de "Zelf schrijven"-zinnen van reeks 1 én 2 van dit onderdeel (2x4=8 unieke zinnen),
  // zodat er bij niveau * en ** voldoende verschillende dictee-zinnen beschikbaar zijn.
  const [s1, s2] = await Promise.all([getSet(key,'1'), getSet(key,'2')]);
  return [...s1.written, ...s2.written];
}
async function buildSequence(key, setNum, maxLevel){
  const order = {'*':1,'**':2,'***':3};
  const cap = order[maxLevel];
  const t = WERKWOORDEN_DATA[key];
  const s = await getSet(key, setNum);
  const seq = [];
  seq.push({type:'info', text:`Welkom bij ${t.title}. Deze oefeningen komen ook terug op het contractwerk, met *, ** of ***.`});
  seq.push({type:'schema', img:t.schema, title:t.title});
  s.explore.forEach(ex=> seq.push({type:'explore', data:ex}));
  shuffle(s.identify.filter(it=>order[it.level]<=cap)).forEach(it=> seq.push({type:'identify', data:it}));
  shuffle(s.fillin.filter(it=>order[it.level]<=cap)).forEach(it=> seq.push({type:'fillin', data:it}));
  if(cap===1){
    // ook op het meest eenvoudige niveau al 5 typ-oefeningen (dictee), zodat elke leerling écht typt
    shuffle(await buildTopicDicteePool(key)).slice(0,5).forEach(it=> seq.push({type:'dictee', data:it}));
  } else if(cap===2){
    shuffle(await buildTopicDicteePool(key)).forEach(it=> seq.push({type:'dictee', data:it})); // alle 8 beschikbare (reeks 1+2 samen)
  } else if(cap>=3){
    shuffle([...s.written]).forEach(it=> seq.push({type:'written', data:it}));
  }
  seq.push({type:'match', data:buildMatchPairs(s)});
  seq.push({type:'end'});
  return seq;
}
function buildMatchPairs(s){
  // Gebruikt de Verkennen-data (onderwerp + juiste vorm) als koppel-kaarten.
  // BELANGRIJK: kaarten komen uit ÉÉN werkwoord, niet gemengd uit meerdere.
  // Bij meerdere werkwoorden (bv. spelen én zijn) gebruiken ze vaak identieke
  // onderwerpteksten ("Jij ...", "Hij ..."), die dan elk een ANDERE vorm nodig
  // hebben — zonder zichtbaar verschil voor de leerling. Door binnen één
  // werkwoord te blijven, is elke onderwerptekst gegarandeerd uniek op het bord.
  const ex = s.explore[Math.floor(Math.random()*s.explore.length)];
  const items = ex.subjects.map(subj => ({
    subject: subj.text.replace('...', '__').trim(),
    form: ex.forms[subj.group]
  }));
  for(let i=items.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [items[i],items[j]]=[items[j],items[i]]; }
  return items.slice(0,6);
}

let run = null;

async function startRun(key, setNum, level){
  const t = WERKWOORDEN_DATA[key];
  run = { key, setNum, level, seq: await buildSequence(key, setNum, level), i:0, correct:0, total:0, wrong:[], good:[],
    color:t.color, title:t.title, streak:0, bestStreak:0,
    backAction:`renderTopic('${key}')` };
  renderStep();
}

function progressHTML(){
  const pct = Math.round((run.i/(run.seq.length-1))*100);
  return `<div class="progressbar"><div style="width:${pct}%;background:${run.color}"></div></div>`;
}

function streakBadge(){
  if(run.streak < 2) return '';
  return `<span class="level-badge" style="background:#fee2e2;color:#b91c1c;float:right">🔥 ${run.streak} op rij</span>`;
}

function renderStep(){
  const step = run.seq[run.i];
  let inner = '';
  if(step.type==='info'){
    inner = `<div class="info-screen">${step.text}</div><button class="nextbtn" onclick="nextStep()">Start ▶</button>`;
    speak(step.text);
  } else if(step.type==='schema'){
    inner = `<h3>Bekijk dit schema even goed</h3><img src="assets/${step.img}" style="max-width:100%;border-radius:12px;border:2px solid var(--line)"><br><button class="nextbtn" onclick="nextStep()">Ik snap het, verder ▶</button>`;
  } else if(step.type==='explore'){
    inner = renderExplore(step.data);
  } else if(step.type==='identify'){
    inner = streakBadge() + renderIdentify(step.data);
  } else if(step.type==='fillin'){
    inner = streakBadge() + renderFillin(step.data);
  } else if(step.type==='written'){
    inner = streakBadge() + renderWritten(step.data);
  } else if(step.type==='match'){
    inner = renderMatch(step.data, step.matchLabel);
  } else if(step.type==='end'){
    inner = renderReport();
  } else if(step.type==='classify'){
    inner = streakBadge() + renderClassify(step.data);
  } else if(step.type==='dictee'){
    inner = streakBadge() + renderDictee(step.data);
  } else if(step.type==='stam'){
    inner = streakBadge() + renderStam(step.data);
  } else if(step.type==='vrijezin'){
    inner = streakBadge() + renderVrijeZin(step.data);
  } else if(step.type==='zinvt'){
    inner = streakBadge() + renderZinVT(step.data);
  } else if(step.type==='vrijetekst'){
    inner = renderVrijeTekst(step.data);
  } else if(step.type==='brontekst'){
    inner = renderBrontekst(step.data);
  }
  root.innerHTML = `
    <button class="backbtn" onclick="stopSpeech();${run.backAction}">← Stoppen</button>
    ${progressHTML()}
    <div class="exercise-box" style="border-color:${run.color}">${inner}</div>`;
  if(step.type==='written' || step.type==='dictee' || step.type==='stam' || step.type==='vrijezin' || step.type==='zinvt'){
    const inp = document.getElementById('writeInput');
    if(inp) inp.focus();
  }
}

function nextStep(){
  stopSpeech();
  run.i++;
  if(run.i >= run.seq.length) run.i = run.seq.length-1;
  renderStep();
}
function autoNext(delay){
  setTimeout(()=>{ if(run) nextStep(); }, delay || 1100);
}
/* Schuift pas door zodra het voorlezen van de feedback echt is afgelopen
   (i.p.v. na een vaste, te korte pauze die het geluid halverwege afkapte). */
function autoAdvance(spokenText){
  if(state.voorlezen && spokenText && window.speechSynthesis){
    try{
      window.speechSynthesis.cancel();
      const u = mkUtterance(spokenText);
      const advance = ()=> setTimeout(()=>{ if(run) nextStep(); }, 400);
      u.onend = advance;
      u.onerror = advance;
      window.speechSynthesis.speak(u);
      return;
    }catch(e){}
  }
  autoNext(900);
}

/* explore */
function renderExplore(data){
  const isGeenPv = run.key === 'geenpv';
  const instructie = isGeenPv
    ? 'Klik op de infinitief en je ziet het voltooid deelwoord of bijvoeglijk naamwoord verschijnen.'
    : `Klik op het onderwerp en je ziet meteen de juiste vorm${data.verb ? ' van het werkwoord '+data.verb : ''}.`;
  const cells = data.subjects.map((s,idx)=>`<div class="explore-cell" data-idx="${idx}" onclick="revealExplore(this,${s.group})">${s.text}</div>`).join('');
  setTimeout(()=>{ speak(instructie); },50);
  return `<span class="level-badge" style="background:#eef; color:#334">Verkennen</span>
    <p>${instructie}</p>
    <div class="explore-grid">${cells}</div>
    <button class="nextbtn" onclick="nextStep()">Volgende ▶</button>`;
}
function revealExplore(el, group){
  const data = run.seq[run.i].data;
  const form = data.forms[group];
  el.classList.add('revealed');
  if(!el.dataset.done){
    // sommige kaarten (bv. bij "geen persoonsvorm") bevatten geen "..."-plekhouder
    // maar tonen enkel de infinitief tussen haakjes; die vervangen we dan volledig
    // door de vorm, in plaats van een niet-bestaande "..." te zoeken.
    if(el.textContent.includes('...')){
      el.textContent = el.textContent.replace('...', form).trim();
    } else {
      el.textContent = form;
    }
    el.dataset.done = '1';
  }
  speak(el.textContent);
}

/* identify (multiple choice) */
function renderIdentify(data){
  run.total++;
  if(!data._shuffled){
    const oldCorrect = data.correctIndex;
    const idxs = data.options.map((_,i)=>i);
    shuffle(idxs);
    data.options = idxs.map(i=>data.options[i]);
    data.correctIndex = idxs.indexOf(oldCorrect);
    data._shuffled = true;
  }
  const opts = data.options.map((o,idx)=>`<button class="opt" onclick="checkIdentify(this,${idx})">${o}</button>`).join('');
  if(data.plain){
    setTimeout(()=>speak(data.prompt.replace(/<[^>]+>/g,'')),50);
    return `<span class="level-badge" style="background:${levelColors[data.level]};color:${levelText[data.level]}">${data.level}</span>
    <p class="prompt">${data.prompt}</p>
    <div class="options">${opts}</div>
    <div id="fb" class="feedback"></div>`;
  }
  setTimeout(()=>speakBlankPrompt(data.prompt),50);
  return `<span class="level-badge" style="background:${levelColors[data.level]};color:${levelText[data.level]}">${data.level}</span>
    <p class="prompt">Vul de zin aan: ${data.prompt}</p>
    <div class="options">${opts}</div>
    <div id="fb" class="feedback"></div>`;
}
function checkIdentify(el, idx){
  const data = run.seq[run.i].data;
  const ok = idx === data.correctIndex;
  document.querySelectorAll('.options .opt').forEach((b,i)=>{
    b.onclick = null;
    if(i===data.correctIndex) b.classList.add('correct');
    else if(b===el) b.classList.add('wrong');
  });
  const fb = document.getElementById('fb');
  if(ok){
    run.correct++; run.good.push(data.options[data.correctIndex]);
    run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
    fb.textContent='Mooi zo! ✅'; fb.className='feedback ok';
    autoAdvance('Juist! '+data.options[data.correctIndex]);
  } else {
    const extra = data.extraInfo ? ' ('+data.extraInfo+')' : '';
    run.wrong.push({vraag:data.prompt, juist:data.options[data.correctIndex]+extra});
    run.streak = 0;
    fb.textContent='Bijna! Het juiste antwoord is: '+data.options[data.correctIndex]+extra; fb.className='feedback no'; speak(fb.textContent);
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}

/* fillin (choose among options in sentence) */
function renderFillin(data){
  run.total++;
  if(!data._shuffled){
    data.options = shuffle([...data.options]);
    data._shuffled = true;
  }
  const opts = data.options.map((o,idx)=>`<button class="opt" onclick="checkFillin(this,${idx})">${o}</button>`).join('');
  const sentence = `${data.prefix} <b>___</b> ${data.suffix}`;
  setTimeout(()=>speakBlankAware(data.prefix, data.suffix),50);
  return `<span class="level-badge" style="background:${levelColors[data.level]};color:${levelText[data.level]}">${data.level}</span>
    <p class="prompt">Kies de juiste vorm van het werkwoord.</p>
    <p class="prompt">${sentence}</p>
    <div class="options">${opts}</div>
    <div id="fb" class="feedback"></div>`;
}
function checkFillin(el, idx){
  const data = run.seq[run.i].data;
  const ok = data.options[idx] === data.answer;
  document.querySelectorAll('.options .opt').forEach(b=>{ b.onclick=null; });
  document.querySelectorAll('.options .opt').forEach((b,i)=>{
    if(data.options[i]===data.answer) b.classList.add('correct');
    else if(i===idx) b.classList.add('wrong');
  });
  const fb = document.getElementById('fb');
  const full = `${data.prefix} ${data.answer} ${data.suffix}`;
  if(ok){
    run.correct++; run.good.push(full);
    run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
    fb.textContent='Mooi zo! ✅ '+full; fb.className='feedback ok';
    autoAdvance(full);
  } else {
    run.wrong.push({vraag:`${data.prefix} ___ ${data.suffix}`, juist:full});
    run.streak = 0;
    fb.textContent='Bijna! Juiste zin: '+full; fb.className='feedback no'; speak(full);
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}

/* written (type your own answer) */
function renderWritten(data){
  run.total++;
  const lvl = data.level || '***';
  setTimeout(()=>{
    let text = data.prompt.replace(/^\d+\)\s*/, '');
    let verbHint = null;
    const m = text.match(/^\(([^)]+)\)\s*/);
    if(m){ verbHint = m[1]; text = text.replace(/^\([^)]+\)\s*/, ''); }
    speakQueueParts(verbHint, text.split('...'));
  },50);
  return `<span class="level-badge" style="background:${levelColors[lvl]};color:${levelText[lvl]}">${lvl}</span>
    <p class="prompt">Schrijf de juiste vorm van het werkwoord.</p>
    <p class="prompt">${data.prompt}</p>
    <div class="writeform"><input type="text" id="writeInput" autocomplete="off" onkeydown="if(event.key==='Enter')checkWritten()"><button class="checkbtn" onclick="checkWritten()">Controleer</button></div>
    <div id="fb" class="feedback"></div>`;
}
function checkWritten(){
  const data = run.seq[run.i].data;
  const inputEl = document.getElementById('writeInput');
  const val = inputEl.value.trim();
  const ok = val.toLowerCase() === data.answer.toLowerCase();
  const fb = document.getElementById('fb');
  inputEl.disabled = true;
  document.querySelector('.checkbtn').disabled = true;
  if(ok){
    run.correct++; run.good.push(data.answer);
    run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
    fb.textContent='Mooi zo! ✅'; fb.className='feedback ok';
    autoAdvance('Juist! '+data.answer);
  } else {
    run.wrong.push({vraag:data.prompt, juist:data.answer});
    run.streak = 0;
    fb.textContent='Het juiste antwoord is: '+data.answer; fb.className='feedback no'; speak(fb.textContent);
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}

/* ---------- geheugenspel: koppel onderwerp aan de juiste vorm ----------
   Belangrijk: sommige vormen komen meerdere keren voor (bv. "werd" hoort bij
   meerdere onderwerpen). Een kaart telt daarom als juist zodra de TEKST van
   de vorm-kaart overeenkomt met de vereiste vorm van de onderwerp-kaart —
   niet omdat het toevallig dezelfde vooraf-vastgelegde koppel-index was.
   Zo wordt elke inhoudelijk correcte combinatie ook echt als juist gerekend. */
function renderMatch(items, matchLabel){
  const cards = [];
  items.forEach((it,idx)=>{
    cards.push({type:'subject', text:it.subject, form:it.form, id:'S'+idx});
    cards.push({type:'form', text:it.form, id:'F'+idx});
  });
  for(let i=cards.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [cards[i],cards[j]]=[cards[j],cards[i]]; }
  run._matchCards = cards;
  run._matchFlipped = [];
  run._matchFound = 0;
  run._matchTotal = items.length;
  const grid = cards.map((c,idx)=>`<div class="match-card" id="mc${idx}" onclick="flipMatch(${idx})">?</div>`).join('');
  const instructie = matchLabel==='infinitief'
    ? 'Zoek per koppel de infinitief en de bijbehorende stam van het werkwoord.'
    : 'Zoek per koppel het onderwerp en de bijbehorende vorm van het werkwoord. Sommige vormen kunnen bij meer dan één onderwerp horen — elke juiste combinatie telt.';
  return `<span class="level-badge" style="background:#fef3c7;color:#92400e">Geheugenspel</span>
    <p>${instructie}</p>
    <div class="match-grid" id="matchGrid">${grid}</div>
    <p id="matchStatus" style="margin-top:.8rem"></p>`;
}
function flipMatch(idx){
  const cardEl = document.getElementById('mc'+idx);
  if(cardEl.classList.contains('matched') || cardEl.classList.contains('flipped')) return;
  if(run._matchFlipped.length>=2) return;
  cardEl.classList.add('flipped');
  cardEl.textContent = run._matchCards[idx].text;
  // onderwerp-kaarten tonen een "__" als visuele plekhouder (bv. "__ de leerlingen?");
  // dat mag niet letterlijk als "onderstrepingsteken" voorgelezen worden.
  speakForce(run._matchCards[idx].text.replace(/_+/g, '').replace(/\s+/g,' ').trim());
  run._matchFlipped.push(idx);
  if(run._matchFlipped.length===2){
    const [a,b] = run._matchFlipped;
    const cA = run._matchCards[a], cB = run._matchCards[b];
    const subjectCard = cA.type==='subject' ? cA : (cB.type==='subject' ? cB : null);
    const formCard = cA.type==='form' ? cA : (cB.type==='form' ? cB : null);
    const isMatch = subjectCard && formCard && (a!==b) && (subjectCard.form === formCard.text);
    if(isMatch){
      document.getElementById('mc'+a).classList.add('matched');
      document.getElementById('mc'+b).classList.add('matched');
      run._matchFound++;
      run._matchFlipped = [];
      if(run._matchFound >= run._matchTotal){
        document.getElementById('matchStatus').innerHTML = 'Alle koppels gevonden! Knap gedaan. <button class="nextbtn" onclick="nextStep()">Verder ▶</button>';
      }
    } else {
      setTimeout(()=>{
        document.getElementById('mc'+a).classList.remove('flipped');
        document.getElementById('mc'+b).classList.remove('flipped');
        document.getElementById('mc'+a).textContent='?';
        document.getElementById('mc'+b).textContent='?';
        run._matchFlipped = [];
      }, 900);
    }
  }
}

/* ---------- rapport ---------- */
function renderReport(){
  const pct = run.total ? Math.round(run.correct/run.total*100) : 100;
  const okList = [...new Set(run.good)].slice(0,6);
  const workList = run.wrong.slice(0,8);
  const st = state.student || {voornaam:'', naam:'', klas:'', klasnummer:''};
  const datum = new Date().toLocaleDateString('nl-BE');
  const reeksLabel = (run.key==='allin' || String(run.setNum).startsWith('hb_')) ? '' : ` (${reeksNaam(run.key, run.setNum)}, niveau ${run.level})`;
  const streakLine = run.bestStreak >= 3 ? `<p>🔥 Langste reeks juiste antwoorden na elkaar: <b>${run.bestStreak}</b></p>` : '';
  const html = `
    <div class="report" id="reportBox">
      <h3>📄 Rapport — ${run.title}${reeksLabel}</h3>
      <p><b>${st.voornaam} ${st.naam}</b> — klas ${st.klas}, nr. ${st.klasnummer} — ${datum}</p>
      <p>Score: <b>${run.correct} / ${run.total}</b> (${pct}%)</p>
      ${streakLine}
      ${okList.length? `<p><b>Dit lukt je goed:</b></p><ul class="ok-list">${okList.map(x=>`<li>${x}</li>`).join('')}</ul>` : ''}
      ${workList.length? `<p><b>Hier kan je nog op oefenen:</b></p><ul class="work-list">${workList.map(w=>`<li>${w.vraag} → <b>${w.juist}</b></li>`).join('')}</ul>` : '<p>Alles was in orde. Top werk! 🎉</p>'}
    </div>
    <div class="report-actions">
      <button onclick="window.print()">🖨️ Printen</button>
      <button onclick="emailReport()">📧 E-mailen</button>
      <button onclick="saveReport()">💾 Opslaan</button>
      <button onclick="${run.key==='allin' ? 'renderAllInNiveau()' : `renderTopic('${run.key}')`}">Terug naar ${run.title}</button>
      <button onclick="renderHome()">Naar overzicht</button>
    </div>`;
  speak(pct>=80 ? 'Knap gedaan! Bekijk je rapport.' : 'Goed geprobeerd! Bekijk je rapport, er staat ook op waar je nog op kan oefenen.');
  return html;
}
function reportText(){
  const pct = run.total ? Math.round(run.correct/run.total*100) : 100;
  const st = state.student || {voornaam:'', naam:'', klas:'', klasnummer:''};
  const datum = new Date().toLocaleDateString('nl-BE');
  const reeksLabel = (run.key==='allin' || String(run.setNum).startsWith('hb_')) ? '' : ` (${reeksNaam(run.key, run.setNum)}, niveau ${run.level})`;
  let txt = `Rapport werkwoorden - ${run.title}${reeksLabel}\n`;
  txt += `${st.voornaam} ${st.naam} - klas ${st.klas}, nr. ${st.klasnummer} - ${datum}\n`;
  txt += `Score: ${run.correct} / ${run.total} (${pct}%)\n`;
  if(run.bestStreak >= 3) txt += `Langste reeks juiste antwoorden na elkaar: ${run.bestStreak}\n`;
  txt += '\n';
  if(run.good.length){ txt += 'Dit lukt goed:\n'; [...new Set(run.good)].slice(0,6).forEach(x=>txt+=' - '+x+'\n'); txt+='\n'; }
  if(run.wrong.length){ txt += 'Kan nog oefenen op:\n'; run.wrong.forEach(w=>txt+=` - ${w.vraag} -> ${w.juist}\n`); }
  else txt += 'Alles was in orde!\n';
  return txt;
}
function emailReport(){
  const subject = encodeURIComponent('Rapport werkwoorden - ' + (state.student?state.student.voornaam+' '+state.student.naam:''));
  const body = encodeURIComponent(reportText());
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
function saveReport(){
  const blob = new Blob([reportText()], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const naam = state.student ? (state.student.voornaam+'-'+state.student.naam) : 'leerling';
  a.download = `rapport-werkwoorden-${naam}.txt`;
  a.click();
}

/* ---------- all-in classificatie ---------- */
async function buildAllInPool(){
  const pool = [];
  const stripLead = (t)=> (t||'').replace(/^\d+\)\s*/, '').replace(/^\([^)]+\)\s*/, '').trim();
  for(const key of Object.keys(WERKWOORDEN_DATA)){
    for(const setNum of Object.keys(WERKWOORDEN_DATA[key].sets)){
      const s = await getSet(key, setNum);
      s.fillin.forEach(it=>{
        const prefixClean = stripLead(it.prefix);
        const html = `${prefixClean} <u>${it.answer}</u> ${it.suffix}`.replace(/\s+/g,' ').trim();
        const text = `${prefixClean} ${it.answer} ${it.suffix}`.replace(/\s+/g,' ').trim();
        pool.push({ html, text, label: key, level: it.level });
      });
      s.written.forEach(it=>{
        const cleanPrompt = stripLead(it.prompt);
        const html = cleanPrompt.replace('...', `<u>${it.answer}</u>`);
        const text = cleanPrompt.replace('...', it.answer);
        pool.push({ html, text, label: key, level:'***' });
      });
    }
  }
  return pool;
}
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }

/* Bouwt de All-in vragenlijst per niveau, naar analogie met de andere reeksen:
   * = 15 vragen (niveau *), ** = +5 vragen (niveau **, dus 20 in totaal),
   *** = +5 vragen (niveau ***, dus 25 in totaal). */
async function buildAllInSet(maxLevel){
  const pool = await buildAllInPool();
  const byLevel = {'*':[], '**':[], '***':[]};
  pool.forEach(p=> byLevel[p.level] && byLevel[p.level].push(p));
  const picked = shuffle(byLevel['*']).slice(0,15);
  if(maxLevel==='**' || maxLevel==='***') picked.push(...shuffle(byLevel['**']).slice(0,5));
  if(maxLevel==='***') picked.push(...shuffle(byLevel['***']).slice(0,5));
  return picked;
}

/* Dictee-blok: 5 zinnen per niveau extra (cumulatief), telkens getypt i.p.v. herkend.
   Gebruikt dezelfde bron als de "Zelf schrijven"-oefening (infinitief + te typen vorm),
   over alle onderdelen (tt/vt/geenpv) heen gemengd. */
async function buildDicteePool(){
  const pool = [];
  for(const key of Object.keys(WERKWOORDEN_DATA)){
    for(const setNum of Object.keys(WERKWOORDEN_DATA[key].sets)){
      const s = await getSet(key, setNum);
      s.written.forEach(it=> pool.push({ prompt: it.prompt, answer: it.answer }));
    }
  }
  return pool;
}
async function buildDicteeSet(maxLevel){
  const n = maxLevel==='***' ? 15 : maxLevel==='**' ? 10 : 5;
  return shuffle(await buildDicteePool()).slice(0, n);
}

/* ========== Handboeklessen (TK-bestanden) ========== */
/* Geeft titel/kleur/terugknop voor een tense-waarde, inclusief het speciale geval "allin"
   (dat geen eigen ingang heeft in WERKWOORDEN_DATA, in tegenstelling tot tt/vt/geenpv). */
function getTenseInfo(tense){
  if(tense === 'allin'){
    return { title: reeksNaam('allin','1'), color:'#7c3aed', backAction:`renderAllInNiveau()` };
  }
  const t = WERKWOORDEN_DATA[tense];
  return { title: t.title, color: t.color, backAction:`renderTopic('${tense}')` };
}
/* ---------- leerkracht: inhoud van reeksen bewerken (handboek én de gewone reeksen) ----------
   Aanpassingen worden per reeks als volledige (overschreven) kopie opgeslagen in de
   gedeelde opslag, los van de oorspronkelijke HANDBOEK_DATA / WERKWOORDEN_DATA. Zo
   blijft het originele materiaal steeds intact en kan de leerkracht op elk moment
   terug naar de oorspronkelijke inhoud — en zien alle leerlingen, op elk toestel,
   automatisch dezelfde (eventueel aangepaste) versie. */
async function getLesData(code){
  await ensureOverrides();
  return sharedOverrides['hb_'+code] || HANDBOEK_DATA[code];
}
function hasLesDataOverride(code){
  return !!(sharedOverrides && sharedOverrides['hb_'+code]);
}
async function saveLesDataOverride(code, data){
  await saveOverride('hb_'+code, data);
}
async function resetLesDataOverride(code){
  if(!confirm('Alle eigen aanpassingen aan deze reeks ongedaan maken en terugkeren naar de oorspronkelijke handboekinhoud?')) return;
  try{
    await deleteOverride('hb_'+code);
  }catch(e){
    alert('Kon niet terugzetten: ' + e.message);
    return;
  }
  openHandboekEditor(code);
}

/* Zelfde principe, maar dan voor de gewone tt/vt/geenpv-reeksen (WERKWOORDEN_DATA). */
async function getSet(key, setNum){
  await ensureOverrides();
  return sharedOverrides['wd_'+key+'_'+setNum] || WERKWOORDEN_DATA[key].sets[setNum];
}
function hasSetOverride(key, setNum){
  return !!(sharedOverrides && sharedOverrides['wd_'+key+'_'+setNum]);
}
async function saveSetOverride(key, setNum, data){
  await saveOverride('wd_'+key+'_'+setNum, data);
}
async function resetSetOverride(key, setNum){
  if(!confirm('Alle eigen aanpassingen aan deze reeks ongedaan maken en terugkeren naar de oorspronkelijke inhoud?')) return;
  try{
    await deleteOverride('wd_'+key+'_'+setNum);
  }catch(e){
    alert('Kon niet terugzetten: ' + e.message);
    return;
  }
  openReeksEditor(key, setNum);
}

let editorState = null;
let editorCode = null;

async function openHandboekEditor(code){
  if(!state.teacherMode) return;
  stopSpeech();
  editorCode = code;
  editorState = JSON.parse(JSON.stringify(await getLesData(code))); // losse werkkopie
  renderHandboekEditor();
}
/* Leest alles wat nu in de invulvelden staat terug in editorState, zodat
   een druk op "toevoegen" of "verwijderen" (die het scherm herbouwen)
   nooit nog niet-opgeslagen tekst laat verdwijnen. */
function syncEditorFromDOM(){
  const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  (editorState.persoonsvorm||[]).forEach((it,i)=>{
    it.prompt = val('pv_'+i+'_prompt'); it.answer = val('pv_'+i+'_answer'); it.level = val('pv_'+i+'_level');
  });
  (editorState.fillin||[]).forEach((it,i)=>{
    it.prefix = val('fi_'+i+'_prefix'); it.suffix = val('fi_'+i+'_suffix'); it.answer = val('fi_'+i+'_answer'); it.level = val('fi_'+i+'_level');
    it.options = val('fi_'+i+'_options').split(',').map(s=>s.trim()).filter(Boolean);
  });
  (editorState.identify||[]).forEach((it,i)=>{
    it.prompt = val('id_'+i+'_prompt'); it.level = val('id_'+i+'_level'); it.extraInfo = val('id_'+i+'_extra');
    it.options = val('id_'+i+'_options').split(',').map(s=>s.trim()).filter(Boolean);
    it.correctIndex = parseInt(val('id_'+i+'_correct'),10) || 0;
  });
  (editorState.zinvt||[]).forEach((it,i)=>{
    it.zin = val('zv_'+i+'_zin'); it.antwoord = val('zv_'+i+'_antwoord');
  });
  if(editorState.zinvt && editorState.zinvt.length){
    editorState.zinvtLabel = val('zv_label');
    editorState.zinvtLevel = val('zv_level');
  }
  (editorState.stam||[]).forEach((it,i)=>{
    it.infinitief = val('st_'+i+'_inf'); it.antwoord = val('st_'+i+'_ant');
  });
  (editorState.vrijezin||[]).forEach((it,i)=>{
    it.infinitief = val('vz_'+i+'_inf');
  });
  const vt = Array.isArray(editorState.vrijetekst) ? editorState.vrijetekst : (editorState.vrijetekst ? [editorState.vrijetekst] : []);
  vt.forEach((it,i)=>{
    it.opdracht = val('vt_'+i+'_opdracht'); it.level = val('vt_'+i+'_level');
  });
  editorState.vrijetekst = vt;
  if(editorState.brontekst){
    editorState.brontekst.titel = val('bt_titel');
    editorState.brontekst.tekst = val('bt_tekst');
    editorState.brontekst.opdracht = val('bt_opdracht');
    const targetsRaw = val('bt_targets');
    if(targetsRaw !== '') editorState.brontekst.targets = targetsRaw.split(',').map(s=>s.trim()).filter(Boolean);
  }
}
function editorAdd(field){
  syncEditorFromDOM();
  if(!editorState[field]) editorState[field] = [];
  const blanks = {
    persoonsvorm: {prompt:"(werkwoord) ...", answer:"", level:"*"},
    fillin: {level:"*", prefix:"", suffix:"", answer:"", options:["","",""]},
    identify: {level:"*", prompt:"", options:["",""], correctIndex:0, extraInfo:""},
    zinvt: {zin:"", antwoord:""},
    stam: {infinitief:"", antwoord:""},
    vrijezin: {infinitief:""},
    vrijetekst: {opdracht:"", level:"***"},
  };
  editorState[field].push(JSON.parse(JSON.stringify(blanks[field])));
  renderHandboekEditor();
}
function editorRemove(field, i){
  syncEditorFromDOM();
  editorState[field].splice(i,1);
  renderHandboekEditor();
}
async function editorSave(){
  syncEditorFromDOM();
  const btn = document.getElementById('editorSaveBtn');
  if(btn){ btn.disabled = true; btn.textContent = '💾 Bezig met opslaan...'; }
  try{
    await saveLesDataOverride(editorCode, editorState);
    alert('Wijzigingen opgeslagen! Alle leerlingen krijgen vanaf nu deze aangepaste versie te zien.');
  }catch(e){
    alert('Opslaan is mislukt: ' + e.message);
  }
  renderHandboekEditor();
}
function editorClose(){
  editorState = null;
  const code = editorCode; editorCode = null;
  renderHandboekNiveau(code);
}
function renderHandboekEditor(){
  const d = editorState;
  const lvlSel = (id, current) => `<select id="${id}">${['*','**','***'].map(l=>`<option value="${l}" ${l===current?'selected':''}>${l}</option>`).join('')}</select>`;
  let html = `<button class="backbtn" onclick="editorClose()">← Terug zonder verder te bewerken</button>
    <h2>🛠️ Oefeningen bewerken — ${d.titel||editorCode}</h2>
    <p style="color:#666">Pas hieronder de inhoud aan. Vergeet niet op <b>Wijzigingen opslaan</b> te klikken. ${hasLesDataOverride(editorCode) ? `<button class="iconbtn" onclick="resetLesDataOverride('${editorCode}')">↩️ Terug naar oorspronkelijke handboektekst</button>` : ''}</p>`;

  if(d.brontekst){
    html += `<h3>📖 Brontekst</h3>
      <label>Titel<br><input id="bt_titel" value="${escAttr(d.brontekst.titel)}" style="width:100%"></label><br>
      <label>Tekst<br><textarea id="bt_tekst" rows="4" style="width:100%">${escHtml(d.brontekst.tekst)}</textarea></label><br>
      <label>Opdracht (bv. "Klik op alle persoonsvormen in de tegenwoordige tijd.")<br><input id="bt_opdracht" value="${escAttr(d.brontekst.opdracht||'')}" style="width:100%"></label><br>
      <label>Woorden om aan te klikken (komma-gescheiden, mag een woord dubbel bevatten)<br><input id="bt_targets" value="${escAttr((d.brontekst.targets||[]).join(', '))}" style="width:100%"></label>`;
  }

  if(d.stam){
    html += `<h3>🌱 Stam (niveau *)</h3>`;
    d.stam.forEach((it,i)=>{
      html += `<div class="editor-row"><input id="st_${i}_inf" placeholder="infinitief" value="${escAttr(it.infinitief)}"> → <input id="st_${i}_ant" placeholder="stam" value="${escAttr(it.antwoord)}"> <button class="iconbtn" onclick="editorRemove('stam',${i})">🗑️</button></div>`;
    });
    html += `<button class="iconbtn" onclick="editorAdd('stam')">+ Werkwoord toevoegen</button>`;
  }

  if(d.identify){
    html += `<h3>🔍 Herkennen (identify)</h3>`;
    d.identify.forEach((it,i)=>{
      html += `<div class="editor-row" style="border-bottom:1px solid #eee;padding:.4rem 0">
        Niveau ${lvlSel('id_'+i+'_level', it.level)}<br>
        <input id="id_${i}_prompt" placeholder="vraag / woord" value="${escAttr(it.prompt)}" style="width:100%"><br>
        Opties (komma-gescheiden): <input id="id_${i}_options" value="${escAttr((it.options||[]).join(', '))}" style="width:100%"><br>
        Index juist antwoord (0=eerste optie, 1=tweede, ...): <input id="id_${i}_correct" type="number" min="0" value="${it.correctIndex}" style="width:4rem"><br>
        Extra uitleg (optioneel): <input id="id_${i}_extra" value="${escAttr(it.extraInfo||'')}" style="width:100%">
        <button class="iconbtn" onclick="editorRemove('identify',${i})">🗑️ Verwijderen</button>
      </div>`;
    });
    html += `<button class="iconbtn" onclick="editorAdd('identify')">+ Vraag toevoegen</button>`;
  }

  if(d.persoonsvorm){
    html += `<h3>✍️ Schrijf de juiste vorm (persoonsvorm)</h3>`;
    d.persoonsvorm.forEach((it,i)=>{
      html += `<div class="editor-row" style="border-bottom:1px solid #eee;padding:.4rem 0">
        Niveau ${lvlSel('pv_'+i+'_level', it.level||'*')}
        <input id="pv_${i}_prompt" placeholder="(werkwoord, tijd) Zin met ..." value="${escAttr(it.prompt)}" style="width:100%;margin-top:.3rem">
        Antwoord: <input id="pv_${i}_answer" value="${escAttr(it.answer)}">
        <button class="iconbtn" onclick="editorRemove('persoonsvorm',${i})">🗑️</button>
      </div>`;
    });
    html += `<button class="iconbtn" onclick="editorAdd('persoonsvorm')">+ Vraag toevoegen</button>`;
  }

  if(d.fillin){
    html += `<h3>☑️ Kies de juiste vorm (fillin)</h3>`;
    d.fillin.forEach((it,i)=>{
      html += `<div class="editor-row" style="border-bottom:1px solid #eee;padding:.4rem 0">
        Niveau ${lvlSel('fi_'+i+'_level', it.level||'*')}<br>
        Voor de leemte: <input id="fi_${i}_prefix" value="${escAttr(it.prefix)}"> ... Na de leemte: <input id="fi_${i}_suffix" value="${escAttr(it.suffix)}"><br>
        Juist antwoord: <input id="fi_${i}_answer" value="${escAttr(it.answer)}"><br>
        Alle keuzemogelijkheden (komma-gescheiden, moet het juiste antwoord bevatten): <input id="fi_${i}_options" value="${escAttr((it.options||[]).join(', '))}" style="width:100%">
        <button class="iconbtn" onclick="editorRemove('fillin',${i})">🗑️ Verwijderen</button>
      </div>`;
    });
    html += `<button class="iconbtn" onclick="editorAdd('fillin')">+ Vraag toevoegen</button>`;
  }

  if(d.zinvt && d.zinvt.length){
    html += `<h3>🔁 Hele zin herschrijven (zinvt)</h3>
      Niveau vanaf wanneer dit onderdeel meedoet: ${lvlSel('zv_level', d.zinvtLevel||'**')}<br>
      Instructie boven de zinnen: <input id="zv_label" value="${escAttr(d.zinvtLabel||'')}" style="width:100%"><br>`;
    d.zinvt.forEach((it,i)=>{
      html += `<div class="editor-row" style="border-bottom:1px solid #eee;padding:.4rem 0">
        Zin: <input id="zv_${i}_zin" value="${escAttr(it.zin)}" style="width:100%">
        Antwoord: <input id="zv_${i}_antwoord" value="${escAttr(it.antwoord)}" style="width:100%">
        <button class="iconbtn" onclick="editorRemove('zinvt',${i})">🗑️</button>
      </div>`;
    });
    html += `<button class="iconbtn" onclick="editorAdd('zinvt')">+ Zin toevoegen</button>`;
  }

  if(d.vrijezin){
    html += `<h3>📝 Zelf een zin schrijven (vrijezin)</h3>`;
    d.vrijezin.forEach((it,i)=>{
      html += `<div class="editor-row"><input id="vz_${i}_inf" placeholder="infinitief" value="${escAttr(it.infinitief)}"> <button class="iconbtn" onclick="editorRemove('vrijezin',${i})">🗑️</button></div>`;
    });
    html += `<button class="iconbtn" onclick="editorAdd('vrijezin')">+ Werkwoord toevoegen</button>`;
  }

  const vt = Array.isArray(d.vrijetekst) ? d.vrijetekst : (d.vrijetekst ? [d.vrijetekst] : []);
  if(vt.length){
    html += `<h3>🤖 AI-gecontroleerde schrijfopdracht (vrijetekst)</h3>`;
    vt.forEach((it,i)=>{
      html += `<div class="editor-row" style="border-bottom:1px solid #eee;padding:.4rem 0">
        Niveau ${lvlSel('vt_'+i+'_level', it.level||'***')}<br>
        Opdracht: <textarea id="vt_${i}_opdracht" rows="2" style="width:100%">${escHtml(it.opdracht)}</textarea>
        <button class="iconbtn" onclick="editorRemove('vrijetekst',${i})">🗑️ Verwijderen</button>
      </div>`;
    });
    html += `<button class="iconbtn" onclick="editorAdd('vrijetekst')">+ Opdracht toevoegen</button>`;
  }

  html += `<div style="margin-top:1.5rem;display:flex;gap:.6rem">
      <button id="editorSaveBtn" class="nextbtn" onclick="editorSave()">💾 Wijzigingen opslaan</button>
      <button class="iconbtn" onclick="editorClose()">Sluiten</button>
    </div>`;
  root.innerHTML = html;
}
function escHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s){ return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }

/* ---------- leerkracht: inhoud van de gewone reeksen (tt/vt/geenpv) bewerken ----------
   Zelfde principe als de handboekeditor hierboven, maar dan voor de "explore"
   (verkennen), "identify", "fillin" en "written" onderdelen van WERKWOORDEN_DATA.
   Het "memory"-veld (indien aanwezig) wordt gewoon meegekopieerd, maar heeft
   momenteel geen eigen scherm in de app en is dus ook niet bewerkbaar hier. */
let reeksEditorState = null;
let reeksEditorKey = null;
let reeksEditorSetNum = null;

async function openReeksEditor(key, setNum){
  if(!state.teacherMode) return;
  stopSpeech();
  reeksEditorKey = key;
  reeksEditorSetNum = setNum;
  reeksEditorState = JSON.parse(JSON.stringify(await getSet(key, setNum)));
  renderReeksEditor();
}
function syncReeksEditorFromDOM(){
  const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  (reeksEditorState.explore||[]).forEach((ex,i)=>{
    ex.verb = val('ex_'+i+'_verb');
    ex.forms = [0,1,2].map(g=> val('ex_'+i+'_form'+g));
    (ex.subjects||[]).forEach((sub,j)=>{
      sub.text = val('ex_'+i+'_sub'+j+'_text');
      sub.group = parseInt(val('ex_'+i+'_sub'+j+'_group'),10) || 0;
    });
  });
  (reeksEditorState.identify||[]).forEach((it,i)=>{
    it.prompt = val('rid_'+i+'_prompt'); it.level = val('rid_'+i+'_level');
    it.options = val('rid_'+i+'_options').split(',').map(s=>s.trim()).filter(Boolean);
    it.correctIndex = parseInt(val('rid_'+i+'_correct'),10) || 0;
  });
  (reeksEditorState.fillin||[]).forEach((it,i)=>{
    it.prefix = val('rfi_'+i+'_prefix'); it.suffix = val('rfi_'+i+'_suffix'); it.answer = val('rfi_'+i+'_answer'); it.level = val('rfi_'+i+'_level');
    it.options = val('rfi_'+i+'_options').split(',').map(s=>s.trim()).filter(Boolean);
  });
  (reeksEditorState.written||[]).forEach((it,i)=>{
    it.prompt = val('rwr_'+i+'_prompt'); it.answer = val('rwr_'+i+'_answer');
  });
}
function reeksEditorAdd(field){
  syncReeksEditorFromDOM();
  if(!reeksEditorState[field]) reeksEditorState[field] = [];
  const blanks = {
    explore: {verb:"", subjects:[{group:0,text:"Ik ..."},{group:1,text:"Jij ..."},{group:2,text:"Wij ..."}], forms:["","",""]},
    identify: {level:"*", prompt:"Vul de zin aan: ...", options:["","",""], correctIndex:0},
    fillin: {level:"*", prefix:"", suffix:"", answer:"", options:["","",""]},
    written: {prompt:"(werkwoord) ...", answer:""},
  };
  reeksEditorState[field].push(JSON.parse(JSON.stringify(blanks[field])));
  renderReeksEditor();
}
function reeksEditorRemove(field, i){
  syncReeksEditorFromDOM();
  reeksEditorState[field].splice(i,1);
  renderReeksEditor();
}
function reeksEditorAddSubject(exI){
  syncReeksEditorFromDOM();
  reeksEditorState.explore[exI].subjects.push({group:0, text:"... ?"});
  renderReeksEditor();
}
function reeksEditorRemoveSubject(exI, subJ){
  syncReeksEditorFromDOM();
  reeksEditorState.explore[exI].subjects.splice(subJ,1);
  renderReeksEditor();
}
async function reeksEditorSave(){
  syncReeksEditorFromDOM();
  const btn = document.getElementById('reeksEditorSaveBtn');
  if(btn){ btn.disabled = true; btn.textContent = '💾 Bezig met opslaan...'; }
  try{
    await saveSetOverride(reeksEditorKey, reeksEditorSetNum, reeksEditorState);
    alert('Wijzigingen opgeslagen! Alle leerlingen krijgen vanaf nu deze aangepaste versie te zien.');
  }catch(e){
    alert('Opslaan is mislukt: ' + e.message);
  }
  renderReeksEditor();
}
function reeksEditorClose(){
  reeksEditorState = null;
  const key = reeksEditorKey, setNum = reeksEditorSetNum;
  reeksEditorKey = null; reeksEditorSetNum = null;
  renderNiveau(key, setNum);
}
function renderReeksEditor(){
  const d = reeksEditorState;
  const t = WERKWOORDEN_DATA[reeksEditorKey];
  const lvlSel = (id, current) => `<select id="${id}">${['*','**','***'].map(l=>`<option value="${l}" ${l===current?'selected':''}>${l}</option>`).join('')}</select>`;
  const groupSel = (id, current) => `<select id="${id}">${[0,1,2].map(g=>`<option value="${g}" ${g===current?'selected':''}>groep ${g}</option>`).join('')}</select>`;
  let html = `<button class="backbtn" onclick="reeksEditorClose()">← Terug zonder verder te bewerken</button>
    <h2>🛠️ Oefeningen bewerken — ${t.title} · ${reeksNaam(reeksEditorKey, reeksEditorSetNum)}</h2>
    <p style="color:#666">Pas hieronder de inhoud aan. Vergeet niet op <b>Wijzigingen opslaan</b> te klikken. ${hasSetOverride(reeksEditorKey, reeksEditorSetNum) ? `<button class="iconbtn" onclick="resetSetOverride('${reeksEditorKey}','${reeksEditorSetNum}')">↩️ Terug naar oorspronkelijke inhoud</button>` : ''}</p>`;

  html += `<h3>🔎 Verkennen (explore)</h3>
    <p style="font-size:.85rem;color:#777">Per werkwoord: 3 vormen (groep 0 = ik, groep 1 = jij/hij/het meisje..., groep 2 = wij/jullie/de leerlingen...) en de onderwerpen die bij elke groep horen.</p>`;
  (d.explore||[]).forEach((ex,i)=>{
    html += `<div class="editor-row" style="border:1px solid #eee;border-radius:8px;padding:.6rem;margin-bottom:.6rem">
      Werkwoord: <input id="ex_${i}_verb" value="${escAttr(ex.verb)}">
      <button class="iconbtn" onclick="editorRemoveExplore(${i})">🗑️ Werkwoord verwijderen</button><br>
      Vorm groep 0: <input id="ex_${i}_form0" value="${escAttr(ex.forms[0])}">
      Vorm groep 1: <input id="ex_${i}_form1" value="${escAttr(ex.forms[1])}">
      Vorm groep 2: <input id="ex_${i}_form2" value="${escAttr(ex.forms[2])}"><br>
      <b>Onderwerpen:</b><br>`;
    (ex.subjects||[]).forEach((sub,j)=>{
      html += `${groupSel('ex_'+i+'_sub'+j+'_group', sub.group)} <input id="ex_${i}_sub${j}_text" value="${escAttr(sub.text)}" placeholder="bv. Jij ..."> <button class="iconbtn" onclick="reeksEditorRemoveSubject(${i},${j})">🗑️</button><br>`;
    });
    html += `<button class="iconbtn" onclick="reeksEditorAddSubject(${i})">+ Onderwerp toevoegen</button>
    </div>`;
  });
  html += `<button class="iconbtn" onclick="reeksEditorAdd('explore')">+ Nieuw werkwoord toevoegen</button>`;

  html += `<h3>🔍 Herkennen (identify)</h3>`;
  (d.identify||[]).forEach((it,i)=>{
    html += `<div class="editor-row" style="border-bottom:1px solid #eee;padding:.4rem 0">
      Niveau ${lvlSel('rid_'+i+'_level', it.level)}<br>
      <input id="rid_${i}_prompt" value="${escAttr(it.prompt)}" style="width:100%"><br>
      Opties (komma-gescheiden): <input id="rid_${i}_options" value="${escAttr((it.options||[]).join(', '))}" style="width:100%"><br>
      Index juist antwoord: <input id="rid_${i}_correct" type="number" min="0" value="${it.correctIndex}" style="width:4rem">
      <button class="iconbtn" onclick="editorRemoveGeneric('identify',${i})">🗑️ Verwijderen</button>
    </div>`;
  });
  html += `<button class="iconbtn" onclick="reeksEditorAdd('identify')">+ Vraag toevoegen</button>`;

  html += `<h3>☑️ Kies de juiste vorm (fillin)</h3>`;
  (d.fillin||[]).forEach((it,i)=>{
    html += `<div class="editor-row" style="border-bottom:1px solid #eee;padding:.4rem 0">
      Niveau ${lvlSel('rfi_'+i+'_level', it.level)}<br>
      Voor de leemte: <input id="rfi_${i}_prefix" value="${escAttr(it.prefix)}"> ... Na de leemte: <input id="rfi_${i}_suffix" value="${escAttr(it.suffix)}"><br>
      Juist antwoord: <input id="rfi_${i}_answer" value="${escAttr(it.answer)}"><br>
      Alle keuzemogelijkheden (komma-gescheiden): <input id="rfi_${i}_options" value="${escAttr((it.options||[]).join(', '))}" style="width:100%">
      <button class="iconbtn" onclick="editorRemoveGeneric('fillin',${i})">🗑️ Verwijderen</button>
    </div>`;
  });
  html += `<button class="iconbtn" onclick="reeksEditorAdd('fillin')">+ Vraag toevoegen</button>`;

  html += `<h3>✍️ Zelf schrijven (written — ook gebruikt voor dictee)</h3>`;
  (d.written||[]).forEach((it,i)=>{
    html += `<div class="editor-row"><input id="rwr_${i}_prompt" value="${escAttr(it.prompt)}" style="width:60%"> Antwoord: <input id="rwr_${i}_answer" value="${escAttr(it.answer)}"> <button class="iconbtn" onclick="editorRemoveGeneric('written',${i})">🗑️</button></div>`;
  });
  html += `<button class="iconbtn" onclick="reeksEditorAdd('written')">+ Zin toevoegen</button>`;

  html += `<div style="margin-top:1.5rem;display:flex;gap:.6rem">
      <button id="reeksEditorSaveBtn" class="nextbtn" onclick="reeksEditorSave()">💾 Wijzigingen opslaan</button>
      <button class="iconbtn" onclick="reeksEditorClose()">Sluiten</button>
    </div>`;
  root.innerHTML = html;
}
// kleine hulpjes zodat de verwijder-knoppen hierboven niet in aanvaring komen met
// de gelijknamige editorRemove() van de handboekeditor (die werkt op editorState,
// niet op reeksEditorState)
function editorRemoveExplore(i){ reeksEditorRemove('explore', i); }
function editorRemoveGeneric(field, i){ reeksEditorRemove(field, i); }

async function renderHandboekNiveau(code){
  stopSpeech();
  const lesData = await getLesData(code);
  const t = getTenseInfo(lesData.tense);
  const desc = lvl => {
    const parts = [];
    if(lvl==='*'){
      if(lesData.stam) parts.push('stam schrijven');
      if((lesData.identify||[]).some(it=>it.level==='*')) parts.push('herkennen');
      if((lesData.fillin||[]).some(it=>it.level==='*')) parts.push('juiste vorm kiezen');
      if((lesData.persoonsvorm||[]).some(it=>(it.level||'*')==='*')) parts.push('persoonsvorm invullen');
    } else if(lvl==='**'){
      if((lesData.fillin||[]).some(it=>(it.level||'**')==='**')) parts.push('zinnen aanvullen');
      if((lesData.persoonsvorm||[]).some(it=>it.level==='**')) parts.push('verleden tijd invullen');
      if(lesData.zinvt && (lesData.zinvtLevel||'**')==='**') parts.push('hele zin herschrijven');
      if((Array.isArray(lesData.vrijetekst)?lesData.vrijetekst:(lesData.vrijetekst?[lesData.vrijetekst]:[])).some(vt=>(vt.level||'***')==='**')) parts.push('AI-gecontroleerd schrijven');
    } else {
      if((lesData.persoonsvorm||[]).some(it=>it.level==='***')) parts.push('extra pittige vragen');
      if(lesData.zinvt && lesData.zinvtLevel==='***') parts.push('hele zin herschrijven');
      if(lesData.vrijezin) parts.push('zelf zinnen schrijven');
      if((Array.isArray(lesData.vrijetekst)?lesData.vrijetekst:(lesData.vrijetekst?[lesData.vrijetekst]:[])).some(vt=>(vt.level||'***')==='***')) parts.push('kort verslag schrijven');
      if(lesData.vrijezin || lesData.vrijetekst) parts.push('AI-gecontroleerd');
    }
    return parts.join(' + ') || 'oefeningen';
  };
  root.innerHTML = `
    <button class="backbtn" onclick="${t.backAction}">← Terug</button>
    <h2>${t.title} — ${reeksNaam('hb_'+code,'1')} ${state.teacherMode ? `<button class="renamebtn" onclick="hernoemReeks('hb_${code}','1')">✏️</button> <button class="iconbtn" onclick="openHandboekEditor('${code}')">🛠️ Oefeningen bewerken</button> <button class="iconbtn" onclick="renderWerkbladPreview('handboek','${code}',\`renderHandboekNiveau('${code}')\`)">🖨️ Werkblad (★+★★+★★★)</button>` : ''}</h2>
    <p>Kies je niveau. Hoe meer sterren, hoe meer opdrachten je maakt.</p>
    <div class="niveau-grid">
      <div class="niveau-card" style="border-color:${t.color}" onclick="startHandboekRun('${code}','*')">
        <b>★</b><p>${desc('*')}</p>
      </div>
      <div class="niveau-card" style="border-color:${t.color}" onclick="startHandboekRun('${code}','**')">
        <b>★★</b><p>${desc('**')}</p>
      </div>
      <div class="niveau-card" style="border-color:${t.color}" onclick="startHandboekRun('${code}','***')">
        <b>★★★</b><p>${desc('***')}</p>
      </div>
    </div>`;
}
async function startHandboekRun(code, level){
  const order = {'*':1,'**':2,'***':3};
  const cap = order[level];
  const lesData = await getLesData(code);
  const t = getTenseInfo(lesData.tense);
  const seq = [];
  seq.push({type:'info', text:`Welkom bij ${reeksNaam('hb_'+code,'1')}.`});
  if(lesData.brontekst) seq.push({type:'brontekst', data:lesData.brontekst});
  shuffle([...(lesData.stam||[])]).forEach(it=> seq.push({type:'stam', data:it}));
  shuffle((lesData.identify||[]).filter(it=>order[it.level]<=cap)).forEach(it=> seq.push({type:'identify', data:it}));
  shuffle((lesData.persoonsvorm||[]).filter(it=>order[it.level||'*']<=cap)).forEach(it=> seq.push({type:'written', data:it}));
  if(lesData.stam && lesData.stam.length>=3) seq.push({type:'match', data: lesData.stam.map(it=>({subject:it.infinitief, form:it.antwoord})), matchLabel:'infinitief'});
  shuffle((lesData.fillin||[]).filter(it=>order[it.level||'**']<=cap)).forEach(it=> seq.push({type:'fillin', data:{...it, level: it.level||'**'}}));
  if(cap>=order[lesData.zinvtLevel||'**']) shuffle((lesData.zinvt||[]).map(it=>({...it, label: it.label||lesData.zinvtLabel}))).forEach(it=> seq.push({type:'zinvt', data:it}));
  if(cap>=3) shuffle([...(lesData.vrijezin||[])]).forEach(it=> seq.push({type:'vrijezin', data:it}));
  (Array.isArray(lesData.vrijetekst) ? lesData.vrijetekst : (lesData.vrijetekst ? [lesData.vrijetekst] : []))
    .filter(vt=>order[vt.level||'***']<=cap)
    .forEach(vt=> seq.push({type:'vrijetekst', data:vt}));
  seq.push({type:'end'});
  run = { key:lesData.tense, setNum:'hb_'+code, level, seq, i:0, correct:0, total:0, wrong:[], good:[],
    color:t.color, title:reeksNaam('hb_'+code,'1'), streak:0, bestStreak:0,
    backAction:`renderHandboekNiveau('${code}')` };
  renderStep();
}
function renderBrontekst(data){
  window._brontekstText = data.tekst;
  const hasOpdracht = data.targets && data.targets.length>0;
  let bodyHtml;
  if(hasOpdracht){
    // Tekst opsplitsen in woorden + tussenliggende witruimte, zodat de opmaak
    // (spaties, regeleinden) exact behouden blijft terwijl elk woord apart
    // aanklikbaar wordt.
    const rawTokens = data.tekst.split(/(\s+)/);
    const remaining = new Map();
    data.targets.forEach(t=>{
      const key = t.toLowerCase();
      remaining.set(key, (remaining.get(key)||0)+1);
    });
    const tokens = rawTokens.map(tok=>{
      if(/^\s*$/.test(tok)) return { ws:true, raw: tok };
      const clean = tok.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '').toLowerCase();
      return { ws:false, raw: tok, clean };
    });
    run._bt = { tokens, remaining, found:new Set(), total:data.targets.length, foundCount:0 };
    const wordsHtml = tokens.map((tok,i)=>{
      if(tok.ws) return tok.raw;
      return `<span class="bt-word" id="btw${i}" onclick="clickBrontekstWord(${i})" style="cursor:pointer;padding:1px 3px;border-radius:5px;transition:background .2s,color .2s">${tok.raw}</span>`;
    }).join('');
    bodyHtml = `<p style="line-height:1.9">${wordsHtml}</p>
      <p id="btStatus" style="font-weight:700;color:#7c3aed;margin-top:.8rem">${data.opdracht||'Klik op de juiste woorden.'} Nog <span id="btCount">${data.targets.length}</span> te vinden.</p>`;
  } else {
    bodyHtml = `<p style="line-height:1.7">${data.tekst}</p>`;
  }
  return `<span class="level-badge" style="background:#eef;color:#334">Tekst</span>
    <h3>${data.titel}</h3>
    ${bodyHtml}
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.6rem">
      <button class="iconbtn" onclick="speakForce(window._brontekstText)">🔊 Lees voor</button>
      <button class="iconbtn" onclick="stopSpeech()">⏹️ Stop voorlezen</button>
    </div>
    <br><button class="nextbtn" style="margin-top:1rem" onclick="nextStep()">Verder ▶</button>`;
}
function clickBrontekstWord(i){
  if(!run || !run._bt) return;
  const tok = run._bt.tokens[i];
  if(!tok || tok.ws) return;
  if(run._bt.found.has(i)) return;
  const el = document.getElementById('btw'+i);
  const rem = run._bt.remaining.get(tok.clean) || 0;
  if(rem > 0){
    run._bt.remaining.set(tok.clean, rem-1);
    run._bt.found.add(i);
    run._bt.foundCount++;
    if(el){
      el.style.background = '#dcfce7';
      el.style.color = '#166534';
      el.style.fontWeight = '700';
      el.style.cursor = 'default';
      el.onclick = null;
    }
    const countEl = document.getElementById('btCount');
    const remainingTotal = run._bt.total - run._bt.foundCount;
    if(countEl) countEl.textContent = remainingTotal;
    if(remainingTotal===0){
      const status = document.getElementById('btStatus');
      if(status) status.innerHTML = '✅ Je hebt ze allemaal gevonden! Knap gedaan.';
      speak('Je hebt ze allemaal gevonden! Knap gedaan.');
    }
  } else if(el){
    el.style.background = '#fee2e2';
    el.style.color = '#991b1b';
    setTimeout(()=>{ if(el && !run._bt.found.has(i)){ el.style.background=''; el.style.color=''; } }, 500);
  }
}
function renderStam(data){
  run.total++;
  setTimeout(()=>speak('Wat is de stam van '+data.infinitief+'?'),50);
  return `<span class="level-badge" style="background:${levelColors['*']};color:${levelText['*']}">*</span>
    <p class="prompt">Schrijf de stam van: <b>${data.infinitief}</b></p>
    <div class="writeform">
      <input type="text" id="writeInput" autocomplete="off" onkeydown="if(event.key==='Enter')checkStam()">
      <button class="checkbtn" onclick="checkStam()">Controleer</button>
    </div>
    <div id="fb" class="feedback"></div>`;
}
function checkStam(){
  const data = run.seq[run.i].data;
  const inputEl = document.getElementById('writeInput');
  const val = inputEl.value.trim();
  const ok = val.toLowerCase() === data.antwoord.toLowerCase();
  const fb = document.getElementById('fb');
  inputEl.disabled = true;
  document.querySelector('.checkbtn').disabled = true;
  if(ok){
    run.correct++; run.good.push(data.antwoord);
    run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
    fb.textContent='Mooi zo! ✅'; fb.className='feedback ok';
    autoNext(900);
  } else {
    run.wrong.push({vraag:'stam van '+data.infinitief, juist:data.antwoord});
    run.streak = 0;
    fb.textContent='De juiste stam is: '+data.antwoord; fb.className='feedback no';
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}
function renderVrijeZin(data){
  run.total++;
  return `<span class="level-badge" style="background:${levelColors['***']};color:${levelText['***']}">***</span>
    <p class="prompt">Schrijf een goede zin met een vervoegde vorm van: <b>${data.infinitief}</b></p>
    <div class="writeform">
      <input type="text" id="writeInput" autocomplete="off" style="width:320px" onkeydown="if(event.key==='Enter')checkVrijeZin()">
      <button class="checkbtn" onclick="checkVrijeZin()">Laat nakijken</button>
    </div>
    <div id="fb" class="feedback"></div>`;
}
async function checkVrijeZin(){
  const data = run.seq[run.i].data;
  const inputEl = document.getElementById('writeInput');
  const zin = inputEl.value.trim();
  const fb = document.getElementById('fb');
  if(!zin){ fb.textContent='Schrijf eerst een zin.'; fb.className='feedback no'; return; }
  inputEl.disabled = true;
  document.querySelector('.checkbtn').disabled = true;
  fb.textContent = '⏳ Even nakijken...'; fb.className = 'feedback';
  try{
    const res = await fetch('/.netlify/functions/check-sentence', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ infinitief: data.infinitief, zin })
    });
    const result = await res.json();
    if(!res.ok){
      fb.textContent = '❌ Kon niet nakijken: ' + (result.error || 'onbekende fout'); fb.className='feedback no';
      fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
      return;
    }
    if(result.correct){
      run.correct++; run.good.push(zin);
      run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
      fb.textContent = '✅ ' + (result.feedback || 'Goed gedaan!'); fb.className='feedback ok';
      autoNext(1600);
    } else {
      run.wrong.push({vraag:'zin met '+data.infinitief, juist: zin + ' → ' + (result.feedback||'')});
      run.streak = 0;
      fb.textContent = '✏️ ' + (result.feedback || 'Dit kan nog beter.'); fb.className='feedback no';
      fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
    }
  }catch(e){
    fb.textContent = '❌ Kon de AI-functie niet bereiken.'; fb.className='feedback no';
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}

/* zinvt: een volledige zin herschrijven (bv. tegenwoordige tijd -> verleden tijd), getypt */
function renderZinVT(data){
  run.total++;
  return `<span class="level-badge" style="background:${levelColors['**']};color:${levelText['**']}">**</span>
    <p class="prompt">${data.label || 'Schrijf deze zin in de verleden tijd:'}</p>
    <p class="prompt"><b>${data.zin}</b></p>
    <div class="writeform">
      <input type="text" id="writeInput" autocomplete="off" style="width:340px" onkeydown="if(event.key==='Enter')checkZinVT()">
      <button class="checkbtn" onclick="checkZinVT()">Controleer</button>
    </div>
    <div id="fb" class="feedback"></div>`;
}
function checkZinVT(){
  const data = run.seq[run.i].data;
  const inputEl = document.getElementById('writeInput');
  const val = inputEl.value.trim().replace(/\s+/g,' ');
  const target = data.antwoord.trim().replace(/\s+/g,' ');
  const ok = val.toLowerCase().replace(/[.!?]$/,'') === target.toLowerCase().replace(/[.!?]$/,'');
  const fb = document.getElementById('fb');
  inputEl.disabled = true;
  document.querySelector('.checkbtn').disabled = true;
  if(ok){
    run.correct++; run.good.push(data.antwoord);
    run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
    fb.textContent='Mooi zo! ✅'; fb.className='feedback ok';
    autoNext(1000);
  } else {
    run.wrong.push({vraag:data.zin, juist:data.antwoord});
    run.streak = 0;
    fb.textContent='De juiste zin is: '+data.antwoord; fb.className='feedback no';
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}

/* vrijetekst: een kort, AI-gecontroleerd tekstje (bv. een verslag), i.p.v. één losse zin */
function renderVrijeTekst(data){
  run.total++;
  return `<span class="level-badge" style="background:${levelColors['***']};color:${levelText['***']}">***</span>
    <p class="prompt">${data.opdracht}</p>
    <textarea id="vrijeTekstInput" rows="5" style="width:100%;max-width:500px;padding:.6rem;border:2px solid var(--line);border-radius:10px;font-family:inherit;font-size:1rem"></textarea>
    <div style="margin-top:.6rem"><button class="checkbtn" onclick="checkVrijeTekst()">Laat nakijken</button></div>
    <div id="fb" class="feedback"></div>`;
}
async function checkVrijeTekst(){
  const inputEl = document.getElementById('vrijeTekstInput');
  const tekst = inputEl.value.trim();
  const data = run.seq[run.i].data;
  const fb = document.getElementById('fb');
  if(!tekst){ fb.textContent='Schrijf eerst je tekst.'; fb.className='feedback no'; return; }
  inputEl.disabled = true;
  document.querySelector('.checkbtn').disabled = true;
  fb.textContent = '⏳ Even nakijken...'; fb.className = 'feedback';
  try{
    const res = await fetch('/.netlify/functions/check-sentence', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ opdracht: data.opdracht, tekst })
    });
    const result = await res.json();
    if(!res.ok){
      fb.textContent = '❌ Kon niet nakijken: ' + (result.error || 'onbekende fout'); fb.className='feedback no';
      fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
      return;
    }
    if(result.correct){
      run.correct++; run.good.push('kort verslag');
      run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
      fb.textContent = '✅ ' + (result.feedback || 'Goed gedaan!'); fb.className='feedback ok';
    } else {
      run.wrong.push({vraag:'kort verslag', juist: result.feedback||''});
      run.streak = 0;
      fb.textContent = '✏️ ' + (result.feedback || 'Dit kan nog beter.'); fb.className='feedback no';
    }
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }catch(e){
    fb.textContent = '❌ Kon de AI-functie niet bereiken.'; fb.className='feedback no';
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}
function renderAllInNiveau(){
  stopSpeech();
  const handboekReeksen = Object.keys(HANDBOEK_DATA).filter(code => HANDBOEK_DATA[code].tense === 'allin');
  const handboekBtns = handboekReeksen.map(code=>`<span>
        <button class="bigbtn" style="background:#7c3aed" onclick="renderHandboekNiveau('${code}')">${reeksNaam('hb_'+code,'1')}</button>
        ${state.teacherMode ? `<button class="renamebtn" title="Naam wijzigen" onclick="hernoemReeks('hb_${code}','1')">✏️</button>` : ''}
      </span>`).join('');
  root.innerHTML = `
    <button class="backbtn" onclick="renderHome()">← Terug</button>
    <h2>🧠 ${reeksNaam('allin','1')} ${state.teacherMode ? `<button class="renamebtn" onclick="hernoemReeks('allin','1')">✏️</button>` : ''}</h2>
    <p>Kies je niveau. Hoe meer sterren, hoe meer zinnen je moet herkennen én typen (dictee).</p>
    <div class="niveau-grid">
      <div class="niveau-card" style="border-color:#7c3aed" onclick="renderAllIn('*')">
        <b>★</b><p>15 herkennen + 5 dictee<br>(20 zinnen)</p>
      </div>
      <div class="niveau-card" style="border-color:#7c3aed" onclick="renderAllIn('**')">
        <b>★★</b><p>20 herkennen + 10 dictee<br>(30 zinnen)</p>
      </div>
      <div class="niveau-card" style="border-color:#7c3aed" onclick="renderAllIn('***')">
        <b>★★★</b><p>25 herkennen + 15 dictee<br>(40 zinnen)</p>
      </div>
    </div>
    ${handboekBtns ? `<h3 style="margin-top:1.5rem">Extra lessen</h3><div class="setbtns">${handboekBtns}</div>` : ''}`;
}

async function renderAllIn(level){
  const classifyPool = shuffle(await buildAllInSet(level));
  const dicteePool = await buildDicteeSet(level);
  const seq = classifyPool.map(p=>({type:'classify', data:p}));
  seq.push({type:'info', text:'Nu volgt het dictee-gedeelte: luister goed en typ telkens de juiste vorm van het werkwoord.'});
  dicteePool.forEach(it=> seq.push({type:'dictee', data:it}));
  run = { key:'allin', setNum:'-', level:level, seq, i:0, correct:0, total:0, wrong:[], good:[],
    color:'#7c3aed', title:reeksNaam('allin','1'), streak:0, bestStreak:0,
    backAction:`renderAllInNiveau()` };
  run.seq.unshift({type:'info', text:'Is het tegenwoordige tijd, verleden tijd of geen persoonsvorm (voltooid deelwoord/bijvoeglijk naamwoord)? Bekijk gerust eerst de spiekbrief.'});
  run.seq.push({type:'end'});
  renderStep();
}
const classifyLabels = {tt:{name:'Tegenwoordige tijd', color:'#16a34a'}, vt:{name:'Verleden tijd', color:'#2563eb'}, geenpv:{name:'Geen persoonsvorm', color:'#d97706'}};

function renderClassify(data){
  run.total++;
  setTimeout(()=>speak(data.text),50);
  const btns = Object.keys(classifyLabels).map(k=>`<button class="opt" style="border-color:${classifyLabels[k].color}" onclick="checkClassify('${k}')">${classifyLabels[k].name}</button>`).join('');
  return `<span class="level-badge" style="background:#ede9fe;color:#5b21b6">All-in</span>
      <p class="prompt">${data.html}</p>
      <p>Welk geval is dit?</p>
      <div class="classify-btns">${btns}</div>
      <div id="fb" class="feedback"></div>`;
}
function checkClassify(key){
  const step = run.seq[run.i];
  const ok = key === step.data.label;
  document.querySelectorAll('.classify-btns .opt').forEach(b=>b.onclick=null);
  const fb = document.getElementById('fb');
  if(ok){
    run.correct++; run.good.push(step.data.text+' → '+classifyLabels[step.data.label].name);
    run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
    fb.textContent='Mooi zo! ✅ Dit is: '+classifyLabels[step.data.label].name; fb.className='feedback ok';
    autoNext(900); // geen voorleesfeedback hier: brengt geen meerwaarde
  } else {
    run.wrong.push({vraag:step.data.text, juist:classifyLabels[step.data.label].name});
    run.streak = 0;
    fb.textContent='Dit was eigenlijk: '+classifyLabels[step.data.label].name; fb.className='feedback no';
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}

/* ---------- dictee (All-in): altijd hoorbaar, de leerling typt zelf ---------- */
function renderDictee(data){
  run.total++;
  let text = (data.prompt||'').replace(/^\d+\)\s*/, '');
  const m = text.match(/^\(([^)]+)\)\s*/);
  if(m){ text = text.replace(/^\([^)]+\)\s*/, ''); }
  const fullSentence = text.replace('...', data.answer).replace(/\s+/g,' ').trim();
  const playDictee = ()=>{
    if(!window.speechSynthesis) return;
    try{
      window.speechSynthesis.cancel();
      // een echt dictee: de VOLLEDIGE zin wordt voorgelezen, inclusief het (juiste) werkwoord zelf —
      // de leerling schrijft op wat die hoort, i.p.v. het antwoord zelf te moeten afleiden.
      window.speechSynthesis.speak(mkUtterance(fullSentence));
    }catch(e){}
  };
  window._dicteePlay = playDictee;
  // dictee wordt hoorbaar afgespeeld, los van de voorlezen-schakelaar. Meteen (synchroon) afspelen,
  // niet via setTimeout: veel browsers (vooral op tablets/telefoons) blokkeren geluid dat niet
  // rechtstreeks binnen dezelfde klik gestart wordt. De knop hieronder werkt in elk geval altijd,
  // want die klik telt zelf als een nieuwe, geldige gebruikersactie.
  playDictee();
  return `<span class="level-badge" style="background:#ede9fe;color:#5b21b6">Dictee</span>
    <p class="prompt">Luister goed en schrijf de juiste vorm van het werkwoord.</p>
    <p class="prompt">${data.prompt}</p>
    <button class="iconbtn" onclick="window._dicteePlay()">🔊 Beluister deze zin</button>
    <span style="font-size:.8rem;color:#888;margin-left:.4rem">(klik hier als je niets hoorde)</span>
    <div class="writeform" style="margin-top:.8rem">
      <input type="text" id="writeInput" autocomplete="off" onkeydown="if(event.key==='Enter')checkDictee()">
      <button class="checkbtn" onclick="checkDictee()">Controleer</button>
    </div>
    <div id="fb" class="feedback"></div>`;
}
function checkDictee(){
  const data = run.seq[run.i].data;
  const inputEl = document.getElementById('writeInput');
  const val = inputEl.value.trim();
  const ok = val.toLowerCase() === data.answer.toLowerCase();
  const fb = document.getElementById('fb');
  inputEl.disabled = true;
  document.querySelector('.checkbtn').disabled = true;
  if(ok){
    run.correct++; run.good.push(data.answer);
    run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
    fb.textContent='Mooi zo! ✅'; fb.className='feedback ok';
    autoNext(900);
  } else {
    run.wrong.push({vraag:data.prompt, juist:data.answer});
    run.streak = 0;
    fb.textContent='Het juiste antwoord is: '+data.answer; fb.className='feedback no';
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}

/* ---------- init ---------- */
overridesPromise = loadSharedOverrides(); // start meteen op de achtergrond op te halen
renderLogin();
