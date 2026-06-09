import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { 
  Settings, 
  Plus, 
  Minus,
  History,
  LayoutGrid,
  ChevronUp,
  Share2,
  AlertCircle,
  Calculator
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import GradingPeriod from "./GradingPeriod";
import CourseSelector from "./CourseSelector";
import CalculationPreview from "./CalculationPreview";
import { 
  calculateTotalPeriodGrade, 
  calculateFinalGrade, 
  calculateGPE, 
  getGradeColor,
  naturalRound
} from "@/utils/calculationUtils";
import { 
  CourseData, 
  loadCourses, 
  saveCourse, 
  saveCourses,
  getActiveCourseId, 
  setActiveCourseId,
  createDefaultCourse,
  createCourseFromTemplate
} from "@/utils/storage";
import { generateImageTranscript } from "@/utils/imageExport";
import { GradingComponent, GRADING_TEMPLATES } from "@/utils/gradingSystems";

const ModernGradeCalculator = forwardRef<{ scrollToSettings: () => void }, {}>((props, ref) => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [activeCourseId, setActiveCourseIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periodTab, setPeriodTab] = useState("midterm");
  const [showCalculations, setShowCalculations] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    scrollToSettings: () => {
      setConfigOpen(true);
    }
  }));

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeTemplate = GRADING_TEMPLATES.find(t => t.id === activeCourse?.templateId) || GRADING_TEMPLATES[0];

  useEffect(() => {
    const init = async () => {
      const savedCourses = loadCourses();
      const savedActiveId = getActiveCourseId();
      
      let updatedCourses = [...savedCourses];
      let needsSaving = false;

      // 1. Ensure Theory core template is represented
      GRADING_TEMPLATES.forEach(template => {
        const hasCore = updatedCourses.some(c => c.templateId === template.id);
        if (!hasCore) {
           // Add fresh core subject
           const newCourse: CourseData = {
              id: crypto.randomUUID(),
              name: template.name,
              templateId: template.id,
              passingGrade: template.passingGrade,
              midtermComponents: JSON.parse(JSON.stringify(template.defaultComponents)),
              finalsComponents: JSON.parse(JSON.stringify(template.defaultComponents)),
              settings: {
                midtermWeight: template.periodRatios.midterm,
                finalsWeight: template.periodRatios.finals,
                targetGrade: 75
              },
              lastModified: new Date().toISOString()
           };
           updatedCourses.push(newCourse);
           needsSaving = true;
        }
      });

      // 2. Final Sync: Ensure names and thresholds match templates exactly for core IDs
      updatedCourses = updatedCourses.map(c => {
         const template = GRADING_TEMPLATES.find(t => t.id === c.templateId);
         if (template) {
            if (c.name !== template.name || c.passingGrade !== template.passingGrade) {
               needsSaving = true;
               return { ...c, name: template.name, passingGrade: template.passingGrade };
            }
         }
         return c;
      });

      // 3. Cleanup: Remove any subjects that are not in the core registry unless they were custom created
      const finalCourses = updatedCourses.filter(c => {
         const isCore = GRADING_TEMPLATES.some(t => t.id === c.templateId);
         return isCore || !["Diff Cal", "Integral Cal", "CMAT", "Strema"].includes(c.name);
      });

      if (finalCourses.length !== updatedCourses.length) needsSaving = true;

      if (needsSaving || savedCourses.length === 0) {
        setCourses(finalCourses);
        saveCourses(finalCourses);
        const validActiveId = savedActiveId && finalCourses.find(c => c.id === savedActiveId) 
          ? savedActiveId 
          : finalCourses[0].id;
        setActiveCourseIdState(validActiveId);
        setActiveCourseId(validActiveId);
      } else {
        setCourses(finalCourses);
        setActiveCourseIdState(savedActiveId || finalCourses[0].id);
      }
      
      setIsLoading(false);
    };
    init();
  }, []);

  if (isLoading || !activeCourse) return <div className="p-8 text-center animate-pulse text-primary font-black uppercase tracking-widest">Initializing Pink Grade Engine... 🌸</div>;

  const midtermGrade = calculateTotalPeriodGrade(activeCourse.midtermComponents);
  const finalsGrade = calculateTotalPeriodGrade(activeCourse.finalsComponents);

  const passingGrade = activeCourse.passingGrade ?? activeTemplate.passingGrade;
  const finalGrade = calculateFinalGrade(
    midtermGrade, 
    finalsGrade, 
    activeCourse.settings.midtermWeight, 
    activeCourse.settings.finalsWeight
  );
  const gpe = calculateGPE(finalGrade, passingGrade);
  const gradeColor = getGradeColor(finalGrade, passingGrade);

  // Weight validation
  const midtermWeightTotal = activeCourse.midtermComponents.reduce((s, c) => s + c.weight, 0);
  const finalsWeightTotal = activeCourse.finalsComponents.reduce((s, c) => s + c.weight, 0);
  const isMidtermWeightValid = Math.abs(midtermWeightTotal - 1) < 0.001;
  const isFinalsWeightValid = Math.abs(finalsWeightTotal - 1) < 0.001;

  const updateCourse = (updatedCourse: CourseData) => {
    const updatedCourses = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    setCourses(updatedCourses);
    saveCourse(updatedCourse);
  };

  const handleComponentChange = (period: 'midterm' | 'finals', componentId: string, updates: Partial<GradingComponent>) => {
    const updatedCourse = JSON.parse(JSON.stringify(activeCourse));
    const components = period === 'midterm' ? updatedCourse.midtermComponents : updatedCourse.finalsComponents;
    const index = components.findIndex((c: GradingComponent) => c.id === componentId);
    if (index !== -1) {
      components[index] = { ...components[index], ...updates };
      updateCourse(updatedCourse);
    }
  };

  const handleSubScoreChange = (period: 'midterm' | 'finals', componentId: string, index: number, value: number | null, isMax: boolean = false) => {
    const updatedCourse = JSON.parse(JSON.stringify(activeCourse));
    const components = period === 'midterm' ? updatedCourse.midtermComponents : updatedCourse.finalsComponents;
    const compIndex = components.findIndex((c: GradingComponent) => c.id === componentId);
    if (compIndex !== -1) {
      const comp = components[compIndex];
      if (comp.isAverage && comp.subScores && comp.subMaxScores) {
        if (isMax) {
          comp.subMaxScores[index] = value;
        } else {
          comp.subScores[index] = value;
        }
        updateCourse(updatedCourse);
      }
    }
  };

  const handleAddSubScore = (period: 'midterm' | 'finals', componentId: string) => {
    const updatedCourse = JSON.parse(JSON.stringify(activeCourse));
    const components = period === 'midterm' ? updatedCourse.midtermComponents : updatedCourse.finalsComponents;
    const compIndex = components.findIndex((c: GradingComponent) => c.id === componentId);
    if (compIndex !== -1) {
      const comp = components[compIndex];
      if (comp.isAverage && comp.subScores && comp.subMaxScores) {
        comp.subScores.push(null);
        comp.subMaxScores.push(100);
        updateCourse(updatedCourse);
      }
    }
  };

  const handleRemoveSubScore = (period: 'midterm' | 'finals', componentId: string, index: number) => {
    const updatedCourse = JSON.parse(JSON.stringify(activeCourse));
    const components = period === 'midterm' ? updatedCourse.midtermComponents : updatedCourse.finalsComponents;
    const compIndex = components.findIndex((c: GradingComponent) => c.id === componentId);
    if (compIndex !== -1) {
      const comp = components[compIndex];
      if (comp.isAverage && comp.subScores && comp.subMaxScores && comp.subScores.length > 1) {
        comp.subScores.splice(index, 1);
        comp.subMaxScores.splice(index, 1);
        updateCourse(updatedCourse);
      }
    }
  };

  const handleWeightChange = (weightType: string, value: number) => {
    const newWeight = value / 100;
    const updatedCourse = JSON.parse(JSON.stringify(activeCourse));
    
    if (weightType === 'midtermWeight') {
      updatedCourse.settings.midtermWeight = newWeight;
      updatedCourse.settings.finalsWeight = Number((1 - newWeight).toFixed(2));
    } else if (weightType === 'finalsWeight') {
      updatedCourse.settings.finalsWeight = newWeight;
      updatedCourse.settings.midtermWeight = Number((1 - newWeight).toFixed(2));
    }
    updateCourse(updatedCourse);
  };

  const handleSaveImage = async () => {
    setIsExporting(true);
    try {
      await generateImageTranscript(activeCourse);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleHardReset = () => {
    const initialCourses = GRADING_TEMPLATES.map(t => {
      const course: CourseData = {
        id: crypto.randomUUID(),
        name: t.name,
        templateId: t.id,
        passingGrade: t.passingGrade,
        midtermComponents: JSON.parse(JSON.stringify(t.defaultComponents)),
        finalsComponents: JSON.parse(JSON.stringify(t.defaultComponents)),
        settings: {
          midtermWeight: t.periodRatios.midterm,
          finalsWeight: t.periodRatios.finals,
          targetGrade: 75
        },
        lastModified: new Date().toISOString()
      };
      return course;
    });
    
    setCourses(initialCourses);
    setActiveCourseIdState(initialCourses[0].id);
    setActiveCourseId(initialCourses[0].id);
    
    localStorage.removeItem('grade-calculator-courses'); 
    initialCourses.forEach(saveCourse);
    
    setConfigOpen(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background selection:bg-primary/20">
      {/* Sticky Header Status */}
      <header className="w-full bg-background/60 backdrop-blur-xl border-b border-primary/10 p-4 shrink-0 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between lg:max-w-none">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Grade</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-black ${gradeColor} tabular-nums tracking-tighter lg:text-5xl`}>{naturalRound(finalGrade)}</span>
              <span className="text-xs font-bold text-muted-foreground/50">%</span>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col items-center gap-2 flex-1 justify-center px-12">
             <div className="flex items-center gap-12">
               <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Midterm</span>
                 <span className={`font-mono text-xl font-bold ${midtermGrade < passingGrade ? 'text-destructive' : 'text-foreground'}`}>{midtermGrade.toFixed(1)}%</span>
               </div>
               <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Finals</span>
                 <span className={`font-mono text-xl font-bold ${finalsGrade < passingGrade ? 'text-destructive' : 'text-foreground'}`}>{finalsGrade.toFixed(1)}%</span>
               </div>
             </div>
             <div className="w-full max-w-xs space-y-1">
               <Progress value={finalGrade} className="h-1.5 bg-primary/10" />
               <div className="flex justify-between text-[7px] font-black uppercase opacity-40"><span>0</span><span>Passing Threshold: {passingGrade}%</span><span>100</span></div>
             </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Scale GPE</span>
            <span className={`text-2xl font-black ${gradeColor} tabular-nums tracking-tighter lg:text-3xl`}>{gpe}</span>
          </div>
        </div>
      </header>

      {/* Subject Stream Tabs */}
      <div className="w-full bg-muted/30 border-b border-primary/5 px-4 py-2 shrink-0">
        <ScrollArea className="w-full" orientation="horizontal">
          <div className="flex items-center gap-2 pb-2">
            {courses.map(course => (
              <Button
                key={course.id}
                variant={activeCourseId === course.id ? "default" : "ghost"}
                size="sm"
                onClick={() => { setActiveCourseIdState(course.id); setActiveCourseId(course.id); }}
                className={`rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCourseId === course.id ? 'shadow-lg shadow-primary/20 scale-105' : 'text-muted-foreground/60 hover:bg-primary/5'}`}
              >
                {course.name}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setConfigOpen(true)}
              className="rounded-full w-9 h-9 border-primary/10 bg-background/50 hover:bg-primary/5 shrink-0"
            >
              <Plus className="w-4 h-4 text-primary" />
            </Button>
          </div>
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1">
        <main className="p-4 lg:p-12 pb-32">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Weight Validation Alerts */}
            {(!isMidtermWeightValid || !isFinalsWeightValid) && (
              <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/10 animate-pulse">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-black text-xs uppercase tracking-widest">Weight Distribution Error</AlertTitle>
                <AlertDescription className="text-xs font-medium opacity-80">
                  {!isMidtermWeightValid && `Midterm weights sum to ${(midtermWeightTotal * 100).toFixed(0)}% (must be 100%). `}
                  {!isFinalsWeightValid && `Finals weights sum to ${(finalsWeightTotal * 100).toFixed(0)}% (must be 100%).`}
                  Adjust components in configuration.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-sm animate-fade-in">
                  <LayoutGrid className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight leading-none lg:text-4xl text-foreground">{activeCourse.name}</h1>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Calculator Stream</span>
                </div>
              </div>

              <div className="flex gap-3">
                <TooltipProvider>
                  <Tooltip defaultOpen>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleSaveImage} disabled={isExporting} className="rounded-2xl w-12 h-12 border-primary/20 active:scale-95 transition-all bg-primary/5 hover:bg-primary/20 shadow-sm group">
                        <Share2 className={`w-5 h-5 text-primary group-hover:scale-110 transition-transform ${isExporting ? 'animate-pulse' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-primary text-primary-foreground font-black text-[10px] rounded-xl px-4 py-2 border-none">SHARE YOUR ACADEMIC SUCCESS! ✨</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Drawer open={configOpen} onOpenChange={setConfigOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-2xl w-12 h-12 bg-muted border border-primary/10 hover:bg-muted/80 shadow-sm">
                      <Settings className="w-6 h-6 text-primary" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="rounded-t-[2.5rem] border-primary/10 h-[90vh] bg-background">
                    <DrawerHeader><DrawerTitle className="text-center font-black uppercase tracking-[0.2em] text-xs text-muted-foreground mt-2">Configuration Settings</DrawerTitle></DrawerHeader>
                    <ScrollArea className="p-8 h-full">
                      <div className="max-w-md mx-auto space-y-12 pb-20">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Course Selection</Label>
                          <CourseSelector courses={courses} activeCourseId={activeCourseId} onCourseSelect={(id) => { setActiveCourseIdState(id); setActiveCourseId(id); }} onCourseCreate={(c) => setCourses([...courses, c])} onCourseDelete={(id) => setCourses(courses.filter(c => c.id !== id))} onCourseUpdate={(c) => setCourses(courses.map(cur => cur.id === c.id ? c : cur))} />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary px-1 text-center block">Target Grade %</Label>
                          <div className="bg-primary/10 p-8 rounded-[2rem] border border-primary/20 text-center space-y-6 shadow-inner">
                            <div className="text-6xl font-black text-primary tabular-nums tracking-tighter">{activeCourse.settings.targetGrade}%</div>
                            <div className="flex items-center justify-center gap-8">
                              <Button variant="outline" size="icon" className="rounded-full w-14 h-14 border-primary/20 bg-background hover:bg-primary/5 shadow-sm" onClick={() => updateCourse({...activeCourse, settings: {...activeCourse.settings, targetGrade: activeCourse.settings.targetGrade - 1}})}><Minus className="w-5 h-5 text-primary" /></Button>
                              <Button variant="outline" size="icon" className="rounded-full w-14 h-14 border-primary/20 bg-background hover:bg-primary/5 shadow-sm" onClick={() => updateCourse({...activeCourse, settings: {...activeCourse.settings, targetGrade: activeCourse.settings.targetGrade + 1}})}><Plus className="w-5 h-5 text-primary" /></Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Period Balance</Label>
                          <Card className="rounded-[2rem] border-primary/10 bg-muted/30 shadow-sm">
                            <CardContent className="p-8 space-y-10">
                              <div className="space-y-6">
                                <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-primary">Midterm Contribution</span><span className="text-xs font-mono font-black">{Math.round(activeCourse.settings.midtermWeight * 100)}%</span></div>
                                <Slider value={[activeCourse.settings.midtermWeight * 100]} max={100} min={0} step={5} onValueChange={(v) => handleWeightChange('midtermWeight', v[0])} className="py-2" />
                                <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-primary">Finals Contribution</span><span className="text-xs font-mono font-black">{Math.round(activeCourse.settings.finalsWeight * 100)}%</span></div>
                                <Slider value={[activeCourse.settings.finalsWeight * 100]} max={100} min={0} step={5} onValueChange={(v) => handleWeightChange('finalsWeight', v[0])} className="py-2" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 border-primary/10 hover:bg-destructive/10 hover:text-destructive transition-colors"><History className="w-4 h-4" /> Reset Course Logic</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem] border-destructive/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-black text-destructive">Wipe All Data?</AlertDialogTitle>
                              <AlertDialogDescription className="font-medium text-muted-foreground/80">
                                This will delete ALL your current scores and restore the default subject registry (Diff Cal, Integral Cal, CMAT, and Strema). This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl text-[10px] font-black uppercase tracking-widest border-none hover:bg-muted shadow-none">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleHardReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-sm shadow-destructive/20 transition-all active:scale-95">Reset Registry</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </ScrollArea>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            {/* Accuracy Disclaimer */}
            <Alert className="rounded-2xl border-primary/20 bg-primary/5 border-dashed">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="font-black text-[10px] uppercase tracking-widest text-primary">Accuracy Disclaimer</AlertTitle>
              <AlertDescription className="text-[10px] font-medium opacity-70 leading-relaxed">
                This calculator may or may not be 100% accurate as professors have different types of curving grades and rounding policies. Use this as a general guide only.
              </AlertDescription>
            </Alert>

            <Tabs value={periodTab} onValueChange={setPeriodTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-2xl h-16 border border-primary/10 lg:max-w-sm shadow-inner">
                <TabsTrigger value="midterm" className="rounded-xl text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Midterm Period</TabsTrigger>
                <TabsTrigger value="finals" className="rounded-xl text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Finals Period</TabsTrigger>
              </TabsList>
              
              <div className="mt-12 lg:grid lg:grid-cols-[1fr_400px] lg:gap-16">
                <div className="space-y-12">
                  <TabsContent value="midterm" className="m-0 focus-visible:outline-none">
                    <GradingPeriod 
                      periodName="Midterm" 
                      components={activeCourse.midtermComponents} 
                      periodGrade={midtermGrade}
                      passingGrade={passingGrade}
                      onComponentChange={(id, updates) => handleComponentChange('midterm', id, updates)}
                      onSubScoreChange={(id, idx, val, isMax) => handleSubScoreChange('midterm', id, idx, val, isMax)}
                      onAddSubScore={(id) => handleAddSubScore('midterm', id)}
                      onRemoveSubScore={(id, idx) => handleRemoveSubScore('midterm', id, idx)}
                      onShowCalc={() => setShowCalculations(!showCalculations)}
                    />
                  </TabsContent>
                  <TabsContent value="finals" className="m-0 focus-visible:outline-none">
                    <GradingPeriod 
                      periodName="Finals" 
                      components={activeCourse.finalsComponents} 
                      periodGrade={finalsGrade}
                      passingGrade={passingGrade}
                      onComponentChange={(id, updates) => handleComponentChange('finals', id, updates)}
                      onSubScoreChange={(id, idx, val, isMax) => handleSubScoreChange('finals', id, idx, val, isMax)}
                      onAddSubScore={(id) => handleAddSubScore('finals', id)}
                      onRemoveSubScore={(id, idx) => handleRemoveSubScore('finals', id, idx)}
                      onShowCalc={() => setShowCalculations(!showCalculations)}
                    />
                  </TabsContent>
                </div>

                <div className="space-y-10">
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full shadow-sm" />
                      <h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Computation Preview</h3>
                    </div>
                    
                    <Collapsible open={showCalculations} onOpenChange={setShowCalculations} className="w-full">
                      <CollapsibleContent className="space-y-4 animate-accordion-down overflow-hidden">
                        <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 lg:p-10 relative shadow-sm">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Live Proof Engine</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowCalculations(false)} className="rounded-full hover:bg-primary/10"><ChevronUp className="w-4 h-4 text-primary" /></Button>
                          </div>
                          <CalculationPreview activeCourse={activeCourse} grades={{midterm: midtermGrade, finals: finalsGrade, finalGrade}} />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {!showCalculations && (
                      <Card className="rounded-[2.5rem] border-primary/10 bg-muted/20 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Calculator className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ready for analysis</h4>
                          <p className="text-[10px] font-medium text-muted-foreground/60 max-w-[200px]">Click 'Show Calculations' to see the LaTeX breakdown of your grades.</p>
                        </div>
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-xl" onClick={() => setShowCalculations(true)}>Open Engine</Button>
                      </Card>
                    )}
                  </section>
                </div>
              </div>
            </Tabs>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
});

export default ModernGradeCalculator;
