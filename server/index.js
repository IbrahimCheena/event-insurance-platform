import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, getDB } from "./db.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import quoteRoutes from "./routes/quotes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Root ping
app.get("/", (req, res) => {
  res.send("Event Insurance API is running");
});

// ✅ Auth routes
app.get("/api/me", authenticateUser, async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query(
      "SELECT email, first_name, last_name, firebase_uid FROM users WHERE firebase_uid = ?",
      [req.user.firebase_uid]
    );

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("GET /api/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/me", authenticateUser, async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    const db = getDB();
    await db.query(
      "UPDATE users SET first_name = ?, last_name = ? WHERE firebase_uid = ?",
      [first_name, last_name, req.user.firebase_uid]
    );
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("PUT /api/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Quotes
app.use("/api/quotes", quoteRoutes);

//
// 🔐 Admin Middleware
//
const requireAdmin = (req, res, next) => {
  if (req.user?.email !== "admin@example.com") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

//
// 🔐 Admin Routes
//

// GET all users
app.get("/api/admin/users", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const [users] = await db.query("SELECT id, first_name, last_name, email FROM users");
    res.json({ users });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user
app.delete("/api/admin/users/:id", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all quotes (events)
app.get("/api/admin/quotes", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const [quotes] = await db.query(`
      SELECT e.id, e.event_type, e.event_date, e.location, e.attendees, e.quote_amount, e.created_at, u.email
      FROM events e
      JOIN users u ON e.user_id = u.id
      ORDER BY e.created_at DESC
    `);
    res.json({ quotes });
  } catch (err) {
    console.error("GET /api/admin/quotes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE quote
app.delete("/api/admin/quotes/:id", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    await db.query("DELETE FROM events WHERE id = ?", [req.params.id]);
    res.json({ message: "Quote deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/quotes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET stats
app.get("/api/admin/stats", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    const [[{ total_users }]] = await db.query("SELECT COUNT(*) AS total_users FROM users");
    const [[{ total_quotes }]] = await db.query("SELECT COUNT(*) AS total_quotes FROM events");
    const [[{ total_revenue }]] = await db.query("SELECT SUM(quote_amount) AS total_revenue FROM events");

    res.json({
      total_users,
      total_quotes,
      total_revenue: parseFloat(total_revenue || 0).toFixed(2),
    });
  } catch (err) {
    console.error("GET /api/admin/stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//
// 🗂️ Event Types Manager
//

// GET event types
app.get("/api/event-types", async (req, res) => {
  try {
    const db = getDB();
    const [types] = await db.query("SELECT * FROM event_types");
    res.json({ event_types: types });
  } catch (err) {
    console.error("GET /api/event-types error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new event type
app.post("/api/event-types", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const db = getDB();
    await db.query("INSERT INTO event_types (name) VALUES (?)", [name]);
    res.status(201).json({ message: "Event type added" });
  } catch (err) {
    console.error("POST /api/event-types error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE event type
app.delete("/api/event-types/:id", authenticateUser, requireAdmin, async (req, res) => {
  try {
    const db = getDB();
    await db.query("DELETE FROM event_types WHERE id = ?", [req.params.id]);
    res.json({ message: "Event type deleted" });
  } catch (err) {
    console.error("DELETE /api/event-types error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
