import admin from "../firebase.js";
import { getDB } from "../db.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const idToken = authHeader.split(" ")[1];

  if (!idToken || idToken.length < 100) {
    return res.status(401).json({ message: "Invalid Firebase token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebase_uid = decodedToken.uid;
    const email = decodedToken.email;

    const db = getDB();

    // Try to fetch existing user
    let [rows] = await db.query(
      "SELECT * FROM users WHERE firebase_uid = ?",
      [firebase_uid]
    );

    let user = rows[0];

    // If user doesn't exist, insert it with blank name fields
    if (!user) {
      await db.query(
        "INSERT INTO users (firebase_uid, email, first_name, last_name) VALUES (?, ?, '', '')",
        [firebase_uid, email]
      );

      // Refetch the newly inserted user
      const [newRows] = await db.query(
        "SELECT * FROM users WHERE firebase_uid = ?",
        [firebase_uid]
      );
      user = newRows[0];
    }

    // Attach full user row to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
