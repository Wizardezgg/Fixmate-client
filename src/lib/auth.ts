import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fixmate";
const dbName = process.env.MONGODB_DB_NAME || "fixmate";

declare global {
  var _betterAuthMongoClient: MongoClient | undefined;
}

function getSyncDb(): Db {
  if (!global._betterAuthMongoClient) {
    global._betterAuthMongoClient = new MongoClient(uri);
  }
  return global._betterAuthMongoClient.db(dbName);
}

const trustedOrigins = Array.from(
  new Set(
    [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
    ]
      .filter((origin): origin is string => Boolean(origin && origin.trim()))
      .map((origin) => origin.trim().replace(/\/+$/, ""))
  )
);

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export const auth = betterAuth({
  database: mongodbAdapter(getSyncDb()),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  ...(googleEnabled
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        },
      }
    : {}),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      area: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Enforce role allowlist: never allow public sign-up as admin
          const requestedRole = (user as { role?: string }).role;
          const safeRole =
            requestedRole === "technician" ? "technician" : "customer";
          return {
            data: {
              ...user,
              role: safeRole,
            },
          };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
