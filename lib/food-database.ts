import type { SupportedLocale } from "@/lib/i18n";

export type PlantCategory =
  | "vegetable" // 🥦
  | "fruit" // 🍎
  | "nut" // 🌰
  | "legume" // 🫘
  | "grain" // 🌾
  | "fungi" // 🍄
  | "herb"; // 🌿

export type FoodTag =
  | "cruciferous"
  | "antioxidant"
  | "detox"
  | "prebiotic"
  | "fiber"
  | "omega3"
  | "fermented"
  | "polyphenols";

export type LocalizedNames = Partial<Record<SupportedLocale, string>>;

export interface FoodItem {
  id: string;
  name: string;
  category: PlantCategory;
  emoji: string;
  color: string;
  pniBenefits: string;
  tags: FoodTag[];
  translations?: LocalizedNames;
}

export const CATEGORY_EMOJI: Record<PlantCategory, string> = {
  vegetable: "🥦",
  fruit: "🍎",
  nut: "🌰",
  legume: "🫘",
  grain: "🌾",
  fungi: "🍄",
  herb: "🌿",
};

export function normalizeFoodName(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Map of normalized synonym -> canonical normalized name
export const synonymsMap: Record<string, string> = {
  // Spanish regionalisms
  [normalizeFoodName("palta")]: normalizeFoodName("aguacate"),
  [normalizeFoodName("avocado")]: normalizeFoodName("aguacate"),
  [normalizeFoodName("porotos")]: normalizeFoodName("alubias"),
  [normalizeFoodName("frijoles")]: normalizeFoodName("alubias"),
  [normalizeFoodName("judias")]: normalizeFoodName("alubias"),
  [normalizeFoodName("batata")]: normalizeFoodName("boniato"),
  [normalizeFoodName("camote")]: normalizeFoodName("boniato"),
  [normalizeFoodName("choclo")]: normalizeFoodName("maiz"),
  [normalizeFoodName("elote")]: normalizeFoodName("maiz"),

  // English to Spanish
  [normalizeFoodName("kale")]: normalizeFoodName("col rizada"),
  [normalizeFoodName("broccoli")]: normalizeFoodName("brocoli"),
  [normalizeFoodName("chickpeas")]: normalizeFoodName("garbanzos"),
  [normalizeFoodName("lentils")]: normalizeFoodName("lentejas"),
  [normalizeFoodName("oats")]: normalizeFoodName("avena"),
  [normalizeFoodName("blueberries")]: normalizeFoodName("arandanos"),
};

export const FOODS: FoodItem[] = [
  {
    id: "brocoli",
    name: "Brócoli",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#2f855a",
    pniBenefits:
      "Crucífera rica en fibra, sulforafano y antioxidantes que favorecen la detoxificación hepática y modulan positivamente la microbiota.",
    tags: ["cruciferous", "detox", "fiber", "antioxidant"],
    translations: {
      en: "Broccoli",
      fr: "Brocoli",
      it: "Broccolo",
      de: "Brokkoli",
      pt: "Brócolis",
    },
  },
  {
    id: "raiz-achicoria",
    name: "Raíz de achicoria",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#b7791f",
    pniBenefits:
      "Riquísima en inulina, un prebiótico que alimenta selectivamente a bacterias beneficiosas.",
    tags: ["prebiotic", "fiber"],
    translations: {
      en: "Chicory root",
    },
  },
  {
    id: "alcachofa-jerusalen",
    name: "Alcachofa de Jerusalén",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#9f7aea",
    pniBenefits:
      "Tuber prebiótico muy rico en inulina que incrementa la producción de ácidos grasos de cadena corta.",
    tags: ["prebiotic", "fiber"],
    translations: {
      en: "Jerusalem artichoke",
    },
  },
  {
    id: "cebada",
    name: "Cebada",
    category: "grain",
    emoji: CATEGORY_EMOJI.grain,
    color: "#d69e2e",
    pniBenefits:
      "Cereal con betaglucanos y fibra que actúa como prebiótico y ayuda al control glucémico.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Barley",
    },
  },
  {
    id: "algas-marinas",
    name: "Algas marinas",
    category: "vegetable",
    emoji: "🌊",
    color: "#2c7a7b",
    pniBenefits:
      "Ricas en fibras solubles y minerales que apoyan la microbiota y el metabolismo tiroideo.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Seaweed",
    },
  },
  {
    id: "diente-de-leon",
    name: "Hojas de diente de león",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#68d391",
    pniBenefits:
      "Hojas amargas ricas en fibra y compuestos detox que favorecen hígado y microbiota.",
    tags: ["fiber", "prebiotic", "detox"],
    translations: {
      en: "Dandelion greens",
    },
  },
  {
    id: "legumbres-mixtas",
    name: "Legumbres mixtas",
    category: "legume",
    emoji: CATEGORY_EMOJI.legume,
    color: "#c05621",
    pniBenefits:
      "Mezcla de lentejas, garbanzos y alubias: gran aporte de fibra fermentable y proteína vegetal.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Mixed legumes",
    },
  },
  {
    id: "guisantes-verdes",
    name: "Guisantes verdes",
    category: "legume",
    emoji: CATEGORY_EMOJI.legume,
    color: "#48bb78",
    pniBenefits:
      "Aportan fibra y almidón resistente que nutre la microbiota y ayuda al control glucémico.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Green peas",
    },
  },
  {
    id: "col-rizada",
    name: "Col rizada (kale)",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#22543d",
    pniBenefits:
      "Aporta fibra, carotenoides y polifenoles que apoyan la salud cerebrovascular e inmunitaria.",
    tags: ["cruciferous", "fiber", "antioxidant", "polyphenols"],
    translations: {
      en: "Kale",
      fr: "Chou frisé (kale)",
      it: "Cavolo riccio (kale)",
      de: "Grünkohl (Kale)",
      pt: "Couve kale",
    },
  },
  {
    id: "yogur-fermentado",
    name: "Yogur con cultivos vivos",
    category: "grain",
    emoji: "🥛",
    color: "#edf2f7",
    pniBenefits:
      "Fuente clásica de probióticos lácteos que refuerzan la barrera intestinal.",
    tags: ["fermented"],
    translations: {
      en: "Yogurt with live cultures",
    },
  },
  {
    id: "kefir",
    name: "Kéfir",
    category: "grain",
    emoji: "🥛",
    color: "#e2e8f0",
    pniBenefits:
      "Bebida fermentada rica en probióticos diversos que modulan el eje intestino‑cerebro.",
    tags: ["fermented"],
    translations: {
      en: "Kefir",
    },
  },
  {
    id: "miso",
    name: "Miso",
    category: "legume",
    emoji: "🥣",
    color: "#b7791f",
    pniBenefits:
      "Pasta de soja fermentada fuente de probióticos y compuestos umami beneficiosos.",
    tags: ["fermented"],
    translations: {
      en: "Miso",
    },
  },
  {
    id: "tempeh",
    name: "Tempeh",
    category: "legume",
    emoji: "🧊",
    color: "#ecc94b",
    pniBenefits:
      "Soja fermentada con alto contenido en proteína y probióticos que favorecen la microbiota.",
    tags: ["fermented"],
    translations: {
      en: "Tempeh",
    },
  },
  {
    id: "kombucha",
    name: "Kombucha",
    category: "grain",
    emoji: "🥤",
    color: "#f6ad55",
    pniBenefits:
      "Té fermentado con cultivos vivos que aporta ácidos orgánicos y probióticos.",
    tags: ["fermented"],
    translations: {
      en: "Kombucha",
    },
  },
  {
    id: "natto",
    name: "Natto",
    category: "legume",
    emoji: "🥢",
    color: "#c05621",
    pniBenefits:
      "Plato japonés de soja fermentada rico en vitamina K2 y probióticos.",
    tags: ["fermented"],
    translations: {
      en: "Natto",
    },
  },
  {
    id: "pepinos-fermentados",
    name: "Pepinillos fermentados",
    category: "vegetable",
    emoji: "🥒",
    color: "#68d391",
    pniBenefits:
      "Pepinos fermentados de forma natural que aportan probióticos y ácidos orgánicos.",
    tags: ["fermented"],
    translations: {
      en: "Fermented pickles",
    },
  },
  {
    id: "queso-fermentado",
    name: "Queso fermentado",
    category: "grain",
    emoji: "🧀",
    color: "#f6e05e",
    pniBenefits:
      "Algunos quesos curados contienen bacterias vivas que pueden actuar como probióticos.",
    tags: ["fermented"],
    translations: {
      en: "Fermented cheese",
    },
  },
  {
    id: "vinagre-madre",
    name: "Vinagre de manzana (con madre)",
    category: "fruit",
    emoji: "🍎",
    color: "#dd6b20",
    pniBenefits:
      "Contiene una colonia simbiótica de bacterias y levaduras que puede apoyar la digestión.",
    tags: ["fermented"],
    translations: {
      en: "Apple cider vinegar (with the mother)",
    },
  },
  {
    id: "aceitunas-fermentadas",
    name: "Aceitunas fermentadas",
    category: "fruit",
    emoji: "🫒",
    color: "#68d391",
    pniBenefits:
      "Ricas en grasas monoinsaturadas y microorganismos procedentes de la fermentación.",
    tags: ["fermented"],
    translations: {
      en: "Fermented olives",
    },
  },
  {
    id: "zanahoria",
    name: "Zanahoria",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#dd6b20",
    pniBenefits:
      "Fuente de betacarotenos y fibra que contribuyen a la integridad de mucosas y a la regulación inmunitaria.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Carrot",
      fr: "Carotte",
      it: "Carota",
      de: "Karotte",
      pt: "Cenoura",
    },
  },
  {
    id: "espinaca",
    name: "Espinaca",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#276749",
    pniBenefits:
      "Rica en folatos, magnesio y compuestos antioxidantes que participan en la función neurológica e inmune.",
    tags: ["fiber", "antioxidant", "polyphenols"],
    translations: {
      en: "Spinach",
      fr: "Épinards",
      it: "Spinaci",
      de: "Spinat",
      pt: "Espinafre",
    },
  },
  {
    id: "ajo",
    name: "Ajo",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#f6e05e",
    pniBenefits:
      "Contiene compuestos azufrados con efecto prebiótico y modulador del sistema inmune.",
    tags: ["prebiotic", "detox", "fiber"],
    translations: {
      en: "Garlic",
      fr: "Ail",
      it: "Aglio",
      de: "Knoblauch",
      pt: "Alho",
    },
  },
  {
    id: "cebolla",
    name: "Cebolla",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#faf089",
    pniBenefits:
      "Aporta inulina y fructooligosacáridos, potentes prebióticos que nutren la microbiota intestinal.",
    tags: ["prebiotic", "fiber"],
    translations: {
      en: "Onion",
      fr: "Oignon",
      it: "Cipolla",
      de: "Zwiebel",
      pt: "Cebola",
    },
  },
  {
    id: "manzana",
    name: "Manzana",
    category: "fruit",
    emoji: CATEGORY_EMOJI.fruit,
    color: "#f56565",
    pniBenefits:
      "La pectina y los polifenoles de la manzana favorecen una microbiota diversa y un perfil inflamatorio más equilibrado.",
    tags: ["fiber", "prebiotic", "polyphenols"],
    translations: {
      en: "Apple",
      fr: "Pomme",
      it: "Mela",
      de: "Apfel",
      pt: "Maçã",
    },
  },
  {
    id: "arandanos",
    name: "Arándanos",
    category: "fruit",
    emoji: CATEGORY_EMOJI.fruit,
    color: "#4c51bf",
    pniBenefits:
      "Muy ricos en antocianinas y polifenoles con efecto antioxidante y neuroprotector.",
    tags: ["antioxidant", "polyphenols"],
    translations: {
      en: "Blueberries",
      fr: "Myrtilles",
      it: "Mirtilli",
      de: "Heidelbeeren",
      pt: "Mirtilos",
    },
  },
  {
    id: "platano",
    name: "Plátano",
    category: "fruit",
    emoji: CATEGORY_EMOJI.fruit,
    color: "#ecc94b",
    pniBenefits:
      "Su almidón resistente actúa como prebiótico, alimentando bacterias beneficiosas.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Banana",
      fr: "Banane",
      it: "Banana",
      de: "Banane",
      pt: "Banana",
    },
  },
  {
    id: "aguacate",
    name: "Aguacate",
    category: "fruit",
    emoji: CATEGORY_EMOJI.fruit,
    color: "#48bb78",
    pniBenefits:
      "Grasa monoinsaturada, fibra y compuestos bioactivos que favorecen la salud cardiometabólica e intestinal.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Avocado",
      fr: "Avocat",
      it: "Avocado",
      de: "Avocado",
      pt: "Abacate",
    },
  },
  {
    id: "nueces",
    name: "Nueces",
    category: "nut",
    emoji: CATEGORY_EMOJI.nut,
    color: "#975a16",
    pniBenefits:
      "Fuente de omega‑3 vegetales, polifenoles y fibra que regulan la inflamación sistémica.",
    tags: ["omega3", "fiber", "antioxidant"],
    translations: {
      en: "Walnuts",
      fr: "Noix",
      it: "Noci",
      de: "Walnüsse",
      pt: "Nozes",
    },
  },
  {
    id: "almendras",
    name: "Almendras",
    category: "nut",
    emoji: CATEGORY_EMOJI.nut,
    color: "#b7791f",
    pniBenefits:
      "Aportan fibra, grasas saludables y vitamina E, clave en la protección antioxidante.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Almonds",
      fr: "Amandes",
      it: "Mandorle",
      de: "Mandeln",
      pt: "Amêndoas",
    },
  },
  {
    id: "lentejas",
    name: "Lentejas",
    category: "legume",
    emoji: CATEGORY_EMOJI.legume,
    color: "#9b2c2c",
    pniBenefits:
      "Legumbre rica en fibra y proteína vegetal que estabiliza la glucemia y nutre la microbiota.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Lentils",
      fr: "Lentilles",
      it: "Lenticchie",
      de: "Linsen",
      pt: "Lentilhas",
    },
  },
  {
    id: "garbanzos",
    name: "Garbanzos",
    category: "legume",
    emoji: CATEGORY_EMOJI.legume,
    color: "#c05621",
    pniBenefits:
      "Su combinación de fibra y almidón resistente favorece la producción de ácidos grasos de cadena corta.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Chickpeas",
      fr: "Pois chiches",
      it: "Ceci",
      de: "Kichererbsen",
      pt: "Grão‑de‑bico",
    },
  },
  {
    id: "alubias",
    name: "Alubias",
    category: "legume",
    emoji: CATEGORY_EMOJI.legume,
    color: "#742a2a",
    pniBenefits:
      "Legumbre muy rica en fibra fermentable que potencia la diversidad microbiana intestinal.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Beans",
      fr: "Haricots",
      it: "Fagioli",
      de: "Bohnen",
      pt: "Feijão",
    },
  },
  {
    id: "avena",
    name: "Avena integral",
    category: "grain",
    emoji: CATEGORY_EMOJI.grain,
    color: "#d69e2e",
    pniBenefits:
      "Los betaglucanos de la avena actúan como prebióticos y ayudan al control metabólico.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Whole oats",
      fr: "Flocons d’avoine complets",
      it: "Avena integrale",
      de: "Vollkorn-Haferflocken",
      pt: "Aveia integral",
    },
  },
  {
    id: "quinoa",
    name: "Quinoa",
    category: "grain",
    emoji: CATEGORY_EMOJI.grain,
    color: "#b7791f",
    pniBenefits:
      "Pseudocereal completo en aminoácidos, con fibra y minerales que apoyan el eje intestino‑cerebro.",
    tags: ["fiber"],
    translations: {
      en: "Quinoa",
      fr: "Quinoa",
      it: "Quinoa",
      de: "Quinoa",
      pt: "Quinoa",
    },
  },
  {
    id: "maiz",
    name: "Maíz",
    category: "grain",
    emoji: CATEGORY_EMOJI.grain,
    color: "#f6e05e",
    pniBenefits:
      "Aporta fibra y compuestos carotenoides que protegen frente al estrés oxidativo.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Corn",
      fr: "Maïs",
      it: "Mais",
      de: "Mais",
      pt: "Milho",
    },
  },
  {
    id: "champiñones",
    name: "Champiñones",
    category: "fungi",
    emoji: CATEGORY_EMOJI.fungi,
    color: "#a0aec0",
    pniBenefits:
      "Fuentes de beta‑glucanos y otros polisacáridos con efecto inmunomodulador.",
    tags: ["fiber", "prebiotic"],
    translations: {
      en: "Mushrooms",
      fr: "Champignons de Paris",
      it: "Funghi champignon",
      de: "Champignons",
      pt: "Cogumelos",
    },
  },
  {
    id: "shiitake",
    name: "Seta shiitake",
    category: "fungi",
    emoji: CATEGORY_EMOJI.fungi,
    color: "#744210",
    pniBenefits:
      "Contiene lentinano y otros compuestos que favorecen la respuesta inmune y la salud intestinal.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Shiitake mushroom",
      fr: "Champignon shiitake",
      it: "Fungo shiitake",
      de: "Shiitake-Pilz",
      pt: "Cogumelo shiitake",
    },
  },
  {
    id: "perejil",
    name: "Perejil",
    category: "herb",
    emoji: CATEGORY_EMOJI.herb,
    color: "#38a169",
    pniBenefits:
      "Hierba rica en clorofila y polifenoles con efecto antioxidante y de soporte detox.",
    tags: ["antioxidant", "detox"],
    translations: {
      en: "Parsley",
      fr: "Persil",
      it: "Prezzemolo",
      de: "Petersilie",
      pt: "Salsinha",
    },
  },
  {
    id: "cilantro",
    name: "Cilantro",
    category: "herb",
    emoji: CATEGORY_EMOJI.herb,
    color: "#2f855a",
    pniBenefits:
      "Aporta compuestos bioactivos que pueden colaborar en la eliminación de metales pesados.",
    tags: ["detox", "antioxidant"],
    translations: {
      en: "Coriander (cilantro)",
      fr: "Coriandre",
      it: "Coriandolo",
      de: "Koriander",
      pt: "Coentro",
    },
  },
  {
    id: "kimchi",
    name: "Kimchi",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#e53e3e",
    pniBenefits:
      "Vegetal fermentado rico en probióticos y fibra que refuerza la barrera intestinal.",
    tags: ["fermented", "fiber"],
    translations: {
      en: "Kimchi",
      fr: "Kimchi",
      it: "Kimchi",
      de: "Kimchi",
      pt: "Kimchi",
    },
  },
  {
    id: "chucrut",
    name: "Chucrut",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#f6e05e",
    pniBenefits:
      "Col fermentada con acción probiótica y prebiótica, clave en PNI para modular la microbiota.",
    tags: ["fermented", "fiber", "cruciferous"],
    translations: {
      en: "Sauerkraut",
      fr: "Choucroute",
      it: "Crauti",
      de: "Sauerkraut",
      pt: "Chucrute",
    },
  },
  {
    id: "acelga",
    name: "Acelga",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#2f855a",
    pniBenefits:
      "Rica en vitamina K, magnesio, fibra y antioxidantes que apoyan la salud cardiovascular y la detoxificación.",
    tags: ["fiber", "antioxidant", "detox"],
    translations: {
      en: "Swiss chard",
      fr: "Bette (blette)",
      it: "Bietola",
      de: "Mangold",
      pt: "Acelga",
    },
  },
  {
    id: "apio",
    name: "Apio",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#68d391",
    pniBenefits:
      "Contiene antioxidantes, fibra y electrolitos que ayudan a la hidratación y al equilibrio inflamatorio.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Celery",
      fr: "Céleri",
      it: "Sedano",
      de: "Sellerie",
      pt: "Aipo (salsão)",
    },
  },
  {
    id: "berenjena",
    name: "Berenjena",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#6b46c1",
    pniBenefits:
      "Contiene nasunina y fibra con efecto antioxidante y protector celular.",
    tags: ["fiber", "antioxidant", "polyphenols"],
    translations: {
      en: "Eggplant (aubergine)",
      fr: "Aubergine",
      it: "Melanzana",
      de: "Aubergine",
      pt: "Berinjela",
    },
  },
  {
    id: "calabacin",
    name: "Calabacín",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#48bb78",
    pniBenefits:
      "Verdura ligera rica en fibra, potasio y vitamina A que favorece la hidratación y el metabolismo.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Zucchini",
      fr: "Courgette",
      it: "Zucchina",
      de: "Zucchini",
      pt: "Abobrinha",
    },
  },
  {
    id: "calabaza",
    name: "Calabaza",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#ed8936",
    pniBenefits:
      "Fuente de betacarotenos y fibra que ayudan al sistema inmune y a la salud intestinal.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Pumpkin",
      fr: "Potiron",
      it: "Zucca",
      de: "Kürbis",
      pt: "Abóbora",
    },
  },
  {
    id: "coliflor",
    name: "Coliflor",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#f7fafc",
    pniBenefits:
      "Crucífera rica en glucosinolatos que apoyan la detoxificación y el equilibrio inflamatorio.",
    tags: ["cruciferous", "detox", "fiber"],
    translations: {
      en: "Cauliflower",
      fr: "Chou-fleur",
      it: "Cavolfiore",
      de: "Blumenkohl",
      pt: "Couve-flor",
    },
  },
  {
    id: "pimiento-rojo",
    name: "Pimiento rojo",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#e53e3e",
    pniBenefits:
      "Altísimo contenido en vitamina C y carotenoides con potente acción antioxidante.",
    tags: ["antioxidant", "polyphenols"],
    translations: {
      en: "Red bell pepper",
      fr: "Poivron rouge",
      it: "Peperone rosso",
      de: "Rote Paprika",
      pt: "Pimentão vermelho",
    },
  },
  {
    id: "puerro",
    name: "Puerro",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#9ae6b4",
    pniBenefits:
      "Rico en inulina prebiótica que favorece la diversidad de la microbiota intestinal.",
    tags: ["prebiotic", "fiber"],
    translations: {
      en: "Leek",
      fr: "Poireau",
      it: "Porro",
      de: "Lauch",
      pt: "Alho-poró",
    },
  },
  {
    id: "tomate",
    name: "Tomate",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#e53e3e",
    pniBenefits:
      "Fuente de licopeno y vitamina C que protege frente al estrés oxidativo.",
    tags: ["antioxidant", "polyphenols"],
    translations: {
      en: "Tomato",
      fr: "Tomate",
      it: "Pomodoro",
      de: "Tomate",
      pt: "Tomate",
    },
  },
  {
    id: "alcachofa",
    name: "Alcachofa",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#38a169",
    pniBenefits:
      "Rica en inulina y cinarina que favorecen la función hepática y digestiva.",
    tags: ["prebiotic", "detox", "fiber"],
    translations: {
      en: "Artichoke",
      fr: "Artichaut",
      it: "Carciofo",
      de: "Artischocke",
      pt: "Alcachofra",
    },
  },
  {
    id: "esparrago",
    name: "Espárrago",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#68d391",
    pniBenefits:
      "Contiene inulina y antioxidantes que apoyan la microbiota y la detoxificación.",
    tags: ["prebiotic", "fiber", "detox"],
    translations: {
      en: "Asparagus",
      fr: "Asperge",
      it: "Asparago",
      de: "Spargel",
      pt: "Aspargo",
    },
  },
  {
    id: "remolacha",
    name: "Remolacha",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#9b2c2c",
    pniBenefits:
      "Rica en nitratos naturales que mejoran la circulación y la función mitocondrial.",
    tags: ["antioxidant", "polyphenols"],
    translations: {
      en: "Beetroot",
      fr: "Betterave",
      it: "Barbabietola",
      de: "Rote Bete",
      pt: "Beterraba",
    },
  },
  {
    id: "rabano",
    name: "Rábano",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#f56565",
    pniBenefits:
      "Contiene glucosinolatos con acción detoxificante y digestiva.",
    tags: ["detox", "antioxidant"],
    translations: {
      en: "Radish",
      fr: "Radis",
      it: "Ravanello",
      de: "Radieschen",
      pt: "Rabanete",
    },
  },
  {
    id: "rucula",
    name: "Rúcula",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#2f855a",
    pniBenefits:
      "Hoja verde rica en nitratos naturales y glucosinolatos beneficiosos para la salud vascular.",
    tags: ["cruciferous", "antioxidant"],
    translations: {
      en: "Rocket (arugula)",
      fr: "Roquette",
      it: "Rucola",
      de: "Rucola",
      pt: "Rúcula",
    },
  },
  {
    id: "boniato",
    name: "Boniato",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#dd6b20",
    pniBenefits:
      "Rico en betacarotenos, fibra y antioxidantes con efecto antiinflamatorio.",
    tags: ["fiber", "antioxidant"],
    translations: {
      en: "Sweet potato",
      fr: "Patate douce",
      it: "Patata dolce",
      de: "Süßkartoffel",
      pt: "Batata-doce",
    },
  },
  {
    id: "pepino",
    name: "Pepino",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#68d391",
    pniBenefits:
      "Alimento muy hidratante con antioxidantes y electrolitos que favorecen la función celular.",
    tags: ["antioxidant"],
    translations: {
      en: "Cucumber",
      fr: "Concombre",
      it: "Cetriolo",
      de: "Gurke",
      pt: "Pepino",
    },
  },
  {
    id: "col-lombarda",
    name: "Col lombarda",
    category: "vegetable",
    emoji: CATEGORY_EMOJI.vegetable,
    color: "#805ad5",
    pniBenefits:
      "Rica en antocianinas con fuerte poder antioxidante y protector cardiovascular.",
    tags: ["cruciferous", "polyphenols", "antioxidant"],
    translations: {
      en: "Red cabbage",
      fr: "Chou rouge",
      it: "Cavolo rosso",
      de: "Rotkohl",
      pt: "Repolho roxo",
    },
  },
  {
    id: "naranja",
    name: "Naranja",
    category: "fruit",
    emoji: CATEGORY_EMOJI.fruit,
    color: "#ed8936",
    pniBenefits:
      "Alta en vitamina C y flavonoides que fortalecen el sistema inmune.",
    tags: ["antioxidant", "polyphenols"],
    translations: {
      en: "Orange",
      fr: "Orange",
      it: "Arancia",
      de: "Orange",
      pt: "Laranja",
    },
  },
  {
    id: "kiwi",
    name: "Kiwi",
    category: "fruit",
    emoji: CATEGORY_EMOJI.fruit,
    color: "#68d391",
    pniBenefits:
      "Muy rico en vitamina C y enzimas digestivas que favorecen la salud intestinal.",
    tags: ["antioxidant", "fiber"],
    translations: {
      en: "Kiwi",
      fr: "Kiwi",
      it: "Kiwi",
      de: "Kiwi",
      pt: "Kiwi",
    },
  },
  {
    id: "granada",
    name: "Granada",
    category: "fruit",
    emoji: CATEGORY_EMOJI.fruit,
    color: "#c53030",
    pniBenefits:
      "Fuente potente de polifenoles como punicalaginas con efecto antiinflamatorio.",
    tags: ["polyphenols", "antioxidant"],
    translations: {
      en: "Pomegranate",
      fr: "Grenade",
      it: "Melagrana",
      de: "Granatapfel",
      pt: "Romã",
    },
  },
  {
    id: "cereza",
    name: "Cereza",
    category: "fruit",
    emoji: CATEGORY_EMOJI.fruit,
    color: "#e53e3e",
    pniBenefits:
      "Rica en antocianinas y melatonina que apoyan la recuperación y el sueño.",
    tags: ["antioxidant", "polyphenols"],
    translations: {
      en: "Cherry",
      fr: "Cerise",
      it: "Ciliegia",
      de: "Kirsche",
      pt: "Cereja",
    },
  },
  {
    id: "chia",
    name: "Semillas de chía",
    category: "nut",
    emoji: CATEGORY_EMOJI.nut,
    color: "#4a5568",
    pniBenefits:
      "Altas en omega-3, fibra soluble y minerales que favorecen la salud metabólica.",
    tags: ["omega3", "fiber"],
    translations: {
      en: "Chia seeds",
      fr: "Graines de chia",
      it: "Semi di chia",
      de: "Chiasamen",
      pt: "Sementes de chia",
    },
  },
  {
    id: "lino",
    name: "Semillas de lino",
    category: "nut",
    emoji: CATEGORY_EMOJI.nut,
    color: "#805ad5",
    pniBenefits:
      "Ricas en omega-3 vegetales y lignanos con efectos hormonales protectores.",
    tags: ["omega3", "fiber", "polyphenols"],
    translations: {
      en: "Flax seeds",
      fr: "Graines de lin",
      it: "Semi di lino",
      de: "Leinsamen",
      pt: "Sementes de linhaça",
    },
  },
  {
    id: "arroz-integral",
    name: "Arroz integral",
    category: "grain",
    emoji: CATEGORY_EMOJI.grain,
    color: "#c05621",
    pniBenefits:
      "Cereal integral rico en fibra y minerales que favorece el metabolismo energético.",
    tags: ["fiber"],
    translations: {
      en: "Brown rice",
      fr: "Riz complet",
      it: "Riso integrale",
      de: "Vollkornreis",
      pt: "Arroz integral",
    },
  },
  {
    id: "trigo-sarraceno",
    name: "Trigo sarraceno",
    category: "grain",
    emoji: CATEGORY_EMOJI.grain,
    color: "#975a16",
    pniBenefits:
      "Contiene rutina y antioxidantes que favorecen la salud vascular.",
    tags: ["fiber", "polyphenols"],
    translations: {
      en: "Buckwheat",
      fr: "Sarrasin",
      it: "Grano saraceno",
      de: "Buchweizen",
      pt: "Trigo‑mouro (sarraceno)",
    },
  }
];

export function findFoodByText(query: string): FoodItem[] {
  const normalizedQuery = normalizeFoodName(query);
  if (!normalizedQuery) return [];

  const canonicalQuery =
    synonymsMap[normalizedQuery] ?? normalizedQuery;

  return FOODS.filter((food) => {
    const normalizedName = normalizeFoodName(food.name);
    if (normalizedName.includes(canonicalQuery)) return true;

    // Also match by basic tag names
    const tagsMatch = food.tags.some((tag) =>
      tag.includes(canonicalQuery as FoodTag),
    );

    return tagsMatch;
  });
}

export function getFoodLabel(food: FoodItem, locale: SupportedLocale): string {
  const translations = (food as FoodItem & { translations?: LocalizedNames })
    .translations;
  return translations?.[locale] ?? food.name;
}

