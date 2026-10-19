"use client";

import { useState, type FormEvent } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const sizes = ["Indépendant", "2 à 10 personnes", "11 à 50 personnes", "51 à 250 personnes", "Plus de 250 personnes"];
const frequencies = ["Plusieurs fois par jour", "Chaque jour", "Chaque semaine", "Chaque mois", "Ponctuellement"];

export function QualificationForm({ enabled }: { enabled: boolean }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enabled || status.kind === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/qualification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      // Le succès n'est affiché que si le serveur confirme l'envoi.
      if (res.ok && body.ok === true) {
        form.reset();
        setStatus({ kind: "sent" });
      } else {
        setStatus({ kind: "error", message: body.error ?? "L'envoi n'a pas abouti. Réessayez plus tard." });
      }
    } catch {
      setStatus({ kind: "error", message: "Connexion impossible. Vérifiez votre réseau et réessayez." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="form-card form-sent" role="status" aria-live="polite">
        <svg viewBox="0 0 40 40" aria-hidden="true" className="knot-svg is-tight">
          <path d="M4 20 C 12 20, 14 12, 20 12 C 26 12, 28 20, 36 20" />
          <path d="M4 20 C 12 20, 14 28, 20 28 C 26 28, 28 20, 36 20" />
          <circle cx="20" cy="20" r="3.2" />
        </svg>
        <h3>Votre demande a bien été envoyée.</h3>
        <p>Merci. Elle a été transmise et vous recevrez une réponse à l&apos;adresse indiquée.</p>
        <button type="button" className="button button--ghost" onClick={() => setStatus({ kind: "idle" })}>
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate={false} aria-describedby="form-state">
      <p className="form-kicker">Décrire mon projet</p>

      {!enabled ? (
        <p id="form-state" className="form-disabled" role="note">
          Le formulaire n&apos;est pas encore relié à une boîte de réception : il ne peut pas être envoyé pour le
          moment.
        </p>
      ) : (
        <p id="form-state" className="sr-only">
          Les champs marqués d&apos;un astérisque sont obligatoires.
        </p>
      )}

      <fieldset disabled={!enabled || status.kind === "sending"}>
        <div className="field-row">
          <label className="field">
            <span>Nom *</span>
            <input name="name" autoComplete="name" required minLength={2} maxLength={100} />
          </label>
          <label className="field">
            <span>Email *</span>
            <input name="email" type="email" autoComplete="email" required maxLength={200} />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Entreprise</span>
            <input name="company" autoComplete="organization" maxLength={120} />
          </label>
          <label className="field">
            <span>Taille</span>
            <select name="size" defaultValue="">
              <option value="">Choisir</option>
              {sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span>La tâche à confier à un agent *</span>
          <textarea
            name="task"
            required
            minLength={20}
            maxLength={3000}
            rows={5}
            placeholder="Exemple : chaque matin, je trie les demandes reçues par mail et je prépare les réponses."
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Fréquence de la tâche</span>
            <select name="frequency" defaultValue="">
              <option value="">Choisir</option>
              {frequencies.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Outils utilisés</span>
            <input name="tools" maxLength={300} placeholder="Messagerie, tableur, CRM…" />
          </label>
        </div>
        <label className="field-hp" aria-hidden="true">
          Site web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="consent">
          <input type="checkbox" name="consent" value="yes" required />
          <span>
            J&apos;accepte que les informations saisies soient utilisées pour répondre à ma demande. *
          </span>
        </label>
        <button type="submit" className="button">
          {status.kind === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
      </fieldset>

      {status.kind === "error" ? (
        <p className="form-error" role="alert">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
