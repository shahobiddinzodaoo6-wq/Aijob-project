"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getApiError } from "@/lib/axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Zap } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type F = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) });

  async function onSubmit(data: F) {
    try {
      await login(data);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (e) { toast.error(getApiError(e)); }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-sm anim-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
              <Zap size={24} className="text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-black text-3xl tracking-tighter text-foreground">AIJob</span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Form card */}
        <div className="card p-8 shadow-2xl shadow-black/5 dark:shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email address" type="email" placeholder="you@example.com"
              error={errors.email?.message} leftIcon={<Mail size={18} />}
              {...register("email")}
            />
            <Input label="Password" type="password" placeholder="••••••••"
              error={errors.password?.message} leftIcon={<Lock size={18} />}
              {...register("password")}
            />
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" title="Forgot password?" className="text-xs font-bold text-primary hover:opacity-80 transition-colors uppercase tracking-widest">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-4 shadow-lg shadow-primary/20">
              Sign In
            </Button>
          </form>

          <div className="h-px bg-border my-8 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">OR</span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline ml-1">
              Create one now
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Designed with Excellence</p>
        </div>
      </div>
    </div>
  );
}
