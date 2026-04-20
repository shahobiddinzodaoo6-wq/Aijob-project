"use client";
import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { aiService } from "@/services/ai.service";
import { useAuthStore } from "@/store/AuthStore";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { PageLoader } from "@/components/ui/Spinner";
import { MapPin, Building2, Calendar, Sparkles, ArrowLeft, DollarSign, Send } from "lucide-react";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [applyOpen, setApplyOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobService.getJob(id),
  });

  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<{ coverLetter: string }>();

  const applyMutation = useMutation({
    mutationFn: (data: { coverLetter: string }) => 
      jobService.applyToJob({ 
        jobId: Number(id), 
        userId: Number(user?.id),
        coverLetter: data.coverLetter 
      }),
    onSuccess: () => {
      toast.success("Дархости шумо бомуваффақият фиристода шуд!");
      setApplyOpen(false);
      qc.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  async function generateCoverLetter() {
    if (!user) return;
    setAiLoading(true);
    try {
      const text = await aiService.draftCoverLetter({ jobId: Number(id), userId: Number(user.id), tone: "professional" });
      setValue("coverLetter", text.content);
      toast.success("AI номаи ҳамроҳиро сохт!");
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setAiLoading(false);
    }
  }

  if (isLoading) return <><Header /><PageLoader /></>;
  if (!job) return <><Header /><div className="p-8 text-center text-slate-500">Вакансия пайдо нашуд</div></>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-slate-900 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs" className="inline-flex items-center gap-1.5 text-indigo-200 hover:text-slate-900 text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Бозгашт ба вакансияҳо
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 size={30} className="text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">{job.title}</h1>
              <p className="text-indigo-200 mt-1 text-lg">{job.organization?.name}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                {job.location && (
                  <span className="flex items-center gap-1.5 text-sm text-indigo-200">
                    <MapPin size={14} />{job.location}
                  </span>
                )}
                {job.type && <Badge variant="cyan">{job.type}</Badge>}
                {job.salary && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-300">
                    <DollarSign size={14} />{job.salary}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-indigo-300">
                  <Calendar size={14} />{new Date(job.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Тавсифи вакансия</h2>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-4">Маҳоратҳои лозимӣ</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Badge key={s.id} variant="purple">{s.skill.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isAuthenticated && user?.role === "Candidate" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                <Button className="w-full" onClick={() => setApplyOpen(true)}>
                  <Send size={16} />
                  Дархост додан
                </Button>
                <Link href={`/dashboard/ai?jobId=${id}`}>
                  <Button variant="outline" className="w-full">
                    <Sparkles size={16} />
                    Таҳлили маҳоратҳо
                  </Button>
                </Link>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-slate-900 mb-4">Маълумот дар бораи вакансия</h3>
              <div className="space-y-3">
                {job.type && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Намуди кор</span>
                    <Badge variant="info">{job.type}</Badge>
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Макон</span>
                    <span className="font-medium text-slate-700">{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Маош</span>
                    <span className="font-semibold text-emerald-600">{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Нашр шуд</span>
                  <span className="font-medium text-slate-700">{new Date(job.createdAt).toLocaleDateString("ru-RU")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="Дархост ба вакансия" description={job.title}>
        <form onSubmit={handleSubmit((d) => applyMutation.mutate(d))} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Номаи ҳамроҳӣ</label>
            <Button type="button" variant="ghost" size="sm" onClick={generateCoverLetter} loading={aiLoading}>
              <Sparkles size={14} className="text-purple-500" />
              Сохтан бо AI
            </Button>
          </div>
          <Textarea placeholder="Дар бораи худ ва таҷрибаи худ нависед..." rows={6} {...register("coverLetter")} />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setApplyOpen(false)}>Инкор</Button>
            <Button type="submit" loading={isSubmitting || applyMutation.isPending}>
              <Send size={15} />Фиристодан
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
