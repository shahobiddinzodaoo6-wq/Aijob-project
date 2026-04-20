"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { PageLoader } from "@/components/ui/Spinner";
import { getApiError } from "@/lib/axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Settings, Bell, Globe, Shield } from "lucide-react";

interface UserSettings { language: string; emailNotifications: boolean; pushNotifications: boolean; }

export default function SettingsPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => { const r = await apiClient.get("/api/UserSettings/me"); return r.data.data as UserSettings; },
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<UserSettings>();
  useEffect(() => { 
    if (settings) {
      reset({ 
        language: settings.language, 
        emailNotifications: settings.emailNotifications, 
        pushNotifications: settings.pushNotifications 
      });
    }
  }, [settings?.language, settings?.emailNotifications, settings?.pushNotifications, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: UserSettings) => { await apiClient.put("/api/UserSettings/me", data); },
    onSuccess: () => toast.success("Настройки сохранены!"),
    onError: (e) => toast.error(getApiError(e)),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-up max-w-2xl">
      <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
        <Settings size={22} className="text-indigo-500" />Настройки
      </h1>

      <Card>
        <CardHeader>
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Globe size={17} className="text-indigo-500"/>Язык и регион</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-5">
            <Select label="Язык интерфейса" options={[
              { value:"ru", label:"Русский" },
              { value:"en", label:"English" },
              { value:"uz", label:"O'zbek" },
            ]} {...register("language")} />

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm"><Bell size={15} className="text-indigo-500"/>Уведомления</h3>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email уведомления</p>
                  <p className="text-xs text-slate-500">Получать уведомления на email</p>
                </div>
                <input type="checkbox" {...register("emailNotifications")} className="w-5 h-5 rounded accent-indigo-600" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Push уведомления</p>
                  <p className="text-xs text-slate-500">Уведомления в браузере</p>
                </div>
                <input type="checkbox" {...register("pushNotifications")} className="w-5 h-5 rounded accent-indigo-600" />
              </label>
            </div>

            <Button type="submit" loading={isSubmitting || saveMutation.isPending}>Сохранить настройки</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Shield size={17} className="text-red-500"/>Безопасность</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-900">Изменить пароль</p>
                <p className="text-xs text-slate-500">Обновите пароль для безопасности</p>
              </div>
              <Button variant="outline" size="sm">Изменить</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-red-700">Удалить аккаунт</p>
                <p className="text-xs text-red-500">Это действие необратимо</p>
              </div>
              <Button variant="danger" size="sm">Удалить</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
