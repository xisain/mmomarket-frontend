import { Brand } from "@/components/brand";
import "@/components/dashboard.css";
import "./skeleton.css";

function Placeholder({ className = "" }: { className?: string }) {
  return <span className={`dash-skeleton ${className}`} />;
}

export function DashboardSkeleton({ variant }: { variant: "profile" | "seller" }) {
  const profile = variant === "profile";

  return (
    <div className={`dash-shell dash-${profile ? "buyer" : "seller"}`}>
      <p className="sr-only" role="status">
        {profile ? "Memuat profil dan transaksi…" : "Memuat dashboard seller…"}
      </p>
      <aside className="dash-sidebar" aria-hidden="true">
        <Brand />
        <div className="dash-workspace">
          <Placeholder className="skeleton-avatar" />
          <div className="skeleton-stack"><Placeholder /><Placeholder className="skeleton-short" /></div>
        </div>
        <div className="skeleton-nav">
          {Array.from({ length: profile ? 3 : 5 }, (_, index) => (
            <Placeholder className="skeleton-nav-item" key={index} />
          ))}
        </div>
        <div className="dash-sidebar-bottom">
          <Placeholder />
          <div className="dash-profile"><Placeholder className="skeleton-avatar" /><Placeholder /></div>
        </div>
      </aside>
      <div className="dash-body">
        <header className="dash-topbar" aria-hidden="true"><Placeholder className="skeleton-breadcrumb" /></header>
        <main className="dash-main" id="main-content" aria-busy="true" aria-label={profile ? "Profil buyer" : "Dashboard seller"}>
          <div aria-hidden="true">
            <div className="dash-page-heading">
              <div className="skeleton-heading skeleton-stack">
                <Placeholder className="skeleton-short" />
                <Placeholder className="skeleton-title" />
                <Placeholder />
              </div>
              <Placeholder className="skeleton-badge" />
            </div>
            <div className="dash-stats">
              {["lavender", "yellow", "green", "pink"].map((tone) => (
                <div className={`dash-stat ${tone}`} key={tone}>
                  <Placeholder /><Placeholder className="skeleton-value" /><Placeholder className="skeleton-short" />
                </div>
              ))}
            </div>
            <div className="dash-overview-grid">
              <div className="dash-panel skeleton-panel skeleton-stack">
                <Placeholder className="skeleton-title" />
                {profile && <Placeholder className="skeleton-avatar skeleton-identity" />}
                {Array.from({ length: 3 }, (_, index) => <Placeholder className="skeleton-row" key={index} />)}
              </div>
              <div className="dash-panel dash-note-panel skeleton-panel skeleton-stack">
                <Placeholder className="skeleton-short" /><Placeholder className="skeleton-avatar skeleton-identity" />
                <Placeholder className="skeleton-title" /><Placeholder /><Placeholder />
              </div>
            </div>
            {!profile && (
              <div className="dash-panel skeleton-panel skeleton-stack">
                <Placeholder className="skeleton-title" />
                {Array.from({ length: 4 }, (_, index) => <Placeholder className="skeleton-row" key={index} />)}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
