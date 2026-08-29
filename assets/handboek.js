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
      {prefix:"(vergeten) Je", suffix:"dat je ouders briefjes schreven.", answer:"vergeet", options:["vergeet","vergeten","vergat"]},
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
      {level:"*", prompt:"koken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"koken → kookte"},
      {level:"*", prompt:"eten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"eten → at"},
      {level:"*", prompt:"bereiden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"bereiden → bereidde"},
      {level:"*", prompt:"bakken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"bakken → bakte"},
      {level:"*", prompt:"kopen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"kopen → kocht"},
      {level:"*", prompt:"slapen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"slapen → sliep"},
      {level:"*", prompt:"vinden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"vinden → vond"},
      {level:"*", prompt:"zoeken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"zoeken → zocht"},
      {level:"*", prompt:"beloven", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"beloven → beloofde"},
      {level:"*", prompt:"bedenken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"bedenken → bedacht"}
    ],
    /* niveau *: kies de juiste verleden vorm in de zin (meerkeuze, extra uitdaging naast het herkennen) */
    fillin: [
      {level:"*", prefix:"(koken) Mama", suffix:"gisteren pasta.", answer:"kookte", options:["kookte","kook","koken"]},
      {level:"*", prefix:"(bakken) Papa", suffix:"een taart voor mijn verjaardag.", answer:"bakte", options:["bakte","bak","bakken"]},
      {level:"*", prefix:"(kopen) Ik", suffix:"een nieuwe fiets.", answer:"kocht", options:["kocht","koop","kopen"]},
      {level:"*", prefix:"(bereiden) De chef", suffix:"een heerlijk gerecht.", answer:"bereidde", options:["bereidde","bereid","bereiden"]},
      {level:"*", prefix:"(beloven) Zij", suffix:"het nooit meer te doen.", answer:"beloofde", options:["beloofde","beloof","beloven"]},
      {level:"*", prefix:"(zoeken) Wij", suffix:"de hele tuin af.", answer:"zochten", options:["zochten","zoeken","zoekt"]},
      {level:"**", prefix:"(slapen) De baby's", suffix:"de hele namiddag.", answer:"sliepen", options:["sliepen","slapen","slaapt"]},
      {level:"**", prefix:"(lopen) Ricardo", suffix:"zondag een goede wedstrijd.", answer:"liep", options:["liep","loopt","lopen"]},
      {level:"**", prefix:"(vinden) De toeschouwers", suffix:"het een spannende wedstrijd.", answer:"vonden", options:["vonden","vinden","vindt"]},
      {level:"**", prefix:"(zien) Hij", suffix:"een grote giraf langs de kant van de weg.", answer:"zag", options:["zag","ziet","zien"]}
    ],
    /* niveau *: enkele typ-oefeningen (naast de stam-oefening in Exploreren), niveau ** = de rest bij "Heden en verleden" */
    persoonsvorm: [
      {prompt:"(eten) Hij ... een grote pizza.", answer:"at", level:"*"},
      {prompt:"(slapen) De hond ... de hele namiddag.", answer:"sliep", level:"*"},
      {prompt:"(vinden) Zij ... haar sleutels terug.", answer:"vond", level:"*"},
      {prompt:"(bedenken) De juf ... een leuk spel.", answer:"bedacht", level:"*"},
      {prompt:"(kopen) Papa ... een cadeau voor mama.", answer:"kocht", level:"*"},
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
  },
  "TK060305": {
    tense: "vt",
    titel: "Gisteren was het ook leuk (TK060305)",
    /* niveau *: verleden tijd enkelvoud EN meervoud typen (cirkel, oefening 2) */
    persoonsvorm: [
      {prompt:"(bestellen) Ik ... een pizza.", answer:"bestelde", level:"*"},
      {prompt:"(bestellen) Wij ... twee pizza's.", answer:"bestelden", level:"*"},
      {prompt:"(redden) De brandweerman ... de kat.", answer:"redde", level:"*"},
      {prompt:"(redden) De brandweermannen ... de katten.", answer:"redden", level:"*"},
      {prompt:"(ontmoeten) Ik ... mijn vriend.", answer:"ontmoette", level:"*"},
      {prompt:"(ontmoeten) Wij ... onze vrienden.", answer:"ontmoetten", level:"*"},
      {prompt:"(beseffen) Hij ... zijn fout.", answer:"besefte", level:"*"},
      {prompt:"(beseffen) De leerlingen ... hun fout.", answer:"beseften", level:"*"},
      /* niveau **: getypte verleden tijd in context (vierkant, oefening 3) */
      {prompt:"(verdienen) De jongen ... een beter resultaat.", answer:"verdiende", level:"**"},
      {prompt:"(bezoeken) Vorig jaar ... wij Rome.", answer:"bezochten", level:"**"},
      {prompt:"(verhuren) De lieve man ... geen fietsen.", answer:"verhuurde", level:"**"},
      {prompt:"(verdiepen) Onze meester ... zich in de geschiedenis van België.", answer:"verdiepte", level:"**"},
      {prompt:"(surfen) ... jullie al naar die website?", answer:"Surften", level:"**"},
      {prompt:"(antwoorden) Het meisje ... niet op mijn vraag.", answer:"antwoordde", level:"**"},
      {prompt:"(verdwijnen) In onze klas ... drie pennenzakken.", answer:"verdwenen", level:"**"},
      {prompt:"(verzetten) De misdadiger ... zich tegen zijn aanhouding.", answer:"verzette", level:"**"},
      {prompt:"(hoesten) Ik ... de hele nacht.", answer:"hoestte", level:"**"},
      {prompt:"(lezen) Tijdens de les drama ... wij onze teksten hardop.", answer:"lazen", level:"**"},
      {prompt:"(bereiden) Opa ... een lekker maaltijd.", answer:"bereidde", level:"**"},
      {prompt:"(ontmoeten) Ik ... mijn favoriete auteur in de bibliotheek.", answer:"ontmoette", level:"**"},
      {prompt:"(maken) De dreumes ... zich gauw uit de voeten.", answer:"maakte", level:"**"},
      {prompt:"(zwemmen) De Belgische ploeg ... een recordtijd.", answer:"zwom", level:"**"},
      {prompt:"(beloven) Wij ... om geen ruzie meer te maken.", answer:"beloofden", level:"**"}
    ],
    /* niveau *: herkennen of het werkwoord van klank verandert in de verleden tijd (cirkel) */
    identify: [
      {level:"*", prompt:"verdienen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"verdienen → verdiende"},
      {level:"*", prompt:"bezoeken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"bezoeken → bezochten"},
      {level:"*", prompt:"verhuren", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"verhuren → verhuurde"},
      {level:"*", prompt:"verdiepen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"verdiepen → verdiepte"},
      {level:"*", prompt:"surfen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"surfen → surften"},
      {level:"*", prompt:"antwoorden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"antwoorden → antwoordde"},
      {level:"*", prompt:"verdwijnen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"verdwijnen → verdwenen"},
      {level:"*", prompt:"verzetten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"verzetten → verzette"},
      {level:"*", prompt:"hoesten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"hoesten → hoestte"},
      {level:"*", prompt:"lezen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"lezen → lazen"},
      {level:"*", prompt:"bereiden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"bereiden → bereidde"},
      {level:"*", prompt:"ontmoeten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"ontmoeten → ontmoette"},
      {level:"*", prompt:"maken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"maken → maakte"},
      {level:"*", prompt:"zwemmen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"zwemmen → zwom"},
      {level:"*", prompt:"beloven", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"beloven → beloofde"}
    ],
    /* niveau **: hele zin herschrijven naar de verleden tijd (vierkant, oefening 4 "Kraak de code") */
    zinvt: [
      {zin:"Jonas lacht met de moppen op het kalenderblaadje.", antwoord:"Jonas lachte met de moppen op het kalenderblaadje."},
      {zin:"Hij neemt de fles melk uit de koelkast.", antwoord:"Hij nam de fles melk uit de koelkast."},
      {zin:"Leen kaart het probleem aan.", antwoord:"Leen kaartte het probleem aan."},
      {zin:"Grootvader vertelt een verhaal uit zijn kindertijd.", antwoord:"Grootvader vertelde een verhaal uit zijn kindertijd."},
      {zin:"Joshua krijgt een voetbalshirt voor zijn verjaardag.", antwoord:"Joshua kreeg een voetbalshirt voor zijn verjaardag."},
      {zin:"Kleine Broes maakt een zandkasteel op het strand.", antwoord:"Kleine Broes maakte een zandkasteel op het strand."},
      {zin:"Moeder laat een briefje achter op de eettafel.", antwoord:"Moeder liet een briefje achter op de eettafel."},
      {zin:"Oma spit de tuin om.", antwoord:"Oma spitte de tuin om."},
      {zin:"Ricardo antwoordt op de vraag.", antwoord:"Ricardo antwoordde op de vraag."}
    ],
    /* niveau ***: AI-gecontroleerd — kies onderwerpen + werkwoorden, maak zinnen in de verleden tijd (driehoek, oefening 5) */
    vrijetekst: {
      opdracht: "Kies drie van deze onderwerpen: de jongens, de juf, de agent, mijn ouders, de buschauffeur, de meisjes van de klas, haar buurmeisje. Maak voor elk een goede zin in de verleden tijd, met een werkwoord uit deze lijst: snijden, gamen, chatten, antwoorden, rijden, kopen, verhuizen."
    }
  },
  "TK060404": {
    tense: "geenpv",
    titel: "In de voetsporen van Ramses (TK060404)",
    brontekst: {
      titel: "Hiërogliefen ... rare tekens?",
      tekst: "De hiërogliefen werden vroeger gebruikt bij de Egyptenaren. De stenen muren van de tempels werden versierd met hiërogliefen. In de hiërogliefen zijn woorden of klanken uitgebeeld. De Egyptische hiërogliefen werden lange tijd als onvertaalbare tekens beschouwd. De laatste hiërogliefen werden geschreven in de vierde eeuw, toen de laatste Egyptische tempel door de Romeinen werd gesloten. De kennis van de hiërogliefen ging verloren. In 1822 heeft de Fransman Champollion de tekens als eerste ontcijferd."
    },
    /* niveau *: welke spellingstrategie hoort bij dit voltooid deelwoord? (cirkel, oefening 2) */
    identify: [
      {level:"*", prompt:"opengesteld", options:["verlengingsregel","verdubbelen","verenkelen","hoorwoord","weetwoord"], correctIndex:0, extraInfo:"is een Romeinse tempel opengesteld voor het publiek"},
      {level:"*", prompt:"uitgenodigd", options:["verlengingsregel","verdubbelen","verenkelen","hoorwoord","weetwoord"], correctIndex:0, extraInfo:"werden als eersten uitgenodigd voor een rondleiding"},
      {level:"*", prompt:"gehouden", options:["verlengingsregel","verdubbelen","verenkelen","hoorwoord","weetwoord"], correctIndex:3, extraInfo:"heeft een toespraak gehouden"},
      {level:"*", prompt:"weggereden", options:["verlengingsregel","verdubbelen","verenkelen","hoorwoord","weetwoord"], correctIndex:2, extraInfo:"is hij met zijn motor weggereden"}
    ],
    /* niveau **: voltooid deelwoord typen in een zin (vierkant, oefening 3) */
    persoonsvorm: [
      {prompt:"(lopen) Mama en papa hebben heel hard ... om hun vliegtuig naar Egypte nog te halen.", answer:"gelopen", level:"**"},
      {prompt:"(betalen) Gelukkig heeft mijn oma hun dure vliegtuigticket ...", answer:"betaald", level:"**"},
      {prompt:"(controleren) De douane heeft alle bagage ...", answer:"gecontroleerd", level:"**"},
      {prompt:"(wachten) Oom Vincent heeft wel vijf uur ... in de luchthaven.", answer:"gewacht", level:"**"},
      {prompt:"(aanbranden) Op haar postkaart schrijft Hanne over de ... soep.", answer:"aangebrande", level:"**"},
      {prompt:"(opstappen) Rond zeven uur is Hanne eindelijk ...", answer:"opgestapt", level:"**"},
      {prompt:"(leren) Op de vlucht van Egypte naar België heb ik mijn toets Frans nog ...", answer:"geleerd", level:"**"},
      {prompt:"(genieten) Ik heb enorm van mijn reis ...", answer:"genoten", level:"**"},
      {prompt:"(komen) Aan het mooie liedje is nu een einde ...", answer:"gekomen", level:"**"}
    ],
    /* niveau **: van bedrijvende naar lijdende vorm herschrijven (vierkant, oefening 4) */
    zinvtLabel: "Herschrijf deze zin in de lijdende vorm (wordt/worden ... door ... + voltooid deelwoord):",
    zinvt: [
      {zin:"Buitenlandse toeristen maken boottochten op de Nijl.", antwoord:"Op de Nijl worden door buitenlandse toeristen boottochten gemaakt."},
      {zin:"Dagelijks vliegt een luchtvaartmaatschappij richting Egypte.", antwoord:"Er wordt dagelijks naar Egypte gevlogen."},
      {zin:"Veel mensen logeren er in mooie hotels.", antwoord:"Er wordt in mooie hotels gelogeerd."},
      {zin:"Toeristen kopen plaatselijke souvenirs.", antwoord:"Er worden plaatselijke souvenirs door de toeristen gekocht."},
      {zin:"De handelaars onderhandelen dan over de prijs.", antwoord:"Er wordt dan over de prijs onderhandeld."}
    ],
    /* niveau ***: AI-gecontroleerd — kort informatief tekstje met correct gebruik van voltooid deelwoorden (driehoek, oefening 5) */
    vrijetekst: {
      opdracht: "Schrijf een kort informatief tekstje (minstens 3 zinnen) over één van deze onderwerpen: hiërogliefen, Ramses, Tongeren, Egypte of piramide. Gebruik minstens twee voltooide deelwoorden (bv. gebouwd, ontdekt, gevonden)."
    }
  },
  "TK060405": {
    tense: "allin",
    titel: "Woordenwerk (TK060405)",
    /* niveau *: herkennen (cirkel, oefening 2 — is dit een persoonsvorm? welk geval?) */
    identify: [
      {level:"*", plain:true, prompt:"In Egypte <u>staan</u> veel piramides. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:0},
      {level:"*", plain:true, prompt:"Wij <u>maken</u> elk jaar een reis. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:0},
      {level:"*", plain:true, prompt:"Setne <u>hoorde</u> dat er een toverboek zou bestaan. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:1},
      {level:"*", plain:true, prompt:"De tekst werd <u>teruggevonden</u> op papyrusrollen. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:2},
      {level:"*", plain:true, prompt:"Het is <u>gebaseerd</u> op een echt gebeurd verhaal. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:2},
      {level:"*", plain:true, prompt:"Hij <u>vond</u> de graftombe. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:1}
    ],
    /* niveau **: getypte vorm in context, tt/vt/vd door elkaar (vierkant, oefening 3) */
    persoonsvorm: [
      {prompt:"(mogen, t.t.) Met de doden ... je niet lachen.", answer:"mag", level:"**"},
      {prompt:"(blijken, t.t.) Dat ... uit het verhaal van Setne.", answer:"blijkt", level:"**"},
      {prompt:"(baseren, v.d.) Het is ... op een echt gebeurd verhaal.", answer:"gebaseerd", level:"**"},
      {prompt:"(gebeuren, v.d.) Het is gebaseerd op een echt ... verhaal.", answer:"gebeurd", level:"**"},
      {prompt:"(worden, v.t.) De tekst ... teruggevonden op papyrusrollen.", answer:"werd", level:"**"},
      {prompt:"(terugvinden, v.d.) De tekst werd ... op papyrusrollen.", answer:"teruggevonden", level:"**"},
      {prompt:"(horen, v.t.) Setne ... dat er een toverboek zou bestaan.", answer:"hoorde", level:"**"},
      {prompt:"(vertellen, v.t.) Men ... hem dat het boek in een graftombe lag.", answer:"vertelde", level:"**"},
      {prompt:"(verbergen, v.d.) Het boek lag ... in een graftombe van een prins.", answer:"verborgen", level:"**"},
      {prompt:"(besluiten, v.t.) Setne ... dat hij het boek zou vinden.", answer:"besloot", level:"**"},
      {prompt:"(vinden, v.t.) Hij ... de graftombe.", answer:"vond", level:"**"},
      {prompt:"(breken, v.t.) Samen met zijn broer ... hij de grafkamer open.", answer:"brak", level:"**"}
    ],
    /* niveau ***: AI-gecontroleerd — verhaal afmaken met werkwoorden uit een lijst, in de verleden tijd (driehoek, oefening 5) */
    vrijetekst: {
      opdracht: "Schrijf drie zinnen die passen bij het verhaal van Setne, elk met een ander werkwoord uit deze lijst, vervoegd in de verleden tijd: weten, vragen, moeten, proberen, luisteren, verliezen, houden, geven, zien, pakken, beginnen, brengen, zijn."
    }
  }
};
