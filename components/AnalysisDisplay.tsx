
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  image: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, image }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl sticky top-24">
        <img src={image} alt="Board Screenshot" className="w-full h-auto object-contain bg-slate-800" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full"></div>
          
          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Best Continuation</h4>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-6xl font-black text-white tracking-tighter">{result.bestMove}</span>
              <span className="text-slate-500 text-sm mt-1 font-medium">Recommended Engine Move</span>
            </div>
            <div className={`flex flex-col items-end px-4 py-2 rounded-2xl border ${
              result.evaluation.startsWith('+') 
                ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-900/20 border-rose-500/30 text-rose-400'
            }`}>
              <span className="text-xs uppercase font-bold tracking-widest opacity-60">Eval</span>
              <span className="text-2xl font-mono font-bold">{result.evaluation}</span>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-6">
            <h5 className="text-slate-300 text-sm font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-400">
                <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Calculated Main Line
            </h5>
            <ol className="space-y-3">
              {result.steps.map((step, index) => (
                <li key={index} className="flex items-center gap-4 group">
                  <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold text-slate-500 border border-slate-700 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">
                    {index + 1}
                  </span>
                  <span className="text-lg font-mono font-medium text-slate-200 group-hover:text-white transition-colors">
                    {step}
                  </span>
                  {index === 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase tracking-tighter">Current Suggestion</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-lg">
          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Strategic Insight</h4>
          <p className="text-slate-300 leading-relaxed text-lg font-medium italic">
            "{result.explanation}"
          </p>
        </div>

        {result.detectedPosition && (
          <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 group">
             <div className="flex justify-between items-center mb-3">
               <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Board FEN Representation</h4>
               <button 
                 onClick={() => navigator.clipboard.writeText(result.detectedPosition || '')}
                 className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
               >
                 Copy FEN
               </button>
             </div>
             <code className="text-xs text-slate-500 break-all select-all block bg-slate-950 p-3 rounded-xl border border-slate-800">
               {result.detectedPosition}
             </code>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDisplay;
