"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialService } from "@/services/social.service";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, UserPlus, Check, X, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import { clsx } from "clsx";

function ConnectionsContent() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState<"my" | "pending">("my");

  const { data: myConns, isLoading: myLoading } = useQuery({
    queryKey: ["my-connections"],
    queryFn: socialService.getMyConnections,
  });

  const { data: pending, isLoading: pendingLoading } = useQuery({
    queryKey: ["pending-connections"],
    queryFn: socialService.getPendingConnections,
  });

  const sendMutation = useMutation({
    mutationFn: (e: string) => socialService.sendConnectionByEmail(e),
    onSuccess: () => { toast.success("Дархост фиристода шуд!"); setEmail(""); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, accept }: { id: number; accept: boolean }) => 
      socialService.respondToConnection(id, accept ? "Accepted" : "Rejected"),
    onSuccess: () => {
      toast.success("Ҷавоб дода шуд!");
      qc.invalidateQueries({ queryKey: ["pending-connections"] });
      qc.invalidateQueries({ queryKey: ["my-connections"] });
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: socialService.deleteConnection,
    onSuccess: () => { toast.success("Нобуд карда шуд"); qc.invalidateQueries({ queryKey: ["my-connections"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <Users size={22} className="text-indigo-500" />
          Алоқаҳо
        </h1>

        {/* Send connection */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1">Иловаи алоқаи нав</h2>
          <p className="text-sm text-slate-500 mb-4">Тавассути почтаи электронӣ (Email) дархост фиристед</p>
          <div className="flex gap-3">
            <Input
              placeholder="user@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={15} />}
              className="flex-1"
              onKeyDown={(e) => { if (e.key === "Enter" && email) sendMutation.mutate(email); }}
            />
            <Button onClick={() => email && sendMutation.mutate(email)} loading={sendMutation.isPending}>
              <UserPlus size={16} />
              Фиристодан
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm">
          {[
            { key: "my", label: "Алоқаҳои ман", count: myConns?.length },
            { key: "pending", label: "Дар интизорӣ", count: pending?.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "my" | "pending")}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                tab === t.key
                  ? "bg-indigo-600 text-slate-900 shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {t.label}
              {t.count ? (
                <span className={clsx("px-2 py-0.5 rounded-full text-xs font-bold", tab === t.key ? "bg-white/20 text-slate-900" : "bg-slate-100 text-slate-600")}>
                  {t.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === "my" && (
          myLoading ? <PageLoader /> : !myConns?.length ? (
            <EmptyState icon={<Users size={40} />} title="Алоқаҳо нестанд" description="Бо мутахассисон робита барқарор кунед" />
          ) : (
            <div className="space-y-3">
              {myConns.map((conn) => {
                const other = conn.addressee;
                const initials = `${other?.firstName?.[0] ?? ""}${other?.lastName?.[0] ?? ""}`;
                return (
                  <div key={conn.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-slate-900 font-bold">
                        {initials || <Users size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{other?.firstName} {other?.lastName}</p>
                        <p className="text-sm text-slate-500">{other?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(Number(conn.id))}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

        {tab === "pending" && (
          pendingLoading ? <PageLoader /> : !pending?.length ? (
            <EmptyState icon={<Users size={40} />} title="Дархостҳои интизорӣ нестанд" />
          ) : (
            <div className="space-y-3">
              {pending.map((conn) => {
                const initials = `${conn.requester?.firstName?.[0] ?? ""}${conn.requester?.lastName?.[0] ?? ""}`;
                return (
                  <div key={conn.id} className="bg-white rounded-2xl border border-indigo-100 p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-slate-900 font-bold">
                        {initials || <Users size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{conn.requester?.firstName} {conn.requester?.lastName}</p>
                        <p className="text-sm text-slate-500">{conn.requester?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="success" onClick={() => respondMutation.mutate({ id: Number(conn.id), accept: true })}>
                        <Check size={14} />Қабул
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => respondMutation.mutate({ id: Number(conn.id), accept: false })}>
                        <X size={14} />Рад
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  return <AuthGuard><ConnectionsContent /></AuthGuard>;
}
