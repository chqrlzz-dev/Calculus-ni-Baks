import React from "react";
import ScoreInput from "./ScoreInput";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradingComponent } from "@/utils/gradingSystems";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GradingPeriodProps {
  periodName: string;
  components: GradingComponent[];
  periodGrade: number;
  passingGrade: number;
  onComponentChange: (id: string, updates: Partial<GradingComponent>) => void;
  onSubScoreChange: (id: string, index: number, value: number | null, isMax?: boolean) => void;
  onAddSubScore: (id: string) => void;
  onRemoveSubScore: (id: string, index: number) => void;
  onShowCalc: () => void;
}

const GradingPeriod: React.FC<GradingPeriodProps> = ({
  periodName,
  components,
  periodGrade,
  passingGrade,
  onComponentChange,
  onSubScoreChange,
  onAddSubScore,
  onRemoveSubScore,
  onShowCalc,
}) => {

  const getGradeColor = (grade: number): string => {
    if (grade >= passingGrade) return "text-green-500 bg-green-500/10";
    if (grade >= passingGrade - 15) return "text-yellow-500 bg-yellow-500/10";
    return "text-red-500 bg-red-500/10";
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Period Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black tracking-tight text-foreground">{periodName} Period</h2>
        <Badge variant="secondary" className={`px-5 py-2 text-sm font-black rounded-2xl shadow-sm ${getGradeColor(periodGrade)} border-none`}>
          {periodGrade.toFixed(1)}%
        </Badge>
      </div>

      <div className="space-y-12">
        {components.map((comp) => (
          <section key={comp.id} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-sm" />
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">{comp.name}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground/40 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground text-[10px] font-bold rounded-lg border-primary/10">
                        Weight: {(comp.weight * 100).toFixed(0)}% | Formula: {comp.formulaType}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              {comp.isAverage && (
                <Button variant="ghost" size="sm" onClick={() => onAddSubScore(comp.id)} className="h-8 rounded-xl bg-primary/10 text-primary font-black text-[10px] uppercase gap-1 hover:bg-primary/20 transition-colors shadow-sm">
                  <Plus className="w-3 h-3" /> Add Item
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {comp.isAverage && comp.subScores && comp.subMaxScores ? (
                comp.subScores.map((score, index) => (
                  <div key={`${comp.id}-sub-${index}`} className="relative group">
                    <ScoreInput
                      label={`${comp.name} #${index + 1}`}
                      score={score}
                      maxScore={comp.subMaxScores![index]}
                      onScoreChange={(value) => onSubScoreChange(comp.id, index, value)}
                      onMaxScoreChange={(value) => onSubScoreChange(comp.id, index, value, true)}
                    />
                    {comp.subScores!.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onRemoveSubScore(comp.id, index)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-sm active:scale-90 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <ScoreInput
                  label={comp.name}
                  score={comp.score}
                  maxScore={comp.maxScore}
                  onScoreChange={(value) => onComponentChange(comp.id, { score: value })}
                  onMaxScoreChange={(value) => onComponentChange(comp.id, { maxScore: value })}
                />
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="pt-6 px-2">
        <Button 
          onClick={onShowCalc}
          className="w-full h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 font-black uppercase tracking-widest text-[10px] gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <Calculator className="w-5 h-5" />
          Analyze Grade Logic
        </Button>
      </div>
    </div>
  );
};

export default GradingPeriod;
