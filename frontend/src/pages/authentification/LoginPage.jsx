import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

function useEntreeDuJour() {
  return useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const jour = Math.floor(diff / (1000 * 60 * 60 * 24));
    const numero = String(jour * 37 + now.getHours()).padStart(5, "0");
    const dateLisible = now.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return { numero: `${now.getFullYear()}-${numero}`, dateLisible };
  }, []);
}

function SceauRegistre({ state }) {
  return (
    <div className={`seau seau-${state}`} aria-hidden="true">
      <svg viewBox="0 0 220 220" width="168" height="168">
        <defs>
          <path
            id="seau-cercle"
            d="M 110, 110 m -78, 0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
          />
        </defs>
        <circle cx="110" cy="110" r="102" className="seau-halo" />
        <circle cx="110" cy="110" r="86" className="seau-anneau-ext" />
        <circle cx="110" cy="110" r="64" className="seau-anneau-int" />
        <text className="seau-texte">
          <textPath href="#seau-cercle" startOffset="2%">
            SERVICE DU COURRIER · ACCÈS CONTRÔLÉ ·
          </textPath>
        </text>
        <g className="seau-centre">
          <path
            d="M110 62 L128 84 L110 106 L92 84 Z"
            className="seau-marque"
          />
          <path
            d="M78 128 h64"
            className="seau-marque seau-trait"
          />
          <path
            d="M86 142 h48"
            className="seau-marque seau-trait"
          />
        </g>
      </svg>
    </div>
  );
}

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { numero, dateLisible } = useEntreeDuJour();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [seSouvenir, setSeSouvenir] = useState(true);
  const [statut, setStatut] = useState("idle");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (statut === "error") {
      const t = setTimeout(() => setStatut("idle"), 2500);
      return () => clearTimeout(t);
    }
  }, [statut]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");

    // Nettoyage de la saisie (retire les espaces inutiles en début/fin)
    const usernameClean = email.trim();
    const passwordClean = motDePasse.trim();

    if (!usernameClean || !passwordClean) {
      setErreur("Veuillez renseigner votre nom d'utilisateur et votre mot de passe.");
      setStatut("error");
      return;
    }

    setStatut("loading");

    try {
      const res = await fetch(`${API_BASE}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameClean,
          password: passwordClean,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Extraction détaillée du message d'erreur de Django
        let messageErreur = "Identifiants incorrects. Veuillez réessayer.";
        
        if (data.detail) {
          messageErreur = data.detail;
        } else if (data.username) {
          messageErreur = `Nom d'utilisateur : ${data.username.join(" ")}`;
        } else if (data.password) {
          messageErreur = `Mot de passe : ${data.password.join(" ")}`;
        }

        throw new Error(messageErreur);
      }

      const storage = seSouvenir ? localStorage : sessionStorage;
      
      // Stockage des jetons d'accès
      if (data.access) storage.setItem("access_token", data.access);
      if (data.refresh) storage.setItem("refresh_token", data.refresh);
      if (data.utilisateur_id) storage.setItem("utilisateur_id", data.utilisateur_id);

      setStatut("success");

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        navigate("/dashboard", { replace: true });
      }, 500);

    } catch (err) {
      setErreur(err.message || "Connexion impossible. Vérifiez votre réseau.");
      setStatut("error");
    }
  };

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .page {
          --cover-1: #101d38;
          --cover-2: #0a1526;
          --brass: #c9a227;
          --brass-soft: rgba(201,162,39,0.55);
          --paper: #fbfaf7;
          --ink: #16202e;
          --slate: #64748b;
          --line-dark: rgba(255,255,255,0.12);
          --line-light: #e7e3d8;
          --brand: #1d4ed8;
          --danger: #b3261e;

          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
          background: var(--paper);
          font-family: 'IBM Plex Sans', system-ui, sans-serif;
          color: var(--ink);
        }
        @media (min-width: 900px) {
          .page { grid-template-columns: 1.05fr 1fr; }
        }

        .couverture {
          position: relative;
          overflow: hidden;
          background: radial-gradient(120% 140% at 20% 0%, var(--cover-1) 0%, var(--cover-2) 70%);
          color: #f4f1e8;
          padding: 3rem 3rem 2.5rem;
          display: none;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 900px) { .couverture { display: flex; } }

        .couverture::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.045) 35px,
            rgba(255,255,255,0.045) 36px
          );
          pointer-events: none;
        }
        .couverture::after {
          content: "";
          position: absolute;
          left: 46px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--brass-soft);
          opacity: 0.5;
        }

        .eyebrow {
          position: relative;
          z-index: 1;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--brass);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .eyebrow::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--line-dark);
        }

        .titre-couverture {
          position: relative;
          z-index: 1;
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2.1rem, 3.1vw, 2.9rem);
          line-height: 1.08;
          margin-top: 1.4rem;
          max-width: 15ch;
          letter-spacing: -0.01em;
        }
        .texte-couverture {
          position: relative;
          z-index: 1;
          margin-top: 1rem;
          max-width: 34ch;
          font-size: 0.92rem;
          line-height: 1.6;
          color: rgba(244,241,232,0.72);
        }

        .zone-sceau {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .ticker {
          position: relative;
          z-index: 1;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          color: rgba(244,241,232,0.65);
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-top: 1px solid var(--line-dark);
          padding-top: 1rem;
          letter-spacing: 0.02em;
        }
        .ticker strong {
          color: var(--brass);
          font-weight: 500;
        }

        .seau { animation: sceauEntree 900ms cubic-bezier(.2,.8,.2,1) both; }
        .seau-loading { animation: sceauPresse 1.1s ease-in-out infinite; }
        .seau-success { animation: sceauValide 500ms ease-out both; }
        .seau-error { animation: sceauSecousse 420ms ease-in-out; }

        .seau-halo { fill: none; stroke: var(--line-dark); stroke-width: 1; }
        .seau-anneau-ext { fill: none; stroke: var(--brass); stroke-width: 1.4; opacity: 0.85; }
        .seau-anneau-int { fill: none; stroke: var(--brass); stroke-width: 1; opacity: 0.55; stroke-dasharray: 2 4; }
        .seau-texte {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          fill: var(--brass);
        }
        .seau-marque { fill: none; stroke: #f4f1e8; stroke-width: 2.5; stroke-linecap: round; }
        .seau-marque:not(.seau-trait) { fill: rgba(244,241,232,0.06); }

        @keyframes sceauEntree {
          0% { opacity: 0; transform: scale(0.7) rotate(-8deg); }
          60% { opacity: 1; transform: scale(1.05) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes sceauPresse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.94); }
        }
        @keyframes sceauValide {
          0% { transform: scale(1); }
          40% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes sceauSecousse {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .zone-formulaire {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
        }
        .carte-formulaire { width: 100%; max-width: 380px; }

        .logo-mobile {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 900px) { .logo-mobile { display: none; } }
        .logo-mobile .pastille {
          width: 34px; height: 34px; border-radius: 9999px;
          background: var(--cover-1);
          display: flex; align-items: center; justify-content: center;
          color: var(--brass);
          font-family: 'Fraunces', serif; font-weight: 700; font-size: 0.95rem;
        }
        .logo-mobile span { font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; letter-spacing: 0.16em; color: var(--slate); text-transform: uppercase; }

        .titre-form {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.85rem;
          letter-spacing: -0.01em;
        }
        .sous-titre-form {
          margin-top: 0.4rem;
          font-size: 0.88rem;
          color: var(--slate);
          line-height: 1.5;
        }

        .champ { margin-top: 1.4rem; }
        .champ label {
          display: block;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 0.4rem;
        }
        .champ-boite {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid var(--line-light);
          border-radius: 10px;
          background: #fff;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .champ-boite:focus-within {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(29,78,216,0.12);
        }
        .champ-boite .icone { padding-left: 0.8rem; color: var(--slate); display: flex; }
        .champ-boite input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 0.68rem 0.7rem;
          font-size: 0.9rem;
          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--ink);
        }
        .champ-boite button.toggle {
          background: none; border: none; cursor: pointer;
          padding: 0 0.8rem; color: var(--slate); display: flex; align-items: center;
        }
        .champ-boite button.toggle:hover { color: var(--ink); }

        .ligne-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.1rem;
          font-size: 0.82rem;
        }
        .case { display: flex; align-items: center; gap: 0.5rem; color: var(--slate); cursor: pointer; }
        .case input { accent-color: var(--brand); width: 15px; height: 15px; }
        .lien-oubli { color: var(--brand); text-decoration: none; font-weight: 500; }
        .lien-oubli:hover { text-decoration: underline; }

        .bouton-connexion {
          margin-top: 1.6rem;
          width: 100%;
          background: var(--brand);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.78rem 1rem;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background 150ms ease, transform 150ms ease;
        }
        .bouton-connexion:hover:not(:disabled) { background: #1a43c4; }
        .bouton-connexion:active:not(:disabled) { transform: scale(0.99); }
        .bouton-connexion:disabled { opacity: 0.75; cursor: progress; }
        .bouton-connexion:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }

        .bandeau-erreur {
          margin-top: 1.1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          background: #fdf1f0;
          border: 1px solid #f3d3d1;
          color: var(--danger);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          font-size: 0.82rem;
          line-height: 1.4;
        }

        .pied-form {
          margin-top: 2.2rem;
          padding-top: 1.2rem;
          border-top: 1px solid var(--line-light);
          font-size: 0.78rem;
          color: var(--slate);
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .seau, .seau-loading, .seau-success, .seau-error { animation: none !important; }
          .bouton-connexion, .champ-boite { transition: none !important; }
        }
      `}</style>

      {/* Panneau gauche : couverture du registre */}
      <div className="couverture">
        <div className="eyebrow">Registre officiel</div>

        <div>
          <h1 className="titre-couverture">Registre des Courriers</h1>
          <p className="texte-couverture">
            Suivez chaque courrier arrivé ou envoyé, de son enregistrement à
            son traitement, dans un espace unique et sécurisé.
          </p>
        </div>

        <div className="zone-sceau">
          <SceauRegistre state={statut} />
        </div>

        <div className="ticker">
          <span>Entrée n° <strong>{numero}</strong></span>
          <span>{dateLisible}</span>
        </div>
      </div>

      {/* Panneau droit : formulaire */}
      <div className="zone-formulaire">
        <div className="carte-formulaire">
          <div className="logo-mobile">
            <div className="pastille">R</div>
            <span>Registre des courriers</span>
          </div>

          <h2 className="titre-form">Connexion</h2>
          <p className="sous-titre-form">
            Accédez à votre espace de gestion des courriers entrants et
            sortants.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="champ">
              <label htmlFor="email">Nom d'utilisateur ou Email</label>
              <div className="champ-boite">
                <span className="icone"><Mail size={16} /></span>
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  placeholder="nom_utilisateur"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="champ">
              <label htmlFor="mot-de-passe">Mot de passe</label>
              <div className="champ-boite">
                <span className="icone"><Lock size={16} /></span>
                <input
                  id="mot-de-passe"
                  type={voirMotDePasse ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setVoirMotDePasse((v) => !v)}
                  aria-label={voirMotDePasse ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {voirMotDePasse ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="ligne-options">
              <label className="case">
                <input
                  type="checkbox"
                  checked={seSouvenir}
                  onChange={(e) => setSeSouvenir(e.target.checked)}
                />
                Se souvenir de moi
              </label>
              <a href="#mot-de-passe-oublie" className="lien-oubli">Mot de passe oublié ?</a>
            </div>

            {erreur && (
              <div className="bandeau-erreur" role="alert" aria-live="polite">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{erreur}</span>
              </div>
            )}

            <button type="submit" className="bouton-connexion" disabled={statut === "loading"}>
              {statut === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connexion en cours…
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pied-form">
            Besoin d'aide pour accéder à votre compte ?{" "}
            <a href="#aide" className="lien-oubli">Contactez l'administrateur</a>
          </div>
        </div>
      </div>
    </div>
  );
}