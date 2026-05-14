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

function AnimateTagline({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p
      className="text-4xl md:text-[44px] leading-[1.06] tracking-[-0.02em] flex flex-wrap gap-x-2.5 gap-y-1"
      style={{ fontFamily: "var(--font-serif)", fontWeight: 500 }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: "tagline-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            animationDelay: `${i * 0.08}s`,
            opacity: 0,
            transform: "translateY(18px) rotate(-3deg)",
          }}
        >
          {word}
        </span>
      ))}
      <style>{`
        @keyframes tagline-pop {
          0% { opacity: 0; transform: translateY(18px) rotate(-3deg) scale(0.9); }
          60% { opacity: 1; transform: translateY(-3px) rotate(1deg) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
      `}</style>
    </p>
  );
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
        <div className="relative max-w-md text-primary-foreground">
          <AnimateTagline text="Turn your scripts and audio into LMS ready videos — in minutes." />
        </div>
      </div>
    </div>
  );
}
