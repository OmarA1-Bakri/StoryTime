import { summarizeReadiness } from "@storytime/config";

export async function GET() {
  const readiness = summarizeReadiness(process.env);
  return Response.json(
    { ok: readiness.ready, ...readiness },
    { status: readiness.ready ? 200 : 503 },
  );
}
