export default function RecordPreviewPage({ params }: { params: { sessionId: string } }) {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1>Composition preview</h1>
      <p>Session: {params.sessionId}</p>
      <p>This route is dev-only. Production replay uses raw tracks plus the composition ledger.</p>
    </main>
  );
}
