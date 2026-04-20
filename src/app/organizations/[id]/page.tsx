"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { Building2, Globe, MapPin, Briefcase, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { data: org, isLoading } = useQuery({
        queryKey: ["organization", id],
        queryFn: () => jobService.getOrganization(Number(id)),
    });

    const { data: jobs } = useQuery({
        queryKey: ["org-jobs", id],
        queryFn: () => jobService.getJobsByOrganization(id),
        enabled: !!id,
    });

    if (isLoading) return <><Header /><PageLoader /></>;
    if (!org) return <><Header /><div className="p-8 text-center text-slate-500">Ширкат пайдо нашуд</div></>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="bg-gradient-to-r from-cyan-600 to-indigo-700 text-white py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/organizations" className="inline-flex items-center gap-1.5 text-cyan-200 hover:text-white text-sm mb-6 transition-colors">
                        <ArrowLeft size={14} />Бозгашт ба ширкатҳо
                    </Link>
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {org.logoUrl ? (
                                <img src={org.logoUrl} alt={org.name} className="w-20 h-20 object-cover" />
                            ) : (
                                <Building2 size={36} className="text-white" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold">{org.name}</h1>
                            {org.industry && <Badge variant="cyan" className="mt-2 text-slate-900">{org.industry}</Badge>}
                            <div className="flex flex-wrap gap-4 mt-3">
                                {org.location && (
                                    <span className="flex items-center gap-1.5 text-sm text-cyan-100 font-medium">
                                        <MapPin size={14} />{org.location}
                                    </span>
                                )}
                                {org.website && (
                                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-cyan-100 font-medium hover:text-white transition-colors">
                                        <Globe size={14} />{org.website}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {org.description && (
                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-3">Дар бораи ширкат</h2>
                        <p className="text-slate-700 leading-relaxed">{org.description}</p>
                    </div>
                )}

                {jobs && jobs.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-indigo-500" />
                            Вакансияҳои кушода
                            <Badge variant="info">{jobs.length}</Badge>
                        </h2>
                        <div className="space-y-3">
                            {jobs.map((job) => (
                                <Link key={job.id} href={`/jobs/${job.id}`}>
                                    <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{job.title}</h3>
                                            <div className="flex gap-2 mt-1.5">
                                                {job.location && (
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <MapPin size={10} />{job.location}
                                                    </span>
                                                )}
                                                {job.type && <Badge variant="info" className="text-xs">{job.type}</Badge>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {job.salary && <Badge variant="success">{job.salary}</Badge>}
                                            <ChevronRight size={16} className="text-slate-300" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
