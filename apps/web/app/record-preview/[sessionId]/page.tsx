export default async function RecordPreviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1>Composition preview</h1>
      <p>Session: {sessionId}</p>
      <p>This route is dev-only. Production replay uses raw tracks plus the composition ledger.</p>
    </main>
  );
}
