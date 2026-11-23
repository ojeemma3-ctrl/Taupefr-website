// Every official or trusted link used in TaupeFR lives here.
//
// RULE: `lastChecked` stays null until Emmanuel has opened the link himself
// and confirmed it. While it is null, the site shows
// "Last checked: to be confirmed". Never fill in a date he hasn't confirmed.

export type Source = {
  name: string;
  /** Empty when the exact page still has to be found. */
  url: string;
  /** "YYYY-MM-DD" once Emmanuel has checked it; null until then. */
  lastChecked: string | null;
  /** Official body, or a private/commercial service. */
  kind: "official" | "platform";
};

export const sources = {
  crousHousing: {
    name: "CROUS housing",
    url: "https://trouverunlogement.lescrous.fr",
    lastChecked: null,
    kind: "official",
  },
  crousBordeaux: {
    name: "CROUS Bordeaux-Aquitaine",
    url: "https://www.crous-bordeaux.fr",
    lastChecked: null,
    kind: "official",
  },
  studapart: {
    name: "Studapart",
    url: "https://www.studapart.com",
    lastChecked: null,
    kind: "platform",
  },
  landlordDocuments: {
    name: "Service-Public: documents a landlord may ask for",
    url: "https://www.service-public.fr/particuliers/vosdroits/F1169",
    lastChecked: null,
    kind: "official",
  },
  visale: {
    name: "Visale (guarantor scheme)",
    url: "https://www.visale.fr",
    lastChecked: null,
    kind: "official",
  },
  housingScams: {
    name: "Service-Public: housing scam guidance",
    url: "",
    lastChecked: null,
    kind: "official",
  },
  franceVisas: {
    name: "France-Visas",
    url: "https://france-visas.gouv.fr",
    lastChecked: null,
    kind: "official",
  },
  campusFrance: {
    name: "Campus France",
    url: "https://www.campusfrance.org/en",
    lastChecked: null,
    kind: "official",
  },
  etudesEnFrance: {
    name: "Études en France",
    url: "https://pastel.diplomatie.gouv.fr/etudesenfrance",
    lastChecked: null,
    kind: "official",
  },
  costOfLiving: {
    name: "Campus France: cost of living",
    url: "https://www.campusfrance.org/en/cost-of-living-in-France",
    lastChecked: null,
    kind: "official",
  },
  cvec: {
    name: "CVEC (student life fee)",
    url: "https://cvec.etudiant.gouv.fr",
    lastChecked: null,
    kind: "official",
  },
  tbm: {
    name: "TBM (Bordeaux public transport)",
    url: "https://www.infotbm.com",
    lastChecked: null,
    kind: "platform",
  },
  uBordeaux: {
    name: "University of Bordeaux",
    url: "https://www.u-bordeaux.com",
    lastChecked: null,
    kind: "official",
  },
  uBordeauxMontaigne: {
    name: "Bordeaux Montaigne University",
    url: "https://www.u-bordeaux-montaigne.fr",
    lastChecked: null,
    kind: "official",
  },
  anef: {
    name: "ANEF (online services for foreign nationals)",
    url: "https://administration-etrangers-en-france.interieur.gouv.fr",
    lastChecked: null,
    kind: "official",
  },
  bankAccountRight: {
    name: "Banque de France: right to a bank account",
    url: "https://www.banque-france.fr",
    lastChecked: null,
    kind: "official",
  },
  ameliStudents: {
    name: "Ameli: foreign students",
    url: "https://etudiant-etranger.ameli.fr",
    lastChecked: null,
    kind: "official",
  },
  ameliEhic: {
    name: "Ameli: European Health Insurance Card",
    url: "https://www.ameli.fr",
    lastChecked: null,
    kind: "official",
  },
  ameliDoctor: {
    name: "Ameli: choosing a doctor (médecin traitant)",
    url: "https://www.ameli.fr",
    lastChecked: null,
    kind: "official",
  },
  caf: {
    name: "CAF (housing aid)",
    url: "https://www.caf.fr",
    lastChecked: null,
    kind: "official",
  },
  studentLife: {
    name: "University student life page",
    url: "",
    lastChecked: null,
    kind: "official",
  },
  languageCentre: {
    name: "University language centre",
    url: "",
    lastChecked: null,
    kind: "official",
  },
  emergencyNumbers: {
    name: "Service-Public: emergency numbers",
    url: "",
    lastChecked: null,
    kind: "official",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;

export function lastCheckedLabel(source: Source): string {
  return source.lastChecked
    ? `Last checked: ${source.lastChecked}`
    : "Last checked: to be confirmed";
}
