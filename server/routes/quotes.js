import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getDB } from "../db.js";

const router = express.Router();

// POST /api/quotes - create a quote
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { event_type, event_date, location, attendees } = req.body;

    if (!event_type || !event_date || !location || !attendees) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const quoteAmount = (Math.random() * (1000 - 100) + 100).toFixed(2);

    const db = getDB();
    const [userRows] = await db.query(
      "SELECT id FROM users WHERE firebase_uid = ?",
      [req.user.firebase_uid]
    );

    const user_id = userRows[0].id;

    await db.query(
      `INSERT INTO events (user_id, event_type, event_date, location, attendees, quote_amount)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, event_type, event_date, location, attendees, quoteAmount]
    );

    res.status(201).json({
      message: "Quote created",
      quote_amount: parseFloat(quoteAmount),
      currency: "USD",
    });
  } catch (err) {
    console.error("Quote error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/quotes - get user's past quotes
router.get("/", authenticateUser, async (req, res) => {
  try {
    const db = getDB();
    const [userRows] = await db.query(
      "SELECT id FROM users WHERE firebase_uid = ?",
      [req.user.firebase_uid]
    );
    const user_id = userRows[0].id;

    const [quotes] = await db.query(
      "SELECT * FROM events WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    res.json({ quotes });
  } catch (err) {
    console.error("Fetch quotes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
