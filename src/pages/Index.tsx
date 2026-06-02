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
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <main className="w-full">
        <ModernGradeCalculator ref={calculatorRef} />
      </main>
      
      {/* Visual background decorations for a "Pink Coquette" feel */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-primary/5 blur-[80px] rounded-full"></div>
      </div>
    </div>
  );
};

export default Index;
