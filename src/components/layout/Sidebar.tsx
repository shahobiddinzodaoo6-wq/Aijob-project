"use client";

import { useAuthStore } from "@/store/AuthStore";
import { clsx } from "clsx";
import {
    LayoutDashboard, User, Briefcase, Building2, FileText,
    MessageSquare, Bell, Users, Sparkles, Settings, Rss, Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Sidebar() {
    const { user } = useAuthStore();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const candidateLinks = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { href: "/dashboard/profile", label: "Profile", icon: User },
        { href: "/jobs", label: "Jobs", icon: Briefcase },
        { href: "/dashboard/applications", label: "My Applications", icon: FileText },
        { href: "/feed", label: "Feed", icon: Rss },
        { href: "/connections", label: "Connections", icon: Users },
        { href: "/messages", label: "Messages", icon: MessageSquare },
        { href: "/notifications", label: "Notifications", icon: Bell },
        { href: "/dashboard/ai", label: "AI Tools", icon: Sparkles, ai: true },
    ];

    const orgLinks = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { href: "/dashboard/organizations", label: "My Organizations", icon: Building2 },
        { href: "/dashboard/jobs", label: "Manage Jobs", icon: Briefcase },
        { href: "/dashboard/applications", label: "Applications", icon: FileText },
        { href: "/feed", label: "Feed", icon: Rss },
        { href: "/messages", label: "Messages", icon: MessageSquare },
        { href: "/notifications", label: "Notifications", icon: Bell },
        { href: "/dashboard/ai", label: "AI Tools", icon: Sparkles, ai: true },
    ];

    const links = user?.role === "Organization" ? orgLinks : candidateLinks;

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

    return (
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-background border-r border-border flex flex-col">
            {mounted ? (
                <div className="p-4 m-4 bg-accent/30 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg shadow-primary/20">
                            {user?.fullName?.[0] ?? "?"}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-foreground text-sm truncate">{user?.fullName}</p>
                            <span className={clsx(
                                "inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mt-1 border",
                                user?.role === "Organization"
                                    ? "bg-sky-500/10 text-sky-500 border-sky-500/20"
                                    : "bg-primary/10 text-primary border-primary/20"
                            )}>
                                {user?.role === "Organization" ? "Employer" : "Candidate"}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 m-4 h-20 bg-accent/10 rounded-2xl border border-border animate-pulse" />
            )}

            {/* Nav */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scroll-area">
                {/* Main links */}
                <div className="mb-4">
                    <p className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1 opacity-70">Navigation</p>
                    {links.filter(l => !l.ai).map(({ href, label, icon: Icon, exact }) => {
                        const active = isActive(href, exact);
                        return (
                            <Link key={href} href={href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    active
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <Icon size={18} className={clsx("flex-shrink-0", active ? "text-primary-foreground" : "text-muted-foreground/60")} />
                                <span className="truncate">{label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* AI section */}
                <div className="pt-4 border-t border-border mt-4">
                    <p className="px-4 py-2 text-[10px] font-bold text-primary uppercase tracking-[0.15em] mb-1 flex items-center gap-2">
                        <Sparkles size={10} fill="currentColor" /> AI Powered
                    </p>
                    {links.filter(l => l.ai).map(({ href, label, icon: Icon, exact }) => {
                        const active = isActive(href, exact);
                        return (
                            <Link key={href} href={href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                                    active
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-primary hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <Zap size={18} className="flex-shrink-0" fill={active ? "currentColor" : "none"} />
                                <span className="truncate">{label}</span>
                                {!active && (
                                    <span className="ml-auto text-[9px] font-black bg-primary text-primary-foreground px-1.5 py-0.5 rounded border border-primary animate-pulse">
                                        NEW
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Settings */}
            <div className="p-3 border-t border-border mt-auto">
                <Link href="/dashboard/settings"
                    className={clsx(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0",
                        isActive("/dashboard/settings")
                            ? "bg-accent text-foreground font-bold"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                >
                    <Settings size={18} className="flex-shrink-0 opacity-60" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
