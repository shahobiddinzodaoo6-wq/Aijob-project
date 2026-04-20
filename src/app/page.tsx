"use client";

import { Header } from "@/components/layout/Header";
import Link from "next/link";
import {
  Briefcase, Users, Sparkles, ArrowRight, Building2,
  Search, TrendingUp, Shield, Zap, CheckCircle, Star
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pill badge */}
            <div className="inline-flex anim-up items-center gap-2 bg-accent/50 border border-border shadow-sm rounded-full px-4 py-1.5 text-sm text-primary mb-8 font-medium">
              <Zap size={13} className="text-primary" fill="currentColor" />
              AI-POWERED RECRUITMENT
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight anim-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">Find Your</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">Dream Job</span>
              <br />
              <span className="text-foreground">With Ease</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed anim-up" style={{ animationDelay: '0.2s' }}>
              The most advanced platform to find the perfect match for your skills using intelligent AI assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center anim-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/jobs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-foreground font-bold rounded-2xl hover:bg-accent/80 transition-all border border-border">
                <Search size={18} />Browse Jobs
              </Link>
              <Link href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:opacity-90 transition-all font-bold rounded-2xl">
                Get Started<ArrowRight size={18} />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mt-24 pt-16 border-t border-border anim-up" style={{ animationDelay: '0.4s' }}>
              {[
                ["10 000+", "Jobs Posted"],
                ["5 000+", "Companies"],
                ["50 000+", "Users"],
                ["AI-First", "Technology"]
              ].map(([v, l]) => (
                <div key={l} className="text-center group">
                  <p className="text-3xl font-black bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{v}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-32 px-4 bg-accent/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">OUR FEATURES</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">Built for the future of work</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Briefcase size={24} />, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", title: "Smart Matching", desc: "Our AI analyzes your skills and experience to find the absolute best fit for your career growth." },
              { icon: <Sparkles size={24} />, color: "text-sky-500", bg: "bg-sky-500/10 border-sky-500/20", title: "AI Resume Analysis", desc: "Get instant feedback on your resume and see how well you match with specific job descriptions." },
              { icon: <Users size={24} />, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", title: "Direct Networking", desc: "Connect directly with hiring managers and build meaningful professional relationships effortlessly." },
              { icon: <TrendingUp size={24} />, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", title: "Market Insights", desc: "Stay ahead with real-time data on salary trends, high-demand skills, and industry shifts." },
              { icon: <Shield size={24} />, color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20", title: "Verified Profiles", desc: "Every organization and job post is verified to ensure a safe and trustworthy environment." },
              { icon: <Zap size={24} />, color: "text-pink-500", bg: "bg-pink-500/10 border-pink-500/20", title: "Instant Alerts", desc: "Never miss an opportunity with personalized job alerts delivered straight to your inbox." },
            ].map((f) => (
              <div key={f.title} className="card p-8 group hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 ${f.bg} border rounded-2xl flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ORGANIZATION ── */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[2.5rem] bg-foreground text-background overflow-hidden p-12 md:p-20 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Tired of manual searching?
                </h2>
                <p className="text-background/70 text-lg mb-8 max-w-md">
                  Let our AI do the heavy lifting and find the most relevant candidates for your company.
                </p>
                <Link href="/register"
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/30">
                  Post a Job<ArrowRight size={20} />
                </Link>
              </div>
              <div className="w-full max-w-[320px] aspect-square bg-background/10 rounded-3xl border border-background/20 flex items-center justify-center rotate-6 hover:rotate-0 transition-transform duration-500">
                <Building2 size={120} className="text-background/20" />
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-16 pt-8 border-t border-background/10">
              {["Free Registration", "AI Candidate Matching", "Data Protection"].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-background/50 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle size={16} className="text-primary" /> {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border  py-16 px-4 bg-accent/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap size={20} className="text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-black text-2xl tracking-tighter">AIJob</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Find your dream job with Artificial Intelligence assistance. Connect with top employers effortlessly.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 py-1 border-b border-primary/20 inline-block">Platform</h4>
            <div className="flex flex-col gap-3">
              {[
                { l: "Jobs", h: "/jobs" },
                { l: "Companies", h: "/organizations" },
                { l: "Sign Up", h: "/register" },
                { l: "Sign In", h: "/login" }
              ].map(({ l, h }) => (
                <Link key={h} href={h} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">{l}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 py-1 border-b border-primary/20 inline-block">Support</h4>
            <div className="flex flex-col gap-3">
              {["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"].map((l) => (
                <span key={l} className="text-muted-foreground text-sm font-medium cursor-pointer hover:text-primary transition-colors">{l}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-medium">© 2024 AIJob. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black text-muted-foreground uppercase opacity-30 tracking-tighter cursor-default underline decoration-primary">Premium Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
