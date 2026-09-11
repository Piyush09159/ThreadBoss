"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readDemoSession } from "@/lib/runtime";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!readDemoSession()) {
      router.replace("/sign-in");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return <main className="tb-route-loading"><span className="tb-spinner" />Loading workspace…</main>;
  return <>{children}</>;
}
