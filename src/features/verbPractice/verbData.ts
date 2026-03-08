import { Verb } from "./types";

export const VERBS: Verb[] = [
  {
    "id": "haben",
    "german": "haben",
    "level": "A1",
    "glosses": [
      "to have",
      "to possess"
    ],
    "conjugations": {
      "praesens": {
        "ich": "habe",
        "du": "habst",
        "er": "habt",
        "sie": "habt",
        "es": "habt",
        "wir": "haben",
        "ihr": "habt",
        "Sie": "haben"
      },
      "perfekt": {
        "ich": "habe gehabt",
        "du": "hast gehabt",
        "er": "hat gehabt",
        "sie": "hat gehabt",
        "es": "hat gehabt",
        "wir": "haben gehabt",
        "ihr": "habt gehabt",
        "Sie": "haben gehabt"
      }
    },
    "separable": false,
    "auxiliary": "haben",
    "irregular": true,
    "valency": {
      "object": "akkusativ"
    },
    "examples": [
      {
        "german": "Ich habe ein Buch",
        "english": "I have a book"
      }
    ]
  },
  {
    "id": "machen",
    "german": "machen",
    "level": "A1",
    "glosses": [
      "to make",
      "to do"
    ],
    "conjugations": {
      "praesens": {
        "ich": "mache",
        "du": "machst",
        "er": "macht",
        "sie": "macht",
        "es": "macht",
        "wir": "machen",
        "ihr": "macht",
        "Sie": "machen"
      },
      "perfekt": {
        "ich": "habe gemacht",
        "du": "hast gemacht",
        "er": "hat gemacht",
        "sie": "hat gemacht",
        "es": "hat gemacht",
        "wir": "haben gemacht",
        "ihr": "habt gemacht",
        "Sie": "haben gemacht"
      },
      "praeteritum": {
        "ich": "machte",
        "du": "machtest",
        "er": "machte",
        "sie": "machte",
        "es": "machte",
        "wir": "machten",
        "ihr": "machtet",
        "Sie": "machten"
      }
    },
    "separable": false,
    "auxiliary": "haben",
    "irregular": false,
    "valency": {
      "object": "akkusativ"
    },
    "examples": [
      {
        "german": "Ich mache meine Hausaufgaben",
        "english": "I do my homework"
      }
    ]
  },
  {
    "id": "gehen",
    "german": "gehen",
    "level": "A1",
    "glosses": [
      "to go",
      "to walk"
    ],
    "conjugations": {
      "praesens": {
        "ich": "gehe",
        "du": "gehst",
        "er": "geht",
        "sie": "geht",
        "es": "geht",
        "wir": "gehen",
        "ihr": "geht",
        "Sie": "gehen"
      },
      "perfekt": {
        "ich": "bin gegangen",
        "du": "bist gegangen",
        "er": "ist gegangen",
        "sie": "ist gegangen",
        "es": "ist gegangen",
        "wir": "sind gegangen",
        "ihr": "seid gegangen",
        "Sie": "sind gegangen"
      }
    },
    "separable": false,
    "auxiliary": "sein",
    "irregular": true,
    "examples": [
      {
        "german": "Ich gehe nach Hause",
        "english": "I go home"
      }
    ]
  },
  {
    "id": "können",
    "german": "können",
    "level": "A1",
    "glosses": [
      "can",
      "to be able to"
    ],
    "conjugations": {
      "praesens": {
        "ich": "könne",
        "du": "könnst",
        "er": "könnt",
        "sie": "könnt",
        "es": "könnt",
        "wir": "können",
        "ihr": "könnt",
        "Sie": "können"
      },
      "perfekt": {
        "ich": "habe gekönnt",
        "du": "hast gekönnt",
        "er": "hat gekönnt",
        "sie": "hat gekönnt",
        "es": "hat gekönnt",
        "wir": "haben gekönnt",
        "ihr": "habt gekönnt",
        "Sie": "haben gekönnt"
      }
    },
    "separable": false,
    "auxiliary": "haben",
    "irregular": true,
    "examples": [
      {
        "german": "Ich kann Deutsch sprechen",
        "english": "I can speak German"
      }
    ]
  },
  {
    "id": "müssen",
    "german": "müssen",
    "level": "A1",
    "glosses": [
      "must",
      "to have to"
    ],
    "conjugations": {
      "praesens": {
        "ich": "müsse",
        "du": "müssst",
        "er": "müsst",
        "sie": "müsst",
        "es": "müsst",
        "wir": "müssen",
        "ihr": "müsst",
        "Sie": "müssen"
      },
      "perfekt": {
        "ich": "habe gemüsst",
        "du": "hast gemüsst",
        "er": "hat gemüsst",
        "sie": "hat gemüsst",
        "es": "hat gemüsst",
        "wir": "haben gemüsst",
        "ihr": "habt gemüsst",
        "Sie": "haben gemüsst"
      }
    },
    "separable": false,
    "auxiliary": "haben",
    "irregular": true,
    "examples": [
      {
        "german": "Ich muss heute arbeiten",
        "english": "I must work today"
      }
    ]
  },
  {
    "id": "sollen",
    "german": "sollen",
    "level": "A1",
    "glosses": [
      "should",
      "to be supposed to"
    ],
    "conjugations": {
      "praesens": {
        "ich": "solle",
        "du": "sollst",
        "er": "sollt",
        "sie": "sollt",
        "es": "sollt",
        "wir": "sollen",
        "ihr": "sollt",
        "Sie": "sollen"
      },
      "perfekt": {
        "ich": "habe gesollt",
        "du": "hast gesollt",
        "er": "hat gesollt",
        "sie": "hat gesollt",
        "es": "hat gesollt",
        "wir": "haben gesollt",
        "ihr": "habt gesollt",
        "Sie": "haben gesollt"
      }
    },
    "separable": false,
    "auxiliary": "haben",
    "irregular": true,
    "examples": [
      {
        "german": "Ich soll mehr lernen",
        "english": "I should study more"
      }
    ]
  }
];
