import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? "/app" : "/signin"} replace />;
}
