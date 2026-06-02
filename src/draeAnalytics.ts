/**
 * 🚀 DRAE ANALYTICS - Ultimate Visitor Tracking System
 */

interface VisitorInfo {
  hash: string;
  label: string;
  visitCount: number;
  firstSeen: string;
  isIncognito: boolean;
  visitorType: 'new' | 'returning' | 'bot';
  browserEmoji: string;
  deviceType: string;
}

interface DiscordPayload {
  embeds: Array<{
    title: string;
    description: string;
    color: number;
    timestamp: string;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
  }>;
}

class DraeAnalyticsConfig {
  public DISCORD_WEBHOOK_URL: string = 'https://discord.com/api/webhooks/1511345217553305640/64jctNGjOu34J1nsrmux511bItC0vLsFZ1qcOiN7W6Jq3xh8NjFoBxAw3UH4DLKGpIDd';
  public readonly LOCAL_STORAGE_PREFIX = 'drae_';
  public readonly COLORS = {
    VISITOR_NEW: 0x00ff88,
    VISITOR_RETURNING: 0x3498db,
    ERROR: 0xe74c3c,
    SESSION_START: 0x9b59b6
  };
}

let CONFIG: DraeAnalyticsConfig = new DraeAnalyticsConfig();

async function sendToDiscord(payload: DiscordPayload): Promise<void> {
  try {
    await fetch(CONFIG.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.warn('Discord log failed:', error);
  }
}

function getOrCreateLabel(): string {
  const stored = localStorage.getItem(`${CONFIG.LOCAL_STORAGE_PREFIX}visitor_label`);
  if (stored) return stored;

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomId = '';
  for (let i = 0; i < 4; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const label = `User#${randomId}`;
  localStorage.setItem(`${CONFIG.LOCAL_STORAGE_PREFIX}visitor_label`, label);
  return label;
}

async function generateVisitorHash(): Promise<string> {
  const fingerprint = navigator.userAgent + screen.width + navigator.language;
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

function setupCrashlytics(): void {
  window.addEventListener('error', async (event) => {
    const label = getOrCreateLabel();
    await sendToDiscord({
      embeds: [{
        title: '❌ Runtime Crash',
        description: `**${label}** crashed!`,
        color: CONFIG.COLORS.ERROR,
        timestamp: new Date().toISOString(),
        fields: [
          { name: 'Message', value: event.message },
          { name: 'Source', value: `${event.filename}:${event.lineno}` }
        ]
      }]
    });
  });
}

export async function initAnalytics(): Promise<void> {
  setupCrashlytics();
  const label = getOrCreateLabel();
  const hash = await generateVisitorHash();
  
  await sendToDiscord({
    embeds: [{
      title: '🚀 New Session',
      description: `**${label}** (${hash}) joined the suite.`,
      color: CONFIG.COLORS.VISITOR_NEW,
      timestamp: new Date().toISOString(),
      fields: [
        { name: 'Browser', value: navigator.userAgent, inline: true },
        { name: 'URL', value: window.location.href, inline: true }
      ]
    }]
  });
}
