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
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[60]">
        {/* Top Right Sticker */}
        <div className="absolute top-[8%] right-[8%] w-[180px] h-[180px] opacity-[0.04] dark:opacity-[0.015] animate-float rotate-12">
          <img
            src="/stickers/ribbon.png"
            alt=""
            className="w-full h-full object-contain drop-shadow-2xl"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>

        {/* Bottom Left Sticker */}
        <div className="absolute bottom-[15%] left-[2%] w-[220px] h-[220px] opacity-[0.04] dark:opacity-[0.015] animate-float-slow -rotate-12">
          <img
            src="/stickers/flower.png"
            alt=""
            className="w-full h-full object-contain drop-shadow-2xl"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>

        {/* Center Right Sticker */}
        <div className="absolute top-[45%] right-[2%] w-[200px] h-[200px] opacity-[0.04] dark:opacity-[0.015] animate-float-mid rotate-6">
          <img
            src="/stickers/star.png"
            alt=""
            className="w-full h-full object-contain drop-shadow-2xl"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>

        {/* Top Left Heart */}
        <div className="absolute top-[20%] left-[5%] w-[120px] h-[120px] opacity-[0.04] dark:opacity-[0.015] animate-float-mid -rotate-6">
          <img
            src="/stickers/ribbon.png"
            alt=""
            className="w-full h-full object-contain scale-x-[-1] drop-shadow-xl opacity-40"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
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
