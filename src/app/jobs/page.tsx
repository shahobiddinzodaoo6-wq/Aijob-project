"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageLoader, SkeletonCard } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase, MapPin, Search, Building2, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Job } from "@/types/job";

const JOB_TYPES = ["", "Full-time", "Part-time", "Remote", "Internship", "Contract"];

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["jobs-paged", query, location, type, page],
    queryFn: () => jobService.getJobsPaged({ query, location, type, page, pageSize: 12 }),
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      {/* Page header */}
      <div className="border-b border-border bg-accent/20">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-3">LATEST OPPORTUNITIES</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Find Your Job</h1>
          <p className="text-muted-foreground text-sm mb-10">
            {data?.totalCount ? `${data.totalCount} jobs found` : "Browse our list of open positions"}
          </p>

          {/* Search Box */}
          <div className="flex flex-col md:flex-row gap-3 max-w-4xl bg-card p-2 rounded-[2rem] border border-border shadow-2xl shadow-black/5 dark:shadow-none">
            <div className="flex-1">
              <Input placeholder="Job title, keywords..." value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                leftIcon={<Search size={18} className="text-primary" />}
                className="border-none shadow-none focus-within:ring-0 h-12"
              />
            </div>
            <div className="md:w-px h-6 md:h-8 bg-border self-center" />
            <div className="md:w-56">
              <Input placeholder="City or region..." value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                leftIcon={<MapPin size={18} className="text-primary" />}
                className="border-none shadow-none focus-within:ring-0 h-12"
              />
            </div>
            <Button onClick={() => setPage(1)} className="rounded-2xl h-12 px-8 font-black shadow-lg shadow-primary/20">
              <Search size={18} />Find Jobs
            </Button>
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2 mt-8">
            {JOB_TYPES.map((jt) => (
              <button key={jt} onClick={() => { setType(jt); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${type === jt
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/10"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                  }`}
              >
                {jt || "All Types"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !data?.items?.length ? (
          <div className="py-20 anim-up">
            <EmptyState icon={<Briefcase size={48} className="text-muted-foreground/30" />} title="No jobs found" description="Try adjusting your search filters to find more results." />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.items.map((job: Job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="group h-full">
                  <div className="card p-6 h-full flex flex-col group-hover:border-primary/50 group-hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors group-hover:scale-110 duration-500">
                        <Building2 size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate text-sm leading-tight group-hover:text-primary transition-colors">{job.title}</h3>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1 truncate">{job.organization?.name || "Company"}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.type && <Badge variant="info" dot>{job.type}</Badge>}
                      {job.salary && <Badge variant="success" dot>{job.salary}</Badge>}
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/50 space-y-2">
                      {job.location && (
                        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                          <MapPin size={14} className="text-primary/50" />{job.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <Clock size={14} className="text-primary/50" />{new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-widest text-primary group-hover:underline">Details</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-accent text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:translate-x-1">
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16">
                <Button variant="outline" size="sm" disabled={!data.hasPrevious} onClick={() => setPage(p => p - 1)} className="rounded-xl border-border px-4">← Previous</Button>
                <div className="flex gap-1.5">
                  {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${page === p
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                    >{p}</button>
                  ))}
                </div>
                <Button variant="outline" size="sm" disabled={!data.hasNext} onClick={() => setPage(p => p + 1)} className="rounded-xl border-border px-4">Next →</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
