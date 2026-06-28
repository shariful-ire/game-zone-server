const { getAuth } = require("../lib/auth");
const { fromNodeHeaders, toNodeHandler } = require("better-auth/node");

async function requireAuth(req, res, next) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized — please log in" });
    }

    req.user = session.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

module.exports = { requireAuth };
