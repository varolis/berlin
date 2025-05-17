const prayerLabels = ["İmsak", "Sabah", "Öğle", "İkindi", "Akşam", "Yatsı"];
const prayerKeys = ["Imsak", "Gunes", "Ogle", "Ikindi", "Aksam", "Yatsi"];
let prayerTimes = [];

function getDateStr() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

async function fetchPrayerTimes() {
  const cityId = localStorage.getItem("cityId") || "11002";
  prayerTimes = [];

  const today = new Date();
  const todayStr = today.toLocaleDateString("tr-TR");
  const cached = localStorage.getItem("ezanData_" + cityId);
  const lastFetchStr = localStorage.getItem("ezanLastFetch_" + cityId);
  const now = new Date();

  let needsDownload = false;

  if (cached) {
    try {
      const cachedObj = JSON.parse(cached);
      const lastFetch = lastFetchStr ? new Date(lastFetchStr) : new Date(0);
      const daysSinceLastFetch = Math.floor((now - lastFetch) / (1000 * 60 * 60 * 24));
      const todayEntry = cachedObj.data.find(d => d.MiladiTarihKisa === todayStr);

      if (!todayEntry) {
        console.log("Heutiges Datum nicht im Cache – lade neue Daten.");
        needsDownload = true;
      } else if (daysSinceLastFetch >= 21) {
        const randomDelay = Math.floor(Math.random() * 12 * 60 * 60 * 1000);
        console.log(`Letzter Download vor ${daysSinceLastFetch} Tagen – neuer Versuch in ${Math.floor(randomDelay / 60000)} Minuten.`);
        setTimeout(() => {
          console.log("Führe geplanten Datendownload durch...");
          fetchAndStorePrayerTimes(todayStr, cityId);
        }, randomDelay);
        processPrayerTimes(cachedObj.data, todayStr);
        return;
      } else {
        console.log("Verwende gespeicherte Gebetszeiten aus dem Cache.");
        return processPrayerTimes(cachedObj.data, todayStr);
      }
    } catch (e) {
      console.warn("Cache konnte nicht gelesen werden, lade neu.");
      needsDownload = true;
    }
  } else {
    needsDownload = true;
  }

  if (needsDownload) {
    await fetchAndStorePrayerTimes(todayStr, cityId);
  }
}

async function fetchAndStorePrayerTimes(todayStr, cityId) {
  try {
    const url = `https://ezanvakti.emushaf.net/vakitler/${cityId}`;
    const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url));
    const raw = await res.json();
    const data = JSON.parse(raw.contents);

    localStorage.setItem("ezanData_" + cityId, JSON.stringify({
      date: todayStr,
      data: data
    }));
    localStorage.setItem("ezanLastFetch_" + cityId, new Date().toISOString());

    processPrayerTimes(data, todayStr);
  } catch (e) {
    alert("Fehler beim Laden der Gebetszeiten: " + e.message);
  }
}

function processPrayerTimes(data, dateStr) {
  const entry = data.find(d => d.MiladiTarihKisa === dateStr);
  if (!entry) return alert("Keine Daten für heute gefunden.");

  const container = document.getElementById("prayerTimes");
  container.innerHTML = "";

  const today = new Date();

  prayerLabels.forEach((label, i) => {
    const timeStr = entry[prayerKeys[i]];
    const [hh, mm] = timeStr.split(":").map(Number);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm, 0, 0);
    prayerTimes.push({ label, time: t, str: timeStr });

    const div = document.createElement("div");
    div.className = "prayer";
    div.innerHTML = `<strong>${label}</strong><br>${timeStr}`;
    container.appendChild(div);
  });
}
