export const DEMO_SESSION_KEY = "threadboss-demo-session";

export type DemoSession = {
  name: string;
  email: string;
  tenantId: string;
};

export function readDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    if (!parsed.email || !parsed.tenantId) return null;
    return {
      name: parsed.name || parsed.email.split("@")[0],
      email: parsed.email,
      tenantId: parsed.tenantId,
    };
  } catch {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    return null;
  }
}
