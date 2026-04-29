"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/AuthStore";
import { userService } from "@/services/user.service";
import { skillService } from "@/services/skill.service";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { getApiError } from "@/lib/axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { User, Upload, Plus, Trash2, Briefcase, GraduationCap, Star, Globe, MapPin, Link2 } from "lucide-react";
import type { UserExperience, UserEducation } from "@/types/user";



export default function ProfilePage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();



  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => userService.getProfileByUser(user!.id),
    enabled: !!user, retry: false,
  });
  const { data: experiences } = useQuery({
    queryKey: ["experiences", user?.id],
    queryFn: () => userService.getExperienceByUser(user!.id),
    enabled: !!user,
  });
  const { data: educations } = useQuery({
    queryKey: ["educations", user?.id],
    queryFn: () => userService.getEducationByUser(user!.id),
    enabled: !!user,
  });

  const { register, handleSubmit, reset, getValues, formState: { isSubmitting } } = useForm<{
    bio: string; headline: string; location: string; website: string;
  }>();
  useEffect(() => {
    if (profile) reset({ 
      bio: profile.bio || "", 
      headline: profile.headline || "", 
      location: profile.location || "", 
      website: profile.website || "" 
    });
  }, [profile, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: { bio: string; headline: string; location: string; website: string }) => {
      const payload = {
        ...data,
        userId: user?.id ? Number(user.id) : undefined,
      };
      if (profile?.id) return userService.updateProfile(profile.id, { ...payload, id: profile.id });
      return userService.createProfile(payload);
    },
    onSuccess: () => { 
      toast.success("Профиль сохранён!"); 
      qc.invalidateQueries({ queryKey: ["profile"] }); 
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  // Experience modal
  const [expOpen, setExpOpen] = useState(false);
  const expForm = useForm<Partial<UserExperience>>();
  const createExpMutation = useMutation({
    mutationFn: (d: Partial<UserExperience>) => userService.createExperience({ ...d, userId: String(user!.id) }),
    onSuccess: () => { toast.success("Илова шуд!"); qc.invalidateQueries({ queryKey: ["experiences"] }); setExpOpen(false); expForm.reset(); },
    onError: (e) => toast.error(getApiError(e)),
  });
  const deleteExpMutation = useMutation({
    mutationFn: (eid: string) => userService.deleteExperience(eid),
    onSuccess: () => { toast.success("Нобуд карда шуд"); qc.invalidateQueries({ queryKey: ["experiences"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  // Education modal
  const [eduOpen, setEduOpen] = useState(false);
  const eduForm = useForm<Partial<UserEducation>>();
  const createEduMutation = useMutation({
    mutationFn: (d: Partial<UserEducation>) => userService.createEducation({ ...d, userId: String(user!.id) }),
    onSuccess: () => { toast.success("Илова шуд!"); qc.invalidateQueries({ queryKey: ["educations"] }); setEduOpen(false); eduForm.reset(); },
    onError: (e) => toast.error(getApiError(e)),
  });
  const deleteEduMutation = useMutation({
    mutationFn: (eid: string | number) => userService.deleteEducation(Number(eid)),
    onSuccess: () => { toast.success("Нобуд карда шуд"); qc.invalidateQueries({ queryKey: ["educations"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const [photoUploading, setPhotoUploading] = useState(false);
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPhotoUploading(true);
    try {
      // 1. Upload photo and get URL/path
      const photoUrl = await userService.uploadPhoto(file);
      if (!photoUrl) throw new Error("Failed to get photo URL");
      
      // 2. Refresh profile data to avoid stale updates
      let p = null;
      try { p = await userService.getProfileByUser(String(user?.id)); } catch (err) {}

      // 3. Prepare payload from CURRENT form values + freshly fetched profile
      const formValues = getValues();
      const payload: any = {
        photoUrl,
        userId: user?.id ? Number(user.id) : undefined,
        bio: formValues.bio || p?.bio || profile?.bio || "",
        headline: formValues.headline || p?.headline || profile?.headline || "",
        location: formValues.location || p?.location || profile?.location || "",
        website: formValues.website || p?.website || profile?.website || "",
        cvUrl: p?.cvUrl || profile?.cvUrl || ""
      };

      // Identify the ID for update
      const updateId = p?.id || (p as any)?.userProfileId || profile?.id;

      if (updateId) {
        // Update existing profile (include id in body as well)
        try {
          await userService.updateProfile(String(updateId), { ...payload, id: updateId });
        } catch (err: any) {
          if (err?.response?.status === 400) {
            // Fallback: try using userId as the path if profile ID fails
            await userService.updateProfile(String(user?.id), { ...payload, id: updateId || user?.id });
          } else {
            throw err;
          }
        }
      } else {
        // Create new profile
        await userService.createProfile(payload);
      }
      
      toast.success("Фото сохранено!");
      qc.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) { 
      console.error("Profile Photo Update Error:", err);
      toast.error(getApiError(err)); 
    } finally { 
      setPhotoUploading(false); 
    }
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-up">
      <h1 className="text-2xl font-black text-slate-900">Профили ман</h1>

      {/* Avatar + basic */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-slate-800 font-black text-3xl overflow-hidden shadow-lg shadow-indigo-200 ring-4 ring-white">
                {(profile?.photoUrl && typeof profile.photoUrl === 'string' && profile.photoUrl.trim() !== "")
                  ? <img 
                      src={profile.photoUrl.startsWith('http') || profile.photoUrl.startsWith('data:') || profile.photoUrl.startsWith('blob:')
                        ? profile.photoUrl 
                        : (process.env.NEXT_PUBLIC_API_URL === '/' || !process.env.NEXT_PUBLIC_API_URL
                            ? (profile.photoUrl.startsWith('/') ? profile.photoUrl : `/${profile.photoUrl}`)
                            : `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/${profile.photoUrl.replace(/^\//, '')}`)} 
                      alt="Фото" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=random&size=128`;
                      }}
                    />
                  : `${user?.fullName?.[0] ?? "?"}`}
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-md">
                <Upload size={14} className="text-slate-900" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-slate-900">{user?.fullName}</h2>
              <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
              {profile?.headline && <p className="text-indigo-600 font-semibold text-sm mt-1">{profile.headline}</p>}
              <div className="flex flex-wrap gap-3 mt-2">
                {profile?.location && <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={11}/>{profile.location}</span>}
                {profile?.website  && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-500 hover:underline"><Globe size={11}/>{profile.website}</a>}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader><h2 className="font-bold text-slate-900">Маълумоти асосӣ</h2></CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
            <Input label="Сарлавҳа" placeholder="Масалан: Senior Frontend Developer" {...register("headline")} />
            <Textarea label="Дар бораи худ" placeholder="Дар бораи таҷриба ва мақсадҳои худ нависед..." rows={4} {...register("bio")} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Макон" placeholder="Душанбе, Тоҷикистон" leftIcon={<MapPin size={14}/>} {...register("location")} />
              <Input label="Веб-сайт" placeholder="https://yoursite.com" leftIcon={<Globe size={14}/>} {...register("website")} />
            </div>
            <Button type="submit" loading={isSubmitting || saveMutation.isPending}>Захира кардани тағйирот</Button>
          </form>
        </CardBody>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Briefcase size={17} className="text-indigo-500"/>Таҷрибаи корӣ</h2>
          <Button size="sm" variant="outline" onClick={() => setExpOpen(true)}><Plus size={14}/>Илова кардан</Button>
        </CardHeader>
        <CardBody>
          {!experiences?.length ? (
            <div className="text-center py-8">
              <Briefcase size={32} className="mx-auto text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">Таҷрибаи корӣ илова нашудааст</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp: UserExperience) => (
                <div key={exp.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{exp.position}</p>
                      <p className="text-sm text-slate-600">{exp.company}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{exp.startDate} — {exp.isCurrent ? "То ҳол" : exp.endDate}</p>
                      {exp.description && <p className="text-sm text-slate-600 mt-1 leading-relaxed">{exp.description}</p>}
                    </div>
                  </div>
                  <button onClick={() => deleteExpMutation.mutate(exp.id)} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>





      {/* Education */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><GraduationCap size={17} className="text-purple-500"/>Таҳсилот</h2>
          <Button size="sm" variant="outline" onClick={() => setEduOpen(true)}><Plus size={14}/>Илова кардан</Button>
        </CardHeader>
        <CardBody>
          {!educations?.length ? (
            <div className="text-center py-8">
              <GraduationCap size={32} className="mx-auto text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">Таҳсилот илова нашудааст</p>
            </div>
          ) : (
            <div className="space-y-4">
              {educations.map((edu: UserEducation) => (
                <div key={edu.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{edu.degree} — {edu.fieldOfStudy}</p>
                      <p className="text-sm text-slate-600">{edu.institution}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{edu.startDate} — {edu.endDate || "То ҳол"}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteEduMutation.mutate(Number(edu.id))} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>




      {/* Add Experience Modal */}
      <Modal open={expOpen} onClose={() => setExpOpen(false)} title="Иловаи таҷрибаи корӣ">
        <form onSubmit={expForm.handleSubmit((d) => createExpMutation.mutate(d))} className="space-y-4">
          <Input label="Вазифа" placeholder="Frontend Developer" {...expForm.register("position")} />
          <Input label="Ширкат" placeholder="Google" {...expForm.register("company")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Санаи оғоз" type="date" {...expForm.register("startDate")} />
            <Input label="Санаи анҷом" type="date" {...expForm.register("endDate")} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isCurrent" {...expForm.register("isCurrent")} className="w-4 h-4 rounded" />
            <label htmlFor="isCurrent" className="text-sm text-slate-700">То ҳол</label>
          </div>
          <Textarea label="Тавсиф" placeholder="Уҳдадориҳои худро шарҳ диҳед..." {...expForm.register("description")} />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setExpOpen(false)}>Инкор</Button>
            <Button type="submit" loading={createExpMutation.isPending}>Илова кардан</Button>
          </div>
        </form>
      </Modal>




      {/* Add Education Modal */}
      <Modal open={eduOpen} onClose={() => setEduOpen(false)} title="Иловаи таҳсилот">
        <form onSubmit={eduForm.handleSubmit((d) => createEduMutation.mutate(d))} className="space-y-4">
          <Input label="Муассисаи таълимӣ" placeholder="МГУ" {...eduForm.register("institution")} />
          <Input label="Дараҷа" placeholder="Бакалавр" {...eduForm.register("degree")} />
          <Input label="Ихтисос" placeholder="Информатика" {...eduForm.register("fieldOfStudy")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Соли оғоз" type="date" {...eduForm.register("startDate")} />
            <Input label="Соли анҷом" type="date" {...eduForm.register("endDate")} />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setEduOpen(false)}>Инкор</Button>
            <Button type="submit" loading={createEduMutation.isPending}>Илова кардан</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}



