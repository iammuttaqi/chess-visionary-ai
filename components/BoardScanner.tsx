
import React, { useRef } from 'react';

interface BoardScannerProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const BoardScanner: React.FC<BoardScannerProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl border-2 border-dashed border-slate-700 bg-slate-800/40 flex flex-col items-center justify-center transition-all hover:border-blue-500/50 group backdrop-blur-sm">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div className="mb-6 p-5 rounded-2xl bg-slate-800 group-hover:bg-blue-900/20 transition-all transform group-hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-slate-500 group-hover:text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>

      <h3 className="text-2xl font-bold mb-2">Analyze Board</h3>
      <p className="text-slate-400 text-center mb-8 max-w-md leading-relaxed">
        Upload a screenshot or simply <span className="text-blue-400 font-medium">paste (Ctrl+V)</span> directly into this window to find the best move.
      </p>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={triggerUpload}
          disabled={isLoading}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-2xl font-semibold transition-all shadow-xl shadow-blue-900/20 transform active:scale-95 flex items-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Select File
            </>
          )}
        </button>
        
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <span className="w-8 h-[1px] bg-slate-800"></span>
          <span>Or press</span>
          <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">Ctrl + V</kbd>
          <span className="w-8 h-[1px] bg-slate-800"></span>
        </div>
      </div>
    </div>
  );
};

export default BoardScanner;
