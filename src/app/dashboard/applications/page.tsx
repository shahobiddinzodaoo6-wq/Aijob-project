"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/AuthStore";
import { jobService } from "@/services/job.service";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText, Trash2, Briefcase, Eye, ChevronDown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import type { ApplicationStatus, JobApplication } from "@/types/job";

const statusVariant: Record<ApplicationStatus, "warning"|"info"|"success"|"danger"> = {
  Pending: "warning", Reviewed: "info", Accepted: "success", Rejected: "danger",
};

const statusLabel: Record<ApplicationStatus, string> = {
  Pending: "На рассмотрении", Reviewed: "Просмотрено", Accepted: "Принято", Rejected: "Отклонено",
};



export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const isOrg = user?.role === "Organization";
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("Pending");

  const { data: myApps, isLoading } = useQuery({
    queryKey: ["my-applications", user?.id],
    queryFn: () => jobService.getMyApplications(Number(user!.id)),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => jobService.deleteApplication(Number(id)),
    onSuccess: () => { toast.success("Дархост нест карда шуд"); qc.invalidateQueries({ queryKey: ["my-applications"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: ApplicationStatus }) => jobService.updateApplicationStatus(Number(id), status),
    onSuccess: () => { toast.success("Статус нав карда шуд!"); qc.invalidateQueries({ queryKey: ["my-applications"] }); setSelectedApp(null); },
    onError: (e) => toast.error(getApiError(e)),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">{isOrg ? "Отклики на вакансии" : "Мои заявки"}</h1>
        {myApps && <Badge variant="info">{myApps.length} заявок</Badge>}
      </div>

      {!myApps?.length ? (
        <EmptyState
          icon={<FileText size={40} />}
          title="Заявок нет"
          description="Откликайтесь на вакансии и отслеживайте статус здесь"
          action={<Link href="/jobs"><Button>Смотреть вакансии</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {myApps.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase size={22} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/jobs/${app.jobId}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-sm">
                        {app.job?.title || "Вакансия"}
                      </Link>
                      <p className="text-sm text-slate-500 mt-0.5">{app.job?.organization?.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(app.createdAt).toLocaleDateString("ru-RU", { day:"numeric", month:"long", year:"numeric" })}</p>
                      {app.coverLetter && (
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2 bg-slate-50 rounded-lg p-2">{app.coverLetter}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={statusVariant[app.status]} dot>{statusLabel[app.status]}</Badge>
                    {isOrg && (
                      <Button size="xs" variant="outline" onClick={() => { setSelectedApp(app); setNewStatus(app.status); }}>
                        <ChevronDown size={12}/>Статус
                      </Button>
                    )}
                    {!isOrg && (
                      <button onClick={() => deleteMutation.mutate(app.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!selectedApp} onClose={() => setSelectedApp(null)} title="Изменить статус заявки">
        <div className="space-y-4">
          <Select
            label="Новый статус"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
            options={[
              { value:"Pending",  label:"На рассмотрении" },
              { value:"Reviewed", label:"Просмотрено" },
              { value:"Accepted", label:"Принято" },
              { value:"Rejected", label:"Отклонено" },
            ]}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setSelectedApp(null)}>Отмена</Button>
            <Button onClick={() => selectedApp && statusMutation.mutate({ id: selectedApp.id, status: newStatus })} loading={statusMutation.isPending}>
              Сохранить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
