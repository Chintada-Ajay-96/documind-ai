// Header.tsx
// Layer: component. The top bar: logo, name, and the backend status light.

import type { BackendStatus } from "../hooks/useBackendStatus";

interface HeaderProps {
  status: BackendStatus;
}

// A page with a folded corner and a highlighter stroke
function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <path
        d="M7 3h13l6 6v20H7z"
        fill="#FBFCFD"
        stroke="#101B33"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 3v6h6" fill="none" stroke="#101B33" strokeWidth="2" strokeLinejoin="round" />
      <rect x="11" y="15" width="11" height="4" fill="#FFE14D" />
      <rect x="11" y="22" width="8" height="2" fill="#101B33" />
    </svg>
  );
}

export function Header({ status }: HeaderProps) {
  let label = "Connecting to backend";
  let tone = "pending";

  if (status.state === "online") {
    if (status.report.database.connected) {
      label = "Backend online";
      tone = "ok";
    } else {
      label = "Database unreachable";
      tone = "warn";
    }
  } else if (status.state === "offline") {
    label = "Backend offline";
    tone = "error";
  }

  return (
    <header className="topbar">
      <div className="brand">
        <LogoMark />
        <span className="brand-name">DocuMind</span>
      </div>

      <div className={`status status-${tone}`} role="status">
        <span className="status-dot" aria-hidden="true" />
        {label}
      </div>
    </header>
  );
}