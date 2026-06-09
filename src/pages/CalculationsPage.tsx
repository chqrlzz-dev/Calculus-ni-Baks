import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, BookOpen, Target, Scale, Zap, Award, Info, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GRADING_TEMPLATES } from "@/utils/gradingSystems";
import { Badge } from "@/components/ui/badge";

const CalculationsPage: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-white/5 p-4 safe-top">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-muted/30">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tighter">Academic Rules</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-12 animate-fade-in">
        {/* Core Logic Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none">The Engine</h2>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Base Mathematical Principles</span>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="border-none bg-muted/20 rounded-[32px] overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Theory Zero-Based Logic</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Used by Theory of Structures and other advanced engineering subjects. It uses a direct linear scale where your raw percentage corresponds directly to your grade points.
                </p>
                <div className="bg-background/50 p-6 rounded-2xl border border-white/5">
                  <BlockMath>{`\\text{Result} = \\frac{\\text{Raw}}{\\text{Max}} \\times \\text{Weight}`}</BlockMath>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-primary/5 rounded-[32px] border border-primary/10">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-primary" />
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-primary">Period Aggregation</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The final grade is a weighted average of the Midterm and Finals performance.
                </p>
                <div className="bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                  <BlockMath>{`\\text{Final Grade} = (M \\times W_m) + (F \\times W_f)`}</BlockMath>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="bg-primary/5" />

        {/* Subject Registry Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none">Subject Registry</h2>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Comprehensive Template Rules</span>
            </div>
          </div>

          <div className="space-y-12">
            {GRADING_TEMPLATES.map((template) => (
              <div key={template.id} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-black tracking-tight text-foreground">{template.name}</h3>
                  <Badge variant="outline" className="rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                    Passing: {template.passingGrade}%
                  </Badge>
                </div>
                
                <Card className="border-none bg-muted/10 rounded-[2.5rem] overflow-hidden border border-white/[0.02]">
                  <CardContent className="p-8 space-y-6">
                    <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                      {template.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-background/40 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
                        <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Midterm Ratio</span>
                        <span className="text-sm font-black text-primary">{(template.periodRatios.midterm * 100).toFixed(0)}%</span>
                      </div>
                      <div className="p-4 bg-background/40 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
                        <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Finals Ratio</span>
                        <span className="text-sm font-black text-primary">{(template.periodRatios.finals * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Component Weighting</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {template.defaultComponents.map((comp, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 bg-background/60 rounded-2xl border border-white/5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-foreground">{comp.name}</span>
                              <span className="text-[8px] font-black uppercase text-muted-foreground/40">{comp.formulaType} logic</span>
                            </div>
                            <Badge variant="secondary" className="rounded-full font-black text-[10px] bg-primary/10 text-primary border-none">
                              {(comp.weight * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
              <Target className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-none">Goal Targeting</h2>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Predictive Logic</span>
            </div>
          </div>

          <Card className="border-none bg-muted/20 rounded-[32px]">
            <CardContent className="p-8 space-y-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                To find the score needed in finals (<InlineMath math="F_{req}" />) for a target grade (<InlineMath math="T" />), the system solves the weighted average equation:
              </p>
              <div className="bg-background/50 p-6 rounded-2xl border border-white/5">
                <BlockMath math="F_{req} = \frac{T - (M \times W_m)}{W_f}" />
              </div>
              <p className="text-[9px] text-center text-muted-foreground/60 italic">
                *Results are automatically rounded to the nearest integer.
              </p>
            </CardContent>
          </Card>
        </section>

        <footer className="text-center py-10 opacity-30 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Academic Registry v2.1.1-stable</p>
          <p className="text-[8px] font-medium leading-relaxed max-w-[200px] mx-auto">
            *This calculator may or may not be 100% accurate as professors have different types of curving grades.
          </p>
        </footer>
      </main>
    </div>
  );
};

// Simple Label shim since I don't want to import from UI if not needed or if it's small
const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={className}>{children}</span>
);

export default CalculationsPage;
