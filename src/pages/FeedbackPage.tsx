import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Star, MessageSquare, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { sendFeedback } from "@/draeAnalytics";

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);
  }, []);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await sendFeedback(
        `Rating: ${rating} Star(s)`,
        feedback,
        email
      );
      alert("Feedback received! Thank you for improving Calculus ni Baks.");
      setFeedback("");
      setEmail("");
      setRating(0);
    } catch (err) {
      console.error(err);
      alert("Failed to send feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-white/5 p-4 safe-top">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-muted/30">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tighter">Feedback</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-8 animate-fade-in">
        <section className="text-center py-6 space-y-2">
          <div className="w-16 h-16 bg-primary/20 rounded-[28px] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary fill-primary/20" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Help us grow.</h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-8">Your thoughts drive the next generation of academic tools.</p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-4 px-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rate your experience</Label>
            <div className="flex justify-between bg-muted/20 p-5 rounded-[32px] border border-white/5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`h-8 w-8 transition-all ${
                      star <= rating
                        ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                        : "text-muted-foreground/30 hover:text-primary/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3 px-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Email (Optional)</Label>
            <Input
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 bg-muted/20 border-white/5 rounded-2xl px-6 font-bold focus-visible:ring-primary/50"
            />
          </div>

          {/* Feedback */}
          <div className="space-y-3 px-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Message</Label>
            <Textarea
              placeholder="Found a bug? Have a request? Speak your mind..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[160px] bg-muted/20 border-white/5 rounded-[32px] p-6 font-bold focus-visible:ring-primary/50 leading-relaxed"
              required
            />
          </div>

          <div className="px-2 pt-4">
            <Button 
              type="submit" 
              className="w-full h-16 rounded-[24px] font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
              disabled={isSubmitting || !feedback.trim()}
            >
              {isSubmitting ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Transmission
                </span>
              )}
            </Button>
          </div>
        </form>

        <Separator className="bg-white/5" />

        <section className="px-2 py-4">
          <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xs uppercase tracking-wider">Direct Access</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                For urgent technical issues, you can also reach us via the support link in the Menu drawer.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FeedbackPage;
