import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getDB } from "../db.js";

const router = express.Router();

// ✅ Admin Email Check Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.email !== "admin@example.com") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// GET /api/admin/users
router.get("/users", authenticateUser, requireAdmin, async (req, res) => {
  const db = getDB();
  const [users] = await db.query("SELECT email, first_name, last_name FROM users");
  res.json({ users });
});

// GET /api/admin/quotes
router.get("/quotes", authenticateUser, requireAdmin, async (req, res) => {
  const db = getDB();
  const [quotes] = await db.query(`
    SELECT q.*, u.email FROM quotes q
    JOIN users u ON q.user_id = u.id
    ORDER BY q.created_at DESC
  `);
  res.json({ quotes });
});

export default router;
