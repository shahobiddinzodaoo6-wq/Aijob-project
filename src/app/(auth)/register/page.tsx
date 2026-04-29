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
import { Mail, Lock, User, Zap, Building2, CheckCircle, Phone } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";




const schema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z.string().min(6, "Invalid phone number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["Candidate", "Organization"]),
});
type F = z.infer<typeof schema>;




export default function RegisterPage() {
    const { register: authRegister } = useAuth();
    const router = useRouter();
    const [role, setRole] = useState<"Candidate" | "Organization">("Candidate");

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<F>({
        resolver: zodResolver(schema),
        defaultValues: { role: "Candidate" },
    });

    function pickRole(r: "Candidate" | "Organization") {
        setRole(r);
        setValue("role", r);
    }

    async function onSubmit(data: F) {
        try {
            await authRegister(data);
            toast.success("Account created successfully!");
            router.push("/dashboard");
        } catch (e) { toast.error(getApiError(e)); }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="relative w-full max-w-md anim-up">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6 group">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                            <Zap size={24} className="text-primary-foreground" fill="currentColor" />
                        </div>
                        <span className="font-black text-3xl tracking-tighter text-foreground">AIJob</span>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Create Account</h1>
                    <p className="text-sm text-muted-foreground">Join our community and start your journey</p>
                </div>

                <div className="card p-8 shadow-2xl shadow-black/5 dark:shadow-none">
                    {/* Role picker */}
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Select Your Role</p>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {([
                            { r: "Candidate", icon: <User size={20} />, label: "Candidate" },
                            { r: "Organization", icon: <Building2 size={20} />, label: "Employer" },
                        ] as const).map(({ r, icon, label }) => {
                            const selected = role === r;
                            return (
                                <button key={r} type="button" onClick={() => pickRole(r)}
                                    className={clsx(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all relative overflow-hidden group",
                                        selected
                                            ? "border-primary bg-primary/5 shadow-inner ring-1 ring-primary"
                                            : "border-border bg-accent/30 hover:border-primary/50 hover:bg-accent/50"
                                    )}
                                >
                                    {selected && <CheckCircle size={16} className="absolute top-2 right-2 text-primary" />}
                                    <span className={clsx("transition-transform group-hover:scale-110 duration-300", selected ? "text-primary" : "text-muted-foreground")}>{icon}</span>
                                    <span className={clsx("text-xs font-black uppercase tracking-tight", selected ? "text-foreground" : "text-muted-foreground")}>{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input label="Full Name" placeholder="John Doe" error={errors.fullName?.message} leftIcon={<User size={18} />} {...register("fullName")} />
                        <Input label="Phone Number" placeholder="+1..." error={errors.phoneNumber?.message} leftIcon={<Phone size={18} />} {...register("phoneNumber")} />
                        <Input label="Email Address" type="email" placeholder="you@example.com" error={errors.email?.message} leftIcon={<Mail size={18} />} {...register("email")} />
                        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} leftIcon={<Lock size={18} />} {...register("password")} />
                        <input type="hidden" {...register("role")} />
                        <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-4 shadow-lg shadow-primary/20">
                            Create Account
                        </Button>
                    </form>

                    <div className="h-px bg-border my-8" />
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}



