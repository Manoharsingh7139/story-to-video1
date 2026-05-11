import { useState } from "react";
import { Topbar } from "@/components/app-shell/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/lib/data/useProjects";
import { useHistoryStore } from "@/lib/data/useHistory";
import { useBrandKit } from "@/lib/data/useBrandKit";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const wipeAll = () => {
    ["cs.projects", "cs.history", "cs.brand", "cs.welcomeDismissed", "cs.brandCallout"].forEach((k) =>
      localStorage.removeItem(k),
    );
    useProjects.setState({ projects: [] });
    useHistoryStore.setState({ entries: [] });
    useBrandKit.getState().reset();
    toast({ title: "Local data cleared" });
  };

  return (
    <>
      <Topbar eyebrow="Settings" title="Account & preferences" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          <Card className="p-6">
            <h3 className="font-display text-lg mb-4">Profile</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button onClick={() => { updateProfile({ name, email }); toast({ title: "Profile updated" }); }}>
                Save changes
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-destructive/30">
            <h3 className="font-display text-lg mb-1">Danger zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Irreversible actions for this browser only.</p>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Clear all local data</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all data?</AlertDialogTitle>
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
              <Button variant="destructive" onClick={() => { signOut(); navigate("/signin"); }}>
                Sign out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
