const WERKWOORDEN_DATA = {
 "tt": {
  "title": "Tegenwoordige tijd",
  "schema": "schema-tt.png",
  "color": "#16a34a",
  "sets": {
   "1": {
    "explore": [
     {
      "verb": "WERKEN",
      "subjects": [
       {
        "group": 0,
        "text": "Ik ..."
       },
       {
        "group": 1,
        "text": "Jij ..."
       },
       {
        "group": 1,
        "text": "Hij ..."
       },
       {
        "group": 1,
        "text": "Het meisje ..."
       },
       {
        "group": 2,
        "text": "Wij ..."
       },
       {
        "group": 2,
        "text": "Jullie ..."
       },
       {
        "group": 2,
        "text": "... de leerlingen?"
       },
       {
        "group": 0,
        "text": "... je?"
       },
       {
        "group": 1,
        "text": "... je broer?"
       }
      ],
      "forms": [
       "werk",
       "werkt",
       "werken"
      ]
     },
     {
      "verb": "WORDEN",
      "subjects": [
       {
        "group": 0,
        "text": "Ik ..."
       },
       {
        "group": 1,
        "text": "Jij ..."
       },
       {
        "group": 1,
        "text": "Hij ..."
       },
       {
        "group": 1,
        "text": "Het meisje ..."
       },
       {
        "group": 2,
        "text": "Wij ..."
       },
       {
        "group": 2,
        "text": "Jullie ..."
       },
       {
        "group": 2,
        "text": "... de leerlingen?"
       },
       {
        "group": 0,
        "text": "... je?"
       },
       {
        "group": 1,
        "text": "... je broer?"
       }
      ],
      "forms": [
       "word",
       "wordt",
       "worden"
      ]
     }
    ],
    "identify": [
     {
      "level": "**",
      "prompt": "Vul de zin aan: Wat ... jullie veel boeken!",
      "options": [
       "koop",
       "koopt",
       "kopen"
      ],
      "correctIndex": 2
     },
     {
      "level": "***",
      "prompt": "Vul de zin aan: Het weer ... .",
      "options": [
       "klaar op",
       "klaart op",
       "klaren op"
      ],
      "correctIndex": 1
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Mama ... de dokter.",
      "options": [
       "telefoneer",
       "telefoneert",
       "telefoneren"
      ],
      "correctIndex": 1
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: ... jij ook mee?",
      "options": [
       "Speel",
       "Speelt",
       "Spelen"
      ],
      "correctIndex": 0
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Elke morgen ... ik melk.",
      "options": [
       "drink",
       "drinkt",
       "drinken"
      ],
      "correctIndex": 0
     }
    ],
    "fillin": [
     {
      "level": "*",
      "prefix": "1) (zien) Ik",
      "suffix": "niks.",
      "answer": "zie",
      "options": [
       "zie",
       "ziet",
       "zien"
      ]
     },
     {
      "level": "*",
      "prefix": "2) (komen) Hij",
      "suffix": "vandaag niet.",
      "answer": "komt",
      "options": [
       "kom",
       "komt",
       "komen"
      ]
     },
     {
      "level": "*",
      "prefix": "3) (uitstellen) Waarom",
      "suffix": "we de tocht uit?",
      "answer": "stellen",
      "options": [
       "stel",
       "stelt",
       "stellen"
      ]
     },
     {
      "level": "*",
      "prefix": "4) (trainen) 's Woendags",
      "suffix": "het elftal.",
      "answer": "traint",
      "options": [
       "train",
       "traint",
       "trainen"
      ]
     },
     {
      "level": "*",
      "prefix": "5) (kruipen) Waarheen",
      "suffix": "het baby'tje?",
      "answer": "kruipt",
      "options": [
       "kruip",
       "kruipt",
       "kruipen"
      ]
     },
     {
      "level": "*",
      "prefix": "6) (vullen) Papa",
      "suffix": "de benzinetank.",
      "answer": "vult",
      "options": [
       "vul",
       "vult",
       "vullen"
      ]
     },
     {
      "level": "*",
      "prefix": "7) (stilleggen)",
      "suffix": "hij de motor stil?",
      "answer": "Legt",
      "options": [
       "Leg",
       "Legt",
       "Leggen"
      ]
     },
     {
      "level": "*",
      "prefix": "8) (wonen) Wie",
      "suffix": "hier?",
      "answer": "woont",
      "options": [
       "woon",
       "woont",
       "wonen"
      ]
     },
     {
      "level": "*",
      "prefix": "9) (vragen)",
      "suffix": "jij het aan onze leraar?",
      "answer": "Vraag",
      "options": [
       "Vraag",
       "Vraagt",
       "Vragen"
      ]
     },
     {
      "level": "*",
      "prefix": "10) (uitbarsten) De kinderen",
      "suffix": "in lachen uit.",
      "answer": "barsten",
      "options": [
       "barst",
       "barsten"
      ]
     },
     {
      "level": "*",
      "prefix": "11) (menen)",
      "suffix": "jullie dat echt?",
      "answer": "Menen",
      "options": [
       "Meen",
       "Meent",
       "Menen"
      ]
     },
     {
      "level": "*",
      "prefix": "12) (zeggen) Je",
      "suffix": "het me veel te laat.",
      "answer": "zegt",
      "options": [
       "zeg",
       "zegt",
       "zeggen"
      ]
     },
     {
      "level": "**",
      "prefix": "13) (vertellen) Niemand",
      "suffix": "zulke onzin.",
      "answer": "vertelt",
      "options": [
       "vertel",
       "vertelt",
       "vertellen"
      ]
     },
     {
      "level": "**",
      "prefix": "14) (bloeien) Wat",
      "suffix": "die plant mooi!",
      "answer": "bloeit",
      "options": [
       "bloei",
       "bloeit",
       "bloeien"
      ]
     },
     {
      "level": "**",
      "prefix": "15) (raken) Dat",
      "suffix": "me helemaal niet.",
      "answer": "raakt",
      "options": [
       "raak",
       "raakt",
       "raken"
      ]
     },
     {
      "level": "**",
      "prefix": "16) (brengen)",
      "suffix": "jij de documentatie mee?",
      "answer": "Breng",
      "options": [
       "Breng",
       "Brengt",
       "Brengen"
      ]
     }
    ],
    "written": [
     {
      "prompt": "17) (Kijken) ... jullie goed naar het voorbeeld?",
      "answer": "Kijken"
     },
     {
      "prompt": "18) (vertrekken) Het vliegtuig ... met vertraging.",
      "answer": "vertrekt"
     },
     {
      "prompt": "19) (knoeien) ... je broertje met de puzzel?",
      "answer": "Knoeit"
     },
     {
      "prompt": "20) (poetsen) Dagelijks ... het meisje haar tanden.",
      "answer": "poetst"
     }
    ],
    "memory": [
     "Ik werk.",
     "Jij wordt.",
     "Word jij?",
     "Werken wij?",
     "Jij werkt.",
     "Jullie worden."
    ]
   },
   "2": {
    "explore": [
     {
      "verb": "SPELEN",
      "subjects": [
       {
        "group": 0,
        "text": "Ik ..."
       },
       {
        "group": 1,
        "text": "Jij ..."
       },
       {
        "group": 1,
        "text": "Hij ..."
       },
       {
        "group": 1,
        "text": "Het meisje ..."
       },
       {
        "group": 2,
        "text": "Wij ..."
       },
       {
        "group": 2,
        "text": "Jullie ..."
       },
       {
        "group": 2,
        "text": "... de leerlingen?"
       },
       {
        "group": 0,
        "text": "... je?"
       },
       {
        "group": 1,
        "text": "... je broer?"
       }
      ],
      "forms": [
       "speel",
       "speelt",
       "spelen"
      ]
     },
     {
      "verb": "ZIJN",
      "subjects": [
       {
        "group": 0,
        "text": "Ik ..."
       },
       {
        "group": 1,
        "text": "Jij ..."
       },
       {
        "group": 3,
        "text": "Hij ..."
       },
       {
        "group": 3,
        "text": "Het meisje ..."
       },
       {
        "group": 2,
        "text": "Wij ..."
       },
       {
        "group": 2,
        "text": "Jullie ..."
       },
       {
        "group": 2,
        "text": "... de leerlingen?"
       },
       {
        "group": 0,
        "text": "... je?"
       },
       {
        "group": 3,
        "text": "... je broer?"
       }
      ],
      "forms": [
       "ben",
       "bent",
       "zijn",
       "is"
      ]
     }
    ],
    "identify": [
     {
      "level": "*",
      "prompt": "Vul de zin aan: Het ... in de Ardennen.",
      "options": [
       "vries",
       "vriest",
       "vriezen"
      ],
      "correctIndex": 1
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: In de wei ... de koeien.",
      "options": [
       "graas",
       "graast",
       "grazen"
      ],
      "correctIndex": 2
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Dat ... ik niet te zeggen.",
      "options": [
       "durf",
       "durft",
       "durven"
      ],
      "correctIndex": 0
     },
     {
      "level": "**",
      "prompt": "Vul de zin aan: Zoiets ... je maar eenmaal.",
      "options": [
       "beleef",
       "beleeft",
       "beleven"
      ],
      "correctIndex": 2
     },
     {
      "level": "***",
      "prompt": "Vul de zin aan: ... jullie geregeld?",
      "options": [
       "lees",
       "leest",
       "lezen"
      ],
      "correctIndex": 2
     }
    ],
    "fillin": [
     {
      "level": "*",
      "prefix": "1) (hakken) Hoe",
      "suffix": "je deze blok in stukken?",
      "answer": "hak",
      "options": [
       "hak",
       "hakt",
       "hakken"
      ]
     },
     {
      "level": "*",
      "prefix": "2) (bewijzen) Dat",
      "suffix": "nog niets.",
      "answer": "bewijst",
      "options": [
       "bewijs",
       "bewijst",
       "bewijzen"
      ]
     },
     {
      "level": "*",
      "prefix": "3) (verbazen) Zijn gedrag",
      "suffix": "me!",
      "answer": "verbaast",
      "options": [
       "verbaas",
       "verbaast",
       "verbazen"
      ]
     },
     {
      "level": "*",
      "prefix": "4) (vertellen)",
      "suffix": "jij soms verhalen aan jouw zusje?",
      "answer": "Vertel",
      "options": [
       "Vertel",
       "Vertelt",
       "Vertellen"
      ]
     },
     {
      "level": "*",
      "prefix": "5) (reizen)",
      "suffix": "je papa veel met het vliegtuig?",
      "answer": "Reist",
      "options": [
       "Reis",
       "Reist",
       "Reizen"
      ]
     },
     {
      "level": "*",
      "prefix": "6) (schrijven) Vandaag",
      "suffix": "we onze brief.",
      "answer": "schrijven",
      "options": [
       "schrijf",
       "schrijft",
       "schrijven"
      ]
     },
     {
      "level": "*",
      "prefix": "7) (wijzen) De thermometer",
      "suffix": "21°C aan.",
      "answer": "wijst",
      "options": [
       "wijs",
       "wijst",
       "wijzen"
      ]
     },
     {
      "level": "*",
      "prefix": "8) (blijven) Hoe lang",
      "suffix": "je in Kortijk?",
      "answer": "blijf",
      "options": [
       "blijf",
       "blijft",
       "blijven"
      ]
     },
     {
      "level": "*",
      "prefix": "9) (verkiezen) Ik",
      "suffix": "hier te blijven.",
      "answer": "verkies",
      "options": [
       "verkies",
       "verkiest",
       "verkiezen"
      ]
     },
     {
      "level": "*",
      "prefix": "10) (bedenken)",
      "suffix": "jullie snel een raadseltje?",
      "answer": "Bedenken",
      "options": [
       "Bedenk",
       "Bedenkt",
       "Bedenken"
      ]
     },
     {
      "level": "*",
      "prefix": "11) (zwerven)",
      "suffix": "je neef nog steeds rond?",
      "answer": "Zwerft",
      "options": [
       "Zwerf",
       "Zwerft",
       "Zwerven"
      ]
     },
     {
      "level": "*",
      "prefix": "12) (schuiven) Ongemerkt",
      "suffix": "je naar me toe.",
      "answer": "schuif",
      "options": [
       "schuif",
       "schuift",
       "schuiven"
      ]
     },
     {
      "level": "**",
      "prefix": "13) (omhelzen) De winnaars",
      "suffix": "elkaar enthousiast.",
      "answer": "omhelzen",
      "options": [
       "omhels",
       "omhelst",
       "omhelzen"
      ]
     },
     {
      "level": "**",
      "prefix": "14) (verliezen)",
      "suffix": "jouw favoriete ploeg vaak?",
      "answer": "Verliest",
      "options": [
       "Verlies",
       "Verliest",
       "Verliezen"
      ]
     },
     {
      "level": "**",
      "prefix": "15) (verhuizen) Volgende maand",
      "suffix": "we.",
      "answer": "verhuizen",
      "options": [
       "verhuis",
       "verhuist",
       "verhuizen"
      ]
     },
     {
      "level": "**",
      "prefix": "16) (bedroeven) Dit nieuws",
      "suffix": "jou echt.",
      "answer": "bedroeft",
      "options": [
       "bedroef",
       "bedroeft",
       "bedroeven"
      ]
     }
    ],
    "written": [
     {
      "prompt": "17) (draven) Het paard ... op en neer.",
      "answer": "draaft"
     },
     {
      "prompt": "18) (begraven) Wanneer ... men de gestorvene?",
      "answer": "begraaft"
     },
     {
      "prompt": "19) (blazen) De wind ... fel in de zeilen.",
      "answer": "blaast"
     },
     {
      "prompt": "20) (eten) Hoeveel gram ... jouw honden?",
      "answer": "eten"
     }
    ],
    "memory": [
     "Ik speel.",
     "Jij bent.",
     "Ben jij?",
     "Spelen jullie?",
     "Zij is.",
     "Wij spelen."
    ]
   }
  }
 },
 "vt": {
  "title": "Verleden tijd",
  "schema": "schema-vt.png",
  "color": "#2563eb",
  "sets": {
   "1": {
    "explore": [
     {
      "verb": "WERKEN",
      "subjects": [
       {
        "group": 0,
        "text": "Ik ..."
       },
       {
        "group": 0,
        "text": "Jij ..."
       },
       {
        "group": 0,
        "text": "Hij ..."
       },
       {
        "group": 0,
        "text": "Het meisje ..."
       },
       {
        "group": 1,
        "text": "Wij ..."
       },
       {
        "group": 1,
        "text": "Jullie ..."
       },
       {
        "group": 1,
        "text": "... de leerlingen?"
       },
       {
        "group": 0,
        "text": "... je?"
       },
       {
        "group": 0,
        "text": "... je broer?"
       }
      ],
      "forms": [
       "werkte",
       "werkten"
      ]
     },
     {
      "verb": "WORDEN",
      "subjects": [
       {
        "group": 0,
        "text": "Ik ..."
       },
       {
        "group": 0,
        "text": "Jij ..."
       },
       {
        "group": 0,
        "text": "Hij ..."
       },
       {
        "group": 0,
        "text": "Het meisje ..."
       },
       {
        "group": 1,
        "text": "Wij ..."
       },
       {
        "group": 1,
        "text": "Jullie ..."
       },
       {
        "group": 1,
        "text": "... de leerlingen?"
       },
       {
        "group": 0,
        "text": "... je?"
       },
       {
        "group": 0,
        "text": "... je broer?"
       }
      ],
      "forms": [
       "werd",
       "werden"
      ]
     }
    ],
    "identify": [
     {
      "level": "**",
      "prompt": "Vul de zin aan: Wat ... jullie veel boeken!",
      "options": [
       "kocht",
       "kochten"
      ],
      "correctIndex": 1
     },
     {
      "level": "***",
      "prompt": "Vul de zin aan: Het weer ... .",
      "options": [
       "klaarde op",
       "klaarden op"
      ],
      "correctIndex": 0
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Mama ... de dokter.",
      "options": [
       "telefoneerde",
       "telefoneerden"
      ],
      "correctIndex": 0
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: ... jij ook mee?",
      "options": [
       "Speelde",
       "Speelden"
      ],
      "correctIndex": 0
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Elke morgen ... ik melk.",
      "options": [
       "dronk",
       "dronken"
      ],
      "correctIndex": 0
     }
    ],
    "fillin": [
     {
      "level": "*",
      "prefix": "1) (zien) Ik",
      "suffix": "niks.",
      "answer": "zag",
      "options": [
       "zag",
       "zagen"
      ]
     },
     {
      "level": "*",
      "prefix": "2) (komen) Hij",
      "suffix": "niet.",
      "answer": "kwam",
      "options": [
       "kwam",
       "kwamen"
      ]
     },
     {
      "level": "*",
      "prefix": "3) (uitstellen) Waarom",
      "suffix": "we de tocht uit?",
      "answer": "stelden",
      "options": [
       "stelde",
       "stelden"
      ]
     },
     {
      "level": "*",
      "prefix": "4) (trainen) 's Woendags",
      "suffix": "het elftal.",
      "answer": "trainde",
      "options": [
       "trainde",
       "trainden"
      ]
     },
     {
      "level": "*",
      "prefix": "5) (kruipen) Waarheen",
      "suffix": "het baby'tje?",
      "answer": "kroop",
      "options": [
       "kroop",
       "kropen"
      ]
     },
     {
      "level": "*",
      "prefix": "6) (vullen) Papa",
      "suffix": "de benzinetank.",
      "answer": "vulde",
      "options": [
       "vulde",
       "vulden"
      ]
     },
     {
      "level": "*",
      "prefix": "7) (stilleggen)",
      "suffix": "hij de motor stil?",
      "answer": "Legde",
      "options": [
       "Legde",
       "Legden"
      ]
     },
     {
      "level": "*",
      "prefix": "8) (wonen) Wie",
      "suffix": "hier?",
      "answer": "woonde",
      "options": [
       "woonde",
       "woonden"
      ]
     },
     {
      "level": "*",
      "prefix": "9) (vragen)",
      "suffix": "jij het aan onze leraar?",
      "answer": "Vroeg",
      "options": [
       "Vroeg",
       "Vroegen"
      ]
     },
     {
      "level": "*",
      "prefix": "10) (uitbarsten) De kinderen",
      "suffix": "in lachen uit.",
      "answer": "barstten",
      "options": [
       "barstte",
       "barstten"
      ]
     },
     {
      "level": "*",
      "prefix": "11) (menen)",
      "suffix": "jullie dat echt?",
      "answer": "Meenden",
      "options": [
       "Meende",
       "Meenden"
      ]
     },
     {
      "level": "*",
      "prefix": "12) (zeggen) Je",
      "suffix": "het me veel te laat.",
      "answer": "zei",
      "options": [
       "zei",
       "zeiden"
      ]
     },
     {
      "level": "**",
      "prefix": "13) (vertellen) Niemand",
      "suffix": "zulke onzin.",
      "answer": "vertelde",
      "options": [
       "vertelde",
       "vertelden"
      ]
     },
     {
      "level": "**",
      "prefix": "14) (bloeien) Wat",
      "suffix": "die plant mooi!",
      "answer": "bloeide",
      "options": [
       "bloeide",
       "bloeiden"
      ]
     },
     {
      "level": "**",
      "prefix": "15) (raken) Dat",
      "suffix": "me helemaal niet.",
      "answer": "raakte",
      "options": [
       "raakte",
       "raakten"
      ]
     },
     {
      "level": "**",
      "prefix": "16) (brengen)",
      "suffix": "jij de documentatie mee?",
      "answer": "Bracht",
      "options": [
       "Bracht",
       "Brachten"
      ]
     }
    ],
    "written": [
     {
      "prompt": "17) (Kijken) ... jullie goed naar het voorbeeld?",
      "answer": "Keken"
     },
     {
      "prompt": "18) (vertrekken) Het vliegtuig ... met vertraging.",
      "answer": "vertrok"
     },
     {
      "prompt": "19) (knoeien) ... je broertje met de puzzel?",
      "answer": "Knoeide"
     },
     {
      "prompt": "20) (poetsen) Dagelijks ... het meisje haar tanden.",
      "answer": "poetste"
     }
    ],
    "memory": [
     "Ik werkte.",
     "Jij werd.",
     "Wij werkten?",
     "De kinderen werden.",
     "Zij raadde(n).",
     "Jullie raadden."
    ]
   },
   "2": {
    "explore": [
     {
      "verb": "SPELEN",
      "subjects": [
       {
        "group": 0,
        "text": "Ik ..."
       },
       {
        "group": 0,
        "text": "Jij ..."
       },
       {
        "group": 0,
        "text": "Het meisje"
       },
       {
        "group": 1,
        "text": "De jongens"
       },
       {
        "group": 1,
        "text": "Wij ..."
       },
       {
        "group": 1,
        "text": "Jullie ..."
       }
      ],
      "forms": [
       "speelde",
       "speelden"
      ]
     },
     {
      "verb": "ZIJN",
      "subjects": [
       {
        "group": 0,
        "text": "Ik ..."
       },
       {
        "group": 0,
        "text": "Jij ..."
       },
       {
        "group": 0,
        "text": "Hij ..."
       },
       {
        "group": 0,
        "text": "Het meisje ..."
       },
       {
        "group": 1,
        "text": "Wij ..."
       },
       {
        "group": 1,
        "text": "Jullie ..."
       },
       {
        "group": 1,
        "text": "... de leerlingen?"
       },
       {
        "group": 0,
        "text": "... je?"
       },
       {
        "group": 0,
        "text": "... je broer?"
       }
      ],
      "forms": [
       "was",
       "waren"
      ]
     }
    ],
    "identify": [
     {
      "level": "*",
      "prompt": "Vul de zin aan: Het ... in de Ardennen.",
      "options": [
       "vroor",
       "vroren"
      ],
      "correctIndex": 0
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: In de wei ... de koeien.",
      "options": [
       "graasde",
       "graasden"
      ],
      "correctIndex": 1
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Dat ... ik niet te zeggen.",
      "options": [
       "durfde",
       "durfden"
      ],
      "correctIndex": 0
     },
     {
      "level": "**",
      "prompt": "Vul de zin aan: Zoiets ... je maar eenmaal.",
      "options": [
       "beleefde",
       "beleefden"
      ],
      "correctIndex": 0
     },
     {
      "level": "***",
      "prompt": "Vul de zin aan: ... jullie geregeld?",
      "options": [
       "las",
       "lazen"
      ],
      "correctIndex": 1
     }
    ],
    "fillin": [
     {
      "level": "*",
      "prefix": "1) (hakken) Hoe",
      "suffix": "je deze blok in stukken?",
      "answer": "hakte",
      "options": [
       "hakte",
       "hakten"
      ]
     },
     {
      "level": "*",
      "prefix": "2) (bewijzen) Dat",
      "suffix": "nog niets.",
      "answer": "bewees",
      "options": [
       "bewees",
       "bewezen"
      ]
     },
     {
      "level": "*",
      "prefix": "3) (verbazen) Zijn gedrag",
      "suffix": "me!",
      "answer": "verbaasde",
      "options": [
       "verbaasde",
       "verbaasden"
      ]
     },
     {
      "level": "*",
      "prefix": "4) (vertellen)",
      "suffix": "jij soms verhalen aan jouw zusje?",
      "answer": "Vertelde",
      "options": [
       "Vertelde",
       "Vertelden"
      ]
     },
     {
      "level": "*",
      "prefix": "5) (reizen)",
      "suffix": "je papa veel met het vliegtuig?",
      "answer": "Reisde",
      "options": [
       "Reisde",
       "Reisden"
      ]
     },
     {
      "level": "*",
      "prefix": "6) (schrijven) Onlangs",
      "suffix": "we onze brief.",
      "answer": "schreven",
      "options": [
       "schreef",
       "schreven"
      ]
     },
     {
      "level": "*",
      "prefix": "7) (wijzen) De thermometer",
      "suffix": "21°C aan.",
      "answer": "wees",
      "options": [
       "wees",
       "wezen"
      ]
     },
     {
      "level": "*",
      "prefix": "8) (blijven) Hoe lang",
      "suffix": "je in Kortijk?",
      "answer": "bleef",
      "options": [
       "bleef",
       "bleven"
      ]
     },
     {
      "level": "*",
      "prefix": "9) (verkiezen) Ik",
      "suffix": "hier te blijven.",
      "answer": "verkoos",
      "options": [
       "verkoos",
       "verkozen"
      ]
     },
     {
      "level": "*",
      "prefix": "10) (bedenken)",
      "suffix": "jullie snel een raadseltje?",
      "answer": "Bedachten",
      "options": [
       "Bedacht",
       "Bedachten"
      ]
     },
     {
      "level": "*",
      "prefix": "11) (zwerven)",
      "suffix": "je neef nog steeds rond?",
      "answer": "Zwerfde",
      "options": [
       "Zwerfde",
       "Zwerfden"
      ]
     },
     {
      "level": "*",
      "prefix": "12) (schuiven) Ongemerkt",
      "suffix": "je naar me toe.",
      "answer": "schoof",
      "options": [
       "schoof",
       "schoven"
      ]
     },
     {
      "level": "**",
      "prefix": "13) (omhelzen) De winnaars",
      "suffix": "elkaar enthousiast.",
      "answer": "omhelsden",
      "options": [
       "omhelsde",
       "omhelsden"
      ]
     },
     {
      "level": "**",
      "prefix": "14) (verliezen)",
      "suffix": "jouw favoriete ploeg vaak?",
      "answer": "Verloor",
      "options": [
       "Verloor",
       "Verloren"
      ]
     },
     {
      "level": "**",
      "prefix": "15) (verhuizen) Vorige maand",
      "suffix": "we.",
      "answer": "verhuisden",
      "options": [
       "verhuisde",
       "verhuisden"
      ]
     },
     {
      "level": "**",
      "prefix": "16) (bedroeven) Dit nieuws",
      "suffix": "jou echt.",
      "answer": "bedroefde",
      "options": [
       "bedroefde",
       "bedroefden"
      ]
     }
    ],
    "written": [
     {
      "prompt": "17) (draven) Het paard ... op en neer.",
      "answer": "draafde"
     },
     {
      "prompt": "18) (begraven) Wanneer ... men de gestorvene?",
      "answer": "begroef"
     },
     {
      "prompt": "19) (blazen) De wind ... fel in de zeilen.",
      "answer": "blies"
     },
     {
      "prompt": "20) (eten) Hoeveel gram ... jouw honden?",
      "answer": "aten"
     }
    ],
    "memory": [
     "Ik speelde.",
     "Jij was.",
     "Was jij?",
     "Speelden jullie?",
     "Zij waren.",
     "Wij speelden."
    ]
   }
  }
 },
 "geenpv": {
  "title": "Geen persoonsvorm",
  "schema": "schema-geenpv.png",
  "color": "#d97706",
  "sets": {
   "1": {
    "explore": [
     {
      "verb": null,
      "subjects": [
       {
        "group": 0,
        "text": "(werken)"
       },
       {
        "group": 1,
        "text": "(maken)"
       },
       {
        "group": 2,
        "text": "(spelen)"
       },
       {
        "group": 4,
        "text": "(geven) "
       },
       {
        "group": 3,
        "text": "(bouwen)"
       },
       {
        "group": 5,
        "text": "(bevestigen)"
       }
      ],
      "forms": [
       "gewerkt",
       "gemaakt",
       "gespeeld",
       "gebouwd",
       "gegeven",
       "bevestigd"
      ]
     },
     {
      "verb": null,
      "subjects": [
       {
        "group": 0,
        "text": "(gaan)"
       },
       {
        "group": 1,
        "text": "(worden)"
       },
       {
        "group": 2,
        "text": "(botsen) "
       },
       {
        "group": 3,
        "text": "(verhuizen)"
       },
       {
        "group": 4,
        "text": "(overtreffen) "
       },
       {
        "group": 5,
        "text": "(verbreden) "
       }
      ],
      "forms": [
       "gegaan",
       "geworden",
       "gebotst",
       "verhuisd",
       "overtroffen",
       "verbreed"
      ]
     }
    ],
    "identify": [
     {
      "level": "**",
      "prompt": "Vul de zin aan: Wat hebben jullie veel boeken ...!",
      "options": [
       "kochten",
       "gekocht",
       "kopen"
      ],
      "correctIndex": 1
     },
     {
      "level": "***",
      "prompt": "Vul de zin aan: Het weer is ... .",
      "options": [
       "klaarde op",
       "klaart op",
       "opgeklaard"
      ],
      "correctIndex": 2
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Mama heeft de dokter... .",
      "options": [
       "telefoneerde",
       "telefoneert",
       "getelefoneerd"
      ],
      "correctIndex": 2
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Heb jij ook ...?",
      "options": [
       "gespeeld",
       "speelt",
       "spelen"
      ],
      "correctIndex": 0
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Vorige week heb ik melk ... .",
      "options": [
       "dronk",
       "drinkt",
       "gedronken"
      ],
      "correctIndex": 2
     }
    ],
    "fillin": [
     {
      "level": "*",
      "prefix": "1) (beweren) Ik heb niks",
      "suffix": ".",
      "answer": "beweerd",
      "options": [
       "beweer",
       "beweerd",
       "beweren"
      ]
     },
     {
      "level": "*",
      "prefix": "2) (komen) Hij is vandaag niet",
      "suffix": ".",
      "answer": "gekomen",
      "options": [
       "komt",
       "kwam",
       "gekomen",
       "kom"
      ]
     },
     {
      "level": "*",
      "prefix": "3) (uitstellen) Waarom hebben we de tocht",
      "suffix": "?",
      "answer": "uitgesteld",
      "options": [
       "uitstellen",
       "uitgesteld",
       "stelt uit",
       "stelde uit"
      ]
     },
     {
      "level": "*",
      "prefix": "4) (trainen) 's Woendags heeft het elftal",
      "suffix": ".",
      "answer": "getraind",
      "options": [
       "getraind",
       "trainde",
       "trainen",
       "traint"
      ]
     },
     {
      "level": "*",
      "prefix": "5) (kruipen) Waarheen is het baby'tje",
      "suffix": "?",
      "answer": "gekropen",
      "options": [
       "kruipt",
       "kroop",
       "kropen",
       "gekropen"
      ]
     },
     {
      "level": "*",
      "prefix": "6) (vullen) Papa heeft de benzinetank",
      "suffix": ".",
      "answer": "gevuld",
      "options": [
       "vulde",
       "gevuld",
       "vult",
       "vullen"
      ]
     },
     {
      "level": "*",
      "prefix": "7) (stilleggen) Heeft hij de motor",
      "suffix": "?",
      "answer": "stilgelegd",
      "options": [
       "stilgelegd",
       "legde stil",
       "stilleggen",
       "legt stil"
      ]
     },
     {
      "level": "*",
      "prefix": "8) (wonen) Wie heeft hier",
      "suffix": "?",
      "answer": "gewoond",
      "options": [
       "wonen",
       "woonde",
       "woont",
       "gewoond"
      ]
     },
     {
      "level": "*",
      "prefix": "9) (vragen) Heb jij het aan onze leraar",
      "suffix": "?",
      "answer": "gevraagd",
      "options": [
       "vraag",
       "vroeg",
       "vragen",
       "gevraagd",
       "vroegen"
      ]
     },
     {
      "level": "*",
      "prefix": "10) (uitbarsten) De kinderen zijn in lachen",
      "suffix": ".",
      "answer": "uitgebarsten",
      "options": [
       "barstten uit",
       "barsten uit",
       "uitgebarsten",
       "barst uit"
      ]
     },
     {
      "level": "*",
      "prefix": "11) (menen) Hebben jullie dat echt",
      "suffix": "?",
      "answer": "gemeend",
      "options": [
       "menen",
       "gemeend",
       "meenden"
      ]
     },
     {
      "level": "*",
      "prefix": "12) (zeggen) Je hebt het me veel te laat",
      "suffix": ".",
      "answer": "gezegd",
      "options": [
       "gezegd",
       "zegt",
       "zei",
       "zeggen"
      ]
     },
     {
      "level": "**",
      "prefix": "13) (vertellen) Niemand heeft zulke onzin",
      "suffix": ".",
      "answer": "verteld",
      "options": [
       "vertelt",
       "vertelde",
       "verteld",
       "vertellen",
       "vertelden"
      ]
     },
     {
      "level": "**",
      "prefix": "14) (bloeien) Wat heeft die plant mooi",
      "suffix": "!",
      "answer": "gebloeid",
      "options": [
       "bloeide",
       "bloeit",
       "gebloeid",
       "bloeien",
       "bloeiden"
      ]
     },
     {
      "level": "**",
      "prefix": "15) (raken) Dat heeft me helemaal niet",
      "suffix": ".",
      "answer": "geraakt",
      "options": [
       "raakte",
       "geraakt",
       "raakt",
       "raken",
       "raakten"
      ]
     },
     {
      "level": "**",
      "prefix": "16) (brengen) Heb jij de documentatie",
      "suffix": "?",
      "answer": "meegebracht",
      "options": [
       "meebrengen",
       "bracht mee",
       "brengt mee",
       "meegebracht",
       "brachten mee"
      ]
     }
    ],
    "written": [
     {
      "prompt": "17) (Kijken) Hebben jullie goed naar het voorbeeld ...?",
      "answer": "gekeken"
     },
     {
      "prompt": "18) (vertrekken) Het vliegtuig is met vertraging ... .",
      "answer": "vertrokken"
     },
     {
      "prompt": "19) (knoeien) Heeft je broertje met de puzzel ...?",
      "answer": "geknoeid"
     },
     {
      "prompt": "20) (poetsen) Het meisje heeft haar tanden ... .",
      "answer": "gepoetst"
     }
    ],
    "memory": [
     "Ik heb gebotst.",
     "Jij hebt gebouwd.",
     "Zij hebben gemaakt.",
     "Wij zijn verhuisd.",
     "Jij bent gegaan.",
     "Jullie zijn gevraagd."
    ]
   },
   "2": {
    "explore": [
     {
      "verb": null,
      "subjects": [
       {
        "group": 0,
        "text": "(spelen)"
       },
       {
        "group": 1,
        "text": "(denken)"
       },
       {
        "group": 2,
        "text": "(durven)"
       },
       {
        "group": 3,
        "text": "(lezen) "
       },
       {
        "group": 4,
        "text": "(bewijzen)"
       },
       {
        "group": 5,
        "text": "(blazen)"
       }
      ],
      "forms": [
       "gespeeld",
       "gedacht",
       "gedurfd",
       "gelezen",
       "bewezen",
       "geblazen"
      ]
     },
     {
      "verb": null,
      "subjects": [
       {
        "group": 0,
        "text": "(omhelzen)"
       },
       {
        "group": 1,
        "text": "(verkiezen)"
       },
       {
        "group": 2,
        "text": "(blijven) "
       },
       {
        "group": 3,
        "text": "(verbazen)"
       },
       {
        "group": 4,
        "text": "(verliezen) "
       },
       {
        "group": 5,
        "text": "(zijn) "
       }
      ],
      "forms": [
       "omhelsd",
       "verkozen",
       "gebleven",
       "verbaasd",
       "verloren",
       "geweest"
      ]
     }
    ],
    "identify": [
     {
      "level": "**",
      "prompt": "Vul de zin aan: Zoiets heb je maar eenmaal ...!",
      "options": [
       "beleeft",
       "beleven",
       "beleefd"
      ],
      "correctIndex": 2
     },
     {
      "level": "***",
      "prompt": "Vul de zin aan: Hebben juliie dat ... ?",
      "options": [
       "gelezen",
       "lezen",
       "lazen"
      ],
      "correctIndex": 0
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Het heeft in de Ardennen ... .",
      "options": [
       "vroor",
       "vriest",
       "gevroren"
      ],
      "correctIndex": 2
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: In de wei hebben de koeien ... .",
      "options": [
       "graast",
       "grazen",
       "gegraasd"
      ],
      "correctIndex": 2
     },
     {
      "level": "*",
      "prompt": "Vul de zin aan: Dat heb ik niet ... .",
      "options": [
       "durft",
       "durfde",
       "gedurfd"
      ],
      "correctIndex": 2
     }
    ],
    "fillin": [
     {
      "level": "*",
      "prefix": "1) (hakken) Hoe heb je deze blok in stukken",
      "suffix": "?",
      "answer": "gehakt",
      "options": [
       "hakt",
       "hakte",
       "hakken",
       "hakten",
       "gehakt"
      ]
     },
     {
      "level": "*",
      "prefix": "2) (bewijzen) Hij heeft nog niets",
      "suffix": ".",
      "answer": "bewezen",
      "options": [
       "bewijst",
       "bewijzen",
       "bewezen",
       "bewees",
       "bewijs"
      ]
     },
     {
      "level": "*",
      "prefix": "3) (verbazen) Zijn gedrag heeft me",
      "suffix": "!",
      "answer": "verbaasd",
      "options": [
       "verbaas",
       "verbaast",
       "verbaasd",
       "verbaasde",
       "verbaasden"
      ]
     },
     {
      "level": "*",
      "prefix": "4) (vertellen) Heb jij soms verhalen aan jouw zusje",
      "suffix": "?",
      "answer": "verteld",
      "options": [
       "vertelde",
       "vertelt",
       "verteld",
       "vertellen",
       "vertelden"
      ]
     },
     {
      "level": "*",
      "prefix": "5) (reizen) Heeft je papa veel met het vliegtuig",
      "suffix": "?",
      "answer": "gereisd",
      "options": [
       "reis",
       "reisde",
       "gereisd",
       "reist",
       "reizen",
       "reisden"
      ]
     },
     {
      "level": "*",
      "prefix": "6) (schrijven) Vorige week hebben we onze brief",
      "suffix": ".",
      "answer": "geschreven",
      "options": [
       "schrijven",
       "geschreven",
       "schreef",
       "schrijf",
       "schrijft",
       "schreven"
      ]
     },
     {
      "level": "*",
      "prefix": "7) (aanwijzen) De thermometer heeft 21°C",
      "suffix": ".",
      "answer": "aangewezen",
      "options": [
       "aangewezen",
       "wees aan",
       "wijst aan",
       "wijzen aan",
       "wezen aan"
      ]
     },
     {
      "level": "*",
      "prefix": "8) (blijven) Hoe lang ben je in Kortijk",
      "suffix": "?",
      "answer": "gebleven",
      "options": [
       "blijven",
       "bleven",
       "blijft",
       "bleef",
       "gebleven"
      ]
     },
     {
      "level": "*",
      "prefix": "9) (verkiezen) Ik heb",
      "suffix": "om hier te blijven.",
      "answer": "verkozen",
      "options": [
       "verkoos",
       "verkies",
       "verkozen",
       "verkiest",
       "verkiezen"
      ]
     },
     {
      "level": "*",
      "prefix": "10) (bedenken) Hebben jullie snel een raadseltje",
      "suffix": "?",
      "answer": "bedacht",
      "options": [
       "bedachten",
       "bedacht",
       "bedenken",
       "bedenk"
      ]
     },
     {
      "level": "*",
      "prefix": "11) (rondzwerven) Heeft je neef nog",
      "suffix": "?",
      "answer": "rondgezworven",
      "options": [
       "rondgezworven",
       "rondzwerven",
       "zwerfden rond",
       "zwerft rond"
      ]
     },
     {
      "level": "*",
      "prefix": "12) (schuiven) Ongemerkt ben je naar me toe",
      "suffix": ".",
      "answer": "geschoven",
      "options": [
       "schuif",
       "schoof",
       "geschoven",
       "schuift",
       "schoven"
      ]
     },
     {
      "level": "**",
      "prefix": "13) (omhelzen) De winnaars hebben elkaar enthousiast",
      "suffix": ".",
      "answer": "omhelsd",
      "options": [
       "omhelst",
       "omhelsd",
       "omhelzen",
       "omhelsden"
      ]
     },
     {
      "level": "**",
      "prefix": "14) (verliezen) Heeft jouw favoriete ploeg",
      "suffix": "?",
      "answer": "verloren",
      "options": [
       "verloren",
       "verloor",
       "verliest",
       "verlies",
       "verliezen"
      ]
     },
     {
      "level": "**",
      "prefix": "15) (verhuizen) Vorige maand zijn we",
      "suffix": ".",
      "answer": "verhuisd",
      "options": [
       "verhuis",
       "verhuist",
       "verhuisde",
       "verhuizen",
       "verhuisden",
       "verhuisd"
      ]
     },
     {
      "level": "**",
      "prefix": "16) (bedroeven) Dit nieuws heeft jou echt",
      "suffix": ".",
      "answer": "bedroefd",
      "options": [
       "bedroefde",
       "bedroeven",
       "bedroef",
       "bedroefd",
       "bedroeft"
      ]
     }
    ],
    "written": [
     {
      "prompt": "17) (draven) Het paard heeft veel ... .",
      "answer": "gedraafd"
     },
     {
      "prompt": "18) (begraven) Wanneer heeft men de gestorvene ... ?",
      "answer": "begraven"
     },
     {
      "prompt": "19) (blazen) De wind heeft fel ... in de zeilen.",
      "answer": "geblazen"
     },
     {
      "prompt": "20) (eten) Hoeveel gram hebben jouw honden ... ?",
      "answer": "gegeten"
     }
    ],
    "memory": [
     "Ik heb gespeeld.",
     "Jij hebt geblazen.",
     "Zij hebben gedacht.",
     "Wij zijn verkozen.",
     "Jij bent geweest.",
     "Jullie zijn gebleven."
    ]
   }
  }
 }
};
