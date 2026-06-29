import { NextResponse } from "next/server";

const items = [
  "consent",
  "call",
  "recording",
  "recovery",
  "ledger",
  "fallbacks",
  "controls",
  "costs"
];

export async function GET() {
  return NextResponse.json({ ok: true, items: items.map((name) => ({ name, status: "ready" })) });
}
