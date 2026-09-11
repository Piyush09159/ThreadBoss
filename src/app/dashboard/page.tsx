"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, LogOut, ShieldCheck } from "lucide-react";
import LiveWorkspace from "@/components/dashboard/LiveWorkspace";
import RouteGuard from "@/components/auth/RouteGuard";
import { useEffect, useState } from "react";
import { DEMO_SESSION_KEY, readDemoSession } from "@/lib/runtime";

export default function DashboardPage() {
  const [name, setName] = useState("Your workspace");
  useEffect(() => {
    const session = readDemoSession();
    if (session) setName(session.name || "Your workspace");
  }, []);
  function logout() { localStorage.removeItem(DEMO_SESSION_KEY); window.location.href = "/"; }
  return (
    <RouteGuard><main className="tb-dashboard tb-dashboard-v5">
      <header className="tb-dashboard-nav">
        <Link href="/" className="tb-brand"><span className="tb-mark" /><span>ThreadBoss</span></Link>
        <div className="tb-dashboard-nav-right"><span className="tb-tenant-pill"><ShieldCheck size={13} /> {name}&nbsp; · &nbsp;Private workspace</span><Link href="/connect" className="tb-btn primary">Connect channel <ArrowRight size={14} /></Link><button type="button" className="tb-icon-btn" onClick={logout} aria-label="Sign out"><LogOut size={15} /></button></div>
      </header>
      <div className="tb-dashboard-inner tb-dashboard-inner-v5">
        <LiveWorkspace />
        <footer className="tb-dashboard-footer"><Link href="/" className="tb-footer-link"><ArrowLeft size={13} /> Back to ThreadBoss</Link><span>Private context layer · backend-ready</span></footer>
      </div>
    </main></RouteGuard>
  );
}
