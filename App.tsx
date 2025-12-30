
import React, { useState, useEffect, useCallback } from 'react';
import BoardScanner from './components/BoardScanner';
import AnalysisDisplay from './components/AnalysisDisplay';
import VoiceInterface from './components/VoiceInterface';
import { AnalysisResult, AppStatus } from './types';
import { analyzeBoardImage } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback(async (base64: string) => {
    setCurrentImage(base64);
    setStatus(AppStatus.ANALYZING);
    setAnalysis(null);
    setError(null);

    try {
      const result = await analyzeBoardImage(base64);
      setAnalysis(result);
      setStatus(AppStatus.READY);
    } catch (err: any) {
      console.error(err);
      setError("Failed to analyze board. Please ensure it's a clear screenshot of a chess board.");
      setStatus(AppStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't interrupt if we are already analyzing
      if (status === AppStatus.ANALYZING) return;

      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                handleImageSelected(reader.result as string);
              };
              reader.readAsDataURL(blob);
              break; // Handle only the first image found
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [status, handleImageSelected]);

  const reset = () => {
    setAnalysis(null);
    setCurrentImage(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 pb-24">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">CHESS<span className="text-blue-500">VISIONARY</span></h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
             <span className="hover:text-white cursor-pointer transition-colors">Tactics</span>
             <span className="hover:text-white cursor-pointer transition-colors">Openings</span>
             <span className="hover:text-white cursor-pointer transition-colors">History</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <header className="mb-12 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight">
            Your Personal AI Grandmaster
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Instantly analyze any board screenshot. Paste an image or upload a file to get expert move suggestions and live voice coaching.
          </p>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-2xl text-red-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {(status === AppStatus.IDLE || status === AppStatus.ANALYZING || status === AppStatus.ERROR) ? (
          <BoardScanner onImageSelected={handleImageSelected} isLoading={status === AppStatus.ANALYZING} />
        ) : (
          <div className="animate-in fade-in zoom-in duration-500">
             <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={reset}
                  className="text-slate-400 hover:text-white flex items-center gap-2 transition-all font-medium group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Analyze Different Game
                </button>
                <div className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  Tip: Paste a new image anytime to re-analyze
                </div>
             </div>
             {analysis && currentImage && <AnalysisDisplay result={analysis} image={currentImage} />}
          </div>
        )}
      </main>

      <VoiceInterface analysisContext={analysis || undefined} />

      {/* Footer Info */}
      <footer className="mt-20 border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
          <p>© 2024 Chess Visionary AI. Powered by Gemini Flash 3.</p>
          <div className="flex gap-8">
            <span className="hover:text-slate-300 cursor-pointer">Terms</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
