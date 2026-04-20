"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase, Plus, Pencil, Trash2, Eye, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import { useForm } from "react-hook-form";
import Link from "next/link";
import type { Job } from "@/types/job";
import { aiService } from "@/services/ai.service";

export default function MyJobsPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const { data: orgs } = useQuery({ queryKey: ["my-orgs"], queryFn: jobService.getMyOrganizations });
  const { data: jobs, isLoading } = useQuery({ queryKey: ["my-jobs"], queryFn: jobService.getMyJobs });

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<Partial<Job>>();

  const createMutation = useMutation({
    mutationFn: (d: any) => jobService.createJob({
      ...d,
      organizationId: Number(d.organizationId),
      salaryMin: Number(d.salaryMin || 0),
      salaryMax: Number(d.salaryMax || 0),
      experienceRequired: Number(d.experienceRequired || 0),
      categoryId: d.categoryId ? Number(d.categoryId) : undefined
    }),
    onSuccess: () => { toast.success("Вакансия сохта шуд!"); qc.invalidateQueries({ queryKey: ["my-jobs"] }); setCreateOpen(false); reset(); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => jobService.updateJob(id, {
      ...data,
      organizationId: Number(data.organizationId),
      salaryMin: Number(data.salaryMin || 0),
      salaryMax: Number(data.salaryMax || 0),
      experienceRequired: Number(data.experienceRequired || 0),
      categoryId: data.categoryId ? Number(data.categoryId) : undefined
    }),
    onSuccess: () => { toast.success("Захира шуд!"); qc.invalidateQueries({ queryKey: ["my-jobs"] }); setEditJob(null); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: () => { toast.success("Нобуд карда шуд"); qc.invalidateQueries({ queryKey: ["my-jobs"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  async function improveDescription() {
    const desc = watch("description");
    if (!desc) return toast.error("Сначала введите описание");
    setAiLoading(true);
    try {
      const improved = await aiService.improveJob({
        title: watch("title") || "Job",
        description: desc,
        location: watch("location") || "",
        experienceRequired: Number(watch("experienceRequired") || 0),
        jobId: editJob ? Number(editJob.id) : 0,
        applyToJob: false
      });
      setValue("description", improved.improvedDescription);
      toast.success("AI тавсифро беҳтар кард!");
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setAiLoading(false);
    }
  }

  if (isLoading) return <PageLoader />;

  const orgOptions = orgs?.map((o) => ({ value: o.id, label: o.name })) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Вакансияҳои ман</h1>
        <Button onClick={() => { reset(); setCreateOpen(true); }}><Plus size={16} />Эҷоди вакансия</Button>
      </div>

      {!jobs?.length ? (
        <EmptyState icon={<Briefcase size={48} />} title="Вакансий нет" action={<Button onClick={() => setCreateOpen(true)}>Создать</Button>} />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{job.description}</p>
                    <div className="flex gap-2 mt-2">
                      {(job as any).jobType && <Badge variant="info">{(job as any).jobType}</Badge>}
                      {job.location && <Badge variant="default">{job.location}</Badge>}
                      <Badge variant={job.isActive ? "success" : "warning"}>{job.isActive ? "Фаъол" : "Ғайрифаъол"}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4 flex-shrink-0">
                    <Link href={`/dashboard/applications?jobId=${job.id}`}>
                      <button className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                        <Eye size={15} />
                      </button>
                    </Link>
                    <button onClick={() => { setEditJob(job); reset(job); }} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(job.id)} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={createOpen || !!editJob} onClose={() => { setCreateOpen(false); setEditJob(null); }} title={editJob ? "Таҳрири вакансия" : "Вакансияи нав"} size="lg">
        <form onSubmit={handleSubmit((d) => editJob ? updateMutation.mutate({ id: editJob.id, data: d }) : createMutation.mutate(d))} className="space-y-4">
          <Input label="Номи вакансия" placeholder="Senior Developer..." {...register("title")} />
          {orgOptions.length > 0 && (
            <Select label="Ширкат" options={orgOptions} placeholder="Ширкатро интихоб кунед" {...register("organizationId")} />
          )}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">Тавсиф</label>
              <Button type="button" variant="ghost" size="sm" onClick={improveDescription} loading={aiLoading}>
                <Sparkles size={14} className="text-purple-500" />Беҳтар кардан бо AI
              </Button>
            </div>
            <Textarea placeholder="Тавсифи вакансия..." rows={5} {...register("description")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Макон" placeholder="Душанбе" {...register("location")} />
            <Input label="Намуди кор" placeholder="FullTime, Remote..." {...register("jobType")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Сатҳ (Junior, Middle...)" placeholder="Junior" {...register("experienceLevel")} />
            <Input label="Таҷриба (сол)" type="number" placeholder="1" {...register("experienceRequired")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Маоши мин." type="number" placeholder="1000" {...register("salaryMin")} />
            <Input label="Маоши макс." type="number" placeholder="2000" {...register("salaryMax")} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); setEditJob(null); }}>Инкор</Button>
            <Button type="submit" loading={isSubmitting || createMutation.isPending || updateMutation.isPending}>Захира кардан</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
