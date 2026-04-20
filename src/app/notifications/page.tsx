"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell, Check, Trash2, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import { clsx } from "clsx";
import { useState } from "react";

import { notificationService } from "@/services/notification.service";
import { useAuthStore } from "@/store/AuthStore";

function NotificationsContent() {
    const { user } = useAuthStore();
    const qc = useQueryClient();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["notifications", user?.id, page],
        queryFn: () => notificationService.getNotifications({ 
            userId: user?.id ? Number(user.id) : undefined, 
            pageNumber: page, 
            pageSize: 20 
        }),
        enabled: !!user,
    });

    const readMutation = useMutation({
        mutationFn: (id: number) => notificationService.markRead(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => notificationService.delete(id),
        onSuccess: () => { 
            toast.success("Огоҳинома нест карда шуд"); 
            qc.invalidateQueries({ queryKey: ["notifications"] }); 
        },
        onError: (e) => toast.error(getApiError(e)),
    });

    const unread = data?.items?.filter((n) => !n.isRead) ?? [];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                        <Bell size={22} className="text-primary" />
                        Огоҳиномаҳо
                        {unread.length > 0 && (
                            <span className="w-6 h-6 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                                {unread.length}
                            </span>
                        )}
                    </h1>
                    {unread.length > 0 && (
                        <Button variant="outline" size="sm" onClick={() => unread.forEach((n) => readMutation.mutate(n.id))}>
                            <CheckCheck size={14} />
                            Ҳамаро хондашуда нишон деҳ
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <PageLoader />
                ) : (!data?.items?.length) ? (
                    <EmptyState
                        icon={<Bell size={40} />}
                        title="Огоҳиномаҳо ҳанӯз нест"
                        description="Вақте ки шумо навсозиҳо мегиред, онҳо дар ин ҷо пайдо мешаванд."
                    />
                ) : (
                    <div className="space-y-2">
                        {data.items.map((n) => (
                            <div
                                key={n.id}
                                className={clsx(
                                    "bg-card text-card-foreground rounded-2xl border p-4 flex items-start gap-4 transition-all",
                                    n.isRead ? "border-border" : "border-primary/30 shadow-sm shadow-primary/10"
                                )}
                            >
                                <div className={clsx(
                                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                    n.isRead ? "bg-accent text-muted-foreground" : "bg-primary/10 text-primary"
                                )}>
                                    <Bell size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={clsx("font-semibold text-sm", n.isRead ? "text-foreground/80" : "text-foreground")}>{n.title}</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1.5">{new Date(n.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    {!n.isRead && (
                                        <button
                                            onClick={() => readMutation.mutate(n.id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-xl text-primary hover:bg-primary/10 transition-all cursor-pointer"
                                        >
                                            <Check size={15} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMutation.mutate(n.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {data.totalPages > 1 && (
                            <div className="flex justify-center gap-3 mt-6">
                                <Button variant="outline" size="sm" disabled={!data.hasPrevious} onClick={() => setPage(p => p - 1)}>Қаблан</Button>
                                <Button variant="outline" size="sm" disabled={!data.hasNext} onClick={() => setPage(p => p + 1)}>Баъдан</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NotificationsPage() {
    return <AuthGuard><NotificationsContent /></AuthGuard>;
}
