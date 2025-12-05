import React from 'react';
import { LabelContent, PaperSize, FieldConfig, Language } from '../types';
import { LABEL_HEADERS } from '../constants';

interface LabelPreviewProps {
  content: LabelContent;
  size: PaperSize;
  fieldConfig: FieldConfig[];
  id: string; // ID for html2canvas to grab
  lang: Language;
}

export const LabelPreview: React.FC<LabelPreviewProps> = ({ content, size, fieldConfig, id, lang }) => {
  // Determine dimensions based on size selection
  // 10x10cm = Ratio 1:1, 10x15cm = Ratio 2:3
  
  const is10x15 = size === PaperSize.S10x15;
  const headers = LABEL_HEADERS[lang];
  
  // Checking active fields
  const showIngredients = fieldConfig.find(f => f.id === 'ingredients')?.enabled;
  const showAllergens = fieldConfig.find(f => f.id === 'allergens')?.enabled;
  const showNutrition = fieldConfig.find(f => f.id === 'nutrition')?.enabled;
  const showStorage = fieldConfig.find(f => f.id === 'storage')?.enabled;
  const showShelfLife = fieldConfig.find(f => f.id === 'shelfLife')?.enabled;
  const showProduction = fieldConfig.find(f => f.id === 'productionDate')?.enabled;
  const showOrigin = fieldConfig.find(f => f.id === 'origin')?.enabled;
  const showUsage = fieldConfig.find(f => f.id === 'usage')?.enabled;
  const showNetWeight = fieldConfig.find(f => f.id === 'netWeight')?.enabled;
  const showDistributor = fieldConfig.find(f => f.id === 'distributor')?.enabled;
  const showBatch = fieldConfig.find(f => f.id === 'batchNumber')?.enabled;

  return (
    <div 
      id={id}
      className="bg-white text-black font-sans relative flex flex-col box-border overflow-hidden"
      style={{
        width: '500px', // Base width for preview
        height: is10x15 ? '750px' : '500px', // 1.5 aspect ratio or 1:1
        padding: '25px', // Approx 5mm padding equivalent
        fontSize: is10x15 ? '13px' : '11px', // Slightly larger font for larger paper
        lineHeight: '1.3'
      }}
    >
      {/* Header Section: Name & Net Weight */}
      <div className="mb-4 border-b-2 border-black pb-2 flex justify-between items-end">
        <h1 className="font-bold text-xl uppercase tracking-wide leading-tight w-3/4">
          {content.productName || 'PRODUCT NAME'}
        </h1>
        {showNetWeight && content.netWeight && (
          <div className="text-lg font-bold text-right whitespace-nowrap">
             {/* Net weight usually displayed prominently */}
             {content.netWeight}
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col gap-3">
        {/* Ingredients */}
        {showIngredients && (
          <div className="text-justify">
            <span className="font-bold">{headers.ingredients} </span>
            <span>{content.ingredients}</span>
          </div>
        )}

        {/* Allergens - Bolded per regulation */}
        {showAllergens && content.allergens && (
          <div className="font-bold">
            {headers.allergens} {content.allergens}
          </div>
        )}

        {/* Nutrition Table */}
        {showNutrition && (
          <div className="border border-black p-2 my-1 text-sm">
            <div className="font-bold border-b border-black mb-1 pb-1">{headers.nutritionTitle}</div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="flex justify-between"><span>{headers.energy}</span> <span className="font-medium">{content.nutrition.energyKj} kJ / {content.nutrition.energyKcal} kcal</span></div>
              <div className="flex justify-between"><span>{headers.fat}</span> <span className="font-medium">{content.nutrition.fat} g</span></div>
              <div className="flex justify-between pl-2 italic text-xs items-center"><span>{headers.saturates}</span> <span className="font-medium">{content.nutrition.saturates} g</span></div>
              <div className="flex justify-between"><span>{headers.carbohydrate}</span> <span className="font-medium">{content.nutrition.carbohydrate} g</span></div>
              <div className="flex justify-between pl-2 italic text-xs items-center"><span>{headers.sugars}</span> <span className="font-medium">{content.nutrition.sugars} g</span></div>
              <div className="flex justify-between"><span>{headers.protein}</span> <span className="font-medium">{content.nutrition.protein} g</span></div>
              <div className="flex justify-between"><span>{headers.salt}</span> <span className="font-medium">{content.nutrition.salt} g</span></div>
            </div>
          </div>
        )}

        {/* Secondary Info Grid */}
        <div className="grid grid-cols-2 gap-2 mt-auto text-xs">
           <div className="col-span-2 grid grid-cols-2 gap-4">
              {showStorage && (
                <div>
                  <span className="font-bold block">{headers.storage}</span>
                  {content.storage}
                </div>
              )}
               {showOrigin && (
                <div>
                  <span className="font-bold block">{headers.origin}</span>
                  {content.origin}
                </div>
              )}
           </div>

           <div className="col-span-2 grid grid-cols-2 gap-4">
             {showShelfLife && (
                <div>
                  <span className="font-bold block">{headers.bestBefore}</span>
                  {content.shelfLife}
                </div>
              )}
              {showProduction && (
                <div>
                  <span className="font-bold block">{headers.productionDate}</span>
                  {content.productionDate}
                </div>
              )}
           </div>
           
           {/* Manufacturer / Distributor Block - Important for EU Compliance */}
           {showDistributor && (
             <div className="col-span-2 mt-1">
               <span className="font-bold block">{headers.distributor}</span>
               {content.distributor}
             </div>
           )}

           {showUsage && (
             <div className="col-span-2 mt-1">
               <span className="font-bold block">{headers.usage}</span>
               {content.usage}
             </div>
           )}
        </div>
      </div>
      
      {/* Footer/Meta */}
      <div className="mt-4 pt-2 border-t border-black text-[10px] text-center text-gray-500 uppercase">
        {showBatch && content.batchNumber ? (
           <span>Batch: {content.batchNumber}</span>
        ) : (
           <span>{headers.batchNote}</span>
        )}
      </div>
    </div>
  );
};