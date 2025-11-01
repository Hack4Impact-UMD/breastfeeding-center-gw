import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import Loading from "@/components/Loading";
import { Navigate } from "react-router";

export default function RequireNoAuth({ children }: { children: ReactNode }) {
  const { isAuthed, loading } = useAuth()

  if (loading) return <div className="w-full h-full">
    <Loading />
  </div>

  if (isAuthed) return <Navigate to="/" />

  return children;
}
