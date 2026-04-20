"use client";
import { clsx } from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/AuthStore";
import { jobService } from "@/services/job.service";
import { socialService } from "@/services/social.service";
import { notificationService } from "@/services/notification.service";
import { Badge } from "@/components/ui/Badge";
import {
  Briefcase, FileText, Users, Building2, ArrowRight,
  Sparkles, Bell, MessageSquare, TrendingUp, Zap
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isOrg = user?.role === "Organization";

  const { data: apps } = useQuery({ queryKey: ["my-applications", user?.id], queryFn: () => jobService.getMyApplications(Number(user!.id)), enabled: !!user && !isOrg });
  const { data: myOrgs } = useQuery({ queryKey: ["my-orgs"], queryFn: jobService.getMyOrganizations, enabled: !!user && isOrg });
  const { data: myJobs } = useQuery({ queryKey: ["my-jobs"], queryFn: jobService.getMyJobs, enabled: !!user && isOrg });
  const { data: notifs } = useQuery({ 
    queryKey: ["notifications", user?.id], 
    queryFn: () => notificationService.getNotifications({ userId: Number(user?.id), pageNumber: 1, pageSize: 5 }), 
    enabled: !!user 
  });
  const unread = notifs?.items?.filter((n) => !n.isRead).length ?? 0;

  const stats = !isOrg ? [
    { icon: <FileText size={18} />, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", label: "Дархостҳо", val: apps?.length ?? 0, href: "/dashboard/applications" },
    { icon: <Briefcase size={18} />, color: "text-sky-500", bg: "bg-sky-500/10 border-sky-500/20", label: "Вакансияҳо", val: "Дидан", href: "/jobs" },
    { icon: <Users size={18} />, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Алоқаҳо", val: "Дидан", href: "/connections" },
    { icon: <MessageSquare size={18} />, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", label: "Паёмҳо", val: "Боз кардан", href: "/messages" },
  ] : [
    { icon: <Building2 size={18} />, color: "text-sky-500", bg: "bg-sky-500/10 border-sky-500/20", label: "Ширкатҳои ман", val: myOrgs?.length ?? 0, href: "/dashboard/organizations" },
    { icon: <Briefcase size={18} />, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", label: "Вакансияҳои нашршуда", val: myJobs?.length ?? 0, href: "/dashboard/jobs" },
    { icon: <FileText size={18} />, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", label: "Дархостҳо", val: "Дидан", href: "/dashboard/applications" },
    { icon: <MessageSquare size={18} />, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Паёмҳо", val: "Боз кардан", href: "/messages" },
  ];

  return (
    <div className="space-y-6 anim-up transition-colors duration-300">
      {/* Welcome Card */}
      <div className="card p-8 group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {user?.fullName?.[0] ?? "?"}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Хуш омадед,</p>
              <h1 className="text-2xl font-black">{user?.fullName}</h1>
              <div className="mt-2">
                <Badge variant={isOrg ? "cyan" : "info"}>
                  {isOrg ? "Ҳисоби Корфармо" : "Профили Номзад"}
                </Badge>
              </div>
            </div>
          </div>

          {unread > 0 && (
            <Link href="/notifications" className="inline-flex items-center gap-2 bg-accent/50 border border-border rounded-xl px-4 py-2 text-sm font-bold text-primary hover:bg-accent transition-all shadow-sm">
              <Bell size={16} fill="currentColor" />
              <span>{unread} огоҳиномаи нав</span>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="group">
            <div className="card p-5 h-full group-hover:border-primary/50 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${s.bg} border rounded-2xl flex items-center justify-center ${s.color} transition-transform duration-500 group-hover:-rotate-12`}>
                  {s.icon}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-accent text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <ArrowRight size={14} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">{s.val}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">{s.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Actions & AI */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card h-fit">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-accent/10">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="font-black text-sm uppercase tracking-widest">Амалҳои зуд</h2>
          </div>
          <div className="p-2">
            {(!isOrg ? [
              { href: "/dashboard/profile", label: "Таҳрири профил", emoji: "👤" },
              { href: "/jobs", label: "Ҷустуҷӯи кор", emoji: "💼" },
              { href: "/dashboard/applications", label: "Дархостҳои ман", emoji: "📋" },
              { href: "/feed", label: "Лентаи касбӣ", emoji: "📰" },
              { href: "/connections", label: "Алоқаҳо", emoji: "🤝" },
            ] : [
              { href: "/dashboard/organizations", label: "Идоракунии ширкатҳо", emoji: "🏢" },
              { href: "/dashboard/jobs", label: "Нашри вакансияи нав", emoji: "➕" },
              { href: "/dashboard/applications", label: "Баррасии дархостҳо", emoji: "📋" },
              { href: "/feed", label: "Лентаи ширкат", emoji: "📰" },
            ]).map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-accent group transition-all duration-200">
                <span className="flex items-center gap-4 text-sm font-bold text-muted-foreground group-hover:text-foreground">
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                  {item.label}
                </span>
                <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>

        {/* AI Powered Promo */}
        <div className="lg:col-span-2 card bg-foreground text-background relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
          <div className="relative p-8 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-background/10 border border-background/20 rounded-2xl flex items-center justify-center">
                <Zap size={24} className="text-primary" fill="currentColor" />
              </div>
              <div>
                <h2 className="font-black text-lg leading-tight uppercase tracking-tighter">Ёвари AI</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">Технологияи AI</p>
                </div>
              </div>
            </div>

            <p className="text-background/60 text-sm leading-relaxed font-medium mb-8">
              {isOrg 
                ? "Аз AI-и мо истифода баред, то номзадҳои беҳтаринро барои ҷойҳои холии худ пайдо кунед. Резюмеҳоро таҳлил кунед." 
                : "Тавсияҳои инфиродии кор гиред ва резюмеи худро бо ёрии асбобҳои муосири AI беҳтар кунед."}
            </p>

            <Link href="/dashboard/ai"
              className="mt-auto group inline-flex items-center gap-3 bg-primary text-primary-foreground font-black px-6 py-3.5 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-primary/20">
              <Sparkles size={16} />
              <span>Асбобҳои AI</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Notifications Table/List */}
      {notifs?.items && notifs.items.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-accent/10">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-primary" />
              <h2 className="font-black text-sm uppercase tracking-widest">Огоҳиномаҳои охирин</h2>
            </div>
            <Link href="/notifications" className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline">
              Ҳамааш →
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {notifs.items.slice(0, 3).map((n) => (
              <div key={n.id} className={clsx(
                "flex items-start gap-4 p-5 transition-all duration-300 hover:bg-accent/30",
                !n.isRead && "bg-primary/5"
              )}>
                <div className={clsx(
                  "w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0",
                  n.isRead ? "bg-muted-foreground/30" : "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                )} />
                <div className="min-w-0">
                  <p className={clsx("text-sm transition-colors", n.isRead ? "text-muted-foreground" : "text-foreground font-bold")}>{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
