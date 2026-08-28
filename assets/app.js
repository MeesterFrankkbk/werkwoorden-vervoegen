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

/* ---------- reeks-namen (leerkracht kan hernoemen, opgeslagen per browser) ---------- */
function reeksNaam(key, setNum){
  const stored = localStorage.getItem('reeksnaam_'+key+'_'+setNum);
  if(stored) return stored;
  return key==='allin' ? 'All-in' : ('Reeks ' + setNum);
}
function hernoemReeks(key, setNum){
  if(!state.teacherMode) return; // enkel zichtbaar/klikbaar als Meester Frank is ingelogd
  const huidige = reeksNaam(key, setNum);
  const nieuw = prompt('Nieuwe naam voor deze reeks:', huidige);
  if(nieuw && nieuw.trim()){
    localStorage.setItem('reeksnaam_'+key+'_'+setNum, nieuw.trim());
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
        <button class="renamebtn" onclick="hernoemReeks('${key}','${s}')">✏️ Hernoemen</button>
      </div>`).join('');
    return `<div class="card topic-${key}" style="cursor:default">
      <h2>${t.title}</h2>
      ${reeksen}
    </div>`;
  }).join('');
  const allInCard = `<div class="card topic-allin" style="cursor:default">
      <h2>🧠 ${reeksNaam('allin','1')} <button class="renamebtn" onclick="hernoemReeks('allin','1')">✏️</button></h2>
      <p style="font-size:.85rem;color:#555;margin-top:0">Dit onderdeel heeft (nog) geen vaste inhoud zoals de andere — het stelt telkens een nieuwe, willekeurige selectie samen uit alle zinnen. Er komen later mogelijk meerdere van deze reeksen; elk krijgt dan een eigen naam.</p>
      <div style="padding:.5rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.4rem">★ 15 zinnen (niveau *)</div>
      <div style="padding:.5rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.4rem">★★ 20 zinnen (+ niveau **)</div>
      <div style="padding:.5rem .8rem;border:2px solid var(--line);border-radius:10px;margin-top:.4rem">★★★ 25 zinnen (+ niveau ***)</div>
    </div>`;
  root.innerHTML = `
    <button class="backbtn" onclick="renderHome()">← Terug</button>
    <h2>⚙️ Meester Frank — beheerpaneel</h2>
    <p>Hier kan je de naam van elke reeks aanpassen.</p>
    <div class="grid">${rows}${allInCard}</div>
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
          <input type="number" id="aiCount" value="8" min="1" max="20" style="width:70px;padding:.5rem;border:2px solid var(--line);border-radius:8px;font-family:inherit">
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
      status.textContent = '❌ ' + (data.error || 'Er ging iets mis.');
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

/* ---------- opgeslagen AI-reeksen (per browser, net als de reeksnamen) ---------- */
function loadAIReeksen(){
  try{ return JSON.parse(localStorage.getItem('ai_reeksen') || '[]'); }catch(e){ return []; }
}
function saveAIReeksenList(list){
  localStorage.setItem('ai_reeksen', JSON.stringify(list));
}
function saveAIReeks(tense, naam){
  const kept = getKeptAIExercises();
  if(kept.length === 0){ alert('Vink minstens één oefening aan.'); return; }
  const list = loadAIReeksen();
  list.push({ id: Date.now(), naam, tense, exercises: kept, createdAt: new Date().toLocaleDateString('nl-BE') });
  saveAIReeksenList(list);
  renderSavedAIReeksen();
  alert(`Reeks "${naam}" is bewaard (in dit beheerpaneel, op dit toestel).`);
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
        <button class="renamebtn" onclick="startSavedAIReeks(${r.id})">▶ Start</button>
        <button class="renamebtn" onclick="deleteAIReeks(${r.id})">🗑️</button>
      </span>
    </div>`).join('');
  wrap.innerHTML = `<h3>Bewaarde AI-reeksen</h3>${rows}`;
}
function hernoemAIReeks(id){
  const list = loadAIReeksen();
  const item = list.find(r=>r.id===id);
  if(!item) return;
  const nieuw = prompt('Nieuwe naam voor deze reeks:', item.naam);
  if(nieuw && nieuw.trim()){
    item.naam = nieuw.trim();
    saveAIReeksenList(list);
    renderSavedAIReeksen();
  }
}
function deleteAIReeks(id){
  if(!confirm('Deze bewaarde reeks verwijderen?')) return;
  saveAIReeksenList(loadAIReeksen().filter(r=>r.id!==id));
  renderSavedAIReeksen();
}
function startSavedAIReeks(id){
  const item = loadAIReeksen().find(r=>r.id===id);
  if(!item) return;
  aiGenerated = item.exercises;
  startAIRunWithData(item.tense, item.naam, item.exercises);
}
function startAIRunWithData(tense, naam, exercises){
  const t = WERKWOORDEN_DATA[tense] || {color:'#0891b2', title:'AI-oefening'};
  run = { key: tense, setNum:'AI', level:'AI', seq: exercises.map(ex=>({type:'fillin', data:ex})), i:0, correct:0, total:0, wrong:[], good:[],
    color:t.color, title:naam, streak:0, bestStreak:0,
    backAction:`renderTeacherPanel()` };
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
  const t = WERKWOORDEN_DATA[key];
  root.innerHTML = `
    <button class="backbtn" onclick="renderHome()">← Terug</button>
    <h2>${t.title}</h2>
    <p>Kies een reeks om te starten. Nadien maak je op het contractwerk het bijbehorende werkblad.</p>
    <div class="setbtns">
      ${['1','2'].map(s=>`<span>
        <button class="bigbtn" style="background:${t.color}" onclick="renderNiveau('${key}','${s}')">${reeksNaam(key,s)}</button>
        ${state.teacherMode ? `<button class="renamebtn" title="Naam wijzigen" onclick="hernoemReeks('${key}','${s}')">✏️</button>` : ''}
      </span>`).join('')}
    </div>
    <div style="margin-top:1.2rem">
      <img src="assets/${t.schema}" style="max-width:100%;border-radius:12px;border:2px solid var(--line)">
    </div>`;
}

/* ---------- niveau keuze ---------- */
function renderNiveau(key, setNum){
  const t = WERKWOORDEN_DATA[key];
  root.innerHTML = `
    <button class="backbtn" onclick="renderTopic('${key}')">← Terug</button>
    <h2>${t.title} — ${reeksNaam(key,setNum)}</h2>
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
function buildSequence(key, setNum, maxLevel){
  const order = {'*':1,'**':2,'***':3};
  const cap = order[maxLevel];
  const t = WERKWOORDEN_DATA[key];
  const s = t.sets[setNum];
  const seq = [];
  seq.push({type:'info', text:`Welkom bij ${t.title}. Deze oefeningen komen ook terug op het contractwerk, met *, ** of ***.`});
  seq.push({type:'schema', img:t.schema, title:t.title});
  s.explore.forEach(ex=> seq.push({type:'explore', data:ex}));
  s.identify.filter(it=>order[it.level]<=cap).forEach(it=> seq.push({type:'identify', data:it}));
  s.fillin.filter(it=>order[it.level]<=cap).forEach(it=> seq.push({type:'fillin', data:it}));
  if(cap>=3) s.written.forEach(it=> seq.push({type:'written', data:it}));
  seq.push({type:'match', data:buildMatchPairs(s)});
  seq.push({type:'end'});
  return seq;
}
function buildMatchPairs(s){
  // gebruikt de Verkennen-data (onderwerp + juiste vorm) als koppel-kaarten
  const items = [];
  s.explore.forEach(ex=>{
    ex.subjects.forEach(subj=>{
      const form = ex.forms[subj.group];
      const subjText = subj.text.replace('...', '__').trim();
      items.push({subject: subjText, form: form});
    });
  });
  for(let i=items.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [items[i],items[j]]=[items[j],items[i]]; }
  return items.slice(0,6);
}

let run = null;

function startRun(key, setNum, level){
  const t = WERKWOORDEN_DATA[key];
  run = { key, setNum, level, seq: buildSequence(key, setNum, level), i:0, correct:0, total:0, wrong:[], good:[],
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
    inner = renderMatch(step.data);
  } else if(step.type==='end'){
    inner = renderReport();
  } else if(step.type==='classify'){
    inner = streakBadge() + renderClassify(step.data);
  }
  root.innerHTML = `
    <button class="backbtn" onclick="${run.backAction}">← Stoppen</button>
    ${progressHTML()}
    <div class="exercise-box" style="border-color:${run.color}">${inner}</div>`;
  if(step.type==='written'){
    const inp = document.getElementById('writeInput');
    if(inp) inp.focus();
  }
}

function nextStep(){
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
  const opts = data.options.map((o,idx)=>`<button class="opt" onclick="checkIdentify(this,${idx})">${o}</button>`).join('');
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
    run.wrong.push({vraag:data.prompt, juist:data.options[data.correctIndex]});
    run.streak = 0;
    fb.textContent='Bijna! Het juiste antwoord is: '+data.options[data.correctIndex]; fb.className='feedback no'; speak(fb.textContent);
    fb.insertAdjacentHTML('afterend','<button class="nextbtn" onclick="nextStep()">Volgende ▶</button>');
  }
}

/* fillin (choose among options in sentence) */
function renderFillin(data){
  run.total++;
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
  setTimeout(()=>{
    let text = data.prompt.replace(/^\d+\)\s*/, '');
    let verbHint = null;
    const m = text.match(/^\(([^)]+)\)\s*/);
    if(m){ verbHint = m[1]; text = text.replace(/^\([^)]+\)\s*/, ''); }
    speakQueueParts(verbHint, text.split('...'));
  },50);
  return `<span class="level-badge" style="background:${levelColors['***']};color:${levelText['***']}">***</span>
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
function renderMatch(items){
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
  return `<span class="level-badge" style="background:#fef3c7;color:#92400e">Geheugenspel</span>
    <p>Zoek per koppel het onderwerp en de bijbehorende vorm van het werkwoord. Sommige vormen kunnen bij meer dan één onderwerp horen — elke juiste combinatie telt.</p>
    <div class="match-grid" id="matchGrid">${grid}</div>
    <p id="matchStatus" style="margin-top:.8rem"></p>`;
}
function flipMatch(idx){
  const cardEl = document.getElementById('mc'+idx);
  if(cardEl.classList.contains('matched') || cardEl.classList.contains('flipped')) return;
  if(run._matchFlipped.length>=2) return;
  cardEl.classList.add('flipped');
  cardEl.textContent = run._matchCards[idx].text;
  speakForce(run._matchCards[idx].text);
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
  const reeksLabel = run.key==='allin' ? '' : ` (${reeksNaam(run.key, run.setNum)}, niveau ${run.level})`;
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
  const reeksLabel = run.key==='allin' ? '' : ` (${reeksNaam(run.key, run.setNum)}, niveau ${run.level})`;
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
function buildAllInPool(){
  const pool = [];
  const stripLead = (t)=> (t||'').replace(/^\d+\)\s*/, '').replace(/^\([^)]+\)\s*/, '').trim();
  Object.keys(WERKWOORDEN_DATA).forEach(key=>{
    Object.keys(WERKWOORDEN_DATA[key].sets).forEach(setNum=>{
      const s = WERKWOORDEN_DATA[key].sets[setNum];
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
    });
  });
  return pool;
}
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }

/* Bouwt de All-in vragenlijst per niveau, naar analogie met de andere reeksen:
   * = 15 vragen (niveau *), ** = +5 vragen (niveau **, dus 20 in totaal),
   *** = +5 vragen (niveau ***, dus 25 in totaal). */
function buildAllInSet(maxLevel){
  const pool = buildAllInPool();
  const byLevel = {'*':[], '**':[], '***':[]};
  pool.forEach(p=> byLevel[p.level] && byLevel[p.level].push(p));
  const picked = shuffle(byLevel['*']).slice(0,15);
  if(maxLevel==='**' || maxLevel==='***') picked.push(...shuffle(byLevel['**']).slice(0,5));
  if(maxLevel==='***') picked.push(...shuffle(byLevel['***']).slice(0,5));
  return picked;
}

function renderAllInNiveau(){
  root.innerHTML = `
    <button class="backbtn" onclick="renderHome()">← Terug</button>
    <h2>🧠 ${reeksNaam('allin','1')} ${state.teacherMode ? `<button class="renamebtn" onclick="hernoemReeks('allin','1')">✏️</button>` : ''}</h2>
    <p>Kies je niveau. Hoe meer sterren, hoe meer zinnen je moet herkennen.</p>
    <div class="niveau-grid">
      <div class="niveau-card" style="border-color:#7c3aed" onclick="renderAllIn('*')">
        <b>★</b><p>15 zinnen<br>(niveau *)</p>
      </div>
      <div class="niveau-card" style="border-color:#7c3aed" onclick="renderAllIn('**')">
        <b>★★</b><p>20 zinnen<br>(+ niveau **)</p>
      </div>
      <div class="niveau-card" style="border-color:#7c3aed" onclick="renderAllIn('***')">
        <b>★★★</b><p>25 zinnen<br>(+ niveau ***)</p>
      </div>
    </div>`;
}

function renderAllIn(level){
  const pool = shuffle(buildAllInSet(level));
  run = { key:'allin', setNum:'-', level:level, seq: pool.map(p=>({type:'classify', data:p})), i:0, correct:0, total:0, wrong:[], good:[],
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

/* ---------- init ---------- */
renderLogin();
