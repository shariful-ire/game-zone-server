import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

let authInstance;
let mongoClient;

export function getAuth() {
  if (authInstance) return authInstance;

  mongoClient = new MongoClient(process.env.MONGODB_URI);

  const trustedOrigins = [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean);

  authInstance = betterAuth({
    database: mongodbAdapter(mongoClient.db("gamezone")),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
    basePath: "/api/auth",
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    user: {
      additionalFields: {
        image: {
          type: "string",
          required: false,
        },
      },
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: false,
      },
    },
  });

  return authInstance;
}
