"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { aiService } from "@/services/ai.service";
import { jobMatchingService } from "@/services/job-matching.service";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { getApiError } from "@/lib/axios";
import toast from "react-hot-toast";
import { Sparkles, FileText, Target, MessageSquare, Briefcase, Copy, Check, Bot, Search, Edit } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { clsx } from "clsx";
import type { 
    AiAnalyzeCvResponse, 
    AiDraftResponse, 
    AiImproveJobResponse, 
    AiSkillGapResponse 
} from "@/types/ai";




function ResultBox({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{label}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
          {copied ? <><Check size={12} className="text-emerald-500"/>Скопировано</> : <><Copy size={12}/>Копировать</>}
        </button>
      </div>
      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  );
}




function AiTool({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>{icon}</div>
          <h2 className="font-bold text-slate-900">{title}</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">{children}</CardBody>
    </Card>
  );
}



function AiContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const defaultJobId = searchParams.get("jobId") || "";
  const isOrg = user?.role === "Organization";

  // Ask AI
  const [askPrompt, setAskPrompt] = useState("");
  const [askResult, setAskResult] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  // Analyze CV
  const [cvText, setCvText] = useState("");
  const [cvResult, setCvResult] = useState<AiAnalyzeCvResponse | null>(null);
  const [cvLoading, setCvLoading] = useState(false);

  // Skill Gap
  const [gapJobId, setGapJobId] = useState(defaultJobId);
  const [gapResult, setGapResult] = useState<AiSkillGapResponse | null>(null);
  const [gapLoading, setGapLoading] = useState(false);

  // Cover Letter
  const [coverJobId, setCoverJobId] = useState(defaultJobId);
  const [coverTone, setCoverTone] = useState("Professional");
  const [coverResult, setCoverResult] = useState<AiDraftResponse | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);

  // Message
  const [msgJobId, setMsgJobId] = useState(defaultJobId);
  const [msgRecipient, setMsgRecipient] = useState("");
  const [msgPurpose, setMsgPurpose] = useState("");
  const [msgTone, setMsgTone] = useState("Professional");
  const [msgResult, setMsgResult] = useState<AiDraftResponse | null>(null);
  const [msgLoading, setMsgLoading] = useState(false);

  // Improve Job
  const [jobId, setJobId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobLoc, setJobLoc] = useState("");
  const [jobExp, setJobExp] = useState(0);
  const [improveResult, setImproveResult] = useState<AiImproveJobResponse | null>(null);
  const [improveLoading, setImproveLoading] = useState(false);

  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  return (
    <div className="space-y-8 animate-fade-up pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
            <Sparkles size={28} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">AI Career Center</h1>
            <p className="text-muted-foreground font-medium">Elevate your path with artificial intelligence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ask AI */}
        <AiTool icon={<Bot size={22} className="text-primary"/>} title="Ask Anything" color="bg-primary/10">
          <Textarea 
            placeholder="How can I improve my LinkedIn profile for remote developer roles?" 
            rows={3} 
            value={askPrompt} 
            onChange={(e) => setAskPrompt(e.target.value)} 
            className="resize-none"
          />
          <Button 
            onClick={async () => {
              setAskLoading(true);
              try {
                const res = await aiService.ask(askPrompt);
                setAskResult(res);
              } catch (e) { toast.error(getApiError(e)); }
              finally { setAskLoading(false); }
            }} 
            loading={askLoading} 
            disabled={!askPrompt}
            fullWidth
          >
            <Sparkles size={16} className="mr-2"/> Generate Answer
          </Button>
          {askResult && <ResultBox text={askResult} label="AI Response" />}
        </AiTool>

        {!isOrg && (
          <>
            {/* Analyze CV */}
            <AiTool icon={<FileText size={22} className="text-purple-500"/>} title="CV Analyzer" color="bg-purple-500/10">
              <Textarea 
                placeholder="Paste your CV text here..." 
                rows={6} 
                value={cvText} 
                onChange={(e) => setCvText(e.target.value)} 
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    setCvLoading(true);
                    try {
                      const res = await aiService.analyzeCv({ cvText, applyToProfile: false, syncSkills: false });
                      setCvResult(res);
                    } catch (e) { toast.error(getApiError(e)); }
                    finally { setCvLoading(false); }
                  }} 
                  loading={cvLoading} 
                  disabled={!cvText}
                  fullWidth
                >
                  Analyze CV
                </Button>
              </div>
              {cvResult && (
                <div className="space-y-4 mt-2">
                  <ResultBox text={cvResult.professionalSummary} label="Extracted Summary" />
                  <div className="bg-accent/50 p-4 rounded-xl border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Extracted Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {cvResult.skills.map((s, i) => <span key={i} className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-md border border-primary/20">{s}</span>)}
                    </div>
                  </div>
                </div>
              )}
            </AiTool>

            

            {/* Skill Gap */}
            <AiTool icon={<Target size={22} className="text-cyan-500"/>} title="Skill Gap Analyst" color="bg-cyan-500/10">
              <Input label="Job ID" placeholder="Enter target job ID" type="number" value={gapJobId} onChange={(e) => setGapJobId(e.target.value)} />
              <Button 
                onClick={async () => {
                  setGapLoading(true);
                  try {
                    const res = await aiService.getSkillGap(Number(user?.id), Number(gapJobId));
                    setGapResult(res);
                  } catch (e) { toast.error(getApiError(e)); }
                  finally { setGapLoading(false); }
                }} 
                loading={gapLoading} 
                disabled={!gapJobId}
                fullWidth
              >
                Find Gaps
              </Button>
              {gapResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-primary/10 p-3 rounded-xl border border-primary/20">
                    <span className="text-sm font-bold">Match Score</span>
                    <span className="text-xl font-black text-primary">{gapResult.matchScore}%</span>
                  </div>
                  <ResultBox text={gapResult.fitSummary} label="Analysis" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Strengths</p>
                      <ul className="text-xs space-y-1">
                        {gapResult.strengths.slice(0, 3).map((s: string, i: number) => <li key={i} className="flex items-center gap-1"><Check size={10}/> {s}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                      <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Missing</p>
                      <ul className="text-xs space-y-1">
                        {gapResult.missingSkills.slice(0, 3).map((s: string, i: number) => <li key={i} className="flex items-center gap-1">• {s}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </AiTool>



            {/* Cover Letter */}
            <AiTool icon={<Edit size={22} className="text-emerald-500"/>} title="Cover Letter Draft" color="bg-emerald-500/10">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Job ID" placeholder="123" type="number" value={coverJobId} onChange={(e) => setCoverJobId(e.target.value)} />
                <Input label="Tone" placeholder="Professional, Enthusiastic..." value={coverTone} onChange={(e) => setCoverTone(e.target.value)} />
              </div>
              <Button 
                onClick={async () => {
                  setCoverLoading(true);
                  try {
                    const res = await aiService.draftCoverLetter({ jobId: Number(coverJobId), userId: Number(user?.id), tone: coverTone });
                    setCoverResult(res);
                  } catch (e) { toast.error(getApiError(e)); }
                  finally { setCoverLoading(false); }
                }} 
                loading={coverLoading} 
                disabled={!coverJobId}
                fullWidth
              >
                Draft Letter
              </Button>
              {coverResult && <ResultBox text={coverResult.content} label={coverResult.subject} />}
            </AiTool>

            {/* Message Draft */}
            <AiTool icon={<MessageSquare size={22} className="text-amber-500"/>} title="Networking Message" color="bg-amber-500/10">
               <div className="grid grid-cols-2 gap-3">
                <Input label="Recipient Name" placeholder="Hiring Manager" value={msgRecipient} onChange={(e) => setMsgRecipient(e.target.value)} />
                <Input label="Tone" value={msgTone} onChange={(e) => setMsgTone(e.target.value)} />
              </div>
              <Input label="Purpose" placeholder="Follow up on application" value={msgPurpose} onChange={(e) => setMsgPurpose(e.target.value)} />
              <Button 
                onClick={async () => {
                  setMsgLoading(true);
                  try {
                    const res = await aiService.draftMessage({ 
                      recipientName: msgRecipient, 
                      purpose: msgPurpose, 
                      tone: msgTone,
                      userId: Number(user?.id)
                    });
                    setMsgResult(res);
                  } catch (e) { toast.error(getApiError(e)); }
                  finally { setMsgLoading(false); }
                }} 
                loading={msgLoading} 
                disabled={!msgRecipient || !msgPurpose}
                fullWidth
              >
                Draft Message
              </Button>
              {msgResult && <ResultBox text={msgResult.content} label={msgResult.subject} />}
            </AiTool>
          </>
        )}



        {isOrg && (
          <AiTool icon={<Briefcase size={22} className="text-indigo-600"/>} title="Job Optimizer" color="bg-indigo-500/10">
            <Input label="Reference Job ID (optional)" value={jobId} onChange={(e) => setJobId(e.target.value)} />
            <Input label="Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Textarea label="Raw Description" placeholder="Briefly describe the role..." rows={4} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} />
            <Button 
                onClick={async () => {
                setImproveLoading(true);
                try {
                  const res = await aiService.improveJob({ 
                    jobId: Number(jobId) || 0,
                    title: jobTitle,
                    description: jobDesc,
                    location: jobLoc,
                    experienceRequired: jobExp,
                    applyToJob: false 
                  });
                  setImproveResult(res);
                } catch (e) { toast.error(getApiError(e)); }
                finally { setImproveLoading(false); }
              }} 
              loading={improveLoading} 
              disabled={!jobTitle || !jobDesc}
              fullWidth
            >
              Optimize Content
            </Button>
            {improveResult && (
              <div className="space-y-4">
                <ResultBox text={improveResult.improvedTitle} label="Optimized Title" />
                <ResultBox text={improveResult.improvedDescription} label="Optimized Description" />
                <div className="bg-accent p-4 rounded-xl">
                    <p className="text-[10px] font-bold uppercase mb-2">Suggested Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                        {improveResult.suggestedSkills.map((s, i) => <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-border">{s}</span>)}
                    </div>
                </div>
              </div>
            )}
          </AiTool>
        )}
      </div>
    </div>
  );
}



export default function AiPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"/></div>}>
      <AiContent />
    </Suspense>
  );
}



