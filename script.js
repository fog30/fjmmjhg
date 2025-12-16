// 🎁 FULL NAMES
const names = [
  "James","Margaret","Muriel","Fergal",
  "Jess","Hilda","Giles","Shannon","Anna",
  "Treza","Alister","Contrad"
];

// 👨‍👩‍👧 GROUPS
const groups = {
  g1: ["James","Margaret","Muriel","Fergal"],
  g2: ["Jess","Hilda","Giles","Shannon","Anna"],
  g3: ["Treza","Alister","Contrad"]
};

// 🎡 CANVAS SETUP
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;
let angle = 0;

drawWheel();

function drawWheel() {
  const slice = (2 * Math.PI) / names.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  names.forEach((name, i) => {
    ctx.beginPath();
    ctx.fillStyle = i % 2 ? "#c1121f" : "#2d6a4f";
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, slice * i, slice * (i + 1));
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(slice * i + slice / 2);
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.fillText(name, radius / 2.3, 5);
    ctx.restore();
  });
}

// 🔑 MAP 3 LETTERS → FULL NAME
function getFullName(short) {
  return names.find(n => n.toLowerCase().startsWith(short));
}

// 🎁 SPIN FUNCTION
function spin() {
  const short = localStorage.getItem("playerShort");
  const player = getFullName(short);

  if (!player) {
    alert("Invalid name");
    return;
  }

  let played = JSON.parse(localStorage.getItem("playedNames")) || [];
  let assigned = JSON.parse(localStorage.getItem("assignedNames")) || [];
  let pairs = JSON.parse(localStorage.getItem("secretSantaPairs")) || {};

  if (played.includes(player)) {
    document.getElementById("spinBtn").style.display = "none";
    document.getElementById("result").innerText =
      "❌ You already played";
    return;
  }

  // 🚫 BLOCKED
  let blocked = new Set([player, ...assigned]);

  for (let g in groups) {
    if (groups[g].includes(player)) {
      groups[g].forEach(n => blocked.add(n));
    }
  }

  let choices = names.filter(n => !blocked.has(n));

  let finalName = choices[Math.floor(Math.random() * choices.length)];

  let spins = 18;
  let interval = setInterval(() => {
    angle += 0.35;
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle);
    ctx.translate(-radius, -radius);
    drawWheel();
    ctx.restore();
    spins--;
    if (spins <= 0) clearInterval(interval);
  }, 80);

  setTimeout(() => {
    document.getElementById("result").innerText =
      "🎄 You got: " + finalName;

    played.push(player);
    assigned.push(finalName);
    pairs[player] = finalName;

    localStorage.setItem("playedNames", JSON.stringify(played));
    localStorage.setItem("assignedNames", JSON.stringify(assigned));
    localStorage.setItem("secretSantaPairs", JSON.stringify(pairs));

    document.getElementById("spinBtn").style.display = "none";
  }, 2300);
}
