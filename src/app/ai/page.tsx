"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  FileText, 
  Search, 
  Zap, 
  Target, 
  PenTool, 
  MessageSquare, 
  ArrowRight,
  BrainCircuit,
  Layout,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { aiService } from "@/services/ai.service";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type ToolType = "ask" | "analyze-cv" | "skill-gap" | "improve-job";

interface Message {
  role: "user" | "ai";
  content: string | any;
  type?: "text" | "analysis";
}

export default function AiPage() {
  const [activeTool, setActiveTool] = useState<ToolType>("ask");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await aiService.ask(input);
      setMessages(prev => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      toast.error("Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeCv = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      const analysis = await aiService.analyzeCv({
        cvText: input,
        applyToProfile: false,
        syncSkills: false
      });
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: analysis,
        type: "analysis"
      }]);
      toast.success("CV Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze CV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Sidebar Tools */}
      <aside className="w-80 border-r border-border bg-accent/5 p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">AI Suite</h2>
          <div className="space-y-2">
            <ToolButton 
              active={activeTool === "ask"}
              onClick={() => setActiveTool("ask")}
              icon={<MessageSquare size={18} />}
              title="General Assistant"
              description="Ask anything about your career"
            />
            <ToolButton 
              active={activeTool === "analyze-cv"}
              onClick={() => setActiveTool("analyze-cv")}
              icon={<FileText size={18} />}
              title="CV Analyzer"
              description="Review and optimize your resume"
            />
            <ToolButton 
              active={activeTool === "skill-gap"}
              onClick={() => setActiveTool("skill-gap")}
              icon={<Target size={18} />}
              title="Skill Gap"
              description="See how you fit a job"
            />
            <ToolButton 
              active={activeTool === "improve-job"}
              onClick={() => setActiveTool("improve-job")}
              icon={<PenTool size={18} />}
              title="Job Improver"
              description="Perfect your job listings"
            />
          </div>
        </div>

        <div className="mt-auto">
          <Card className="p-4 bg-primary/10 border-primary/20">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
              <Zap size={14} fill="currentColor" />
              Pro Feature
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              AI analysis is powered by advanced models to provide high-quality career advice.
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs">Learn More</Button>
          </Card>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col relative bg-mesh">
        {/* Header */}
        <header className="p-6 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              {activeTool === "ask" && <MessageSquare size={20} />}
              {activeTool === "analyze-cv" && <FileText size={20} />}
              {activeTool === "skill-gap" && <Target size={20} />}
              {activeTool === "improve-job" && <PenTool size={20} />}
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">
                {activeTool === "ask" && "AI Personal Assistant"}
                {activeTool === "analyze-cv" && "Resume Reviewer"}
                {activeTool === "skill-gap" && "Skill Match Intelligence"}
                {activeTool === "improve-job" && "Listing Optimizer"}
              </h1>
              <p className="text-xs text-muted-foreground">Powered by AIJob Intelligence</p>
            </div>
          </div>
          
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
            <Sparkles size={12} className="mr-1.5" /> AI Online
          </Badge>
        </header>

        {/* Chat / Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center anim-pulse">
                <BrainCircuit size={40} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">How can I help you today?</h3>
                <p className="text-muted-foreground">
                  {activeTool === "ask" && "Ask me about job market trends, interview tips, or career paths."}
                  {activeTool === "analyze-cv" && "Paste your resume text here to get professional feedback and improvements."}
                  {activeTool === "skill-gap" && "Compare your profile with a specific job description to find missing skills."}
                  {activeTool === "improve-job" && "Enter your job details to get an optimized, more engaging version."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {activeTool === "ask" && (
                  <>
                    <Suggestion title="Salary Trends" onClick={() => setInput("What are the salary trends for frontend developers?")} />
                    <Suggestion title="Interview Prep" onClick={() => setInput("Help me prepare for a senior React role interview.")} />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex gap-4",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                  )}>
                    {msg.role === "user" ? <Users size={14} /> : <Zap size={14} />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl p-4 shadow-sm",
                    msg.role === "user" 
                      ? "bg-accent text-accent-foreground rounded-tr-none" 
                      : "bg-card border border-border rounded-tl-none"
                  )}>
                    {msg.type === "analysis" ? (
                      <CvAnalysisView data={msg.content} />
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed text-sm">
                        {msg.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                    <Zap size={14} className="animate-pulse" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
                    <Spinner size="sm" />
                    <span className="text-sm text-muted-foreground animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-6 bg-background/50 backdrop-blur-md border-t border-border">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -top-12 left-0 right-0 flex justify-center opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">Smart AI Interface</span>
            </div>
            <div className="relative">
              {activeTool === "ask" ? (
                <div className="flex items-end gap-2">
                  <div className="relative flex-1">
                    <Textarea 
                      placeholder="Type your question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAsk();
                        }
                      }}
                      className="min-h-[50px] max-h-[200px] bg-card border-border/50 focus:border-primary pr-12 rounded-2xl resize-none py-4"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                       <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-accent px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">↵</span>
                      </kbd>
                    </div>
                  </div>
                  <Button 
                    className="h-[50px] w-[50px] rounded-2xl shrink-0 shadow-lg shadow-primary/20"
                    disabled={isLoading || !input.trim()}
                    onClick={handleAsk}
                  >
                    <Send size={20} />
                  </Button>
                </div>
              ) : activeTool === "analyze-cv" ? (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Paste your resume / CV text here to analyze..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[150px] bg-card border-border/50 focus:border-primary rounded-2xl p-6"
                  />
                  <Button 
                    className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-black text-lg gap-3"
                    disabled={isLoading || !input.trim()}
                    onClick={handleAnalyzeCv}
                  >
                    <Zap size={20} fill="currentColor" /> Analyze CV
                  </Button>
                </div>
              ) : (
                <Card className="p-8 text-center border-dashed border-2">
                  <Layout className="mx-auto mb-4 text-muted-foreground" size={40} />
                  <h4 className="font-bold mb-2">Feature Coming Soon</h4>
                  <p className="text-sm text-muted-foreground">
                    This tool is currently being optimized for the best experience.
                  </p>
                </Card>
              )}
            </div>
            <p className="text-[10px] text-center mt-3 text-muted-foreground uppercase tracking-widest font-bold">
              AI can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function ToolButton({ icon, title, description, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left group",
        active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "hover:bg-accent text-foreground"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
        active ? "bg-white/20 text-white rotate-6" : "bg-accent/80 text-primary group-hover:scale-110"
      )}>
        {icon}
      </div>
      <div>
        <h3 className="font-black text-sm tracking-tight">{title}</h3>
        <p className={cn(
          "text-[10px] mt-0.5 leading-tight opacity-70",
          active ? "text-white" : "text-muted-foreground"
        )}>{description}</p>
      </div>
    </button>
  );
}

function Suggestion({ title, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="p-3 bg-accent/30 border border-border/30 rounded-xl hover:bg-accent transition-all text-xs font-bold text-foreground flex items-center justify-between group"
    >
      {title}
      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    </button>
  );
}

function CvAnalysisView({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight">{data.fullName}</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{data.experienceYears} Years of Experience</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-lg border border-primary/20">
          {Math.min(95, 70 + data.experienceYears * 2)}%
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-black mb-3">
            <Zap size={14} className="text-amber-500" /> Professional Summary
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {data.professionalSummary}
          </p>
        </div>
        
        <div>
          <h4 className="flex items-center gap-2 text-sm font-black mb-3">
            <Target size={14} className="text-primary" /> Key Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skills?.map((s: string) => (
              <Badge key={s} variant="outline" className="text-[10px] font-bold px-2 py-0">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-accent/20 p-4 rounded-xl border border-border/50">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-primary">Resume Optimization</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-3 bg-red-500/5 border-red-500/10">
            <p className="text-[10px] font-black uppercase text-red-500 mb-1">Missing Sections</p>
            <ul className="text-[10px] space-y-1">
              {data.missingOrWeakSections?.slice(0, 3).map((item: string) => (
                <li key={item} className="flex gap-1">
                  <span className="text-red-500">•</span> {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-3 bg-blue-500/5 border-blue-500/10 col-span-2">
            <p className="text-[10px] font-black uppercase text-blue-500 mb-1">How to Improve</p>
            <ul className="text-[10px] grid grid-cols-2 gap-x-4 gap-y-1">
              {data.howToImprove?.slice(0, 4).map((item: string) => (
                <li key={item} className="flex gap-1">
                  <span className="text-blue-500">•</span> {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
