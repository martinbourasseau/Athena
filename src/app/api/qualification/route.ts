import { isFormConfigured } from "@/lib/env";

/**
 * Réception du formulaire de qualification.
 * Ne répond `{ ok: true }` QUE si Resend a accepté l'email.
 * Sans configuration complète : 503, rien n'est simulé.
 */

const RATE_LIMIT = 4;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const hits = (buckets.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  buckets.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: object, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isFormConfigured()) {
    return json(
      { ok: false, error: "Le formulaire n'est pas encore relié à une boîte de réception." },
      503,
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return json({ ok: false, error: "Trop de demandes envoyées. Réessayez dans une heure." }, 429);
  }

  const raw = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!raw) return json({ ok: false, error: "Données invalides." }, 400);

  // Champ piège : rempli = robot. On ne confirme pas d'envoi.
  if (str(raw.website, 200)) return json({ ok: false, error: "Données invalides." }, 400);

  const data = {
    name: str(raw.name, 100),
    email: str(raw.email, 200),
    company: str(raw.company, 120),
    size: str(raw.size, 60),
    task: str(raw.task, 3000),
    frequency: str(raw.frequency, 60),
    tools: str(raw.tools, 300),
  };

  if (data.name.length < 2 || !EMAIL.test(data.email) || data.task.length < 20 || raw.consent !== "yes") {
    return json({ ok: false, error: "Merci de compléter les champs obligatoires." }, 400);
  }

  const text = [
    `Nom : ${data.name}`,
    `Email : ${data.email}`,
    `Entreprise : ${data.company || "—"}`,
    `Taille : ${data.size || "—"}`,
    `Fréquence : ${data.frequency || "—"}`,
    `Outils : ${data.tools || "—"}`,
    "",
    "Tâche à confier :",
    data.task,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `Athéna — projet d'agent — ${data.name}${data.company ? ` (${data.company})` : ""}`,
        text,
      }),
    });
    if (!res.ok) {
      return json({ ok: false, error: "L'envoi n'a pas abouti. Réessayez plus tard." }, 502);
    }
    return json({ ok: true }, 200);
  } catch {
    return json({ ok: false, error: "L'envoi n'a pas abouti. Réessayez plus tard." }, 502);
  }
}
