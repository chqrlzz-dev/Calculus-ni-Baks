import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Calculator, 
  Settings, 
  User, 
  BookOpen, 
  ExternalLink,
  GraduationCap,
  FileCode,
  Boxes,
  Cpu,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  FileText,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface MainLayoutProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onSettingsClick }) => {
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans lg:flex-row lg:overflow-hidden selection:bg-primary/20">
      {/* Laptop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 border-r border-primary/10 bg-primary/[0.02] p-8 shrink-0">
        <div className="flex flex-col h-full">
          <div className="mb-12 flex flex-col items-start gap-1 relative w-full">
            <h1 className="text-3xl font-black tracking-tighter text-primary leading-none">Calculus ni Baks 📘✏️</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">Engineering Grade Suite</p>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="absolute -top-2 -right-2 rounded-xl bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 active:scale-90 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>

          <nav className="flex flex-col gap-3 flex-1">
            <Link to="/">
              <Button variant="ghost" className={`w-full justify-start h-14 rounded-2xl gap-4 px-6 transition-all active:scale-95 ${path === '/' ? 'bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:bg-primary/90' : 'text-muted-foreground font-bold hover:bg-primary/5 hover:text-primary'}`}>
                <Calculator className="w-5 h-5" /> Calculator
              </Button>
            </Link>
            <Link to="/calculations">
              <Button variant="ghost" className={`w-full justify-start h-14 rounded-2xl gap-4 px-6 transition-all active:scale-95 ${path === '/calculations' ? 'bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:bg-primary/90' : 'text-muted-foreground font-bold hover:bg-primary/5 hover:text-primary'}`}>
                <BookOpen className="w-5 h-5" /> Grading Rules
              </Button>
            </Link>
            <Link to="/developer">
              <Button variant="ghost" className={`w-full justify-start h-14 rounded-2xl gap-4 px-6 transition-all active:scale-95 ${path === '/developer' ? 'bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:bg-primary/90' : 'text-muted-foreground font-bold hover:bg-primary/5 hover:text-primary'}`}>
                <User className="w-5 h-5" /> Developer
              </Button>
            </Link>
          </nav>

          <div className="mt-auto space-y-6">
            <Separator className="bg-primary/10" />
            <div className="grid grid-cols-2 gap-4 px-2">
               <Link to="/faq" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Support</Link>
               <Link to="/feedback" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Feedback</Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-[0.3em]">Crafted with 💖 by @chqrlzz</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative lg:h-screen lg:overflow-hidden">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm bg-background/60 backdrop-blur-2xl border border-primary/10 p-2.5 rounded-[2rem] shadow-2xl lg:hidden ring-1 ring-primary/5">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex-1">
            <Button variant="ghost" className={`w-full flex flex-col gap-1 h-14 rounded-2xl transition-all active:scale-90 ${path === '/' ? 'bg-primary/10 text-primary font-black' : 'text-muted-foreground font-bold hover:text-primary'}`}>
              <Calculator className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-widest">Calc</span>
            </Button>
          </Link>
          <Link to="/calculations" className="flex-1">
            <Button variant="ghost" className={`w-full flex flex-col gap-1 h-14 rounded-2xl transition-all active:scale-90 ${path === '/calculations' ? 'bg-primary/10 text-primary font-black' : 'text-muted-foreground font-bold hover:text-primary'}`}>
              <BookOpen className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-widest">Rules</span>
            </Button>
          </Link>
          <Link to="/developer" className="flex-1">
            <Button variant="ghost" className={`w-full flex flex-col gap-1 h-14 rounded-2xl transition-all active:scale-90 ${path === '/developer' ? 'bg-primary/10 text-primary font-black' : 'text-muted-foreground font-bold hover:text-primary'}`}>
              <User className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-widest">Dev</span>
            </Button>
          </Link>
          
          <Drawer open={open} onOpenChange={setOpen}>
            {onSettingsClick ? (
               <Button 
                variant="ghost" 
                onClick={onSettingsClick}
                className="flex-1 flex flex-col gap-1 h-14 rounded-2xl text-muted-foreground font-bold active:scale-90 hover:text-primary"
               >
                 <Settings className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-widest">Setup</span>
               </Button>
            ) : (
              <DrawerTrigger asChild>
                <Button variant="ghost" className="flex-1 flex flex-col gap-1 h-14 rounded-2xl text-muted-foreground font-bold active:scale-90 hover:text-primary">
                  <Settings className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-widest">Setup</span>
                </Button>
              </DrawerTrigger>
            )}
            <DrawerContent className="rounded-t-[3rem] border-primary/10 h-[85vh] bg-background">
              <DrawerHeader><DrawerTitle className="text-center font-black uppercase tracking-[0.3em] text-[10px] py-4 text-muted-foreground">Suite Console</DrawerTitle></DrawerHeader>
              <ScrollArea className="h-full px-8 pb-20">
                <div className="space-y-12">
                  <div className="space-y-4 flex justify-between items-center px-1">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Theme</Label>
                    <Button 
                      variant="outline" 
                      onClick={toggleTheme}
                      className="rounded-xl bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 active:scale-95 transition-all h-10 gap-2 px-4"
                    >
                      {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{isDark ? 'Light' : 'Dark'} Mode</span>
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary px-1">Professional Toolkit</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { icon: <GraduationCap className="w-6 h-6" />, label: "GWA Calculator", path: "https://gwa-calculator-ni-baks.vercel.app/" },
                        { icon: <FileCode className="w-6 h-6" />, label: "BSCE Curriculum", path: "https://psychiotric-sudo.github.io/curriculum/" },
                        { icon: <Boxes className="w-6 h-6" />, label: "PSet Generator", path: "https://psychiotric-sudo.github.io/pset_generator/" },
                        { icon: <Cpu className="w-6 h-6" />, label: "File Tree Generator", path: "https://09sychic.github.io/filetree/" },
                      ].map((tool, i) => (
                        <a 
                          key={i} 
                          href={tool.path} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-6 p-6 bg-primary/[0.03] border border-primary/10 rounded-[2rem] active:scale-[0.98] transition-all hover:bg-primary/[0.06] shadow-sm"
                          onClick={() => setOpen(false)}
                        >
                          <div className="w-16 h-16 rounded-[1.2rem] bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">{tool.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-sm font-black uppercase tracking-tight text-foreground">{tool.label}</h4>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-20 text-primary" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Reference & Legal</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: <HelpCircle className="w-5 h-5" />, label: "Support", path: "/faq" },
                        { icon: <MessageSquare className="w-5 h-5" />, label: "Feedback", path: "/feedback" },
                        { icon: <ShieldCheck className="w-5 h-5" />, label: "Privacy", path: "/privacy" },
                        { icon: <FileText className="w-5 h-5" />, label: "Terms", path: "/terms" },
                      ].map((item, i) => (
                        <Button 
                          key={i} 
                          variant="outline" 
                          className="h-24 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 border-primary/10 bg-muted/30 active:scale-95 transition-all hover:bg-primary/5 hover:border-primary/20 group" 
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link to={item.path}>
                            <span className="opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all scale-110">{item.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">{item.label}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
