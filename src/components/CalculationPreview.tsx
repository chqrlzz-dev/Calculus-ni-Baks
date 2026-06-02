import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { getFormulaLatex } from "@/utils/gradingSystems";
import { generatePDFTranscript } from "@/utils/pdfGenerator";
import { generateImageTranscript } from "@/utils/imageExport";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Calculator, PenTool, ClipboardList, Share2 } from "lucide-react";

import { CourseData } from "@/utils/storage";

interface CalculationPreviewProps {
  activeCourse: CourseData;
  grades: {
    midterm: number;
    finals: number;
    finalGrade: number;
  };
}

const CalculationPreview: React.FC<CalculationPreviewProps> = ({
  activeCourse,
  grades,
}) => {
  const passingGrade = activeCourse.passingGrade || 75;

  // Helper function to get color based on grade
  const getGradeColor = (grade: number): string => {
    if (grade >= passingGrade) return "text-green-600 dark:text-green-400";
    if (grade >= passingGrade - 15) return "text-yellow-600 dark:text-yellow-400";
    if (grade >= passingGrade - 25) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6 text-sm animate-fade-in pb-10">
      {/* Midterm Period */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black text-primary uppercase tracking-tighter">Midterm Path</h3>
          <Badge variant="outline" className={`font-mono font-black ${getGradeColor(grades.midterm)}`}>
            {grades.midterm.toFixed(2)}%
          </Badge>
        </div>
        
        <div className="bg-muted/20 p-5 rounded-[24px] border border-white/5 space-y-5">
          {activeCourse.midtermComponents.map((comp) => (
            <div key={comp.id} className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                {comp.id.includes('quiz') ? <PenTool className="w-3 h-3" /> : <ClipboardList className="w-3 h-3" />} 
                {comp.name} ({comp.weight * 100} pts)
              </div>
              <div className="bg-background/50 p-3 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar text-[11px]">
                <BlockMath>{`\\text{${comp.name}} = ${getFormulaLatex(comp)}`}</BlockMath>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Finals Period */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black text-primary uppercase tracking-tighter">Finals Path</h3>
          <Badge variant="outline" className={`font-mono font-black ${getGradeColor(grades.finals)}`}>
            {grades.finals.toFixed(2)}%
          </Badge>
        </div>
        
        <div className="bg-muted/20 p-5 rounded-[24px] border border-white/5 space-y-5">
          {activeCourse.finalsComponents.map((comp) => (
            <div key={comp.id} className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                {comp.id.includes('quiz') ? <PenTool className="w-3 h-3" /> : <ClipboardList className="w-3 h-3" />} 
                {comp.name} ({comp.weight * 100} pts)
              </div>
              <div className="bg-background/50 p-3 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar text-[11px]">
                <BlockMath>{`\\text{${comp.name}} = ${getFormulaLatex(comp)}`}</BlockMath>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Final Sum */}
      <div className="bg-primary/10 p-6 rounded-[32px] border border-primary/20 space-y-4">
        <div className="text-center text-[10px] font-black uppercase tracking-widest text-primary/70">Final Computation</div>
        <div className="bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          <BlockMath>{`\\text{Total} = (${grades.midterm.toFixed(1)} \\times ${activeCourse.settings.midtermWeight}) + (${grades.finals.toFixed(1)} \\times ${activeCourse.settings.finalsWeight})`}</BlockMath>
        </div>
        <div className="text-center">
          <div className={`text-4xl font-black ${getGradeColor(grades.finalGrade)} tabular-nums`}>{grades.finalGrade.toFixed(2)}%</div>
          <div className="text-[8px] font-black uppercase tracking-widest opacity-50 mt-1">Confirmed Result</div>
        </div>
      </div>
    </div>
  );
};

export default CalculationPreview;
