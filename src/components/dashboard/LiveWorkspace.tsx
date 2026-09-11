"use client";

import { Activity, ArrowUpRight, Bot, CalendarClock, CheckCircle2, MessageCircle, Network, Send, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { threadbossApi, type ChannelConnection } from "@/lib/api";

type Channel = { name: string; icon: typeof MessageCircle; status: string; tone: string; metric: string };

const baseChannels: Channel[] = [
  { name: "WhatsApp", icon: MessageCircle, status: "Connected", tone: "lime", metric: "1,184" },
  { name: "Telegram", icon: Send, status: "Connected", tone: "cyan", metric: "412" },
  { name: "Slack", icon: Network, status: "Connected", tone: "violet", metric: "246" },
];

const activity = [
  ["Knowledge Agent", "Indexed 36 new messages", "2m ago", Bot],
  ["Planner Agent", "Updated Friday obligations", "12m ago", CalendarClock],
  ["Follow-up Agent", "Watching 3 open commitments", "24m ago", CheckCircle2],
];

export default function LiveWorkspace() {
  const [active, setActive] = useState("All channels");
  const [channels, setChannels] = useState(baseChannels);
  const apiEnabled = Boolean(process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    if (!apiEnabled) return;
    threadbossApi.getChannels().then(({ channels: live }) => {
      const mapped = live.map((item: ChannelConnection) => ({
        name: item.channel_type === "whatsapp" ? "WhatsApp" : item.channel_type === "telegram" ? "Telegram" : "Slack",
        icon: item.channel_type === "whatsapp" ? MessageCircle : item.channel_type === "telegram" ? Send : Network,
        status: item.status.replace("_", " "),
        tone: item.channel_type === "whatsapp" ? "lime" : item.channel_type === "telegram" ? "cyan" : "violet",
        metric: "—",
      }));
      if (mapped.length) setChannels(mapped);
    }).catch(() => {});
  }, [apiEnabled]);

  const total = useMemo(() => channels.reduce((sum, c) => sum + Number(c.metric.replace(/,/g, "") || 0), 0), [channels]);

  return (
    <>
      <div className="tb-commandbar">
        <div className="tb-command-search"><span>⌘</span> Search your workspace <kbd>K</kbd></div>
        <div className="tb-command-status"><span className="tb-dot" style={{ background: "#6df0af" }} /> Context engine online</div>
      </div>

      <div className="tb-dashboard-hero">
        <div>
          <div className="tb-kicker">Workspace / live context</div>
          <h1 className="tb-title">Your conversations, finally useful.</h1>
          <p className="tb-copy">ThreadBoss is turning connected conversations into searchable memory, plans, and action.</p>
        </div>
        <div className="tb-live-stat"><span className="tb-kicker">MESSAGES IN CONTEXT</span><strong>{total.toLocaleString()}</strong><small>across connected channels</small></div>
      </div>

      <div className="tb-statrow tb-statrow-enhanced">
        {[
          ["Messages indexed", "1,842", MessageCircle, "+36 today"],
          ["Open commitments", "16", CheckCircle2, "3 due soon"],
          ["Upcoming", "7", CalendarClock, "next: 7 PM"],
          ["Agent runs", "128", Zap, "all healthy"],
        ].map(([label, value, Icon, hint]) => (
          <article className="tb-card tb-stat" key={label as string}><div className="tb-stat-icon"><Icon size={16} /></div><span>{label}</span><strong>{value}</strong><small>{hint}</small></article>
        ))}
      </div>

      <div className="tb-filterrow">
        {['All channels', 'WhatsApp', 'Telegram', 'Slack'].map((item) => <button className={active === item ? 'is-active' : ''} onClick={() => setActive(item)} key={item}>{item}</button>)}
        <span className="tb-filter-spacer" />
        <button className="tb-refresh"><Activity size={14} /> Live</button>
      </div>

      <div className="tb-dashgrid tb-dashgrid-v5">
        <section className="tb-card tb-surface-card">
          <div className="tb-card-heading"><div><div className="tb-kicker">Connected surfaces</div><h2>Where ThreadBoss is listening</h2></div><Sparkles size={18} /></div>
          <div className="tb-surface-list">
            {channels.filter((c) => active === 'All channels' || c.name === active).map(({ name, icon: Icon, status, tone, metric }) => <div className="tb-surface-row" key={name}><div className={`tb-surface-icon ${tone}`}><Icon size={17} /></div><div className="tb-surface-main"><strong>{name}</strong><span>{metric} messages in indexed context</span></div><div className="tb-status"><span className="tb-dot" style={{ background: '#6df0af' }} />{status}</div><ArrowUpRight size={15} className="tb-row-arrow" /></div>)}
          </div>
          <a href="/connect" className="tb-inline-link">Manage channel connections <ArrowUpRight size={14} /></a>
        </section>

        <section className="tb-card tb-pulse-card">
          <div className="tb-card-heading"><div><div className="tb-kicker">Agent activity</div><h2>System pulse</h2></div><span className="tb-pulse-live"><i /> LIVE</span></div>
          <div className="tb-activity-list">{activity.map(([name, text, time, Icon]) => <div className="tb-activity-row" key={name as string}><div className="tb-activity-icon"><Icon size={16} /></div><div><strong>{name}</strong><p>{text as string}</p></div><time>{time as string}</time></div>)}</div>
          <div className="tb-health"><span><CheckCircle2 size={14} /> All systems nominal</span><small>Agent telemetry will sync from <code>agent_runs</code>.</small></div>
        </section>
      </div>
    </>
  );
}
