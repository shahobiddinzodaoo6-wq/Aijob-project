"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getApiError } from "@/lib/axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Lock, CheckCircle } from "lucide-react";
import { Suspense, useState } from "react";




const schema = z.object({
  newPassword: z.string().min(6, "Минимум 6 символов"),
  confirm: z.string(),
}).refine((d) => d.newPassword === d.confirm, { message: "Пароли не совпадают", path: ["confirm"] });
type FormData = z.infer<typeof schema>;




function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      await authService.resetPassword({ email, token, newPassword: data.newPassword });
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (e) {
      toast.error(getApiError(e));
    }
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Пароль изменён!</h2>
        <p className="text-slate-400 text-sm">Перенаправление на страницу входа...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Новый пароль"
        type="password"
        placeholder="••••••••"
        error={errors.newPassword?.message}
        leftIcon={<Lock size={15} />}
        className="bg-white/10 border-white/20 text-slate-900 placeholder:text-slate-400"
        {...register("newPassword")}
      />
      <Input
        label="Подтвердите пароль"
        type="password"
        placeholder="••••••••"
        error={errors.confirm?.message}
        leftIcon={<Lock size={15} />}
        className="bg-white/10 border-white/20 text-slate-900 placeholder:text-slate-400"
        {...register("confirm")}
      />
      <Button type="submit" className="w-full py-3" loading={isSubmitting}>
        Сохранить пароль
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Briefcase size={20} className="text-slate-900" />
            </div>
            <span className="font-extrabold text-2xl text-slate-900">AIJob</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Новый пароль</h1>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <Suspense fallback={<div className="text-slate-400 text-center py-4">Загрузка...</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}



