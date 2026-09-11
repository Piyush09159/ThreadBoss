"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  MessageCircle,
  Network,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  Menu,
  X,
} from "lucide-react";
import ThreadGraph from "@/components/three/ThreadGraph";
import { useState } from "react";

const channels = [
  {
    name: "WhatsApp",
    eyebrow: "Personal",
    desc: "The conversations where life actually happens.",
    icon: MessageCircle,
    tone: "lime",
  },
  {
    name: "Telegram",
    eyebrow: "Fast + flexible",
    desc: "Bot-driven workflows, communities, and context.",
    icon: Send,
    tone: "cyan",
  },
  {
    name: "Slack",
    eyebrow: "Work",
    desc: "Decisions, requests, and team context without the scroll.",
    icon: Network,
    tone: "violet",
  },
];

const agents = [
  ["01", "Knowledge", "Find the message, decision, person, or promise you remember vaguely — and return the evidence.", BrainCircuit],
  ["02", "Planner", "Turn open commitments and calendar context into a useful day instead of another unread thread.", CalendarClock],
  ["03", "Action", "Move from intent to execution through connected tools and services.", Zap],
  ["04", "Follow-up", "Keep track of who owes what, before a deadline quietly turns into a problem.", CheckCircle2],
] as const;

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function closeNav() { setMobileNavOpen(false); }

  return (
    <main className="tb-page">
      <nav className={`tb-nav ${mobileNavOpen ? "is-open" : ""}`}>
        <Link href="/" className="tb-brand" onClick={closeNav}><span className="tb-mark" /><span>ThreadBoss</span></Link>
        <div className="tb-navlinks">
          <a href="#system" onClick={closeNav}>System</a>
          <a href="#channels" onClick={closeNav}>Channels</a>
          <a href="#agents" onClick={closeNav}>Agents</a>
        </div>
        <div className="tb-navactions">
          <Link href="/sign-in" className="tb-btn ghost" onClick={closeNav}>Sign in</Link>
          <Link href="/sign-up" className="tb-btn primary" onClick={closeNav}>Build your workspace <ArrowRight size={15} /></Link>
        </div>
        <button type="button" className="tb-mobile-nav-toggle" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(v => !v)}>
          {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      <section className="tb-hero">
        <div className="tb-noise" />
        <div className="tb-canvas-wrap"><ThreadGraph /></div>
        <div className="tb-grid" />

        <div className="tb-hero-copy">
          <div className="tb-pill"><span className="tb-live" /> Agentic intelligence for the conversations that matter</div>
          <h1 className="tb-h1">Your conversations.<br /><span className="tb-gradient">Finally useful.</span></h1>
          <p className="tb-lead">ThreadBoss connects to the channels you already live in, remembers the important parts, and helps turn messages into plans, decisions, reminders, and action.</p>
          <div className="tb-hero-actions">
            <Link href="/sign-up" className="tb-btn primary tb-btn-lg">Start ThreadBoss <ArrowRight size={17} /></Link>
            <a href="#system" className="tb-btn ghost tb-btn-lg">Explore the system <ArrowDownRight size={17} /></a>
          </div>
          <div className="tb-proof-row">
            <span><ShieldCheck size={14} /> Private workspace architecture</span>
            <span><Workflow size={14} /> One context layer across channels</span>
          </div>
        </div>

        <div className="tb-hero-corners">
          <div>THREAD / 001</div>
          <div>CONTEXT ONLINE</div>
        </div>
      </section>

      <section className="tb-marquee" aria-label="Product principle">
        <span>CONNECT</span><CircleDot size={9} /><span>UNDERSTAND</span><CircleDot size={9} /><span>REMEMBER</span><CircleDot size={9} /><span>ACT</span><CircleDot size={9} /><span>CONNECT</span><CircleDot size={9} /><span>UNDERSTAND</span>
      </section>

      <section className="tb-section tb-system" id="system">
        <div className="tb-section-header split">
          <div>
            <div className="tb-kicker">01 — The system</div>
            <h2 className="tb-title">Chat is where the data starts. ThreadBoss is what happens next.</h2>
          </div>
          <div>
            <p className="tb-copy">Instead of adding another place to manage life and work, ThreadBoss treats conversation itself as the source of truth — then gives that context an execution layer.</p>
            <div className="tb-mini-line"><span /> message → context → memory → action</div>
          </div>
        </div>

        <div className="tb-system-stage">
          <div className="tb-stage-orbit orbit-a" />
          <div className="tb-stage-orbit orbit-b" />
          <div className="tb-stage-core"><span className="tb-mark large" /><strong>THREADBOSS</strong><small>ONE INTELLIGENT CONTEXT LAYER</small></div>
          {[
            ["WhatsApp", "social"], ["Telegram", "social"], ["Slack", "work"], ["Calendar", "tool"], ["Tasks", "memory"], ["Actions", "tool"],
          ].map(([label, cls], i) => (
            <div className={`tb-float-node node-${i} ${cls}`} key={label}><span />{label}</div>
          ))}
        </div>
      </section>

      <section className="tb-section" id="channels">
        <div className="tb-section-header split">
          <div>
            <div className="tb-kicker">02 — Channel layer</div>
            <h2 className="tb-title">One workspace. Wherever your conversations happen.</h2>
          </div>
          <p className="tb-copy">Connect your channels once. The central ThreadBoss backend owns the agents, models, memory, and actions behind them.</p>
        </div>
        <div className="tb-channels">
          {channels.map(({ name, eyebrow, desc, icon: Icon, tone }, index) => (
            <Link href="/connect" className={`tb-channel tb-channel-${tone}`} key={name}>
              <div className="tb-channel-top"><span>0{index + 1}</span><Icon size={18} /></div>
              <div className="tb-channel-body"><span className="tb-channel-eyebrow">{eyebrow}</span><h3>{name}</h3><p>{desc}</p></div>
              <div className="tb-channel-arrow"><ChevronRight size={17} /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="tb-section" id="agents">
        <div className="tb-section-header split">
          <div>
            <div className="tb-kicker">03 — Agent layer</div>
            <h2 className="tb-title">Not one giant prompt. A team with jobs.</h2>
          </div>
          <p className="tb-copy">ThreadBoss is designed around specialized agents so the system can retrieve, plan, act, and follow up without collapsing everything into one opaque interaction.</p>
        </div>

        <div className="tb-agent-grid">
          {agents.map(([num, title, copy, Icon]) => (
            <article className="tb-agent" key={title}>
              <div className="tb-agent-meta"><span>{num}</span><Icon size={19} /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tb-section tb-quote-section">
        <div className="tb-quote-card">
          <Sparkles size={18} />
          <blockquote>“What did my landlord agree on rent?”</blockquote>
          <p>ThreadBoss is designed to answer with the conversation that matters — not a guess.</p>
          <div className="tb-quote-source"><MessageCircle size={14} /> Exact message · exact context · exact source</div>
        </div>
      </section>

      <section className="tb-section">
        <div className="tb-cta">
          <div className="tb-kicker">04 — Enter the workspace</div>
          <h2 className="tb-title">Give your conversations a memory.</h2>
          <p className="tb-copy">Create your workspace, connect a channel, and let ThreadBoss take it from there.</p>
          <div className="tb-hero-actions" style={{ marginTop: 24 }}>
            <Link href="/sign-up" className="tb-btn primary tb-btn-lg">Create workspace <ArrowRight size={16} /></Link>
            <Link href="/connect" className="tb-btn ghost tb-btn-lg">View channel setup</Link>
          </div>
        </div>
      </section>

      <footer className="tb-footer"><span>© 2026 ThreadBoss</span><span>Conversations → Context → Action</span></footer>
    </main>
  );
}
