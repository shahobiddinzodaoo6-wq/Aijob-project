"use client";
import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { Users, UserPlus, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import { useForm } from "react-hook-form";
import Link from "next/link";


export default function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);


  const { data: members, isLoading } = useQuery({
    queryKey: ["org-members", id],
    queryFn: () => jobService.getOrgMembers(Number(id)),
  });


  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ userId: string; role: string }>();

  const inviteMutation = useMutation({
    mutationFn: (data: { userId: string; role: string }) => 
      jobService.inviteMember({ 
        organizationId: Number(id), 
        userId: Number(data.userId), 
        role: data.role 
      }),
    onSuccess: () => { toast.success("Даъватнома фиристода шуд!"); setInviteOpen(false); reset(); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const removeMutation = useMutation({
    mutationFn: (mid: number | string) => jobService.removeMember(Number(mid)),
    onSuccess: () => { toast.success("Иштирокчӣ нест карда шуд"); qc.invalidateQueries({ queryKey: ["org-members"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <Link href="/dashboard/organizations" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 mb-6 transition-colors">
        <ArrowLeft size={14} />Бозгашт ба ширкатҳо
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Users size={24} className="text-indigo-500" />Иштирокчиён
        </h1>
        <Button onClick={() => setInviteOpen(true)}><UserPlus size={16} />Даъват кардан</Button>
      </div>

      <div className="space-y-3">
        {members?.map((m) => (
          <Card key={m.id}>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {/* @ts-ignore */}
                    {m.user?.fullName?.[0] || "?"}
                  </div>
                  <div>
                    {/* @ts-ignore */}
                    <p className="font-semibold text-slate-900">{m.user?.fullName}</p>
                    <p className="text-sm text-slate-500">{m.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{m.role}</Badge>
                  <Badge variant={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge>
                  <button onClick={() => removeMutation.mutate(m.id)} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Даъвати иштирокчӣ">
        <form onSubmit={handleSubmit((d) => inviteMutation.mutate(d))} className="space-y-4">
          <Input label="ID-и корбар" placeholder="ID-и номзадро ворид кунед..." {...register("userId")} />
          <Input label="Нақш" placeholder="Member, Admin..." {...register("role")} />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Инкор</Button>
            <Button type="submit" loading={isSubmitting || inviteMutation.isPending}>Фиристодан</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

