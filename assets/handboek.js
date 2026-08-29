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
  },
  "TK060706": {
    tense: "geenpv",
    titel: "Nooit helemaal voltooid (TK060706)",
    /* niveau *: voltooid deelwoord typen, inclusief trema (cirkel, oefening 2) */
    persoonsvorm: [
      {prompt:"(adresseren) Opa heeft de brieven ... aan de genodigden.", answer:"geadresseerd", level:"*"},
      {prompt:"(inspecteren) De piloot heeft zijn vliegtuig ...", answer:"geïnspecteerd", level:"*"},
      {prompt:"(arriveren) De hulpverleners zijn op hun bestemming ...", answer:"gearriveerd", level:"*"},
      {prompt:"(interesseren) Ik ben ... in het steunen van die organisatie.", answer:"geïnteresseerd", level:"*"},
      {prompt:"(uiten) Vader heeft zijn bezorgdheid ...", answer:"geuit", level:"*"},
      {prompt:"(ergeren) Mama heeft zich al meermaals aan mijn puberende zus ...", answer:"geërgerd", level:"*"},
      {prompt:"(openen) Het museum is vandaag niet ...", answer:"geopend", level:"*"},
      /* niveau **: voltooid deelwoord als bijvoeglijk naamwoord, met -e (vierkant, oefening 3) */
      {prompt:"(afbranden) het ... huis", answer:"afgebrande", level:"**"},
      {prompt:"(openen) de ... deur", answer:"geopende", level:"**"},
      {prompt:"(illustreren) het ... verhaal", answer:"geïllustreerde", level:"**"},
      {prompt:"(exporteren) de ... hulpgoederen", answer:"geëxporteerde", level:"**"},
      {prompt:"(uploaden) de ... foto's", answer:"geüploade", level:"**"},
      {prompt:"(updaten) de ... laptop", answer:"geüpdatete", level:"**"},
      {prompt:"(eisen) het ... vonnis", answer:"geëiste", level:"**"},
      {prompt:"(overblijven) de ... supporters", answer:"overgebleven", level:"**"},
      {prompt:"(instorten) het ... gebouw", answer:"ingestorte", level:"**"},
      {prompt:"(bewijzen) een ... dienst", answer:"bewezen", level:"**"},
      /* niveau ***: telkens twee voltooide deelwoorden in dezelfde zin (driehoek, oefening 5) */
      {prompt:"(opereren) De ... patiënt wordt door de verpleger verzorgd.", answer:"geopereerde", level:"***"},
      {prompt:"(verzorgen) De geopereerde patiënt wordt door de verpleger ...", answer:"verzorgd", level:"***"},
      {prompt:"(vertalen) Het ... boek werd door een bekend tekenaar geïllustreerd.", answer:"vertaalde", level:"***"},
      {prompt:"(illustreren) Het vertaalde boek werd door een bekend tekenaar ...", answer:"geïllustreerd", level:"***"},
      {prompt:"(vervallen) Het ... huis werd door die bouwfirma gerestaureerd.", answer:"vervallen", level:"***"},
      {prompt:"(restaureren) Het vervallen huis werd door die bouwfirma ...", answer:"gerestaureerd", level:"***"},
      {prompt:"(oplossen) Het ... vraagstuk wordt door de juf verbeterd.", answer:"opgeloste", level:"***"},
      {prompt:"(verbeteren) Het opgeloste vraagstuk wordt door de juf ...", answer:"verbeterd", level:"***"},
      {prompt:"(bedreigen) Die ... dieren werden uit Azië geïmporteerd.", answer:"bedreigde", level:"***"},
      {prompt:"(importeren) Die bedreigde dieren werden uit Azië ...", answer:"geïmporteerd", level:"***"}
    ],
    /* niveau **: zin herschrijven met een voltooid deelwoord (vierkant, oefening 4) */
    zinvtLabel: "Herschrijf deze zin met een voltooid deelwoord (bv. 'ik heb ... gegeten'):",
    zinvt: [
      {zin:"Ik interviewde een hulpverlener van Artsen Zonder Grenzen.", antwoord:"Ik heb een hulpverlener van Artsen Zonder Grenzen geïnterviewd."},
      {zin:"Mijn grootouders emigreerden naar Spanje.", antwoord:"Mijn grootouders zijn naar Spanje geëmigreerd."},
      {zin:"In de lessen STEM experimenteerden wij met drones.", antwoord:"In de lessen STEM hebben wij met drones geëxperimenteerd."}
    ]
  },
  "TK060806": {
    tense: "allin",
    titel: "Nog niet klaar met werken (TK060806)",
    /* niveau *: tt/vt door elkaar typen (cirkel, oefening 2) */
    persoonsvorm: [
      {prompt:"(drijven, t.t.) Het schip ... op de oceaan.", answer:"drijft", level:"*"},
      {prompt:"(dromen, v.t.) De zangeres ... over ruimtewezens.", answer:"droomde", level:"*"},
      {prompt:"(landen, v.t.) Het ruimteschip ... in een tarweveld.", answer:"landde", level:"*"},
      {prompt:"(geloven, t.t.) ... jij dat ruimtewezens echt bestaan?", answer:"Geloof", level:"*"},
      {prompt:"(lezen, t.t.) ... je kleine broer veel boeken over ruimtevaart?", answer:"Leest", level:"*"},
      {prompt:"(bestellen, v.t.) De zangeres ... een lekkere cocktail.", answer:"bestelde", level:"*"},
      {prompt:"(beleven, v.t.) Wij ... spannende avonturen.", answer:"beleefden", level:"*"},
      {prompt:"(branden, t.t.) Het licht ... nog in de klas.", answer:"brandt", level:"*"},
      /* niveau **: nog meer tt/vt door elkaar (vierkant, oefening 3) */
      {prompt:"(reizen, v.t.) ... jij al een keer naar Azië?", answer:"Reisde", level:"**"},
      {prompt:"(onthouden, t.t.) Waarom ... jij die formule niet?", answer:"onthoud", level:"**"},
      {prompt:"(verwachten, v.t.) De manager ... een antwoord van de zangeres.", answer:"verwachtte", level:"**"},
      {prompt:"(verkleden, t.t.) De goochelaar ... zich niet zo graag.", answer:"verkleedt", level:"**"},
      {prompt:"(bevrijden, v.t.) Ik ... gisteren een vogeltje uit het net.", answer:"bevrijdde", level:"**"},
      {prompt:"(verbranden, v.t.) De kleuter ... zijn vingers aan de kachel.", answer:"verbrandde", level:"**"},
      {prompt:"(verplichten, t.t.) Mijn ouders ... mij om een fietshelm te dragen.", answer:"verplichten", level:"**"},
      {prompt:"(besteden, t.t.) ... jij veel tijd aan je schoolwerk?", answer:"Besteed", level:"**"},
      {prompt:"(verwoesten, v.t.) De orkaan ... het kustdorp.", answer:"verwoestte", level:"**"},
      {prompt:"(belanden, v.t.) Wij ... gisteren op de verkeerde trein.", answer:"belandden", level:"**"},
      {prompt:"(vinden, v.t.) De professor ... een verklaring voor het fenomeen.", answer:"vond", level:"**"},
      {prompt:"(racen, t.t.) De mountainbiker ... met zijn fiets door het bos.", answer:"racet", level:"**"}
    ],
    /* niveau ** én ***: AI-gecontroleerde schrijfopdrachten (oefening 4 = vierkant, oefening 5 = driehoek) */
    vrijetekst: [
      {
        level: "**",
        opdracht: "Kies een onderwerp (bv. de ruimtewezens, de zangeres, de piloot, de manager, de commissaris, de professor) en een werkwoord (bv. organiseren, ontdekken, landen, vertrekken, playbacken, beantwoorden). Schrijf 3 grappige zinnen in de tegenwoordige tijd en 3 in de verleden tijd."
      },
      {
        level: "***",
        opdracht: "Je wilt meer weten over het ruimtewezen in de kamer van zangeres Lala. Je hebt een interview van haar afgenomen. Schrijf een kort krantenartikel (minstens 4 zinnen), met persoonsvormen in zowel de tegenwoordige als de verleden tijd."
      }
    ]
  },
  "TK061001": {
    tense: "allin",
    titel: "Lachen en werken (TK061001)",
    /* niveau *: tt/vt door elkaar typen (cirkel, oefening 2) */
    persoonsvorm: [
      {prompt:"(houden, t.t.) Tim ... de hond met beide armen vast.", answer:"houdt", level:"*"},
      {prompt:"(werken, t.t.) ... je ook mee aan het project?", answer:"Werk", level:"*"},
      {prompt:"(huren, t.t.) Wij ... een zomerhuisje aan de Franse kust.", answer:"huren", level:"*"},
      {prompt:"(verhuizen, t.t.) Onze buurman ... naar China.", answer:"verhuist", level:"*"},
      {prompt:"(vinden, t.t.) ... je broer nog wel eens fossielen?", answer:"Vindt", level:"*"},
      {prompt:"(antwoorden, v.t.) Wat ... jij op zijn vraag?", answer:"antwoordde", level:"*"},
      {prompt:"(beloven, v.t.) Papa ... om snel naar huis te komen.", answer:"beloofde", level:"*"},
      {prompt:"(proberen, v.t.) Wij ... het raadsel op te lossen.", answer:"probeerden", level:"*"},
      {prompt:"(ontmoeten, v.t.) De meisjes ... hun idool.", answer:"ontmoetten", level:"*"},
      {prompt:"(bestellen, v.t.) Mijn zus ... een nieuw kleedje.", answer:"bestelde", level:"*"},
      /* niveau **: tt/vt/vd door elkaar (vierkant, oefening 3 en 4) */
      {prompt:"(eindigen, t.t.) Jij ... het spel.", answer:"eindigt", level:"**"},
      {prompt:"(eindigen, v.t.) Hij ... het spel.", answer:"eindigde", level:"**"},
      {prompt:"(eindigen, v.d.) Zij is ...", answer:"geëindigd", level:"**"},
      {prompt:"(vragen, v.t.) Jij ... het aan de leraar.", answer:"vroeg", level:"**"},
      {prompt:"(vragen, v.d.) Ik heb ...", answer:"gevraagd", level:"**"},
      {prompt:"(antwoorden, t.t.) ... jij op de vraag?", answer:"Antwoord", level:"**"},
      {prompt:"(antwoorden, v.t.) Ik ...", answer:"antwoordde", level:"**"},
      {prompt:"(antwoorden, v.d.) Ze heeft ...", answer:"geantwoord", level:"**"},
      {prompt:"(nemen, v.t.) Ik ... de bus.", answer:"nam", level:"**"},
      {prompt:"(nemen, v.d.) Hij heeft ...", answer:"genomen", level:"**"},
      {prompt:"(graven, t.t.) Ik ... een kuil.", answer:"graaf", level:"**"},
      {prompt:"(graven, v.d.) Ik heb ...", answer:"gegraven", level:"**"},
      {prompt:"(eisen, v.t.) Jij ... te veel.", answer:"eiste", level:"**"},
      {prompt:"(eisen, v.d.) Ik heb ...", answer:"geëist", level:"**"},
      {prompt:"(raden, v.t.) Ik ... het juiste antwoord.", answer:"raadde", level:"**"},
      {prompt:"(raden, t.t.) Je ... nooit wie ik gezien heb.", answer:"raadt", level:"**"},
      {prompt:"(raden, v.d.) Heb je zijn leeftijd juist ...?", answer:"geraden", level:"**"},
      {prompt:"(beantwoorden, v.t.) De directeur ... mijn vraag onmiddellijk.", answer:"beantwoordde", level:"**"},
      {prompt:"(beantwoorden, t.t.) De sollicitant ... aan ons profiel.", answer:"beantwoordt", level:"**"},
      {prompt:"(beantwoorden, v.d.) Heb je die brief al ...?", answer:"beantwoord", level:"**"},
      {prompt:"(landen, t.t.) ... je zus vandaag op Zaventem?", answer:"Landt", level:"**"},
      {prompt:"(landen, v.t.) Het vliegtuig ... met een uur vertraging.", answer:"landde", level:"**"},
      {prompt:"(landen, v.d.) Is de luchtballon al ...?", answer:"geland", level:"**"},
      {prompt:"(besteden, t.t.) Hoelang ... je wekelijks aan je hobby?", answer:"besteed", level:"**"},
      {prompt:"(besteden, v.t.) Jorn ... te weinig aandacht.", answer:"besteedde", level:"**"},
      {prompt:"(besteden, v.d.) Heb je voldoende aandacht ...?", answer:"besteed", level:"**"},
      {prompt:"(bieden, v.t.) De miljonair ... veel euro's.", answer:"bood", level:"**"},
      {prompt:"(bieden, v.d.) Hoeveel heeft hij dan ...?", answer:"geboden", level:"**"},
      {prompt:"(bieden, t.t.) Die opdracht ... je weinig uitdaging.", answer:"biedt", level:"**"},
      /* niveau ***: nog pittiger door elkaar (driehoek, oefening 5) */
      {prompt:"(dansen, v.t.) De jongeren ... tot in de vroege uurtjes.", answer:"dansten", level:"***"},
      {prompt:"(lachen, t.t.) ... je met die jongen omdat hij een fout maakt?", answer:"Lach", level:"***"},
      {prompt:"(afbranden, v.d.) Vorige week zijn in onze stad vijf huizen ...", answer:"afgebrand", level:"***"},
      {prompt:"(dulden, t.t.) De rechter ... geen enkele tegenspraak.", answer:"duldt", level:"***"},
      {prompt:"(ontmoeten, v.t.) Gisteren ... wij onze nieuwe buren.", answer:"ontmoetten", level:"***"},
      {prompt:"(veranderen, v.d.) Heeft de winkelier zijn etalage ...?", answer:"veranderd", level:"***"},
      {prompt:"(beslissen, v.t.) De leerkrachten ... om voortaan geen huiswerk meer te geven.", answer:"beslisten", level:"***"},
      {prompt:"(kopen, v.d.) Mijn grootouders hebben een nieuwe wagen ...", answer:"gekocht", level:"***"}
    ]
  },
  "TK061002": {
    tense: "allin",
    titel: "Spieken is niet nodig (TK061002)",
    /* niveau *: verleden tijd en voltooid deelwoord typen (cirkel, oefening 2) */
    persoonsvorm: [
      {prompt:"(dansen) Ik ... de hele avond.", answer:"danste", level:"*"},
      {prompt:"(dansen) Ik heb ...", answer:"gedanst", level:"*"},
      {prompt:"(eten) Ik ... een appel.", answer:"at", level:"*"},
      {prompt:"(eten) Ik heb ...", answer:"gegeten", level:"*"},
      {prompt:"(lachen) Ik ... luid.", answer:"lachte", level:"*"},
      {prompt:"(lachen) Ik heb ...", answer:"gelachen", level:"*"},
      {prompt:"(zingen) Ik ... een lied.", answer:"zong", level:"*"},
      {prompt:"(zingen) Ik heb ...", answer:"gezongen", level:"*"},
      {prompt:"(praten) Ik ... met mijn vriend.", answer:"praatte", level:"*"},
      {prompt:"(praten) Ik heb ...", answer:"gepraat", level:"*"},
      {prompt:"(snijden) Ik ... het brood.", answer:"sneed", level:"*"},
      {prompt:"(snijden) Ik heb ...", answer:"gesneden", level:"*"},
      {prompt:"(drinken) Ik ... een glas water.", answer:"dronk", level:"*"},
      {prompt:"(drinken) Ik heb ...", answer:"gedronken", level:"*"},
      /* niveau **: persoonsvorm in de andere tijd zetten, in een verhaal (vierkant, oefening 3) */
      {prompt:"(hebben) Apotheker Janssens ... een zaak in de Kerkstraat. Zet in de verleden tijd.", answer:"had", level:"**"},
      {prompt:"(horen) Hij ... dat er een opnameploeg op ronde was. Zet in de verleden tijd.", answer:"hoorde", level:"**"},
      {prompt:"(vertellen) Hij ... het nieuws onmiddellijk aan zijn vrouw. Zet in de tegenwoordige tijd.", answer:"vertelt", level:"**"},
      {prompt:"(besluiten) Die ... om een bezoek te brengen aan haar kapper. Zet in de verleden tijd.", answer:"besloot", level:"**"},
      {prompt:"(gaan) Enkele minuten later ... de winkeldeur van de apotheek open. Zet in de verleden tijd.", answer:"ging", level:"**"},
      {prompt:"(staan) Daar ... Koen Bauwers! Zet in de verleden tijd.", answer:"stond", level:"**"},
      {prompt:"(inspecteren) Presentator Koen Bauwers ... de apotheek op netheid. Zet in de tegenwoordige tijd.", answer:"inspecteert", level:"**"},
      {prompt:"(ontvangen) Na een grondige inspectie ... de apotheker een prijs. Zet in de verleden tijd.", answer:"ontving", level:"**"},
      {prompt:"(vertrekken) Daarna ... de opnameploeg naar een andere locatie. Zet in de verleden tijd.", answer:"vertrok", level:"**"},
      /* niveau **: lange brief aanvullen (vierkant, oefening 4) */
      {prompt:"(komen) Nu het einde van dit schooljaar zo dichtbij ...,", answer:"komt", level:"**"},
      {prompt:"(willen) ... ik deze brief aan u richten.", answer:"wil", level:"**"},
      {prompt:"(zijn) Dit jaar ... een topjaar!", answer:"was", level:"**"},
      {prompt:"(leren) We ... veel nieuwe dingen.", answer:"leerden", level:"**"},
      {prompt:"(hebben) Geen enkele spellingregel ... nog geheimen voor ons.", answer:"heeft", level:"**"},
      {prompt:"(danken) Al die kennis ... we aan u en uw collega's.", answer:"danken", level:"**"},
      {prompt:"(zijn) Ik ... zo blij om nu een echte Taalkanjer te zijn.", answer:"ben", level:"**"},
      {prompt:"(worden) Onze klas ... een hechte vriendenclub.", answer:"werd", level:"**"},
      {prompt:"(worden) Ik ... binnenkort een echte puber.", answer:"word", level:"**"},
      {prompt:"(beleven) Bedankt voor alle leuke momenten die we het voorbije jaar hebben ...", answer:"beleefd", level:"**"}
    ],
    /* niveau ***: AI-gecontroleerd kort verslag (driehoek, oefening 5) */
    vrijetekst: {
      opdracht: "Je beleefde je laatste schooljaar in de lagere school. Welk moment is je bijgebleven? Schrijf er een kort verslag over (minstens 3 zinnen)."
    }
  },
  "TK050105": {
    tense: "tt",
    titel: "Na hard werken mag je rusten (TK050105)",
    fillin: [
      {level:"*", prefix:"Ik", suffix:"nooit rokjes.", answer:"draag", options:["draagt","dragen","draag"]},
      {level:"*", prefix:"Ahmed", suffix:"heel graag.", answer:"tennist", options:["tennis","tennissen","tennist"]},
      {level:"*", prefix:"", suffix:"jij me even met dit vraagstuk?", answer:"Help", options:["Helpt","Help","Helpen"]},
      {level:"*", prefix:"De poetsman", suffix:"de keuken.", answer:"poetst", options:["poetst","poets","poetsen"]},
      {level:"*", prefix:"Mijn buur", suffix:"regelmatig over de haag.", answer:"kijkt", options:["kijken","kijk","kijkt"]},
      {level:"*", prefix:"Papa", suffix:"naar de winkel.", answer:"fietst", options:["fiets","fietsen","fietst"]},
      {level:"*", prefix:"", suffix:"jij nog iets nodig?", answer:"Heb", options:["Heb","Hebben","Hebt"]}
    ],
    persoonsvorm: [
      {prompt:"(toveren) Opa ... een geweldig geschenk tevoorschijn.", answer:"tovert", level:"*"},
      {prompt:"(schijnen) 's Nachts ... de maan door de bomen.", answer:"schijnt", level:"*"},
      {prompt:"(spelen) Volgende week ... de muzikant in Gent.", answer:"speelt", level:"*"},
      {prompt:"(geloven) ... jij dat de aarde zal beven vannacht?", answer:"Geloof", level:"*"},
      {prompt:"(kijken) De toeschouwers ... naar de voorstelling.", answer:"kijken", level:"*"},
      {prompt:"(wegdromen) In de klas ... ik vaak weg.", answer:"droom", level:"*"},
      {prompt:"(drinken) ... jij dat glas in één keer leeg?", answer:"Drink", level:"*"},
      {prompt:"(werken) Samira ... flink voor school.", answer:"werkt", level:"*"},
      {prompt:"(bevriezen) De kleuter ... van de kou.", answer:"bevriest", level:"*"},
      {prompt:"(verplaatsen) Waarom ... de meester ons zo vaak?", answer:"verplaatst", level:"*"},
      {prompt:"(wonen) Onze hond Tarzan ... in een hok in de tuin.", answer:"woont", level:"*"},
      {prompt:"(krabben) Een kat met vlooien ... zich de hele dag.", answer:"krabt", level:"*"},
      {prompt:"(zweven) Boven onze tuin ... regelmatig een buizerd.", answer:"zweeft", level:"*"},
      {prompt:"(lachen) De leerlingen ... om de grapjes van de juf.", answer:"lachen", level:"*"},
      {prompt:"(opstaan) 9 u. Ik ... en ontbijt.", answer:"sta op", level:"**"},
      {prompt:"(ontbijten) 9 u. Ik sta op en ...", answer:"ontbijt", level:"**"},
      {prompt:"(bellen) Ik ... mijn manager om te weten waar ik vandaag moet optreden.", answer:"bel", level:"**"},
      {prompt:"(noteren) Mijn manager ... alle afspraken.", answer:"noteert", level:"**"},
      {prompt:"(helpen) en ... mij om niets te vergeten.", answer:"helpt", level:"**"},
      {prompt:"(bezoeken) 11 u. Ik ... de locatie van mijn volgende show.", answer:"bezoek", level:"**"},
      {prompt:"(nemen) Goochelaars ... altijd een kijkje op voorhand.", answer:"nemen", level:"**"},
      {prompt:"(oefenen) 13 u. Ik ... een aantal nieuwe trucs samen met mijn assistente.", answer:"oefen", level:"**"},
      {prompt:"(vinden) Zijn assistente ... die trucs niet altijd zo geweldig.", answer:"vindt", level:"**"},
      {prompt:"(zijn) maar het publiek ... altijd enthousiast.", answer:"is", level:"**"},
      {prompt:"(vertrekken) 17 u. Ik ... richting Luik.", answer:"vertrek", level:"**"},
      {prompt:"(worden) 20 u. Het startschot ... gegeven.", answer:"wordt", level:"**"},
      {prompt:"(voelen) Ik ... me helemaal klaar.", answer:"voel", level:"**"}
    ],
    vrijezin: [
      {infinitief:"toveren"},
      {infinitief:"geloven"},
      {infinitief:"werken"},
      {infinitief:"bevriezen"},
      {infinitief:"wonen"},
      {infinitief:"lachen"},
      {infinitief:"vertrekken"}
    ]
  },
  "TK050405": {
    tense: "vt",
    titel: "De tijd van toen (TK050405)",
    identify: [
      {level:"*", prompt:"springen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"springen → sprong"},
      {level:"*", prompt:"werken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"werken → werkte"},
      {level:"*", prompt:"lopen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"lopen → liep"},
      {level:"*", prompt:"stoppen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"stoppen → stopte"},
      {level:"*", prompt:"rijden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"rijden → reed"},
      {level:"*", prompt:"kijken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"kijken → keek"},
      {level:"*", prompt:"schaatsen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"schaatsen → schaatste"},
      {level:"*", prompt:"vinden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"vinden → vond"},
      {level:"*", prompt:"bellen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"bellen → belde"},
      {level:"*", prompt:"trappen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"trappen → trapte"}
    ],
    persoonsvorm: [
      {prompt:"(springen) Ik ...", answer:"sprong", level:"*"},
      {prompt:"(lopen) Ik ...", answer:"liep", level:"*"},
      {prompt:"(rijden) Ik ...", answer:"reed", level:"*"},
      {prompt:"(kijken) Ik ...", answer:"keek", level:"*"},
      {prompt:"(vinden) Ik ...", answer:"vond", level:"*"},
      {prompt:"(werken) Ik ...", answer:"werkte", level:"*"},
      {prompt:"(stoppen) Ik ...", answer:"stopte", level:"*"},
      {prompt:"(schaatsen) Ik ...", answer:"schaatste", level:"*"},
      {prompt:"(bellen) Ik ...", answer:"belde", level:"*"},
      {prompt:"(trappen) Ik ...", answer:"trapte", level:"*"},
      {prompt:"(rijden) Gisteren ... ik met de fiets naar school.", answer:"reed", level:"**"},
      {prompt:"(lopen) Vorige week ... mijn broer zijn beste tijd.", answer:"liep", level:"**"},
      {prompt:"(geven) De juf ... vorige week geen enkele taak op.", answer:"gaf", level:"**"},
      {prompt:"(snijden) De slager ... onlangs in zijn vinger.", answer:"sneed", level:"**"},
      {prompt:"(hebben) ... jullie ook al een vrije dag?", answer:"Hadden", level:"**"},
      {prompt:"(vinden) Gelukkig ... mama hem nog net op tijd.", answer:"vond", level:"**"},
      {prompt:"(houden) Het meisje ... de ballon niet goed vast.", answer:"hield", level:"**"},
      {prompt:"(drinken) Vanochtend ... ik twee glazen melk.", answer:"dronk", level:"**"},
      {prompt:"(zitten) De poes ... daarnet nog onder de tafel.", answer:"zat", level:"**"},
      {prompt:"(fluiten) De scheidrechter ... de wedstrijd af.", answer:"floot", level:"**"},
      {prompt:"(vliegen) Vorige winter ... veel vogels weg.", answer:"vlogen", level:"**"},
      {prompt:"(spelen) Wij ... een leuk spel.", answer:"speelden", level:"**"},
      {prompt:"(stoppen) De auto ... voor het rode licht.", answer:"stopte", level:"**"},
      {prompt:"(werken) Oma ... de hele dag in de tuin.", answer:"werkte", level:"**"},
      {prompt:"(vertellen) De juf ... een waargebeurd verhaal.", answer:"vertelde", level:"**"},
      {prompt:"(plakken) De kleuter ... de snippers op zijn blad.", answer:"plakte", level:"**"},
      {prompt:"(delen) Tijdens de wandeling ... vrijwilligers water uit.", answer:"deelden", level:"**"},
      {prompt:"(dansen) De jongens ... urenlang.", answer:"dansten", level:"**"},
      {prompt:"(voetballen) Zaterdag ... de meisjes op kunstgras.", answer:"voetbalden", level:"**"},
      {prompt:"(kammen) De ruiters ... elke dag de manen van hun paard.", answer:"kamden", level:"**"},
      {prompt:"(plagen) De rakkers ... elkaar tijdens het bosspel.", answer:"plaagden", level:"**"},
      {prompt:"(kennen) ... jij die persoon goed?", answer:"Kende", level:"**"},
      {prompt:"(straffen) Mama ... ons omdat we stout waren.", answer:"strafte", level:"**"},
      {prompt:"(beloven) Mijn oom ... me een uitstap naar zee.", answer:"beloofde", level:"**"},
      {prompt:"(vieren) Vorig jaar ... opa zijn tachtigste verjaardag.", answer:"vierde", level:"**"},
      {prompt:"(kleuren) Die lieve meid ... de tekening mooi in.", answer:"kleurde", level:"**"}
    ],
    zinvtLabel: "Schrijf deze zin in de verleden tijd:",
    zinvt: [
      {zin:"De tovenaar tovert een konijn uit zijn hoed.", antwoord:"De tovenaar toverde een konijn uit zijn hoed."},
      {zin:"We zwemmen voor het goede doel.", antwoord:"Gisteren zwommen we voor het goede doel."},
      {zin:"De kunstenaar tekent een mooi portret.", antwoord:"De kunstenaar tekende een mooi portret."},
      {zin:"De voetballers spelen een zware wedstrijd.", antwoord:"De voetballers speelden een zware wedstrijd."},
      {zin:"We kijken naar een leuke film in de klas.", antwoord:"We keken naar een leuke film in de klas."}
    ],
    vrijetekst: {
      opdracht: "Schrijf een kort verslag (minstens 3 zinnen) over een leuke gebeurtenis die je hebt meegemaakt. Vervoeg alle werkwoorden in de verleden tijd."
    }
  },
  "TK050406": {
    tense: "allin",
    titel: "Een geschenk voor Leen (TK050406)",
    persoonsvorm: [
      {prompt:"(lopen, t.t.) De jongens ... twee toertjes in het stadspark.", answer:"lopen", level:"*"},
      {prompt:"(dromen, v.t.) Thomas ... over de toekomst.", answer:"droomde", level:"*"},
      {prompt:"(spelen, t.t.) De meisjes ... tijdens de speeltijd met de diabolo's.", answer:"spelen", level:"*"},
      {prompt:"(vinden, v.t.) Jonas ... een muntstuk van 2 euro op de stoep.", answer:"vond", level:"*"},
      {prompt:"(komen, t.t.) De bruidegom ... de bruid afhalen met een paardenkoets.", answer:"komt", level:"*"},
      {prompt:"(tonen, v.t.) De auteur ... zijn nieuwste boek aan het grote publiek.", answer:"toonde", level:"*"},
      {prompt:"(zingen, t.t.) Vader ... een liedje luidkeels mee in de wagen.", answer:"zingt", level:"*"},
      {prompt:"(geven, v.t.) De hotelgast ... zijn sleutel af aan de receptioniste.", answer:"gaf", level:"*"},
      {prompt:"(vertellen, v.t.) Vandaag ... de juf het verhaal van Romeo en Julia.", answer:"vertelde", level:"**"},
      {prompt:"(inspireren, v.t.) Dat ... Jonas.", answer:"inspireerde", level:"**"},
      {prompt:"(fietsen, v.t.) Hij ... naar huis.", answer:"fietste", level:"**"},
      {prompt:"(denken, v.t.) en ... na over de manier waarop hij zijn liefde aan Leen zou verklaren.", answer:"dacht", level:"**"},
      {prompt:"(zoeken, v.t.) Hij ... iets origineels.", answer:"zocht", level:"**"},
      {prompt:"(zullen, v.t.) ... hij een boeket bloemen kopen?", answer:"Zou", level:"**"},
      {prompt:"(eten, v.t.) Jonas ... haastig.", answer:"at", level:"**"},
      {prompt:"(vertrekken, v.t.) en ... naar zijn kamer.", answer:"vertrok", level:"**"},
      {prompt:"(schrijven, v.t.) Daar ... hij een leuk briefje voor Leen.", answer:"schreef", level:"**"},
      {prompt:"(gaan, v.t.) Nadien ... Jonas met zijn fiets richting Leen.", answer:"ging", level:"**"}
    ],
    zinvtLabel: "Schrijf deze zin in de andere tijd:",
    zinvt: [
      {zin:"Jonas fietst naar het huis van Leen.", antwoord:"Jonas fietste naar het huis van Leen."},
      {zin:"Hij maakte een mooie diamant voor haar.", antwoord:"Hij maakt een mooie diamant voor haar."},
      {zin:"De juf vertelde over het leven van Shakespeare.", antwoord:"De juf vertelt over het leven van Shakespeare."},
      {zin:"Jonas probeert een leuk deuntje op zijn blokfluit te spelen.", antwoord:"Jonas probeerde een leuk deuntje op zijn blokfluit te spelen."}
    ],
    vrijetekst: {
      opdracht: "Verzin zelf een klein liefdesverhaal (minstens 3 zinnen) met werkwoorden in zowel de tegenwoordige als de verleden tijd."
    }
  },
  "TK050504": {
    tense: "vt",
    titel: "Feest, feestte, gefeest (TK050504)",
    identify: [
      {level:"*", prompt:"mogen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"mogen → mocht"},
      {level:"*", prompt:"horen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"horen → hoorde"},
      {level:"*", prompt:"lachen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"lachen → lachten"},
      {level:"*", prompt:"toveren", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"toveren → toverde"},
      {level:"*", prompt:"voorzien", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"voorzien → voorzagen"},
      {level:"*", prompt:"kunnen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"kunnen → konden"},
      {level:"*", prompt:"eindigen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"eindigen → eindigde"},
      {level:"*", prompt:"gaan", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"gaan → gingen"}
    ],
    persoonsvorm: [
      {prompt:"(zetten) ik ...", answer:"zette", level:"*"},
      {prompt:"(zetten) wij ...", answer:"zetten", level:"*"},
      {prompt:"(redden) ik ...", answer:"redde", level:"*"},
      {prompt:"(redden) wij ...", answer:"redden", level:"*"},
      {prompt:"(lusten) ik ...", answer:"lustte", level:"*"},
      {prompt:"(lusten) wij ...", answer:"lustten", level:"*"},
      {prompt:"(antwoorden) ik ...", answer:"antwoordde", level:"*"},
      {prompt:"(antwoorden) wij ...", answer:"antwoordden", level:"*"},
      {prompt:"(feesten) ik ...", answer:"feestte", level:"*"},
      {prompt:"(feesten) wij ...", answer:"feestten", level:"*"},
      {prompt:"(zuchten) Opa ... eens heel diep.", answer:"zuchtte", level:"**"},
      {prompt:"(antwoorden) Waarom ... jij niet op mijn vraag?", answer:"antwoordde", level:"**"},
      {prompt:"(verwachten) Wij ... een huiswerkvrije week.", answer:"verwachtten", level:"**"},
      {prompt:"(verplichten) De agent ... mij om een fietshelm te dragen.", answer:"verplichtte", level:"**"},
      {prompt:"(landen) De vliegtuigen ... gisteren allemaal met vertraging.", answer:"landden", level:"**"},
      {prompt:"(branden) De kaarsen ... de hele avond.", answer:"brandden", level:"**"},
      {prompt:"(schatten) De jongen ... eerst de uitkomst van de deling.", answer:"schatte", level:"**"},
      {prompt:"(ontmoeten) Vorige week ... wij onze pennenvrienden.", answer:"ontmoetten", level:"**"},
      {prompt:"(starten) De voorstelling ... met een kwartier vertraging.", answer:"startte", level:"**"},
      {prompt:"(raden) Wij ... niet wie er op bezoek zou komen.", answer:"raadden", level:"**"},
      {prompt:"(vluchten) De katten ... weg voor de blaffende honden.", answer:"vluchtten", level:"**"},
      {prompt:"(broeden) De vogels ... hun eieren uit.", answer:"broedden", level:"**"},
      {prompt:"(posten) ... jullie de brieven vanochtend?", answer:"Postten", level:"**"},
      {prompt:"(haasten) Vader ... zich naar het station.", answer:"haastte", level:"**"},
      {prompt:"(praten) De leerlingen ... er maar op los.", answer:"praatten", level:"**"}
    ],
    zinvtLabel: "Schrijf deze zin in de verleden tijd:",
    zinvt: [
      {zin:"De officier ontmoet de agent in het centrum van de stad.", antwoord:"De officier ontmoette de agent in het centrum van de stad."},
      {zin:"De professor lust geen sinaasappels maar wel citroenen.", antwoord:"De professor lustte geen sinaasappels maar wel citroenen."},
      {zin:"In december brandt de kachel elke dag.", antwoord:"In december brandde de kachel elke dag."}
    ],
    vrijetekst: {
      opdracht: "Gebruik elk van deze werkwoorden in een goede zin, vervoegd in de verleden tijd: overladen, vergroten, verwoesten, zweten."
    }
  },
  "TK050505": {
    tense: "vt",
    titel: "Ons feestgedrag onder de loep (TK050505)",
    persoonsvorm: [
      {prompt:"(versieren) ik ...", answer:"versierde", level:"*"},
      {prompt:"(versieren) wij ...", answer:"versierden", level:"*"},
      {prompt:"(organiseren) ik ...", answer:"organiseerde", level:"*"},
      {prompt:"(organiseren) wij ...", answer:"organiseerden", level:"*"},
      {prompt:"(feesten) ik ...", answer:"feestte", level:"*"},
      {prompt:"(feesten) wij ...", answer:"feestten", level:"*"},
      {prompt:"(dansen) ik ...", answer:"danste", level:"*"},
      {prompt:"(dansen) wij ...", answer:"dansten", level:"*"},
      {prompt:"(worden) Er ... een groot feest gegeven.", answer:"werd", level:"**"},
      {prompt:"(dragen) De gasten ... mooie kleding.", answer:"droegen", level:"**"},
      {prompt:"(dansen) De gasten ... de hele avond in het rond.", answer:"dansten", level:"**"},
      {prompt:"(klinken) Er ... mooie muziek.", answer:"klonk", level:"**"},
      {prompt:"(verlichten) Papa ... de dansvloer.", answer:"verlichtte", level:"**"},
      {prompt:"(tonen) Mama ... haar kookkunst.", answer:"toonde", level:"**"},
      {prompt:"(bereiden) Mama ... heerlijke hapjes.", answer:"bereidde", level:"**"},
      {prompt:"(bakken) Papa ... ook lekkere taartjes.", answer:"bakte", level:"**"},
      {prompt:"(geven) Veel mensen ... haar complimentjes.", answer:"gaven", level:"**"},
      {prompt:"(genieten) Ik ... enorm van die leuke avond.", answer:"genoot", level:"**"},
      {prompt:"(mogen) Voor mij ... het alle dagen feest zijn.", answer:"mocht", level:"**"},
      {prompt:"(beleven) We ... een heel fijne avond.", answer:"beleefden", level:"***"},
      {prompt:"(drinken) We ... lekkere drankjes.", answer:"dronken", level:"***"},
      {prompt:"(eten) en ... heerlijke hapjes.", answer:"aten", level:"***"},
      {prompt:"(eindigen) Helaas ... het mooie feest.", answer:"eindigde", level:"***"},
      {prompt:"(moeten) Iedereen ... naar huis toe.", answer:"moest", level:"***"},
      {prompt:"(vertrekken) We ... omstreeks middernacht.", answer:"vertrokken", level:"***"},
      {prompt:"(zijn) Eigenlijk ... het niet eens zo heel koud.", answer:"was", level:"***"},
      {prompt:"(herinneren) Een blik op de klok ... ons er wel aan dat het bedtijd was.", answer:"herinnerde", level:"***"},
      {prompt:"(vallen) Ik ... als een blok in slaap.", answer:"viel", level:"***"},
      {prompt:"(dromen) en ... verder over het feest.", answer:"droomde", level:"***"},
      {prompt:"('s Morgens, worden) ... ik wakker met hoofdpijn.", answer:"werd", level:"***"}
    ],
    identify: [
      {level:"*", prompt:"eten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"eten → at"},
      {level:"*", prompt:"drinken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"drinken → dronk"},
      {level:"*", prompt:"zingen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"zingen → zong"},
      {level:"*", prompt:"zitten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"zitten → zat"},
      {level:"*", prompt:"fluiten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:0, extraInfo:"fluiten → floot"},
      {level:"*", prompt:"vieren", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"vieren → vierde"},
      {level:"*", prompt:"snoepen", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"snoepen → snoepte"},
      {level:"*", prompt:"rusten", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"rusten → rustte"},
      {level:"*", prompt:"braden", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"braden → braadde"},
      {level:"*", prompt:"bakken", options:["Verandert van klank","Verandert niet van klank"], correctIndex:1, extraInfo:"bakken → bakte"}
    ],
    zinvtLabel: "Schrijf deze zin in de verleden tijd:",
    zinvt: [
      {zin:"Tijdens het feest wordt veel wijn gedronken.", antwoord:"Tijdens het feest werd veel wijn gedronken."},
      {zin:"Jelle nodigt ook de buren uit.", antwoord:"Jelle nodigde ook de buren uit."},
      {zin:"Aan het einde begint men zich gek te gedragen.", antwoord:"Aan het einde begon men zich gek te gedragen."},
      {zin:"Gelukkig is het een heel plezierige avond.", antwoord:"Gelukkig was het een heel plezierige avond."},
      {zin:"We praten nog lang na over dit feest.", antwoord:"We praatten nog lang na over dit feest."}
    ]
  },
  "TK050601": {
    tense: "allin",
    titel: "Sporten is gezond (TK050601)",
    persoonsvorm: [
      {prompt:"(willen) Moeder Tomaat en haar zoontje ... de straat oversteken. Zet in de verleden tijd.", answer:"wilden", level:"*"},
      {prompt:"(steken) Moeder Tomaat en haar zoontje ... over, maar werden toch overreden. Zet in de verleden tijd.", answer:"staken", level:"*"},
      {prompt:"(worden) Ze staken over, maar ... toch overreden. Zet in de verleden tijd.", answer:"werden", level:"*"},
      {prompt:"(zuchten) 'Ja', ... moeder Tomaat. Zet in de verleden tijd.", answer:"zuchtte", level:"*"},
      {prompt:"(komen) Een aardappel ... hijgend naar zijn vriend toegelopen. Zet in de tegenwoordige tijd.", answer:"komt", level:"*"},
      {prompt:"(zeggen) en ...: 'Help, mijn moeder zit in de puree!' Zet in de tegenwoordige tijd.", answer:"zegt", level:"*"},
      {prompt:"(kweken, t.t.) Oma ... heerlijke tomaten in haar tuin.", answer:"kweekt", level:"**"},
      {prompt:"(kweken, v.t.) Oma ... heerlijke tomaten in haar tuin.", answer:"kweekte", level:"**"},
      {prompt:"(zingen, t.t.) De zanger ... een lied over tomaten.", answer:"zingt", level:"**"},
      {prompt:"(zingen, v.t.) De zanger ... een lied over tomaten.", answer:"zong", level:"**"},
      {prompt:"(krijgen, t.t.) Alle leerlingen ... een gezond drankje.", answer:"krijgen", level:"**"},
      {prompt:"(krijgen, v.t.) Alle leerlingen ... een gezond drankje.", answer:"kregen", level:"**"},
      {prompt:"(antwoorden, t.t.) Jonas ... op de vragen van de meester.", answer:"antwoordt", level:"**"},
      {prompt:"(antwoorden, v.t.) Jonas ... op de vragen van de meester.", answer:"antwoordde", level:"**"},
      {prompt:"(vluchten, t.t.) De dader ... weg.", answer:"vlucht", level:"**"},
      {prompt:"(vluchten, v.t.) De dader ... weg.", answer:"vluchtte", level:"**"},
      {prompt:"(schudden, t.t.) De jongen ... met zijn hoofd.", answer:"schudt", level:"**"},
      {prompt:"(schudden, v.t.) De jongen ... met zijn hoofd.", answer:"schudde", level:"**"},
      {prompt:"(zien, t.t.) De gefrituurde hapjes ... er lekker uit.", answer:"zien", level:"**"},
      {prompt:"(zien, v.t.) De gefrituurde hapjes ... er lekker uit.", answer:"zagen", level:"**"},
      {prompt:"(kijken, t.t.) De meester ... boos naar Jonas.", answer:"kijkt", level:"**"},
      {prompt:"(kijken, v.t.) De meester ... boos naar Jonas.", answer:"keek", level:"**"},
      {prompt:"(spelen, v.t.) Vorige week ... we een volleybalwedstrijd met onze klas.", answer:"speelden", level:"**"},
      {prompt:"(hebben, v.t.) De leerlingen van de andere school ... veel geoefend.", answer:"hadden", level:"**"},
      {prompt:"(moeten, v.t.) We ... ons beste beentje voorzetten.", answer:"moesten", level:"**"},
      {prompt:"(komen, v.t.) De anderen ... eerst op voorsprong.", answer:"kwamen", level:"**"},
      {prompt:"(reageren, v.t.) Wij ... goed.", answer:"reageerden", level:"**"},
      {prompt:"(zetten, v.t.) We ... onze achterstand om in winst.", answer:"zetten", level:"**"},
      {prompt:"(organiseren, t.t.) Morgen ... onze school de terugwedstrijd.", answer:"organiseert", level:"**"},
      {prompt:"(gaan, t.t.) Jelle, onze topscorer, ... vanmiddag nog extra oefenen.", answer:"gaat", level:"**"},
      {prompt:"(smashen, t.t.) Hij ... erop los wanneer hij daartoe de kans krijgt.", answer:"smasht", level:"**"},
      {prompt:"(houden, t.t.) De sportleraar ... morgen eerst nog een training.", answer:"houdt", level:"**"},
      {prompt:"(doen, t.t.) Ik ... alvast mijn uiterste best om goed te spelen.", answer:"doe", level:"**"},
      {prompt:"(stoten, t.t.) Bij winst ... onze ploeg door naar de halve finale.", answer:"stoot", level:"**"},
      {prompt:"(beloven, t.t.) Het ... nog spannend te worden!", answer:"belooft", level:"**"},
      {prompt:"(worden, v.t.) In Leuven ... een spannende wedstrijd gespeeld.", answer:"werd", level:"***"},
      {prompt:"(gaan, v.t.) De leerlingen van klas 5 ... de strijd aan met een naburige school.", answer:"gingen", level:"***"},
      {prompt:"(spelen, v.t.) Tot op de laatste minuut ... men met volle overgave.", answer:"speelde", level:"***"},
      {prompt:"(trillen, t.t.) Ik ... nog op mijn benen als ik eraan terugdenk.", answer:"tril", level:"***"},
      {prompt:"(maken, v.t.) In de vijftiende minuut ... Jelle een fantastische goal.", answer:"maakte", level:"***"},
      {prompt:"(behalen, v.t.) Pas in de laatste minuut ... men het winnende punt.", answer:"behaalde", level:"***"},
      {prompt:"(strijden, t.t.) Volgend schooljaar ... de kampioenen opnieuw mee voor de titel.", answer:"strijden", level:"***"}
    ],
    zinvtLabel: "Schrijf deze zin in de andere tijd:",
    zinvt: [
      {zin:"Mijn vader bereidt dagelijks een verse maaltijd.", antwoord:"Mijn vader bereidde dagelijks een verse maaltijd."},
      {zin:"In de lente zaaide papa spinazie in de tuin.", antwoord:"In de lente zaait papa spinazie in de tuin."},
      {zin:"De kinderen beleefden veel plezier in de speeltuin.", antwoord:"De kinderen beleven veel plezier in de speeltuin."},
      {zin:"Tijdens de zwemles zwom mijn broer al 200 m schoolslag.", antwoord:"Tijdens de zwemles zwemt mijn broer al 200 m schoolslag."},
      {zin:"De jongen fietst elke ochtend naar school.", antwoord:"De jongen fietste elke ochtend naar school."}
    ],
    vrijetekst: {
      opdracht: "Zoek in de krant een kort sportverslag en schrijf het opnieuw in de verleden tijd. Maak er gerust een grappig verhaal van (minstens 3 zinnen)."
    }
  },
  "TK050603": {
    tense: "tt",
    titel: "Een avondje griezelen (TK050603)",
    brontekst: {
      titel: "Een avondje griezelen",
      tekst: "Stach verhuist met zijn familie vanuit de stad naar een eenzaam eiland aan de Belgische kust. Al bij aankomst voelt Stach dat er een groot gevaar dreigt. De eilandbewoners negeren de nieuwkomers. Ze weigeren hun vragen te beantwoorden. Op de avond van Halloween zit Stach gezellig alleen voor de televisie. Hij hoort een vreemd, krassend geluid aan de voordeur ..."
    },
    persoonsvorm: [
      {prompt:"(verhuizen) Stach ... met zijn familie vanuit de stad naar een eenzaam eiland.", answer:"verhuist", level:"*"},
      {prompt:"(voelen) Al bij aankomst ... Stach dat er een groot gevaar dreigt.", answer:"voelt", level:"*"},
      {prompt:"(dreigen) Al bij aankomst voelt Stach dat er een groot gevaar ...", answer:"dreigt", level:"*"},
      {prompt:"(negeren) De eilandbewoners ... de nieuwkomers.", answer:"negeren", level:"*"},
      {prompt:"(weigeren) De eilandbewoners ... hun vragen te beantwoorden.", answer:"weigeren", level:"*"},
      {prompt:"(zitten) Op de avond van Halloween ... Stach gezellig alleen voor de televisie.", answer:"zit", level:"*"},
      {prompt:"(horen) Hij ... een vreemd, krassend geluid aan de voordeur.", answer:"hoort", level:"*"},
      {prompt:"(rijden) Jonas ... elke dag met de fiets naar school.", answer:"rijdt", level:"**"},
      {prompt:"(zitten) Hij ... al in het vijfde leerjaar.", answer:"zit", level:"**"},
      {prompt:"(houden) ... de portier de wacht aan de ingang?", answer:"Houdt", level:"**"},
      {prompt:"(bereiden) Papa ... een heerlijke maaltijd.", answer:"bereidt", level:"**"},
      {prompt:"(rusten) In het weekend ... ik voldoende.", answer:"rust", level:"**"},
      {prompt:"(fluiten) Samuel ... een mooi liedje.", answer:"fluit", level:"**"},
      {prompt:"(sprinten) De wielrenner ... naar de overwinning.", answer:"sprint", level:"**"},
      {prompt:"(snijden) Oma ... het vlees in stukken.", answer:"snijdt", level:"**"},
      {prompt:"(worden) ... je zus snel boos?", answer:"Wordt", level:"**"},
      {prompt:"(raden) De leerlingen ... het antwoord.", answer:"raden", level:"**"},
      {prompt:"(schudden) Voor ik de kaarten uitdeel, ... ik ze door elkaar.", answer:"schud", level:"**"},
      {prompt:"(haasten) ... je moeder zich ook zo vaak?", answer:"Haast", level:"**"},
      {prompt:"(vergeten) ... jij ook regelmatig een taak te maken?", answer:"Vergeet", level:"**"},
      {prompt:"(ontmoeten) Volgende week ... wij een bekend auteur.", answer:"ontmoeten", level:"**"},
      {prompt:"(branden) Onze kachel ... elke avond.", answer:"brandt", level:"**"},
      {prompt:"(zitten) De Taalkanjers ... rustig in de caravan naar de spannende film te kijken.", answer:"zitten", level:"***"},
      {prompt:"(liggen) Er ... een zak chips op tafel.", answer:"ligt", level:"***"},
      {prompt:"(staan) en er ... een grote fles limonade klaar.", answer:"staat", level:"***"},
      {prompt:"(schrikken) Plots ... Ricardo.", answer:"schrikt", level:"***"},
      {prompt:"(vragen) Hij ... aan de andere Kanjers om stil te zijn.", answer:"vraagt", level:"***"},
      {prompt:"(horen) Dan ... ze het ook: piep, kriep, piep.", answer:"horen", level:"***"},
      {prompt:"(proberen) Het lijkt alsof iemand ... binnen te geraken.", answer:"probeert", level:"***"},
      {prompt:"(moeten) 'We ... iets doen', zegt Hajar.", answer:"moeten", level:"***"},
      {prompt:"(kunnen) 'We ... de tafel voor de deur schuiven', antwoordt Leen.", answer:"kunnen", level:"***"},
      {prompt:"(schuiven) Alle leden ... samen de tafel voor de deur.", answer:"schuiven", level:"***"},
      {prompt:"(stoppen) Het krassende geluid ...", answer:"stopt", level:"***"},
      {prompt:"(openen) De volgende ochtend ... Bert de deur van de caravan.", answer:"opent", level:"***"},
      {prompt:"(springen) Hij ... verschrikt achteruit.", answer:"springt", level:"***"},
      {prompt:"(hangen) Aan de deurklink ... een ijzeren haak.", answer:"hangt", level:"***"}
    ],
    vrijezin: [
      {infinitief:"verhuizen"},
      {infinitief:"negeren"},
      {infinitief:"weigeren"},
      {infinitief:"schrikken"},
      {infinitief:"proberen"},
      {infinitief:"schuiven"},
      {infinitief:"openen"}
    ]
  },
  "TK050701": {
    tense: "allin",
    titel: "Broes bracht oma een bezoek (TK050701)",
    persoonsvorm: [
      {prompt:"(eten) Ik ... mijn soep op. Zet in de tegenwoordige tijd.", answer:"eet", level:"*"},
      {prompt:"(werken) Daan ... voor school. Zet in de verleden tijd.", answer:"werkte", level:"*"},
      {prompt:"(rijden) Die trein ... naar Blankenberge. Zet in de verleden tijd.", answer:"reed", level:"*"},
      {prompt:"(lezen) Gitte ... graag een boek. Zet in de verleden tijd.", answer:"las", level:"*"},
      {prompt:"(huilen) De baby ... de hele nacht. Zet in de tegenwoordige tijd.", answer:"huilt", level:"*"},
      {prompt:"(stoppen) De bus ... aan de halte. Zet in de tegenwoordige tijd.", answer:"stopt", level:"*"},
      {prompt:"(lopen, stam+t) Hij ... elke dag naar school.", answer:"loopt", level:"*"},
      {prompt:"(lopen, v.t.) Hij ... gisteren naar school.", answer:"liep", level:"*"},
      {prompt:"(rusten, stam+t) Sam ... elke middag.", answer:"rust", level:"*"},
      {prompt:"(rusten, v.t.) Sam ... gisteren ook.", answer:"rustte", level:"*"},
      {prompt:"(verkiezen, stam+t) Hij ... voor het blauwe shirt.", answer:"verkiest", level:"*"},
      {prompt:"(verkiezen, v.t.) Hij ... vorige keer het rode shirt.", answer:"verkoos", level:"*"},
      {prompt:"(beloven, stam+t) Papa ... een verrassing.", answer:"belooft", level:"*"},
      {prompt:"(beloven, v.t.) Papa ... gisteren een verrassing.", answer:"beloofde", level:"*"},
      {prompt:"(zwemmen, stam+t) Hij ... elke zaterdag.", answer:"zwemt", level:"*"},
      {prompt:"(zwemmen, v.t.) Hij ... gisteren ook.", answer:"zwom", level:"*"},
      {prompt:"(behalen, stam+t) Sam ... goede punten.", answer:"behaalt", level:"*"},
      {prompt:"(behalen, v.t.) Sam ... vorig jaar ook goede punten.", answer:"behaalde", level:"*"}
    ],
    stam: [
      {infinitief:"lopen", antwoord:"loop"},
      {infinitief:"rusten", antwoord:"rust"},
      {infinitief:"verkiezen", antwoord:"verkies"},
      {infinitief:"beloven", antwoord:"beloof"},
      {infinitief:"zwemmen", antwoord:"zwem"},
      {infinitief:"behalen", antwoord:"behaal"}
    ],
    zinvtLabel: "Schrijf deze zin in de andere tijd:",
    zinvt: [
      {zin:"Het is een geweldig fijne dag!", antwoord:"Het was een geweldig fijne dag!"},
      {zin:"Ik bezocht vandaag mijn oma in het zorgcentrum.", antwoord:"Ik bezoek vandaag mijn oma in het zorgcentrum."},
      {zin:"Het centrum toont zijn nieuwe kleuren.", antwoord:"Het centrum toonde zijn nieuwe kleuren."},
      {zin:"Ik zag de prachtige kleurtinten in de kamers.", antwoord:"Ik zie de prachtige kleurtinten in de kamers."},
      {zin:"Er trad ook een circusschool op.", antwoord:"Er treedt ook een circusschool op."},
      {zin:"Een acrobaat voert sprongen uit in de lucht.", antwoord:"Een acrobaat voerde sprongen uit in de lucht."}
    ],
    vrijetekst: {
      opdracht: "Bracht jij onlangs nog iemand een bezoek? Schrijf er een kort dagboekfragment over (minstens 3 zinnen), met werkwoorden in zowel de tegenwoordige als de verleden tijd."
    }
  },
  "TK050705": {
    tense: "geenpv",
    titel: "Mooi gekleurd (TK050705)",
    identify: [
      {level:"*", plain:true, prompt:"Gisteren heeft het erg hard <u>geregend</u>. Is dit een persoonsvorm?", options:["Ja, persoonsvorm","Nee, geen persoonsvorm"], correctIndex:1},
      {level:"*", plain:true, prompt:"De zon <u>scheen</u> ook tussen de regen door. Is dit een persoonsvorm?", options:["Ja, persoonsvorm","Nee, geen persoonsvorm"], correctIndex:0},
      {level:"*", plain:true, prompt:"Ik heb naar de pot goud <u>gezocht</u>. Is dit een persoonsvorm?", options:["Ja, persoonsvorm","Nee, geen persoonsvorm"], correctIndex:1},
      {level:"*", plain:true, prompt:"Dan <u>benoemde</u> ik de kleuren. Is dit een persoonsvorm?", options:["Ja, persoonsvorm","Nee, geen persoonsvorm"], correctIndex:0},
      {level:"*", plain:true, prompt:"Ik heb de kleuren in een kleurtje <u>gezet</u>. Is dit een persoonsvorm?", options:["Ja, persoonsvorm","Nee, geen persoonsvorm"], correctIndex:1},
      {level:"*", plain:true, prompt:"Ik <u>plaats</u> nu die letters na elkaar. Is dit een persoonsvorm?", options:["Ja, persoonsvorm","Nee, geen persoonsvorm"], correctIndex:0},
      {level:"**", prompt:"gezien — Ik heb gisteren een regenboog gezien.", options:["verlengingsregel","verdubbelen","verenkelen","hoorwoord","weetwoord"], correctIndex:3},
      {level:"**", prompt:"vertrokken — Mijn ouders zijn op zakenreis vertrokken.", options:["verlengingsregel","verdubbelen","verenkelen","hoorwoord","weetwoord"], correctIndex:1},
      {level:"**", prompt:"kapotgebeten — De hond heeft mijn bal kapotgebeten.", options:["verlengingsregel","verdubbelen","verenkelen","hoorwoord","weetwoord"], correctIndex:2},
      {level:"**", prompt:"verhuisd — Mijn oma is naar een zorgcentrum verhuisd.", options:["verlengingsregel","verdubbelen","verenkelen","hoorwoord","weetwoord"], correctIndex:0}
    ],
    persoonsvorm: [
      {prompt:"(mengen) Vandaag hebben we kleuren ...", answer:"gemengd", level:"**"},
      {prompt:"(krijgen) Door geel aan rood toe te voegen, hebben we oranje ...", answer:"gekregen", level:"**"},
      {prompt:"(spuiten) Met de nieuwe kleur heb ik de houten bank ...", answer:"gespoten", level:"**"},
      {prompt:"(worden) Het resultaat is verbluffend ...", answer:"geworden", level:"**"},
      {prompt:"(verwachten) Dat had ik niet ...", answer:"verwacht", level:"**"},
      {prompt:"(brengen) De leerkracht heeft me een nieuwe opdracht ...", answer:"gebracht", level:"**"},
      {prompt:"(schilderen) Ik heb de blokkendozen meteen ...", answer:"geschilderd", level:"**"},
      {prompt:"(vertellen) Thuis heb ik ... dat het een leuke dag was.", answer:"verteld", level:"**"}
    ],
    zinvtLabel: "Zet de zin om met een voltooid deelwoord (bv. 'Ik wandel door het park.' → 'Ik heb door het park gewandeld.'):",
    zinvtLevel: "**",
    zinvt: [
      {zin:"Vandaag denk ik aan het bezoek van gisteren.", antwoord:"Vandaag heb ik aan het bezoek van gisteren gedacht."},
      {zin:"Het is een leuke dag.", antwoord:"Het is een leuke dag geweest."},
      {zin:"Ik zie de mooie kleuren van het zorgcentrum.", antwoord:"Ik heb de mooie kleuren van het zorgcentrum gezien."},
      {zin:"Met de clown van het circus lach ik heel hard.", antwoord:"Met de clown van het circus heb ik heel hard gelachen."},
      {zin:"Leeuwen en tijgers brullen een melodie.", antwoord:"Leeuwen en tijgers hebben een melodie gebruld."},
      {zin:"De mooie kleuren maken de sfeer bijzonder.", antwoord:"De mooie kleuren hebben de sfeer bijzonder gemaakt."}
    ],
    vrijetekst: {
      opdracht: "Noteer twee zinnen over je lievelingskleur en gebruik telkens een voltooid deelwoord (bv. 'Ik heb mijn fiets hemelsblauw geschilderd.')."
    }
  },
  "TK050706": {
    tense: "allin",
    titel: "Heb ik gedroomd? (TK050706)",
    identify: [
      {level:"*", plain:true, prompt:"Ik heb een mooi gedicht <u>geschreven</u>. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:2},
      {level:"*", plain:true, prompt:"Ik <u>schreef</u> het voor mijn juf. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:1},
      {level:"*", plain:true, prompt:"De juf <u>leest</u> mijn tekst. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:0},
      {level:"*", plain:true, prompt:"Plots <u>tovert</u> ze een glimlach op haar gezicht. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:0},
      {level:"*", plain:true, prompt:"<u>Vond</u> ze mijn tekst mooi? Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:1},
      {level:"*", plain:true, prompt:"Ze heeft me <u>bedankt</u> voor de mooie woorden. Welk geval is dit?", options:["Tegenwoordige tijd","Verleden tijd","Geen persoonsvorm"], correctIndex:2}
    ],
    persoonsvorm: [
      {prompt:"(bezoeken, t.t.) ik ...", answer:"bezoek", level:"**"},
      {prompt:"(bezoeken, v.t.) wij ...", answer:"bezochten", level:"**"},
      {prompt:"(bezoeken, v.d.) ik heb ...", answer:"bezocht", level:"**"},
      {prompt:"(vertellen, t.t.) jij ...", answer:"vertelt", level:"**"},
      {prompt:"(vertellen, v.t.) hij ...", answer:"vertelde", level:"**"},
      {prompt:"(vertellen, v.d.) ik heb ...", answer:"verteld", level:"**"},
      {prompt:"(zwemmen, t.t.) hij ...", answer:"zwemt", level:"**"},
      {prompt:"(zwemmen, v.t.) jij ...", answer:"zwom", level:"**"},
      {prompt:"(zwemmen, v.d.) ik heb ...", answer:"gezwommen", level:"**"},
      {prompt:"(schilderen, t.t.) ik ...", answer:"schilder", level:"**"},
      {prompt:"(schilderen, v.t.) ik ...", answer:"schilderde", level:"**"},
      {prompt:"(schilderen, v.d.) ik heb ...", answer:"geschilderd", level:"**"},
      {prompt:"(zitten, t.t.) jij ...", answer:"zit", level:"**"},
      {prompt:"(zitten, v.t.) wij ...", answer:"zaten", level:"**"},
      {prompt:"(zitten, v.d.) ik heb ...", answer:"gezeten", level:"**"},
      {prompt:"(schrijven, t.t.) hij ...", answer:"schrijft", level:"**"},
      {prompt:"(schrijven, v.t.) hij ...", answer:"schreef", level:"**"},
      {prompt:"(schrijven, v.d.) ik heb ...", answer:"geschreven", level:"**"},
      {prompt:"(rijden, t.t.) jij ...", answer:"rijdt", level:"**"},
      {prompt:"(rijden, v.t.) wij ...", answer:"reden", level:"**"},
      {prompt:"(rijden, v.d.) ik heb ...", answer:"gereden", level:"**"},
      {prompt:"(ontmoeten, v.t.) Vorige week ... wij een kunstenaar.", answer:"ontmoetten", level:"***"},
      {prompt:"(wonen, t.t.) De man ... nog niet zo lang in ons dorp.", answer:"woont", level:"***"},
      {prompt:"(bouwen, v.d.) Hij heeft net een nieuw atelier ...", answer:"gebouwd", level:"***"},
      {prompt:"(mogen, v.t.) Wij ... bij hem op bezoek gaan.", answer:"mochten", level:"***"},
      {prompt:"(geven, v.d.) Hij heeft ons een boeiende rondleiding ...", answer:"gegeven", level:"***"},
      {prompt:"(tekenen, v.t.) Hij ... een portret van onze juf.", answer:"tekende", level:"***"},
      {prompt:"(kleuren, v.t.) Nadien ... hij het portret in.", answer:"kleurde", level:"***"},
      {prompt:"(blozen, v.d.) Juf ... toen ze het resultaat zag.", answer:"bloosde", level:"***"},
      {prompt:"(krijgen, v.d.) Ze heeft het portret mee naar huis ...", answer:"gekregen", level:"***"},
      {prompt:"(hangen, t.t.) Het kunstwerk ... nu op in onze klas.", answer:"hangt", level:"***"},
      {prompt:"(bewonderen, t.t.) Juf ... het elke dag.", answer:"bewondert", level:"***"},
      {prompt:"(worden, t.t.) Juf ... er echt gelukkig van.", answer:"wordt", level:"***"},
      {prompt:"(denken, t.t.) Ik ... dat juf verliefd is op die man.", answer:"denk", level:"***"}
    ],
    zinvtLabel: "Schrijf deze zin in de andere tijd:",
    zinvt: [
      {zin:"Opa hield niet van kleurrijke schilderijen.", antwoord:"Opa houdt niet van kleurrijke schilderijen."},
      {zin:"De schilder morst verf op de grond.", antwoord:"De schilder morste verf op de grond."},
      {zin:"Oma bezocht in Madrid een museum.", antwoord:"Oma bezoekt in Madrid een museum."},
      {zin:"De kunstenaar ontmoet zijn collega op restaurant.", antwoord:"De kunstenaar ontmoette zijn collega op restaurant."},
      {zin:"Joshua reed met de trein naar Antwerpen.", antwoord:"Joshua rijdt met de trein naar Antwerpen."}
    ],
    vrijetekst: {
      opdracht: "Gebruik elk van deze werkwoorden in een goede zin: antwoorden (tegenwoordige tijd), snijden (voltooid deelwoord), rusten (verleden tijd), knippen (voltooid deelwoord)."
    }
  },
  "TK050801": {
    tense: "geenpv",
    titel: "Bezoek aan een sportschool (TK050801)",
    persoonsvorm: [
      {prompt:"(wandelen) Wij zijn gisteren naar het bos ...", answer:"gewandeld", level:"*"},
      {prompt:"(fietsen) Ik ben naar mijn oma ...", answer:"gefietst", level:"*"},
      {prompt:"(lopen) De atlete heeft een sterke wedstrijd ...", answer:"gelopen", level:"*"},
      {prompt:"(zwemmen) Lola heeft 50 meter ...", answer:"gezwommen", level:"*"},
      {prompt:"(voetballen) Onze ploeg heeft niet zo goed ...", answer:"gevoetbald", level:"*"},
      {prompt:"(tennissen) Deze maand heb ik nog niet ...", answer:"getennist", level:"*"},
      {prompt:"(springen) De acrobaat heeft op de trampoline ...", answer:"gesprongen", level:"*"},
      {prompt:"(roeien) De jongens zijn met hun bootje naar de overkant ...", answer:"geroeid", level:"*"},
      {prompt:"(fietsen, t.t.) Ik ...", answer:"fiets", level:"**"},
      {prompt:"(fietsen, v.d.) Ik ben ...", answer:"gefietst", level:"**"},
      {prompt:"(zwemmen, v.t.) Ik ...", answer:"zwom", level:"**"},
      {prompt:"(zwemmen, v.d.) Ik heb ...", answer:"gezwommen", level:"**"},
      {prompt:"(voetballen, t.t.) Hij ...", answer:"voetbalt", level:"**"},
      {prompt:"(voetballen, v.d.) Hij heeft ...", answer:"gevoetbald", level:"**"},
      {prompt:"(lopen, t.t.) De atlete ...", answer:"loopt", level:"**"},
      {prompt:"(lopen, v.t.) Jullie ...", answer:"liepen", level:"**"},
      {prompt:"(sprinten, v.t.) Hij ...", answer:"sprintte", level:"**"},
      {prompt:"(sprinten, v.d.) Ik heb ...", answer:"gesprint", level:"**"},
      {prompt:"(turnen, v.t.) De turnster ...", answer:"turnde", level:"**"},
      {prompt:"(turnen, v.d.) Oma heeft ...", answer:"geturnd", level:"**"},
      {prompt:"(duiken, v.t.) Jullie ...", answer:"doken", level:"**"},
      {prompt:"(duiken, v.d.) Hij heeft ...", answer:"gedoken", level:"**"},
      {prompt:"(hinkelen, v.t.) Hij ...", answer:"hinkelde", level:"**"},
      {prompt:"(hinkelen, v.d.) We hebben ...", answer:"gehinkeld", level:"**"}
    ],
    zinvtLabel: "Schrijf deze zin in de verleden tijd:",
    zinvt: [
      {zin:"Bij het wielrennen spurt Greg Van Avermaet naar het goud.", antwoord:"Bij het wielrennen spurtte Greg Van Avermaet naar het goud."},
      {zin:"De onbekende Lionel Cox schiet goed en verovert een zilveren plak.", antwoord:"De onbekende Lionel Cox schoot goed en veroverde een zilveren plak."},
      {zin:"Op de 100 m vrije slag zwemt Pieter Timmers naar zilver.", antwoord:"Op de 100 m vrije slag zwom Pieter Timmers naar zilver."},
      {zin:"Zelfs in de ploegsport valt ons land in de prijzen.", antwoord:"Zelfs in de ploegsport viel ons land in de prijzen."},
      {zin:"De Belgische hockeymannen behalen eveneens zilver.", antwoord:"De Belgische hockeymannen behaalden eveneens zilver."}
    ],
    vrijetekst: {
      opdracht: "Wanneer heb jij voor het laatst gesport? Schrijf een kort verslag (minstens 3 zinnen) en gebruik zoveel mogelijk voltooide deelwoorden."
    }
  },
  "TK051005": {
    tense: "allin",
    titel: "Grote kuis in huis (TK051005)",
    persoonsvorm: [
      {prompt:"(opruimen, v.t.) Wij ... vandaag al heel goed op.", answer:"ruimden", level:"*"},
      {prompt:"(poetsen, t.t.) Bram ... zijn kamer vanaf nu wekelijks.", answer:"poetst", level:"*"},
      {prompt:"(luisteren, v.t.) Lize ... niet zo goed naar papa.", answer:"luisterde", level:"*"},
      {prompt:"(poetsen, v.t.) Onze ouders ... de hele dag in de garage.", answer:"poetsten", level:"*"},
      {prompt:"(stofzuigen, t.t.) Ik ... echt wel graag.", answer:"stofzuig", level:"*"},
      {prompt:"(dweilen, t.t.) ... jullie echt elke week?", answer:"Dweilen", level:"*"},
      {prompt:"(wassen, v.t.) Mijn opa ... de ramen twee keer per week.", answer:"waste", level:"*"},
      {prompt:"(poetsen, v.t.) Een poetsvrouw ... elke dag wel ergens een huis.", answer:"poetste", level:"**"},
      {prompt:"(dweilen, v.t.) Mijn moeder ... de huiskamer.", answer:"dweilde", level:"**"},
      {prompt:"(stofzuigen, v.t.) Vader ... de auto twee keer per week.", answer:"stofzuigde", level:"**"},
      {prompt:"(stoffen, v.t.) Lize en Bram ... hun spullen grondig af.", answer:"stoften af", level:"**"},
      {prompt:"(schilderen, v.t.) Dit jaar ... we de vuile muren opnieuw.", answer:"schilderden", level:"**"},
      {prompt:"(spoelen, v.t.) De glazenwasser ... de ruiten grondig.", answer:"spoelde", level:"**"},
      {prompt:"(beluisteren, v.t.) Bram ... altijd muziek op zijn kamer.", answer:"beluisterde", level:"**"},
      {prompt:"(antwoorden, v.t.) Daarom ... hij vaak niet.", answer:"antwoordde", level:"**"},
      {prompt:"(vragen, v.t.) Een paar dagen terug ... mama aan papa om de garage op te ruimen.", answer:"vroeg", level:"***"},
      {prompt:"(zijn, t.t.) Als er nu iets ... wat papa niet graag doet, dan is het wel de garage opruimen.", answer:"is", level:"***"},
      {prompt:"(doen, t.t.) Als er nu iets is wat papa niet graag ..., dan is het wel de garage opruimen.", answer:"doet", level:"***"},
      {prompt:"(hebben, t.t.) hij ... er een grondige hekel aan.", answer:"heeft", level:"***"},
      {prompt:"(moeten, t.t.) 'Papa, je ... nu echt wel aan de slag, hoor!'", answer:"moet", level:"***"},
      {prompt:"(roepen, v.t.) ... mama vanuit de keuken.", answer:"riep", level:"***"},
      {prompt:"(worden, v.t.) Al snel ... onze garage omgetoverd tot een echt slagveld.", answer:"werd", level:"***"},
      {prompt:"(omtoveren, v.d.) Al snel werd onze garage ... tot een echt slagveld.", answer:"omgetoverd", level:"***"},
      {prompt:"(besluiten, v.t.) Ik ... om mijn arme paps te helpen.", answer:"besloot", level:"***"},
      {prompt:"(zijn, v.t.) Op een paar uurtjes ... heel de klus geklaard.", answer:"was", level:"***"},
      {prompt:"(klaren, v.d.) Op een paar uurtjes was heel de klus ...", answer:"geklaard", level:"***"},
      {prompt:"(roepen, v.t.) 'Joepie!', ... ik uit.", answer:"riep", level:"***"},
      {prompt:"(lachen, v.t.) Vader ...", answer:"lachte", level:"***"},
      {prompt:"(worden, t.t.) Vandaag ... ons teamwerk door mama geïnspecteerd.", answer:"wordt", level:"***"},
      {prompt:"(inspecteren, v.d.) Vandaag wordt ons teamwerk door mama ...", answer:"geïnspecteerd", level:"***"},
      {prompt:"(beantwoorden, t.t.) Onze garage ... nu weer aan moeders wensen.", answer:"beantwoordt", level:"***"},
      {prompt:"(samenwerken, v.d.) omdat wij flink hebben ...", answer:"samengewerkt", level:"***"}
    ],
    stam: [
      {infinitief:"houden", antwoord:"houd"},
      {infinitief:"vallen", antwoord:"val"},
      {infinitief:"beschermen", antwoord:"bescherm"},
      {infinitief:"moeten", antwoord:"moet"},
      {infinitief:"beginnen", antwoord:"begin"},
      {infinitief:"wieden", antwoord:"wied"},
      {infinitief:"oogsten", antwoord:"oogst"}
    ],
    vrijetekst: {
      opdracht: "Ben jij een goede poetshulp? Schrijf in vijf zinnen wat belangrijk is als je poetst."
    }
  }

};
