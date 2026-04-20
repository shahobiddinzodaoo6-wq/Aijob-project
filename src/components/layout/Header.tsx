"use client";

import { useAuthStore } from "@/store/AuthStore";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { socialService } from "@/services/social.service";
import { notificationService } from "@/services/notification.service";

import {
    Bell, MessageSquare, Briefcase, Menu, X,
    ChevronDown, User, Settings, LogOut, Sparkles,
    LayoutDashboard, Building2, Rss, Users, Zap
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { clsx } from "clsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
    const { user, isAuthenticated } = useAuthStore();
    const { logout } = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = useMemo(() => [
        { href: "/jobs", label: "Вакансияҳо", icon: Briefcase },
        { href: "/organizations", label: "Ширкатҳо", icon: Building2 },
        { href: "/feed", label: "Лента", icon: Rss, authOnly: true },
        { href: "/connections", label: "Алоқаҳо", icon: Users, authOnly: true },
    ], []);

    const { data: notifData } = useQuery({
        queryKey: ["notif-count"],
        queryFn: () => notificationService.getNotifications({ userId: user?.id ? Number(user.id) : undefined, pageNumber: 1, pageSize: 10 }),
        enabled: isAuthenticated,
        refetchInterval: 30_000,
    });
    const unread = notifData?.items?.filter((n) => !n.isRead).length ?? 0;

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                            <Zap size={18} className="text-white fill-white" />
                        </div>
                        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">AIJob</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-1 mx-4">
                        {navLinks.map(({ href, label, icon: Icon, authOnly }) => {
                            if (authOnly && !isAuthenticated) return null;
                            const active = isActive(href);
                            return (
                                <Link key={href} href={href}
                                    className={clsx(
                                        "flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-xl",
                                        active
                                            ? "bg-primary/10 text-primary font-bold"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    <Icon size={16} />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Action Area */}
                    <div className="flex items-center gap-1 sm:gap-2">


                        {mounted ? (
                            isAuthenticated ? (
                                <div className="flex items-center gap-1">
                                    <Link href="/messages"
                                        className="relative w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                                        <MessageSquare size={20} />
                                    </Link>

                                    <Link href="/notifications"
                                        className="relative w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                                        <Bell size={20} />
                                        {unread > 0 && (
                                            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none border-2 border-background">
                                                {unread > 9 ? "9+" : unread}
                                            </span>
                                        )}
                                    </Link>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl hover:bg-accent transition-all border border-transparent hover:border-border outline-none ml-1 group">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm group-active:scale-95 transition-transform">
                                                    {user?.fullName?.[0] || "?"}
                                                </div>
                                                <span className="hidden xl:block text-sm font-semibold text-foreground max-w-[100px] truncate">
                                                    {user?.fullName?.split(" ")[0]}
                                                </span>
                                                <ChevronDown size={14} className="text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-64">
                                            <div className="px-4 py-3 border-b border-border/50 mb-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md">
                                                        {user?.fullName?.[0] || "?"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate">{user?.fullName}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-accent/50 inline-block px-2 py-0.5 rounded-md border border-border">
                                                    {user?.role === "Organization" ? "Organization" : "Candidate"}
                                                </div>
                                            </div>

                                            <div className="p-1">
                                                {[
                                                    { href: "/dashboard", icon: LayoutDashboard, label: "Панели асосӣ" },
                                                    { href: "/dashboard/profile", icon: User, label: "Профил" },
                                                    { href: "/dashboard/ai", icon: Sparkles, label: "Асбобҳои AI" },
                                                    { href: "/dashboard/settings", icon: Settings, label: "Танзимот" },
                                                ].map(({ href, icon: Icon, label }) => (
                                                    <DropdownMenuItem key={href} asChild>
                                                        <Link href={href} className={clsx(
                                                            "flex items-center gap-3 cursor-pointer",
                                                            isActive(href) && "bg-accent text-foreground font-semibold"
                                                        )}>
                                                            <Icon size={16} className="text-muted-foreground/60" />{label}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>

                                            <DropdownMenuSeparator />

                                            <div className="p-1">
                                                <DropdownMenuItem onClick={() => logout()}
                                                    className="flex items-center gap-3 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium">
                                                    <LogOut size={16} />Баромад
                                                </DropdownMenuItem>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hover:bg-accent rounded-xl">
                                        Воридшавӣ
                                    </Link>
                                    <Link href="/register" className="bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 px-5 py-2 text-sm font-bold rounded-xl transition-all h-10 flex items-center">
                                        Бақайдгирӣ
                                    </Link>
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-8 bg-accent/20 rounded-xl" />
                                <div className="w-24 h-10 bg-primary/10 rounded-xl" />
                            </div>
                        )}

                        <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                            onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-in slide-in-from-top-2 absolute top-full left-0 right-0 shadow-2xl z-40">
                        <div className="flex items-center justify-between mb-4 px-2">
                        </div>

                        {navLinks.map(({ href, label, icon: Icon, authOnly }) => {
                            if (authOnly && !isAuthenticated) return null;
                            return (
                                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                    <Icon size={18} />{label}
                                </Link>
                            );
                        })}

                        {isAuthenticated ? (
                            <div className="pt-2 mt-2 border-t border-border space-y-1">
                                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"><LayoutDashboard size={18} />Dashboard</Link>
                                <Link href="/messages" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"><MessageSquare size={18} />Messages</Link>
                                <Link href="/notifications" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"><Bell size={18} />Notifications</Link>
                                <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors">
                                    <LogOut size={18} />Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 pt-4">
                                <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full py-3 text-sm font-bold border border-border rounded-xl text-center bg-accent/50">Login</Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full py-3 text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 rounded-xl text-center">Register</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
