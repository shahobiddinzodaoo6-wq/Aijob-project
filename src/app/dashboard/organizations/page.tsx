"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2, Plus, Pencil, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import { useForm } from "react-hook-form";
import Link from "next/link";
import type { Organization } from "@/types/job";

export default function OrganizationsPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<Organization | null>(null);

  const { data: orgs, isLoading } = useQuery({
    queryKey: ["my-orgs"],
    queryFn: jobService.getMyOrganizations,
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Partial<Organization>>();

  const createMutation = useMutation({
    mutationFn: jobService.createOrganization,
    onSuccess: () => { toast.success("Ширкат сохта шуд!"); qc.invalidateQueries({ queryKey: ["my-orgs"] }); setCreateOpen(false); reset(); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Organization> }) => jobService.updateOrganization(Number(id), data),
    onSuccess: () => { toast.success("Захира шуд!"); qc.invalidateQueries({ queryKey: ["my-orgs"] }); setEditOrg(null); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => jobService.deleteOrganization(Number(id)),
    onSuccess: () => { toast.success("Нобуд карда шуд"); qc.invalidateQueries({ queryKey: ["my-orgs"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Ширкатҳои ман</h1>
        <Button onClick={() => { reset(); setCreateOpen(true); }}>
          <Plus size={16} />Эҷоди ширкат
        </Button>
      </div>

      {!orgs?.length ? (
        <EmptyState icon={<Building2 size={48} />} title="Ширкатҳо нестанд" description="Ширкати аввалини худро созед" action={<Button onClick={() => setCreateOpen(true)}>Сохтан</Button>} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {orgs.map((org) => (
            <Card key={org.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <Building2 size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{org.name}</h3>
                      {org.industry && <p className="text-sm text-slate-500">{org.industry}</p>}
                      {org.location && <p className="text-xs text-slate-400">{org.location}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/organizations/${org.id}/members`}>
                      <button className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                        <Users size={15} />
                      </button>
                    </Link>
                    <button onClick={() => { setEditOrg(org); reset(org); }} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(org.id)} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={createOpen || !!editOrg} onClose={() => { setCreateOpen(false); setEditOrg(null); }} title={editOrg ? "Таҳрири ширкат" : "Ширкати нав"}>
        <form onSubmit={handleSubmit((d) => editOrg ? updateMutation.mutate({ id: editOrg.id, data: d }) : createMutation.mutate(d))} className="space-y-4">
          <Input label="Ном" placeholder="Номи ширкат" {...register("name")} />
          <Textarea label="Тавсиф" placeholder="Дар бораи ширкат..." {...register("description")} />
          <Input label="Соҳа" placeholder="IT, Молия, Маориф..." {...register("industry")} />
          <Input label="Макон" placeholder="Душанбе, Тоҷикистон" {...register("location")} />
          <Input label="Веб-сайт" placeholder="https://company.com" {...register("website")} />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); setEditOrg(null); }}>Инкор</Button>
            <Button type="submit" loading={isSubmitting || createMutation.isPending || updateMutation.isPending}>Захира кардан</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
