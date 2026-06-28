const { betterAuth } = require("better-auth");
const { MongoClient } = require("mongodb");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");

let authInstance;

function getAuth() {
  if (authInstance) return authInstance;

  const mongoClient = new MongoClient(process.env.MONGODB_URI);

  authInstance = betterAuth({
    database: mongodbAdapter(mongoClient.db("gamezone")),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: `http://localhost:${process.env.PORT || 5000}`,
    basePath: "/api/auth",
    trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
    emailAndPassword: {
      enabled: true,
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
    advanced: {
      crossSubDomainCookies: {
        enabled: false,
      },
    },
  });

  return authInstance;
}

module.exports = { getAuth };
