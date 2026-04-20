"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2, Globe, MapPin, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrganizationsPage() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["organizations-paged", page],
        queryFn: () => jobService.getOrganizationsPaged({ pageNumber: page, pageSize: 12 }),
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">ШИРКАТҲОРО ПАЙДО КУНЕД</p>
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Ширкатҳо</h1>
                    <p className="text-slate-500 text-sm mb-7">Корфармоёни беҳтарин ва фарҳанги ширкатҳои онҳоро кашф кунед</p>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                        <Input placeholder="Ҷустуҷӯи ширкатҳо..." leftIcon={<Search size={15} />} className="flex-1" />
                        <Button className="flex-shrink-0"><Search size={15} />Ёфтан</Button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {isLoading ? (
                    <PageLoader />
                ) : !data?.items?.length ? (
                    <EmptyState icon={<Building2 size={40} />} title="Ширкатҳо пайдо нашуданд" />
                ) : (
                    <>
                        <p className="text-sm text-slate-500 mb-5">{data.totalCount} ширкат пайдо шуд</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.items.map((org) => (
                                <Link key={org.id} href={`/organizations/${org.id}`}>
                                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-5 h-full flex flex-col cursor-pointer group">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {org.logoUrl ? (
                                                    <img src={org.logoUrl} alt={org.name} className="w-14 h-14 object-cover" />
                                                ) : (
                                                    <Building2 size={26} className="text-indigo-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-900 truncate">{org.name}</h3>
                                                {org.industry && <Badge variant="cyan" className="mt-1">{org.industry}</Badge>}
                                            </div>
                                        </div>

                                        {org.description && (
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{org.description}</p>
                                        )}

                                        <div className="mt-auto space-y-1.5">
                                            {org.location && (
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <MapPin size={11} />{org.location}
                                                </div>
                                            )}
                                            {org.website && (
                                                <div className="flex items-center gap-1.5 text-xs text-indigo-500">
                                                    <Globe size={11} />{org.website}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-indigo-600">Муфассал</span>
                                            <ChevronRight size={14} className="text-indigo-400" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {data.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-10">
                                <Button variant="outline" size="sm" disabled={!data.hasPrevious} onClick={() => setPage(p => p - 1)}>Қаблан</Button>
                                <span className="text-sm text-slate-600 font-medium">{page} / {data.totalPages}</span>
                                <Button variant="outline" size="sm" disabled={!data.hasNext} onClick={() => setPage(p => p + 1)}>Баъдан</Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
