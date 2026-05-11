import { useState } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/lib/data/useProjects";
import { useHistoryStore } from "@/lib/data/useHistory";
import { useBrandKit } from "@/lib/data/useBrandKit";
import { toast } from "@/hooks/use-toast";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const wipeAll = () => {
    ["cs.projects", "cs.history", "cs.brand", "cs.welcomeDismissed", "cs.brandCallout"].forEach(
      (k) => localStorage.removeItem(k),
    );
    useProjects.setState({ projects: [] });
    useHistoryStore.setState({ entries: [] });
    useBrandKit.getState().reset();
    toast({ title: "Local data cleared" });
  };

  return (
    <>
      <Topbar crumbs={[{ label: "Settings" }]} />
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 lg:px-12 py-12 lg:py-16">
          <EditorialHeader
            eyebrow={
              <>
                <span className="h-px w-6 bg-foreground/30 inline-block" />
                <span>Settings</span>
              </>
            }
            title="Account & preferences."
            lede="Tune the small things — they add up."
          />

          <div className="mt-12 space-y-12">
            <section>
              <div className="flex items-baseline justify-between mb-1 pb-3 border-b hairline">
                <h2 className="font-serif text-xl text-ink">Profile</h2>
                <p className="text-[12px] text-muted-foreground">Visible only to you.</p>
              </div>
              <div className="pt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Button
                    onClick={() => {
                      updateProfile({ name, email });
                      toast({ title: "Profile updated" });
                    }}
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-1 pb-3 border-b hairline">
                <h2 className="font-serif text-xl text-ink">Session</h2>
                <p className="text-[12px] text-muted-foreground">Sign out of this browser.</p>
              </div>
              <div className="pt-5">
                <Button
                  variant="outline"
                  onClick={() => {
                    signOut();
                    navigate("/signin");
                  }}
                >
                  Sign out
                </Button>
              </div>
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-1 pb-3 border-b hairline">
                <h2 className="font-serif text-xl text-destructive">Danger zone</h2>
                <p className="text-[12px] text-muted-foreground">Irreversible. Local data only.</p>
              </div>
              <div className="pt-5">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5">
                      Clear all local data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-serif">Clear all data?</AlertDialogTitle>
                      <AlertDialogDescription>
                        All projects, history, and brand kit settings will be deleted from this browser.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={wipeAll}>Clear data</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
