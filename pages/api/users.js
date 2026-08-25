// pages/api/users.js
// GET  /api/users      → returns all users (for login)
// POST /api/users      → registers a new user
// PUT  /api/users?id=  → updates an existing user

import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

function readDb() {
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
}

export default function handler(req, res) {

  // ── GET: return all users ──
  if (req.method === "GET") {
    const db = readDb();
    return res.status(200).json(db.users);
  }

  // ── POST: register a new user ──
  if (req.method === "POST") {
    const { name, age, email, contact, password } = req.body;

    const db = readDb();

    const existing = db.users.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      age,
      email,
      contact,
      password,
    };

    db.users.push(newUser);

    try {
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    } catch (err) {
      console.warn("Could not write to db.json:", err.message);
    }

    return res.status(201).json(newUser);
  }

  // ── PUT: update an existing user ──
  if (req.method === "PUT") {
    const { id } = req.query;
    const { name, age, contact, password } = req.body;

    try {
      const db = readDb();
      const idx = db.users.findIndex((u) => u.id === id);
      if (idx === -1) return res.status(404).json({ error: "User not found." });

      db.users[idx] = { ...db.users[idx], name, age, contact, password };
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

      return res.status(200).json(db.users[idx]);
    } catch (err) {
      return res.status(500).json({ error: "Failed to update profile." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}