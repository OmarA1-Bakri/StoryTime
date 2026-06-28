const tiers = [
  { name: "Free Beta", storage: "Small", credits: "Limited weekly", export: "In-app replay" },
  { name: "Family", storage: "Medium", credits: "Moderate", export: "MP4 download" },
  { name: "Vault", storage: "Large", credits: "Higher", export: "Archive tools" }
];

export default function PricingPage() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1>StoryTime pricing</h1>
      <p>StoryTime is currently being prepared for a private beta.</p>
      <ul>
        {tiers.map((tier) => (
          <li key={tier.name}>
            <strong>{tier.name}</strong>: {tier.storage} storage, {tier.credits} credits, {tier.export}.
          </li>
        ))}
      </ul>
    </main>
  );
}
