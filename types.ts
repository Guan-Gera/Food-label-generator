export enum Language {
  EN = 'EN', // English
  DE = 'DE', // German
  FR = 'FR', // French
  IT = 'IT'  // Italian
}

export enum PaperSize {
  S10x10 = '10x10cm',
  S10x15 = '10x15cm'
}

export interface NutritionInfo {
  energyKj: string;
  energyKcal: string;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  protein: string;
  salt: string;
}

export interface LabelContent {
  productName: string;
  netWeight: string; // New: Net Quantity
  ingredients: string;
  allergens: string; 
  storage: string;
  shelfLife: string;
  productionDate: string;
  origin: string;
  usage: string;
  distributor: string; // New: FBO / Manufacturer address
  batchNumber: string; // New: Optional custom batch number
  nutrition: NutritionInfo;
}

export interface FieldConfig {
  id: keyof Omit<LabelContent, 'nutrition'> | 'nutrition';
  label: string;
  enabled: boolean;
  required: boolean;
}

// Map of translations for a single label (user content)
export type TranslatedLabels = {
  [key in Language]?: LabelContent;
};

// Interface for static headers on the label
export interface LabelHeaders {
  ingredients: string;
  allergens: string;
  nutritionTitle: string;
  energy: string;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  protein: string;
  salt: string;
  storage: string;
  origin: string;
  bestBefore: string;
  productionDate: string;
  usage: string;
  netWeight: string;
  distributor: string;
  batchNote: string;
}
