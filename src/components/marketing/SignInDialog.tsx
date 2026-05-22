import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "@/hooks/use-toast";
import { ArrowUpRight } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export function SignInDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
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
      onOpenChange(false);
      navigate("/app", { replace: true });
    } catch (err: any) {
      toast({ title: "Couldn't sign in", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-paper border hairline shadow-paper rounded-2xl p-0 max-w-md overflow-hidden">
        {/* Decorative serif flourish */}
        <div
          aria-hidden
          className="absolute -top-6 -right-4 text-[120px] leading-none text-foreground/5 select-none pointer-events-none"
          style={{ fontFamily: "var(--font-serif)", transform: "rotate(8deg)" }}
        >
          &
        </div>

        <div className="relative p-7 md:p-9">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3 flex items-center">
            <span className="h-px w-6 bg-foreground/30 inline-block mr-2" />
            Welcome back
          </div>

          <h2
            className="editorial-display text-ink text-[34px] md:text-[40px] leading-[1.02] tracking-[-0.02em] mb-1"
          >
            Hello,{" "}
            <span className="font-serif italic font-normal text-primary">again.</span>
          </h2>
          <p className="font-serif italic text-sm text-muted-foreground mb-7">
            Pick up where you left off.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="signin-email" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </Label>
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="bg-background/60 border-foreground/15 rounded-lg h-11"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signin-password" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Password
              </Label>
              <Input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background/60 border-foreground/15 rounded-lg h-11"
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group w-full h-11 rounded-full uppercase tracking-[0.18em] text-[12.5px] font-medium"
            >
              <span>{loading ? "Signing in…" : "Sign in"}</span>
              <ArrowUpRight
                className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </Button>

            <p className="text-[11px] text-center text-muted-foreground pt-1">
              Contact admin for new account setup.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
