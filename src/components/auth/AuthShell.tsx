"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

import { DEMO_SESSION_KEY } from "@/lib/runtime";
export function AuthShell({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); if (!email || !password || (isSignUp && !name)) { setError("Complete the required fields to continue."); return; } setBusy(true); window.setTimeout(() => { localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ name: name || email.split("@")[0], email, tenantId: "demo-tenant" })); window.location.href = "/connect"; }, 450); }
  return <main className="tb-auth-wrap"><div className="tb-auth-shell-art" aria-hidden="true"><span/><span/><span/><span/><span/></div><div className="tb-auth">
    <Link href="/" className="tb-brand"><span className="tb-mark"/><span>ThreadBoss</span></Link>
    <div className="tb-kicker" style={{marginTop:38}}>Workspace access</div><h1>{isSignUp ? "Build your workspace." : "Welcome back."}</h1><p className="tb-copy">{isSignUp ? "Create the private context layer behind your connected conversations." : "Your conversation layer is waiting."}</p>
    <form onSubmit={submit} noValidate>{isSignUp && <div className="tb-field"><label>Your name</label><input className="tb-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name"/></div>}<div className="tb-field"><label>Email</label><input className="tb-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email"/></div><div className="tb-field"><label htmlFor="password">Password</label><div className="tb-password-wrap"><input id="password" className="tb-input" value={password} onChange={e=>setPassword(e.target.value)} placeholder={isSignUp ? "Create a password" : "Your password"} type={showPassword ? "text" : "password"} autoComplete={isSignUp ? "new-password" : "current-password"}/><button type="button" className="tb-password-toggle" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></div>{error && <div className="tb-form-error">{error}</div>}<button type="submit" className="tb-btn primary tb-auth-submit" disabled={busy}>{busy ? "Opening workspace…" : isSignUp ? <>Continue to channels <ArrowRight size={15}/></> : <>Sign in <ArrowRight size={15}/></>}</button></form>
    <div className="tb-auth-divider"><span>or</span></div><div className="tb-auth-socials"><button className="tb-btn ghost" type="button">Continue with Google</button><button className="tb-btn ghost" type="button">Continue with SSO</button></div><div className="tb-auth-note"><ShieldCheck size={14}/> Auth provider integration will plug into the central backend contract when supplied.</div>
    <p className="tb-auth-switch">{isSignUp ? "Already have an account?" : "New here?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Sign in" : "Create an account"}</Link></p><Link href="/" className="tb-auth-back"><ArrowLeft size={13}/> Back to ThreadBoss</Link>
  </div></main>;
}
