import "../shell.css";

export default function PreferencesPage() {
  return <main className="appShell"><section className="appHero"><p className="eyebrow">Preferences</p><h1>Family controls</h1><p>Review account limits, library size, and beta configuration.</p></section><section className="appCards"><article className="appCard"><strong>Library size</strong><span>320 MB used of 1 GB</span></article><article className="appCard"><strong>Credits</strong><span>3 adventures remaining</span></article><article className="appCard"><strong>Mode</strong><span>Local demo mode enabled</span></article></section></main>;
}
