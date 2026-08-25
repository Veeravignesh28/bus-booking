
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

function readDb() {
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
}

export default function handler(req, res) {

  // ── GET: return buses filtered by from / to / date ──
  if (req.method === "GET") {
    const { from, to, date } = req.query;

    const db = readDb();

    // If no filters supplied, return all buses
    if (!from && !to && !date) {
      return res.status(200).json(db.buses);
    }

    const filtered = db.buses.filter((b) => {
      return (
        (!from || b.from.toLowerCase() === from.toLowerCase()) &&
        (!to   || b.to.toLowerCase()   === to.toLowerCase())   &&
        (!date || b.date               === date)
      );
    });

    return res.status(200).json(filtered);
  }

  return res.status(405).json({ error: "Method not allowed" });
}