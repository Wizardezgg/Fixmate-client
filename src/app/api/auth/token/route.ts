import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "JWT_SECRET is not configured" },
        { status: 500 }
      );
    }

    const user = session.user as {
      id: string;
      email: string;
      name: string;
      role?: string;
    };

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "customer",
      },
      secret,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to issue token" },
      { status: 500 }
    );
  }
}
