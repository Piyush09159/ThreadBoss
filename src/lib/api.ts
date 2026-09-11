export type ChannelType = "whatsapp" | "telegram" | "slack";
export type ChannelStatus = "pending" | "qr_ready" | "connecting" | "connected" | "disconnected" | "error";

export interface ChannelConnection {
  id: string;
  channel_type: ChannelType;
  status: ChannelStatus;
  external_account_id?: string | null;
  metadata?: Record<string, unknown>;
}

export interface MeResponse {
  user: { id: string; email?: string | null; display_name?: string | null };
  tenant: { id: string; name?: string | null; onboarding_completed: boolean };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`ThreadBoss API ${res.status}`);
  return res.json() as Promise<T>;
}

export const threadbossApi = {
  getMe: () => request<MeResponse>("/api/me"),
  getChannels: () => request<{ channels: ChannelConnection[] }>("/api/channels"),
  createWhatsAppOnboarding: () => request<{ sessionId: string; qr?: string; status: ChannelStatus }>("/api/onboarding/whatsapp", { method: "POST", body: "{}" }),
  getWhatsAppOnboarding: (sessionId: string) => request<{ sessionId: string; qr?: string; status: ChannelStatus }>(`/api/onboarding/whatsapp/${sessionId}`),
  connectTelegram: () => request<{ url: string; status: ChannelStatus }>("/api/connect/telegram", { method: "POST", body: "{}" }),
  connectSlack: () => request<{ url: string; status: ChannelStatus }>("/api/connect/slack"),
  disconnectChannel: (id: string) => request<{ ok: boolean }>(`/api/channels/${id}/disconnect`, { method: "POST", body: "{}" }),
};
