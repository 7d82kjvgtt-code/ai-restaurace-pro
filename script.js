const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const FILE = path.join(__dirname, "rezervace.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function loadReservations() {
  if (!fs.existsSync(FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveReservations(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.post("/api/rezervace", (req, res) => {
  const { jmeno, osoby, cas } = req.body;

  if (!jmeno || !osoby || !cas) {
    return res.json({ ok: false, message: "Vyplň všechna pole." });
  }

  const rezervace = loadReservations();

  rezervace.push({
    id: Date.now(),
    jmeno,
    osoby,
    cas,
    vytvoreno: new Date().toLocaleString("cs-CZ")
  });

  saveReservations(rezervace);

  res.json({ ok: true });
});

app.get("/api/rezervace", (req, res) => {
  res.json(loadReservations());
});

app.listen(PORT, () => {
  console.log(`Web běží na http://localhost:${PORT}`);
});