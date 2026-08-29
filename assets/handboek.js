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
  },
  "TK060506": {
    tense: "allin",
    titel: "Experimenteren met wat we leerden (TK060506)",
    /* niveau *: getypte vorm, tt/vt/vd door elkaar (cirkel, oefening 2) */
    persoonsvorm: [
      {prompt:"(staan) Samen met mijn ouders ... ik te wachten op een taxi.", answer:"sta", level:"*"},
      {prompt:"(tonen) De taxichauffeur ... ons waar we de bagage mogen plaatsen.", answer:"toont", level:"*"},
      {prompt:"(zijn) Onze vakantie ... nu echt voorbij.", answer:"is", level:"*"},
      {prompt:"(willen) Ik ... graag nog wat langer blijven.", answer:"wilde", level:"*"},
      {prompt:"(dromen) Vannacht ... ik dat we nog niet naar huis moesten.", answer:"droomde", level:"*"},
      {prompt:"(zwemmen) In mijn droom ... ik nog lekker in het zwembad.", answer:"zwom", level:"*"},
      {prompt:"(horen) Plots ... ik een luide melodie.", answer:"hoorde", level:"*"},
      {prompt:"(maken) Mijn wekker had een einde ... aan mijn fijne droom.", answer:"gemaakt", level:"*"},
      {prompt:"(zien) Ik ... dat het tijd was om op te staan.", answer:"zag", level:"*"},
      /* niveau **: bij een voltooid deelwoord de infinitief typen (vierkant, oefening 3) */
      {prompt:"Eduard heeft een tijdje als kelner gewerkt. Wat is de infinitief van 'gewerkt'?", answer:"werken", level:"**"},
      {prompt:"De taverne is onlangs gesloten. Wat is de infinitief van 'gesloten'?", answer:"sluiten", level:"**"},
      {prompt:"Toen heeft hij beslist te gaan solliciteren. Wat is de infinitief van 'beslist'?", answer:"beslissen", level:"**"},
      {prompt:"Eduard heeft altijd goed gestudeerd. Wat is de infinitief van 'gestudeerd'?", answer:"studeren", level:"**"},
      {prompt:"Als puber heeft hij op een Franse school gezeten. Wat is de infinitief van 'gezeten'?", answer:"zitten", level:"**"},
      {prompt:"Het sollicitatiegesprek is goed verlopen. Wat is de infinitief van 'verlopen'?", answer:"verlopen", level:"**"},
      {prompt:"Eduard heeft de nieuwe job gekregen. Wat is de infinitief van 'gekregen'?", answer:"krijgen", level:"**"},
      {prompt:"Hij is nu begonnen als reisleider. Wat is de infinitief van 'begonnen'?", answer:"beginnen", level:"**"},
      {prompt:"Hij heeft al veel reizigers begeleid. Wat is de infinitief van 'begeleid'?", answer:"begeleiden", level:"**"}
    ],
    /* niveau **: zin herschrijven naar de verleden tijd, zonder voltooid deelwoord (vierkant, oefening 4) */
    zinvtLabel: "Herschrijf deze zin in de verleden tijd (zonder voltooid deelwoord):",
    zinvt: [
      {zin:"Eduard heeft een tijdje als kelner gewerkt.", antwoord:"Eduard werkte een tijdje als kelner."},
      {zin:"De taverne is onlangs gesloten.", antwoord:"De taverne sloot onlangs."},
      {zin:"Toen heeft hij beslist te gaan solliciteren als reisleider.", antwoord:"Toen besliste hij te gaan solliciteren als reisleider."},
      {zin:"Eduard heeft altijd goed gestudeerd.", antwoord:"Eduard studeerde altijd goed."},
      {zin:"Als puber heeft hij op een Franse school gezeten.", antwoord:"Als puber zat hij op een Franse school."},
      {zin:"Het sollicitatiegesprek is goed verlopen.", antwoord:"Het sollicitatiegesprek verliep goed."},
      {zin:"Eduard heeft de nieuwe job gekregen.", antwoord:"Eduard kreeg de nieuwe job."},
      {zin:"Hij is nu begonnen als reisleider in Egypte.", antwoord:"Hij begon onlangs als reisleider in Egypte."},
      {zin:"Hij heeft al veel reizigers begeleid.", antwoord:"Hij begeleidde al veel reizigers."}
    ],
    /* niveau ***: AI-gecontroleerd reisverslag (driehoek, oefening 5) */
    vrijetekst: {
      opdracht: "Kruip in de huid van Eduard, de reisleider. Schrijf een kort reisverslag (minstens 3 zinnen) over iets wat je meemaakte, in de verleden tijd."
    }
  },
  "TK060605": {
    tense: "allin",
    titel: "Werk aan de winkel (TK060605)",
    /* niveau *: tt/vt/vd naast elkaar, per werkwoord (cirkel, oefening 2) */
    persoonsvorm: [
      {prompt:"(winnen, t.t.) Jesse ... altijd.", answer:"wint", level:"*"},
      {prompt:"(winnen, v.t.) De jongens ... nooit.", answer:"wonnen", level:"*"},
      {prompt:"(winnen, v.d.) De man heeft ...", answer:"gewonnen", level:"*"},
      {prompt:"(zitten, t.t.) Oma en opa ... op een bankje.", answer:"zitten", level:"*"},
      {prompt:"(zitten, v.t.) Wij ... op de eerste rij.", answer:"zaten", level:"*"},
      {prompt:"(zitten, v.d.) Op welke stoel heb jij ...?", answer:"gezeten", level:"*"},
      {prompt:"(proberen, t.t.) Ik ... het nog eens.", answer:"probeer", level:"*"},
      {prompt:"(proberen, v.t.) Sandro ... het ook al.", answer:"probeerde", level:"*"},
      {prompt:"(proberen, v.d.) De redders hebben het ...", answer:"geprobeerd", level:"*"},
      {prompt:"(antwoorden, t.t.) Indra ... niet op mijn vraag.", answer:"antwoordt", level:"*"},
      {prompt:"(antwoorden, v.t.) Vorige week ... hij ook niet.", answer:"antwoordde", level:"*"},
      {prompt:"(antwoorden, v.d.) Wij hebben op die vraag ...", answer:"geantwoord", level:"*"},
      /* niveau **: verhaal aanvullen met tegenwoordige tijd, door elkaar (vierkant, oefening 4) */
      {prompt:"(komen) Stralend ... ik binnen.", answer:"kom", level:"**"},
      {prompt:"(hebben) Eindelijk ... ik ook een uitnodiging gekregen.", answer:"heb", level:"**"},
      {prompt:"(krijgen) Eindelijk heb ik ook een uitnodiging ...", answer:"gekregen", level:"**"},
      {prompt:"(mogen) Ik ... volgende woensdag naar het feestje.", answer:"mag", level:"**"},
      {prompt:"(uitnodigen) Hij heeft mij ...", answer:"uitgenodigd", level:"**"},
      {prompt:"(moeten) Nu ... ik een cadeautje kopen.", answer:"moet", level:"**"},
      {prompt:"(fronsen) Mama ... de wenkbrauwen.", answer:"fronst", level:"**"},
      {prompt:"(vinden) Mama zegt dat ze het niet zo'n goed idee ...", answer:"vindt", level:"**"},
      {prompt:"(begrijpen) Ik ... het allemaal niet.", answer:"begrijp", level:"**"},
      {prompt:"(vragen) Ik ... haar waarom ik niet mag gaan.", answer:"vraag", level:"**"},
      {prompt:"(liggen) Ik ... te huilen in mijn bed.", answer:"lig", level:"**"},
      {prompt:"(overtuigen) Hij heeft mama ...", answer:"overtuigd", level:"**"}
    ],
    /* niveau **: zin naar de andere tijd herschrijven (vierkant, oefening 3) — richting wisselt per zin */
    zinvtLabel: "Schrijf deze zin in de andere tijd:",
    zinvt: [
      {zin:"Eline viel uit haar bed.", antwoord:"Eline valt uit haar bed."},
      {zin:"Jasper ging naast zijn stoel zitten.", antwoord:"Jasper gaat naast zijn stoel zitten."},
      {zin:"De jongen struikelt over zijn hond en breekt zijn teen.", antwoord:"De jongen struikelde over zijn hond en brak zijn teen."},
      {zin:"De tuinslang zwiert in het rond en maakt me helemaal nat.", antwoord:"De tuinslang zwierde in het rond en maakte me helemaal nat."},
      {zin:"Wie het laatst lacht, heeft de mop niet begrepen.", antwoord:"Wie het laatst lachte, had de mop niet begrepen."}
    ],
    /* niveau ***: AI-gecontroleerd — eigen ervaring vertellen in de tegenwoordige tijd (driehoek, oefening 5) */
    vrijetekst: {
      opdracht: "Vertel in enkele zinnen (minstens 3) iets wat jij hebt beleefd, in de tegenwoordige tijd (alsof het nu gebeurt)."
    }
  },
  "TK060704": {
    tense: "allin",
    titel: "Op zoek naar hulpverleners (TK060704)",
    /* niveau *: herkennen + typen in de verleden tijd (cirkel, oefening 2) */
    identify: [
      {level:"*", prompt:"lachen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"lachen → lachte"},
      {level:"*", prompt:"sterven", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"sterven → stierf"},
      {level:"*", prompt:"dulden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"dulden → duldde"},
      {level:"*", prompt:"proberen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"proberen → probeerde"},
      {level:"*", prompt:"genezen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"genezen → genas"},
      {level:"*", prompt:"ontmoeten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"ontmoeten → ontmoetten"},
      {level:"*", prompt:"voorlezen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"voorlezen → las voor"},
      {level:"*", prompt:"branden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"branden → brandde"},
      {level:"*", prompt:"gieten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"gieten → goot"}
    ],
    persoonsvorm: [
      {prompt:"(lachen) Jonas ... toen papa een grapje maakte.", answer:"lachte", level:"*"},
      {prompt:"(sterven) Die vogel ... aan zijn verwondingen.", answer:"stierf", level:"*"},
      {prompt:"(dulden) De rechter ... geen tegenspraak.", answer:"duldde", level:"*"},
      {prompt:"(proberen) Jonas ... een foto te nemen.", answer:"probeerde", level:"*"},
      {prompt:"(genezen) Gelukkig ... de vogel van zijn wonde.", answer:"genas", level:"*"},
      {prompt:"(ontmoeten) Wij ... een heel vriendelijke medewerker.", answer:"ontmoetten", level:"*"},
      {prompt:"(voorlezen) De juf ... het krantenartikel voor.", answer:"las", level:"*"},
      {prompt:"(branden) Mama ... enkele kaarsen in Scherpenheuvel.", answer:"brandde", level:"*"},
      {prompt:"(gieten) De ober ... de wijn in een karaf.", answer:"goot", level:"*"},
      /* niveau **: een persoonsvorm in de ANDERE tijd zetten, in context (vierkant, oefening 3) */
      {prompt:"Hij wint de wedstrijd in Oost-Vlaanderen. Zet 'wint' in de andere tijd.", answer:"won", level:"**"},
      {prompt:"Leen schrijft een liefdesbrief aan Stefan. Zet 'schrijft' in de andere tijd.", answer:"schreef", level:"**"},
      {prompt:"Wij geloofden de fabeltjes van de verkoper niet. Zet 'geloofden' in de andere tijd.", answer:"geloven", level:"**"},
      {prompt:"De leden van de jeugdbeweging slapen in grote tenten. Zet 'slapen' in de andere tijd.", answer:"sliepen", level:"**"},
      {prompt:"Els koopt schoenen met hakken om wat groter te lijken. Zet 'koopt' in de andere tijd.", answer:"kocht", level:"**"},
      {prompt:"De tennisspeelster verloor de wedstrijd. Zet 'verloor' in de andere tijd.", answer:"verliest", level:"**"},
      {prompt:"De secretaris antwoordde op de brief van de burgers. Zet 'antwoordde' in de andere tijd.", answer:"antwoordt", level:"**"},
      {prompt:"De verkoopprijs van de papaja's daalde sterk. Zet 'daalde' in de andere tijd.", answer:"daalt", level:"**"},
      {prompt:"De kinderen kijken naar het jeugdjournaal. Zet 'kijken' in de andere tijd.", answer:"keken", level:"**"},
      {prompt:"De kersverse vader verfde de kinderkamer in het blauw. Zet 'verfde' in de andere tijd.", answer:"verft", level:"**"},
      {prompt:"Raphael verliest met een spelletje op de PlayStation. Zet 'verliest' in de andere tijd.", answer:"verloor", level:"**"},
      {prompt:"De premier drinkt graag een glaasje champagne. Zet 'drinkt' in de andere tijd.", answer:"dronk", level:"**"},
      /* niveau **: voltooid deelwoord typen (vierkant, oefening 4) */
      {prompt:"(wachten) Ik heb ...", answer:"gewacht", level:"**"},
      {prompt:"(fluiten) Ik heb ...", answer:"gefloten", level:"**"},
      {prompt:"(organiseren) Ik heb ...", answer:"georganiseerd", level:"**"},
      {prompt:"(herkennen) Ik heb ...", answer:"herkend", level:"**"},
      {prompt:"(wandelen) Ik heb ...", answer:"gewandeld", level:"**"},
      {prompt:"(herstellen) Ik heb ...", answer:"hersteld", level:"**"},
      {prompt:"(trouwen) Ik ben ...", answer:"getrouwd", level:"**"},
      {prompt:"(verhuizen) Ik ben ...", answer:"verhuisd", level:"**"},
      {prompt:"(verplichten) Ik ben ...", answer:"verplicht", level:"**"},
      {prompt:"(beveiligen) Ik heb ...", answer:"beveiligd", level:"**"},
      {prompt:"(filmen) Ik heb ...", answer:"gefilmd", level:"**"},
      {prompt:"(planten) Ik heb ...", answer:"geplant", level:"**"},
      /* niveau ***: nog pittiger door elkaar, tt/vt/vd (driehoek, oefening 5) */
      {prompt:"(uitnodigen, v.t.) Ahmed ... ons uit voor een kopje thee.", answer:"nodigde", level:"***"},
      {prompt:"(vluchten, v.t.) Ik ... toen ik de hond zag.", answer:"vluchtte", level:"***"},
      {prompt:"(waken, t.t.) De agent ... over een duur schilderij.", answer:"waakt", level:"***"},
      {prompt:"(drinken, v.d.) Wie heeft er van die wijn ...?", answer:"gedronken", level:"***"},
      {prompt:"(raden, t.t.) ... jij de oplossing van dat raadsel?", answer:"Raad", level:"***"}
    ]
  },
  "TK060705": {
    tense: "allin",
    titel: "Hulpverleners zijn harde werkers (TK060705)",
    /* niveau *: juiste werkwoordsvorm kiezen (cirkel, oefening 2) */
    fillin: [
      {level:"*", prefix:"De arbeiders", suffix:"vorige maand twee waterputten.", answer:"boorden", options:["boren","boorden","boordden"]},
      {level:"*", prefix:"De chauffeurs", suffix:"volgende week nieuwe voedselpakketten.", answer:"brengen", options:["brengen","brengden","brachten"]},
      {level:"*", prefix:"De man", suffix:"de vrachtwagen en reed weg.", answer:"startte", options:["start","starte","startte"]},
      {level:"*", prefix:"Mijn ouders", suffix:"maandelijks een bedrag voor Unicef.", answer:"storten", options:["storten","stortten","stort"]},
      {level:"*", prefix:"De hulpverlener", suffix:"mijn vraag via mail.", answer:"beantwoordt", options:["beantwoordt","beantwoord","beantwoordde"]}
    ],
    /* niveau **: tt en vt door elkaar typen (vierkant, oefening 3 en 4) */
    persoonsvorm: [
      {prompt:"(organiseren, t.t.) Ik ... een feest.", answer:"organiseer", level:"**"},
      {prompt:"(organiseren, v.t.) Hij ... een feest.", answer:"organiseerde", level:"**"},
      {prompt:"(arresteren, t.t.) Jij ... de dief.", answer:"arresteert", level:"**"},
      {prompt:"(arresteren, v.t.) Ik ... de dief.", answer:"arresteerde", level:"**"},
      {prompt:"(fotograferen, t.t.) Hij ... de zonsondergang.", answer:"fotografeert", level:"**"},
      {prompt:"(fotograferen, v.t.) Jij ... de zonsondergang.", answer:"fotografeerde", level:"**"},
      {prompt:"(dicteren, t.t.) De juf ... een tekst.", answer:"dicteert", level:"**"},
      {prompt:"(dicteren, v.t.) Ik ... een tekst.", answer:"dicteerde", level:"**"},
      {prompt:"(fantaseren, t.t.) Ik ... over de vakantie.", answer:"fantaseer", level:"**"},
      {prompt:"(fantaseren, v.t.) Jij ... over de vakantie.", answer:"fantaseerde", level:"**"},
      {prompt:"(verbieden, t.t.) Hij ... praten tijdens de les.", answer:"verbiedt", level:"**"},
      {prompt:"(verbieden, v.t.) Hij ... praten tijdens de les.", answer:"verbood", level:"**"},
      {prompt:"(oplossen, t.t.) Jij ... het probleem op.", answer:"lost", level:"**"},
      {prompt:"(oplossen, v.t.) Ik ... het probleem op.", answer:"loste", level:"**"},
      {prompt:"(bezoeken, v.t.) Youssef ... zijn beste vriend Daan.", answer:"bezocht", level:"**"},
      {prompt:"(ontvangen, v.t.) De ouders van zijn vriend ... hem met open armen.", answer:"ontvingen", level:"**"},
      {prompt:"(leiden, v.t.) De mensen ... hem rond in hun woning.", answer:"leidden", level:"**"},
      {prompt:"(schrikken, v.t.) Youssef ... van de thuissituatie van zijn vriend.", answer:"schrok", level:"**"},
      {prompt:"(leven, v.t.) Hij wist niet dat hij in armoede ...", answer:"leefde", level:"**"},
      {prompt:"(vertellen, v.t.) De mensen ... dat ze vorig jaar alles kwijtraakten.", answer:"vertelden", level:"**"},
      {prompt:"(branden, v.t.) Hun huis ... af en was volledig vernield.", answer:"brandde", level:"**"},
      {prompt:"(organiseren, t.t.) Youssef ... een benefiet voor de familie van zijn vriend.", answer:"organiseert", level:"**"},
      {prompt:"(verzenden, t.t.) Hij ... een aantal mails naar kennissen van zijn eigen ouders.", answer:"verzendt", level:"**"},
      {prompt:"(reageren, t.t.) Mensen ... massaal op zijn oproep.", answer:"reageren", level:"**"},
      {prompt:"(aanbieden, t.t.) Een meubelmaker ... een mooi stapelbed aan.", answer:"biedt", level:"**"},
      {prompt:"(verkiezen, t.t.) De plaatselijke bakker ... om hen dagelijks een brood te schenken.", answer:"verkiest", level:"**"},
      {prompt:"(wassen, v.t.) Youssef zelf ... auto's.", answer:"waste", level:"**"},
      {prompt:"(verdienen, v.t.) Daarmee ... hij wel honderd euro.", answer:"verdiende", level:"**"},
      {prompt:"(kopen, v.t.) Met het geld ... hij wat gezelschapsspellen.", answer:"kocht", level:"**"}
    ],
    /* niveau ***: woorden herschikken tot een correcte zin, met vervoegd werkwoord (driehoek, oefening 5) */
    zinvtLabel: "Zet de woorden in de juiste volgorde tot een goede zin, en vervoeg het werkwoord correct:",
    zinvtLevel: "***",
    zinvt: [
      {zin:"Mechelen – hoofdzetel – zich – bevinden – in – de – Vlaanderen – Kruis – Rode – van", antwoord:"De hoofdzetel van Rode Kruis Vlaanderen bevindt zich in Mechelen."},
      {zin:"centrum – vorige – brengen – we – bezoek – het – aan – week – een", antwoord:"Vorige week brachten we een bezoek aan het centrum."},
      {zin:"takenpakket – organisatie – ontdekken – van – meer – we – over – deze – het", antwoord:"We ontdekten meer over het takenpakket van deze organisatie."},
      {zin:"vrijwilliger – ik – later – Kruis – worden – Rode – bij – ook – het", antwoord:"Later word ik ook vrijwilliger bij het Rode Kruis."}
    ]
  }
};
