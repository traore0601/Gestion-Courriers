import { useState, useEffect } from "react";

const PALETTE = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorClass(name) {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/**
 * Avatar : affiche la photo de profil réelle de l'utilisateur (`src`) si elle
 * est disponible et se charge correctement, sinon un cercle avec ses initiales.
 */
function Avatar({ src, name, size = 40, className = "" }) {
  const [imgFailed, setImgFailed] = useState(false);

  // Réinitialise l'état d'échec si la source change (ex: nouvel utilisateur connecté)
  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const dimension = `${size}px`;
  const showImage = !!src && !imgFailed;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name ? `Photo de ${name}` : "Photo de profil"}
        onError={() => setImgFailed(true)}
        style={{ width: dimension, height: dimension }}
        className={`rounded-full object-cover border border-gray-200 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className={`rounded-full flex items-center justify-center text-white font-semibold shrink-0 select-none ${getColorClass(
        name
      )} ${className}`}
      role="img"
      aria-label={name ? `Photo de ${name}` : "Photo de profil"}
    >
      <span style={{ fontSize: `${Math.max(10, size * 0.38)}px` }}>
        {getInitials(name)}
      </span>
    </div>
  );
}

export default Avatar;
