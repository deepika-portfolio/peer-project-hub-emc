const admin = require("../config/firebaseAdmin");

/**
 * Verifies the Firebase ID token sent in the Authorization header
 * (format: "Bearer <idToken>") and attaches the decoded user to req.user.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "No auth token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Optional auth: attaches req.user if a valid token is present,
 * but does not block the request if it's missing/invalid.
 * Useful for routes like GET /projects that are public but
 * behave slightly differently for logged-in users.
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) return next();

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name || decoded.email };
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
};

module.exports = { verifyToken, optionalAuth };
