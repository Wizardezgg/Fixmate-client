import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { auth, ensureAuthDbConnected } from "@/lib/auth";

const handler = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
  await ensureAuthDbConnected();
  return handler.GET(req);
}

export async function POST(req: NextRequest) {
  await ensureAuthDbConnected();
  return handler.POST(req);
}
