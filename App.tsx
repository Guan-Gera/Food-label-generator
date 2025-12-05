import React, { useState, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { DEFAULT_FIELDS, INITIAL_CONTENT, INITIAL_NUTRITION, NUTRITION_LABELS_CN } from './constants';
import { FieldConfig, LabelContent, Language, PaperSize, TranslatedLabels, NutritionInfo } from './types';
import { translateLabelData } from './services/geminiService';
import { LabelPreview } from './components/LabelPreview';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const App: React.FC = () => {
  // State
  const [fields, setFields] = useState<FieldConfig[]>(DEFAULT_FIELDS);
  const [inputData, setInputData] = useState<LabelContent>(INITIAL_CONTENT);
  const [translations, setTranslations] = useState<TranslatedLabels>({});
  const [selectedSize, setSelectedSize] = useState<PaperSize>(PaperSize.S10x10);
  const [previewLang, setPreviewLang] = useState<Language>(Language.EN);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Handlers
  const toggleField = (id: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const handleInputChange = (key: keyof LabelContent, value: string) => {
    setInputData(prev => ({ ...prev, [key]: value }));
  };

  const handleNutritionChange = (key: keyof NutritionInfo, value: string) => {
    setInputData(prev => ({
      ...prev,
      nutrition: { ...prev.nutrition, [key]: value }
    }));
  };

  const handleTranslate = async () => {
    if (!process.env.API_KEY) {
      alert("请先在环境设置中配置 API_KEY。");
      return;
    }
    setIsTranslating(true);
    try {
      const results = await translateLabelData(inputData);
      setTranslations(results);
      // Auto-switch to EN preview on success
      setPreviewLang(Language.EN);
    } catch (err) {
      console.error(err);
      alert("翻译失败，请重试。");
    } finally {
      setIsTranslating(false);
    }
  };

  const generatePDF = async (lang: Language) => {
    // Select the element to capture
    const element = document.getElementById(`label-preview-${lang}`);
    if (!element) return;

    try {
      // 1. Capture High Res Canvas
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better print quality
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');

      // 2. Setup PDF dimensions (mm)
      // 10x10cm = 100x100mm, 10x15cm = 100x150mm
      const isSquare = selectedSize === PaperSize.S10x10;
      const pdfWidth = 100;
      const pdfHeight = isSquare ? 100 : 150;
      
      const pdf = new jsPDF({
        orientation: isSquare ? 'p' : 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      // 3. Add Image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // 4. Construct Filename
      // Format: [ChineseName]-[Lang]-[SizeCode].pdf
      const cleanName = inputData.productName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_') || 'Label';
      const sizeCode = isSquare ? 'Z' : 'C'; // Z for 10x10, C for 10x15
      const filename = `${cleanName}-${lang}-${sizeCode}.pdf`;

      pdf.save(filename);

    } catch (err) {
      console.error(`Error generating PDF for ${lang}`, err);
    }
  };

  const handleBatchExport = async () => {
    setIsExporting(true);
    // Export only available translations
    const langs = Object.keys(translations) as Language[];
    
    if (langs.length === 0) {
      alert("请先翻译内容，然后再下载。");
      setIsExporting(false);
      return;
    }

    // Iterate through available languages to generate PDFs
    for (const lang of langs) {
       setPreviewLang(lang);
       // Small delay to allow React to render the new content
       await new Promise(resolve => setTimeout(resolve, 500));
       await generatePDF(lang);
    }

    setIsExporting(false);
  };

  // Derived content for current preview
  const currentPreviewContent = translations[previewLang] || inputData;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* LEFT: Input Panel */}
      <div className="w-full md:w-5/12 lg:w-4/12 bg-white shadow-xl z-10 flex flex-col h-screen overflow-hidden">
        <div className="p-6 bg-orange-600 text-white shadow-md z-20">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-3xl">🏷️</span> EuroLabel AI
          </h1>
          <p className="text-orange-100 text-sm mt-1 opacity-90">智能多语言食品标签生成器</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          
          {/* Paper Size Selection */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
             <h3 className="font-semibold text-orange-800 mb-3 text-sm uppercase tracking-wider">规格设置</h3>
             <div className="flex gap-4">
               {Object.values(PaperSize).map((size) => (
                 <label 
                   key={size} 
                   className="flex items-center gap-2 cursor-pointer group"
                   onClick={() => setSelectedSize(size)}
                 >
                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSize === size ? 'border-orange-600' : 'border-gray-400'}`}>
                     {selectedSize === size && <div className="w-2 h-2 bg-orange-600 rounded-full" />}
                   </div>
                   <span className={`text-sm ${selectedSize === size ? 'font-medium text-orange-900' : 'text-gray-600'}`}>
                     {size} ({size === PaperSize.S10x10 ? 'Z材料' : 'C材料'})
                   </span>
                 </label>
               ))}
             </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider border-b pb-2">产品详细信息 (中文)</h3>
            
            {fields.filter(f => f.id !== 'nutrition').map(field => (
              <div key={field.id} className={`transition-opacity ${!field.enabled ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                   <label className="text-xs font-semibold text-gray-600 block">{field.label}</label>
                   {!field.required && (
                     <input 
                       type="checkbox" 
                       checked={field.enabled} 
                       onChange={() => toggleField(field.id as string)}
                       className="accent-orange-600 w-3 h-3"
                     />
                   )}
                </div>
                <textarea 
                  disabled={!field.enabled}
                  value={inputData[field.id as keyof LabelContent] as string || ''}
                  onChange={(e) => handleInputChange(field.id as keyof LabelContent, e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm p-2 border disabled:bg-gray-100 resize-none h-16"
                  placeholder={field.enabled ? `请输入...` : '已禁用'}
                />
              </div>
            ))}

            {/* Nutrition Section */}
            {fields.find(f => f.id === 'nutrition')?.enabled && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                   <label className="text-sm font-bold text-gray-700">营养成分 (每100g/ml)</label>
                   <input 
                     type="checkbox" 
                     checked={fields.find(f => f.id === 'nutrition')?.enabled} 
                     onChange={() => toggleField('nutrition')}
                     className="accent-orange-600"
                   />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(INITIAL_NUTRITION) as Array<keyof NutritionInfo>).map(nutKey => (
                    <div key={nutKey}>
                      <label className="text-[10px] text-gray-500 uppercase font-medium">{NUTRITION_LABELS_CN[nutKey]}</label>
                      <input 
                        type="text"
                        value={inputData.nutrition[nutKey]}
                        onChange={(e) => handleNutritionChange(nutKey, e.target.value)}
                        className="w-full text-sm p-1 border rounded border-gray-300 focus:border-orange-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="p-4 bg-white border-t flex flex-col gap-3 shadow-lg z-30">
          <button 
            onClick={handleTranslate}
            disabled={isTranslating}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-all"
          >
             {isTranslating ? (
               <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> 翻译中...</>
             ) : (
               <>✨ 一键翻译 (英/德/法/意)</>
             )}
          </button>
        </div>
      </div>

      {/* RIGHT: Preview Panel */}
      <div className="flex-1 bg-stone-100 flex flex-col h-screen overflow-hidden">
        {/* Preview Toolbar */}
        <div className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
           <div className="flex space-x-1 bg-stone-100 p-1 rounded-lg">
             {Object.values(Language).map(lang => (
               <button
                 key={lang}
                 onClick={() => setPreviewLang(lang)}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                   previewLang === lang 
                   ? 'bg-white text-orange-600 shadow-sm ring-1 ring-black/5' 
                   : 'text-gray-500 hover:text-gray-700 hover:bg-stone-200/50'
                 }`}
               >
                 {previewLang === lang && (
                   <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                 )}
                 {lang === 'EN' ? 'EN 英语' : lang === 'DE' ? 'DE 德语' : lang === 'FR' ? 'FR 法语' : 'IT 意大利语'}
               </button>
             ))}
           </div>
           
           <div className="flex gap-2">
             <button 
                onClick={() => generatePDF(previewLang)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
             >
               下载当前 PDF
             </button>
             <button 
                onClick={handleBatchExport}
                disabled={isExporting}
                className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
             >
               {isExporting ? '生成中...' : '批量下载所有语言'}
             </button>
           </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-10 flex justify-center items-start bg-stone-200/50">
           <div className="shadow-2xl transition-all duration-300 origin-top transform scale-75 md:scale-90 lg:scale-100">
             {/* We use a key here to force re-render if lang changes, ensuring ID updates correctly for capture */}
             <LabelPreview 
                key={`${previewLang}-${selectedSize}`}
                id={`label-preview-${previewLang}`}
                content={currentPreviewContent} 
                size={selectedSize}
                fieldConfig={fields}
                lang={previewLang}
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;