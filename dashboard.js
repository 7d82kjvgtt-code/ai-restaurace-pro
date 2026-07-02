let reservations = [];
let foods = [];

async function loadReservations() {
  const res = await fetch("/api/rezervace");
  reservations = await res.json();

  document.getElementById("totalCount").innerText = reservations.length;
  document.getElementById("todayCount").innerText = reservations.length;

  renderReservations(reservations);
}

function renderReservations(data) {
  const table = document.getElementById("reservationTable");

  if (!data.length) {
    table.innerHTML = `<tr><td colspan="5">Žádné rezervace.</td></tr>`;
    return;
  }

  table.innerHTML = data.map(r => `
    <tr>
      <td>${r.jmeno}</td>
      <td>${r.osoby}</td>
      <td>${r.cas}</td>
      <td>${r.vytvoreno || "-"}</td>
      <td>
        <button class="deleteBtn" onclick="deleteReservation(${r.id})">🗑️</button>
      </td>
    </tr>
  `).join("");
}

async function deleteReservation(id) {
  if (!confirm("Opravdu smazat rezervaci?")) return;

  await fetch("/api/rezervace/" + id, {
    method: "DELETE"
  });

  loadReservations();
}

async function loadFoods() {
  const res = await fetch("/api/menu");
  foods = await res.json();
  renderFoods();
}

async function addFood() {
  const name = document.getElementById("foodName").value.trim();
  const price = document.getElementById("foodPrice").value.trim();

  if (!name || !price) {
    alert("Vyplň název i cenu.");
    return;
  }

  await fetch("/api/menu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price })
  });

  document.getElementById("foodName").value = "";
  document.getElementById("foodPrice").value = "";

  loadFoods();
}

function renderFoods() {
  const list = document.getElementById("foodList");

  if (!foods.length) {
    list.innerHTML = "<p>Žádná jídla.</p>";
    return;
  }

  list.innerHTML = foods.map(food => `
    <div class="foodItem">
      <div>
        <b>🍕 ${food.name}</b>
        <div class="foodPrice">${food.price} Kč</div>
      </div>

      <button class="deleteBtn" onclick="deleteFood(${food.id})">🗑️</button>
    </div>
  `).join("");
}

async function deleteFood(id) {
  if (!confirm("Opravdu smazat jídlo?")) return;

  await fetch("/api/menu/" + id, {
    method: "DELETE"
  });

  loadFoods();
}

document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = reservations.filter(r =>
    r.jmeno.toLowerCase().includes(value)
  );

  renderReservations(filtered);
});

loadReservations();
loadFoods();