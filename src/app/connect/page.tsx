"use client";

import Link from "next/link";
import { Check, ChevronLeft, ExternalLink, Hash, MessageCircle, QrCode, Send, ShieldCheck, Sparkles, Wifi } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import RouteGuard from "@/components/auth/RouteGuard";
import { threadbossApi } from "@/lib/api";

const channels = [
  {
    key: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    eyebrow: "Personal channel",
    copy: "Pair your WhatsApp session and let ThreadBoss work across the conversations already in your pocket.",
    accent: "lime",
    value: "https://threadboss.local/connect/whatsapp/demo",
    action: "Scan with WhatsApp",
  },
  {
    key: "telegram",
    name: "Telegram",
    icon: Send,
    eyebrow: "Bot connection",
    copy: "Open a secure ThreadBoss bot link. Production onboarding will replace this demo payload.",
    accent: "cyan",
    value: "https://t.me/threadboss_bot?start=demo_tenant",
    action: "Open Telegram",
  },
  {
    key: "slack",
    name: "Slack",
    icon: Hash,
    eyebrow: "Workspace install",
    copy: "Connect a team workspace through the ThreadBoss Slack installation flow.",
    accent: "violet",
    value: "https://threadboss.local/connect/slack/demo",
    action: "Install ThreadBoss",
  },
] as const;

type ConnectionKey = (typeof channels)[number]["key"];

export default function ConnectPage() {
  const [selected, setSelected] = useState<ConnectionKey>("whatsapp");
  const [connected, setConnected] = useState<ConnectionKey[]>([]);
  const [liveValue, setLiveValue] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const apiEnabled = Boolean(process.env.NEXT_PUBLIC_API_URL);
  const active = useMemo(() => channels.find((item) => item.key === selected)!, [selected]);
  const ActiveIcon = active.icon;
  const isConnected = connected.includes(active.key);
  const payloadValue = liveValue || active.value;

  useEffect(() => {
    setLiveValue(null);
    setSessionId(null);
    setApiError(null);
  }, [selected]);

  useEffect(() => {
    if (!apiEnabled || !sessionId || selected !== "whatsapp") return;
    const timer = window.setInterval(async () => {
      try {
        const result = await threadbossApi.getWhatsAppOnboarding(sessionId);
        if (result.qr) setLiveValue(result.qr);
        if (result.status === "connected") {
          setConnected((current) => current.includes("whatsapp") ? current : [...current, "whatsapp"]);
          window.clearInterval(timer);
        }
      } catch {
        // Keep polling resilient; the demo UI stays usable while the backend evolves.
      }
    }, 2500);
    return () => window.clearInterval(timer);
  }, [apiEnabled, selected, sessionId]);

  async function connect() {
    setApiError(null);
    if (!apiEnabled) {
      setConnected((current) => current.includes(active.key) ? current.filter((key) => key !== active.key) : [...current, active.key]);
      return;
    }
    setLoading(true);
    try {
      if (active.key === "whatsapp") {
        const result = await threadbossApi.createWhatsAppOnboarding();
        setSessionId(result.sessionId);
        if (result.qr) setLiveValue(result.qr);
        if (result.status === "connected") setConnected((current) => [...new Set([...current, "whatsapp"])]);
      } else if (active.key === "telegram") {
        const result = await threadbossApi.connectTelegram();
        setLiveValue(result.url);
        if (result.status === "connected") setConnected((current) => [...new Set([...current, "telegram"])]);
      } else {
        const result = await threadbossApi.connectSlack();
        setLiveValue(result.url);
        if (result.status === "connected") setConnected((current) => [...new Set([...current, "slack"])]);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Connection request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RouteGuard><main className="tb-connect tb-connect-premium">
      <div className="tb-connect-ambient" />
      <div className="tb-connect-inner">
        <div className="tb-connect-head">
          <div>
            <Link href="/" className="tb-backlink"><ChevronLeft size={14} /> ThreadBoss</Link>
            <div className="tb-kicker" style={{ marginTop: 28 }}>Workspace onboarding / 01</div>
            <h1 className="tb-title">Bring your conversations in.</h1>
            <p className="tb-copy" style={{ maxWidth: 700, margin: 0 }}>
              Choose a channel below. Every connection becomes part of the same ThreadBoss context layer, while the central backend keeps the agent logic behind the scenes.
            </p>
          </div>
          <div className="tb-connect-progress">
            <span className="tb-progress-label">CHANNELS</span>
            <strong>{connected.length} <em>/ 3</em></strong>
            <div className="tb-progress-track"><span style={{ width: `${(connected.length / 3) * 100}%` }} /></div>
          </div>
        </div>

        <div className="tb-connect-layout">
          <aside className="tb-channel-list">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              const activeTab = selected === channel.key;
              const done = connected.includes(channel.key);
              return (
                <button
                  type="button"
                  aria-pressed={activeTab}
                  key={channel.key}
                  className={`tb-channel-tab ${activeTab ? "is-active" : ""} ${channel.accent}`}
                  onClick={() => setSelected(channel.key)}
                >
                  <span className="tb-channel-index">0{index + 1}</span>
                  <span className="tb-channel-icon"><Icon size={17} /></span>
                  <span className="tb-channel-tab-text"><strong>{channel.name}</strong><small>{channel.eyebrow}</small></span>
                  <span className={`tb-channel-state ${done ? "done" : ""}`}>{done ? <Check size={13} /> : ""}</span>
                </button>
              );
            })}
            <div className="tb-channel-list-note"><ShieldCheck size={15} /><span>Connection credentials stay with the secure backend integration.</span></div>
          </aside>

          <section className={`tb-connect-panel ${active.accent}`}>
            <div className="tb-connect-panel-top">
              <div>
                <div className="tb-channel-heading"><ActiveIcon size={18} /><span>{active.eyebrow}</span></div>
                <h2>{active.name}</h2>
                <p>{active.copy}</p>
              </div>
              <div className={`tb-live-badge ${isConnected ? "online" : ""}`}><span />{isConnected ? "CONNECTED" : "READY TO CONNECT"}</div>
            </div>

            <div className="tb-pair-stage">
              <div className="tb-pair-glow" />
              <div className="tb-qr-frame">
                <div className="tb-qr-corner tl" /><div className="tb-qr-corner tr" /><div className="tb-qr-corner bl" /><div className="tb-qr-corner br" />
                <QRCodeSVG value={liveValue || active.value} size={205} includeMargin bgColor="#ffffff" fgColor="#071018" />
              </div>
              <div className="tb-scan-line" />
              <div className="tb-pair-meta"><QrCode size={14} /> {isConnected ? "Connection established" : liveValue ? `Live ${active.name} pairing payload` : `Demo ${active.name} pairing payload`}</div>
            </div>

            <div className="tb-pair-actions">
              <button type="button" className="tb-btn primary tb-btn-lg" onClick={connect} disabled={loading}>
                {loading ? "Connecting…" : isConnected ? <><Check size={16} /> Connected</> : <><Wifi size={16} /> {apiEnabled ? "Start connection" : "Simulate connection"}</>}
              </button>
              <a className="tb-btn ghost tb-btn-lg" href={payloadValue} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Open payload</a>
            </div>

            <div className="tb-connect-caption"><Sparkles size={14} /> {apiEnabled ? "Live backend integration mode is enabled. Connection state will follow the central ThreadBoss API." : "Demo mode is active. Add NEXT_PUBLIC_API_URL when your lead provides the production backend contract."}</div>{apiError && <div className="tb-form-error" role="alert">{apiError}</div>}
          </section>
        </div>

        <div className="tb-connection-footer">
          <div><span className="tb-kicker">What happens next</span><strong>Connect → ingest → understand → act</strong></div>
          <Link href="/dashboard" className="tb-btn ghost">Enter workspace</Link>
        </div>
      </div>
    </main></RouteGuard>
  );
}
