
function showSettings() {
  const cities = [
    { name: "Berlin", id: "11002" },
    { name: "München", id: "11009" },
    { name: "Frankfurt", id: "11010" },
    { name: "Hamburg", id: "11012" },
    { name: "Stuttgart", id: "11051" }
  ];

  const currentId = localStorage.getItem("cityId") || "11002";
  const cityName = cities.find(c => c.id === currentId)?.name || "Unbekannt";

  let html = `<div style="background:black;color:white;padding:20px;">
    <h2>Stadt wählen</h2>
    <select id="citySelect" style="font-size:16px;padding:4px;">`;

  cities.forEach(city => {
    const selected = city.id === currentId ? "selected" : "";
    html += `<option value="\${city.id}" \${selected}>\${city.name}</option>`;
  });

  html += `</select><br><br>
    <button onclick="applySettings()" style="font-size:16px;padding:6px;">Übernehmen</button>
    </div>`;

  const settingsWin = window.open("", "Einstellungen", "width=300,height=300");
  settingsWin.document.body.innerHTML = html;
}

function applySettings() {
  const id = document.getElementById("citySelect").value;
  localStorage.setItem("cityId", id);
  alert("Stadt gespeichert. Die Seite wird neu geladen.");
  location.reload();
}
