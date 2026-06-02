import React, { useEffect } from "react";
import ModernGradeCalculator from "@/components/ModernGradeCalculator";

interface IndexProps {
  onSettingsClick?: (handler: () => void) => void;
}

const Index: React.FC<IndexProps> = ({ onSettingsClick }) => {
  const calculatorRef = React.useRef<{ scrollToSettings: () => void }>(null);

  useEffect(() => {
    if (onSettingsClick && calculatorRef.current) {
      onSettingsClick(() => calculatorRef.current?.scrollToSettings());
    }
  }, [onSettingsClick]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative overflow-hidden">
      <main className="w-full relative z-10">
        <ModernGradeCalculator ref={calculatorRef} />
      </main>
      
      {/* Decorative Stickers (Place PNGs in public/stickers/) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Top Right Sticker */}
        <div className="absolute top-[5%] right-[5%] w-[150px] h-[150px] opacity-[0.08] dark:opacity-[0.03] animate-float rotate-12">
          <img src="/stickers/ribbon.png" alt="" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>
        
        {/* Bottom Left Sticker */}
        <div className="absolute bottom-[10%] left-[-2%] w-[200px] h-[200px] opacity-[0.1] dark:opacity-[0.04] animate-float-slow -rotate-12">
          <img src="/stickers/flower.png" alt="" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>

        {/* Center Right Sticker */}
        <div className="absolute top-[40%] right-[-3%] w-[180px] h-[180px] opacity-[0.07] dark:opacity-[0.02] animate-float-mid rotate-6">
          <img src="/stickers/star.png" alt="" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>

        {/* Floating Hearts/Sparkles */}
        <div className="absolute top-[15%] left-[10%] w-8 h-8 opacity-[0.1] animate-pulse">
           <div className="w-full h-full bg-primary rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Gradient Blurs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse opacity-40"></div>
      </div>
    </div>
  );
};

export default Index;
