import { FieldConfig, LabelContent, LabelHeaders, Language, NutritionInfo } from "./types";

export const INITIAL_NUTRITION: NutritionInfo = {
  energyKj: '',
  energyKcal: '',
  fat: '',
  saturates: '',
  carbohydrate: '',
  sugars: '',
  protein: '',
  salt: ''
};

// Chinese labels for the input form
export const NUTRITION_LABELS_CN: Record<keyof NutritionInfo, string> = {
  energyKj: '能量 (KJ)',
  energyKcal: '能量 (Kcal)',
  fat: '脂肪 (Fat)',
  saturates: '饱和脂肪 (Saturates)',
  carbohydrate: '碳水化合物 (Carbohydrate)',
  sugars: '糖 (Sugars)',
  protein: '蛋白质 (Protein)',
  salt: '盐 (Salt)'
};

export const INITIAL_CONTENT: LabelContent = {
  productName: '',
  netWeight: '',
  ingredients: '',
  allergens: '',
  storage: '',
  shelfLife: '',
  productionDate: '见包装喷码',
  origin: '',
  usage: '',
  distributor: '',
  batchNumber: '',
  nutrition: INITIAL_NUTRITION
};

export const DEFAULT_FIELDS: FieldConfig[] = [
  { id: 'productName', label: '产品名称 (Product Name)', enabled: true, required: true },
  { id: 'netWeight', label: '净含量 (Net Weight)', enabled: true, required: true },
  { id: 'ingredients', label: '配料表 (Ingredients)', enabled: true, required: true },
  { id: 'allergens', label: '致敏物质 (Allergens)', enabled: true, required: false },
  { id: 'nutrition', label: '标准营养成分表 (Nutrition)', enabled: true, required: false },
  { id: 'storage', label: '储存方法 (Storage)', enabled: true, required: false },
  { id: 'shelfLife', label: '保质期 (Shelf Life)', enabled: true, required: false },
  { id: 'productionDate', label: '生产日期 (Production Date)', enabled: true, required: false },
  { id: 'origin', label: '产地 (Origin)', enabled: true, required: false },
  { id: 'distributor', label: '制造商/经销商信息 (Manufacturer/Distributor)', enabled: false, required: false },
  { id: 'usage', label: '使用方法 (Usage)', enabled: false, required: false },
  { id: 'batchNumber', label: '批号 (Batch No.) - 不填则显示见包装', enabled: false, required: false },
];

export const LABEL_HEADERS: Record<Language, LabelHeaders> = {
  [Language.EN]: {
    ingredients: "Ingredients:",
    allergens: "Allergy Advice:",
    nutritionTitle: "Nutrition Information (per 100g/ml)",
    energy: "Energy",
    fat: "Fat",
    saturates: "of which saturates",
    carbohydrate: "Carbohydrate",
    sugars: "of which sugars",
    protein: "Protein",
    salt: "Salt",
    storage: "Storage:",
    origin: "Origin:",
    bestBefore: "Best Before:",
    productionDate: "Production Date:",
    usage: "Usage:",
    netWeight: "Net Weight:",
    distributor: "Manufactured for / Imported by:",
    batchNote: "CHECK PACKAGING FOR BATCH CODE"
  },
  [Language.DE]: {
    ingredients: "Zutaten:",
    allergens: "Allergiehinweis:",
    nutritionTitle: "Nährwertangaben (pro 100g/ml)",
    energy: "Energie",
    fat: "Fett",
    saturates: "davon gesättigte Fettsäuren",
    carbohydrate: "Kohlenhydrate",
    sugars: "davon Zucker",
    protein: "Eiweiß",
    salt: "Salz",
    storage: "Lagerung:",
    origin: "Herkunft:",
    bestBefore: "Mindestens haltbar bis:",
    productionDate: "Herstellungsdatum:",
    usage: "Verwendung:",
    netWeight: "Nettofüllmenge:",
    distributor: "Hergestellt für / Importiert durch:",
    batchNote: "SIEHE VERPACKUNG FÜR CHARGENCODE"
  },
  [Language.FR]: {
    ingredients: "Ingrédients:",
    allergens: "Allergènes:",
    nutritionTitle: "Valeurs nutritionnelles (pour 100g/ml)",
    energy: "Énergie",
    fat: "Matières grasses",
    saturates: "dont acides gras saturés",
    carbohydrate: "Glucides",
    sugars: "dont sucres",
    protein: "Protéines",
    salt: "Sel",
    storage: "Conservation:",
    origin: "Origine:",
    bestBefore: "À consommer de préférence avant le:",
    productionDate: "Date de fabrication:",
    usage: "Utilisation:",
    netWeight: "Poids net:",
    distributor: "Fabriqué pour / Importé par:",
    batchNote: "VOIR L'EMBALLAGE POUR LE CODE DU LOT"
  },
  [Language.IT]: {
    ingredients: "Ingredienti:",
    allergens: "Allergeni:",
    nutritionTitle: "Valori nutrizionali (per 100g/ml)",
    energy: "Energia",
    fat: "Grassi",
    saturates: "di cui acidi grassi saturi",
    carbohydrate: "Carboidrati",
    sugars: "di cui zuccheri",
    protein: "Proteine",
    salt: "Sale",
    storage: "Conservazione:",
    origin: "Origine:",
    bestBefore: "Da consumarsi preferibilmente entro:",
    productionDate: "Data di produzione:",
    usage: "Uso:",
    netWeight: "Peso netto:",
    distributor: "Prodotto per / Importato da:",
    batchNote: "VEDI CONFEZIONE PER IL CODICE LOTTO"
  }
};