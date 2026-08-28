/* ===== Handboeklessen (Correctiesleutels TK-bestanden) =====
   Elke reeks hoort bij één bestaand onderdeel (tt/vt/geenpv) en krijgt als naam de
   bestandscode zelf (bv. "TK060106"). Structuur per reeks:
   - tense: 'tt' | 'vt' | 'geenpv'
   - niveauBeschrijving: tekst per niveau-kaart
   - stam: [{infinitief, antwoord}]              -> niveau *
   - persoonsvorm: [{prompt, answer}]             -> niveau * (typen, na de stam-oefeningen)
   - fillin: [{prefix, suffix, answer, options}]  -> niveau ** (hergebruikt renderFillin)
   - vrijezin: [{infinitief}]                     -> niveau *** (AI-gecontroleerd) */

const HANDBOEK_DATA = {
  "TK060106": {
    tense: "tt",
    titel: "Woorden die werken (TK060106)",
    stam: [
      {infinitief:"spelen", antwoord:"speel"},
      {infinitief:"oefenen", antwoord:"oefen"},
      {infinitief:"worden", antwoord:"word"},
      {infinitief:"verwennen", antwoord:"verwen"},
      {infinitief:"verkiezen", antwoord:"verkies"},
      {infinitief:"beloven", antwoord:"beloof"},
      {infinitief:"branden", antwoord:"brand"},
      {infinitief:"vertoeven", antwoord:"vertoef"},
      {infinitief:"vervelen", antwoord:"verveel"},
      {infinitief:"antwoorden", antwoord:"antwoord"}
    ],
    persoonsvorm: [
      {prompt:"(spelen) Hij ... buiten met zijn vrienden.", answer:"speelt", level:"*"},
      {prompt:"(oefenen) Jij ... elke dag piano.", answer:"oefent", level:"*"},
      {prompt:"(beloven) Papa ... een verrassing.", answer:"belooft", level:"*"},
      {prompt:"(antwoorden) De leerling ... goed op de vraag.", answer:"antwoordt", level:"*"},
      {prompt:"(branden) De kaars ... de hele avond.", answer:"brandt", level:"*"}
    ],
    fillin: [
      {prefix:"(bespieden) Karel", suffix:"zijn kleine broer.", answer:"bespiedt", options:["bespied","bespiedt","bespieden"]},
      {prefix:"(lopen) 's Ochtends", suffix:"de meisjes een kwartiertje.", answer:"lopen", options:["loopt","lopen","loop"]},
      {prefix:"(telefoneren) Moeder", suffix:"elke dag naar opa.", answer:"telefoneert", options:["telefoneer","telefoneert","telefoneren"]},
      {prefix:"(bakken) De leerlingen van klas 6", suffix:"wafels voor het goede doel.", answer:"bakken", options:["bakt","bakken","bak"]},
      {prefix:"(rekenen) In onze klas", suffix:"Karel als de beste.", answer:"rekent", options:["reken","rekent","rekenen"]},
      {prefix:"(verbieden) Die strenge juf", suffix:"praten tijdens de les.", answer:"verbiedt", options:["verbied","verbiedt","verbieden"]},
      {prefix:"(antwoorden) Op de toets", suffix:"Katrien altijd juist.", answer:"antwoordt", options:["antwoord","antwoordt","antwoorden"]},
      {prefix:"(gijzelen) De kidnapper", suffix:"die arme vrouw al drie dagen.", answer:"gijzelt", options:["gijzel","gijzelt","gijzelen"]},
      {prefix:"(interviewen) Morgen", suffix:"de journaliste een bekende auteur.", answer:"interviewt", options:["interview","interviewt","interviewen"]},
      {prefix:"(verschillen) Jouw leven", suffix:"nogal van het leven van je ouders.", answer:"verschilt", options:["verschil","verschilt","verschillen"]},
      {prefix:"(bestaan) Computers, mobiele telefoons en tablets", suffix:"nog niet zo lang.", answer:"bestaan", options:["bestaat","bestaan","besta"]},
      {prefix:"(vergeten) Je", suffix:"dat je ouders briefjes schreven.", answer:"vergeet", options:["vergeet","vergeten","vergeette"]},
      {prefix:"(sturen) Of", suffix:"jij nog wel eens een papieren brief?", answer:"stuur", options:["stuur","stuurt","sturen"]},
      {prefix:"(verwachten) Een futuroloog schreef dat hij", suffix:"dat het gedaan is met onze privacy.", answer:"verwacht", options:["verwacht","verwachtte","verwachten"]},
      {prefix:"(vernietigen) Digitale berichten blijven vindbaar, ook al", suffix:"je ze.", answer:"vernietig", options:["vernietig","vernietigt","vernietigen"]},
      {prefix:"(verbranden) Als je een papieren brief", suffix:", is hij echt weg.", answer:"verbrandt", options:["verbrand","verbrandt","verbranden"]}
    ],
    vrijezin: [
      {infinitief:"veranderen"},
      {infinitief:"downloaden"},
      {infinitief:"verbranden"},
      {infinitief:"reizen"},
      {infinitief:"reageren"},
      {infinitief:"begeleiden"},
      {infinitief:"vinden"},
      {infinitief:"worden"}
    ]
  }
};
