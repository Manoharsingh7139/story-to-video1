import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, FormEvent } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/Wordmark";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/app";
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({ email: fe.email?.[0], password: fe.password?.[0] });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Welcome back" });
      navigate(decodeURIComponent(next), { replace: true });
    } catch (err: any) {
      toast({ title: "Couldn't sign in", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout
    title="Welcome back."
    subtitle="Sign in to keep building."
  >
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-[11px] text-center text-muted-foreground">
        Contact Admin for new account setup.
      </p>
      <p className="text-[10px] text-center text-muted-foreground/70 pt-2">
        Demo account — credentials stored locally in this browser.
      </p>
    </form>
  </AuthLayout>;
}

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="flex flex-col justify-between p-8 md:p-14 bg-paper">
        <Wordmark size="md" />
        <div className="max-w-sm w-full mx-auto md:mx-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
            <span className="h-px w-6 bg-foreground/30 inline-block align-middle mr-2" />
            Welcome
          </div>
          <h1 className="editorial-display text-4xl md:text-[44px] text-ink mb-3">
            {title}
          </h1>
          <p className="font-serif italic text-base text-muted-foreground mb-10">
            {subtitle}
          </p>
          {children}
        </div>
        <p className="text-[11px] text-muted-foreground tnum">© Content Studio</p>
      </div>
      <div
        className="hidden md:flex relative items-center justify-center p-14 overflow-hidden border-l hairline"
        style={{ background: "hsl(var(--primary))" }}
      >
        {/* Editorial mock slide */}
        <div className="relative max-w-md text-primary-foreground">
          <div className="text-[10px] uppercase tracking-[0.24em] opacity-65 mb-8">
            Slide 01 / 14
          </div>
          <p
            className="text-4xl md:text-[44px] leading-[1.06] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 500 }}
          >
            Turn writing into watchable stories — slide by slide, voice by voice.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-10 bg-primary-foreground/40" />
            <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
              An editorial system for video
            </p>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-3 text-[11px] opacity-75 tnum">
            <div>
              <div className="font-serif text-2xl text-primary-foreground/95">14</div>
              <div className="uppercase tracking-[0.18em] mt-1 opacity-70">Templates</div>
            </div>
            <div>
              <div className="font-serif text-2xl text-primary-foreground/95">9</div>
              <div className="uppercase tracking-[0.18em] mt-1 opacity-70">Themes</div>
            </div>
            <div>
              <div className="font-serif text-2xl text-primary-foreground/95">8</div>
              <div className="uppercase tracking-[0.18em] mt-1 opacity-70">Voices</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 right-8 text-[10px] uppercase tracking-[0.24em] text-primary-foreground/60">
          Designed in Stockholm
        </div>
      </div>
    </div>
  );
}
