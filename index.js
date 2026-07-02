const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const RESERVATION_FILE = path.join(__dirname, "rezervace.json");
const MENU_FILE = path.join(__dirname, "menu.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// REZERVACE
app.get("/api/rezervace", (req, res) => {
  res.json(readJson(RESERVATION_FILE));
});

app.post("/api/rezervace", (req, res) => {
  const { jmeno, osoby, cas } = req.body;

  if (!jmeno || !osoby || !cas) {
    return res.json({ ok: false, message: "Vyplň všechna pole." });
  }

  const rezervace = readJson(RESERVATION_FILE);

  rezervace.push({
    id: Date.now(),
    jmeno,
    osoby,
    cas,
    status: "Čeká",
    vytvoreno: new Date().toLocaleString("cs-CZ")
  });

  writeJson(RESERVATION_FILE, rezervace);

  res.json({ ok: true });
});

app.delete("/api/rezervace/:id", (req, res) => {
  const rezervace = readJson(RESERVATION_FILE).filter(
    r => String(r.id) !== String(req.params.id)
  );

  writeJson(RESERVATION_FILE, rezervace);

  res.json({ ok: true });
});

// MENU
app.get("/api/menu", (req, res) => {
  res.json(readJson(MENU_FILE));
});

app.post("/api/menu", (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.json({ ok: false, message: "Vyplň název i cenu." });
  }

  const menu = readJson(MENU_FILE);

  menu.push({
    id: Date.now(),
    name,
    price
  });

  writeJson(MENU_FILE, menu);

  res.json({ ok: true });
});

app.delete("/api/menu/:id", (req, res) => {
  const menu = readJson(MENU_FILE).filter(
    item => String(item.id) !== String(req.params.id)
  );

  writeJson(MENU_FILE, menu);

  res.json({ ok: true });
});

module.exports = app;
