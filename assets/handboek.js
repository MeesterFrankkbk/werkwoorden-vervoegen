/* ===== Handboeklessen (Correctiesleutels TK-bestanden) =====
   Elke reeks hoort bij één bestaand onderdeel (tt/vt/geenpv) en krijgt als naam de
   bestandscode zelf (bv. "TK060106"). Structuur per reeks:
   - tense: 'tt' | 'vt' | 'geenpv'
   - niveauBeschrijving: tekst per niveau-kaart
   - stam: [{infinitief, antwoord}]              -> niveau *
   - persoonsvorm: [{prompt, answer}]             -> niveau * (typen, na de stam-oefeningen)
   - brontekst: {titel, tekst}                    -> altijd zichtbaar/voorleesbaar, vóór de oefeningen
   - fillin: [{prefix, suffix, answer, options}]  -> niveau ** (hergebruikt renderFillin)
   - vrijezin: [{infinitief}]                     -> niveau *** (AI-gecontroleerd) */

const HANDBOEK_DATA = {
  "TK060106": {
    tense: "tt",
    titel: "Woorden die werken (TK060106)",
    brontekst: {
      titel: "Het gewicht van euro's",
      tekst: "Je wilt 100 euro in een portemonnee steken en die informatie aan een vriend meedelen. Zo hoeft hij niet te tellen als je hem de portemonnee geeft. Je schrijft gewoon het getal 100 op de portemonnee. Je noemt dat digitale informatie. Je kunt het ook wat moeilijker maken. Je weegt 1 euro en je leest 7,5 gram op de weegschaal. Dat moet je ook aan je vriend vertellen. Hij leest 750 gram op zijn weegschaal en hij weet nu dat je beurs 100 euro bevat."
    },
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
  },
  "TK060304": {
    tense: "vt",
    titel: "Keuze van de jury (TK060304)",
    brontekst: {
      titel: "De beste hobbykok",
      tekst: "Beste hobbykok, een tijdje geleden nam u deel aan onze wedstrijd. Volgens onze jury was u de terechte winnaar van onze wedstrijd. De jury gaf u 58 punten. Vorig jaar boden we de winnaar een reis voor twee personen aan. De winnaar werd uitgenodigd en ontving zijn prijs uit handen van de burgemeester van onze stad. De regionale zender zond hierover een mooie reportage uit. Ook dit jaar kozen we ervoor om de winnaar een reis te schenken. We schreven u al een brief met alle nodige informatie. Met vriendelijke groeten, de jury"
    },
    /* niveau *: herkennen of een werkwoord van klank verandert in de verleden tijd (cirkel) */
    identify: [
      {level:"*", prompt:"koken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1},
      {level:"*", prompt:"eten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0},
      {level:"*", prompt:"bereiden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1},
      {level:"*", prompt:"bakken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1},
      {level:"*", prompt:"kopen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0},
      {level:"*", prompt:"slapen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0},
      {level:"*", prompt:"vinden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0},
      {level:"*", prompt:"zoeken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0},
      {level:"*", prompt:"beloven", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1},
      {level:"*", prompt:"bedenken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0}
    ],
    /* niveau **: getypte verleden tijd in een zin (vierkant, oefening 3) */
    persoonsvorm: [
      {prompt:"(slapen) De baby's ... de hele namiddag.", answer:"sliepen", level:"**"},
      {prompt:"(lopen) Ricardo ... zondag een goede wedstrijd.", answer:"liep", level:"**"},
      {prompt:"(kopen) De kok ... zijn ingrediënten op de markt.", answer:"kocht", level:"**"},
      {prompt:"(bedenken) Hij ... een lekker recept.", answer:"bedacht", level:"**"},
      {prompt:"(zijn) Gisteren ... wij niet thuis.", answer:"waren", level:"**"},
      {prompt:"(hebben) Wij ... een mooie prijs gewonnen.", answer:"hadden", level:"**"},
      {prompt:"(verlaten) De jury ... de wedstrijdtafel.", answer:"verliet", level:"**"},
      {prompt:"(zwemmen) Leen ... meer dan tien meter onder water.", answer:"zwom", level:"**"},
      {prompt:"(brengen) Oma ... een lekkere taart mee.", answer:"bracht", level:"**"},
      {prompt:"(zoeken) De jongen ... zijn brooddoos.", answer:"zocht", level:"**"}
    ],
    /* niveau **: volledige zin herschrijven naar de verleden tijd (vierkant, oefening 4) */
    zinvt: [
      {zin:"De kok rijdt met een oude chauffeur mee.", antwoord:"De kok reed met een oude chauffeur mee."},
      {zin:"De jury kiest de beste kandidaat uit.", antwoord:"De jury koos de beste kandidaat uit."},
      {zin:"De toeschouwers vinden het een spannende wedstrijd.", antwoord:"De toeschouwers vonden het een spannende wedstrijd."},
      {zin:"De winnaar krijgt een jeepsafari aangeboden.", antwoord:"De winnaar kreeg een jeepsafari aangeboden."},
      {zin:"Hij ziet een grote giraf langs de kant van de weg.", antwoord:"Hij zag een grote giraf langs de kant van de weg."},
      {zin:"De reizigers zwemmen elke dag in het mooie zwembad.", antwoord:"De reizigers zwommen elke dag in het mooie zwembad."},
      {zin:"Jammer genoeg komt aan elk mooi liedje een einde.", antwoord:"Jammer genoeg kwam aan elk mooi liedje een einde."}
    ],
    /* niveau ***: AI-gecontroleerd kort reisverslag in de verleden tijd (driehoek, oefening 5) */
    vrijetekst: {
      opdracht: "Stel je in de plaats van de hobbykok, net terug van een mooie reis. Schrijf een kort verslag over je reis, in de verleden tijd (minstens 3 zinnen)."
    }
  }
};
