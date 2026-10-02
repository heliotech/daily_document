/**
 *       title: index.js
 *      author: khaz
 *        desc: JS engine for daily document web app.
 *  created on: Fri Oct  2 13:14:02 2026
 */

// import { dbglog } from '#lib/softdev/debug.js';
//
// document.addEventListener('DOMContentLoaded', () => {
//   console.log(` ━━━ index.js (Browser) ━━━\n`);
//   dbglog("DOM ready, script running.");
// });

const range = (start, end, step = 1) => {
  let output = [];

  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }

  for (let i = start; i < end; i += step) {
    output.push(i);
  }

  return output;
};

function getDayOfYear(date) {
    // calculating day nr

    const startOfYear = new Date(date.getFullYear(), 0, 1);  // year, 0 -> jan., the first
    const diffInMilliseconds = date - startOfYear;  // dnr as a difference
    // to number of days:
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

    return diffInDays;
}

const D2R = Math.PI/180;

function dec(dnr) {
    // solar declination
    return 23.45 * Math.sin((360.0 * (dnr + 284.0)/365.0)*D2R);
}

function et(dn) {
    return (9.85*Math.sin((4*Math.PI*(dn-80))/365.2422)
              - 7.65*Math.sin((2*Math.PI*(dn-3))/365.2422));
}

// Analemma proper:
const yearDays = range(1, 366 + 2);  // 366 + 2 makes analema closed
const decYear = yearDays.map(dec);
const etYear = yearDays.map(et);

const config = {
  responsive: true
};

const traceAn = {
  x: decYear,
  y: etYear,
  type: 'scatter',  // 'scatter' z mode: 'lines' tworzy wykres liniowy
  mode: 'lines',
  name: 'analemma',

  // Konfiguracja linii
  line: {
    color: '#ff5722', // Kolor linii (np. pomarańczowy HEX)
    width: 2          // Opcjonalnie: grubość linii w pikselach
  },

  // Konfiguracja punktów na linii
  marker: {
    color: '#1e88e5', // Kolor punktów
    size: 8           // Opcjonalnie: rozmiar punktów
  }
};

const layoutAn = {
  title: 'Analemma',
  showlegend: true,
  legend: {
    x: 1.01,           // Umieszczenie legendy tuż za wykresem
    y: 1
  },
  width: 800,
  height: 600,
  xaxis: { title: 'dec' },
  yaxis: { title: 'et(dec)' },
  paper_bgcolor: '#000000',
  plot_bgcolor: '#011601',

// // Wymuszenie pełnej ramki (osie ze wszystkich 4 stron)
//   xaxis: {
//     title: 'dec [deg]',
//     showline: true,
//     mirror: 'all',     // Dopisuje linię po przeciwnej (górnej) stronie
//     linecolor: '#000',
//     linewidth: 1
//   },
//   yaxis: {
//     title: 'et [min]',
//     showline: true,
//     mirror: 'all',     // Dopisuje linię po przeciwnej (prawej) stronie
//     linecolor: '#000',
//     linewidth: 1
//   },

  font: {
    color: '#ffffff',      // biały kolor dla wszystkich tekstów
    family: 'Arial, sans-serif', // opcjonalnie: zmiana czcionki
    size: 14               // opcjonalnie: zmiana rozmiaru
  },

  margin: {
    l: 70,  // Lewy (miejsce na etykiety osi Y)
    r: 60, // Prawy (miejsce na legendę i prawą ramkę)
    b: 80,  // Dolny (miejsce na etykiety osi X i dolną ramkę)
    t: 60   // Górny
  },
};

// plotly data:
var dataPlotly = [traceAn];

// Equinox points:
const equinoxes = [80, 266];
const decEquinoxes = equinoxes.map(dec);
const etEquinoxes = equinoxes.map(et);
// 2. Seria PUNKTOWA (zaznaczone, wybrane punkty)
// Odpowiednik z Pythona: ax.scatter(wybrane_x, wybrane_y)
const traceEquinoxes = {
  x: decEquinoxes, // Np. współrzędne dla przesilenia, równonocy, dziś
  y: etEquinoxes,
  type: 'scatter',
  mode: 'markers',         // <-- KLUCZ: Tylko punkty
  hovertext: ["aequinoctium vernum", "aequinoctium autumnale"],
  marker: {
    color: 'blue',          // Inny kolor dla wyróżnienia
    size: 10,              // Większy rozmiar punktu
    symbol: 'circle',     // Opcjonalnie: inny kształt
    line: {                // Opcjonalnie: obramowanie punktu
      color: 'yellow',
      width: 1
    }
  },
  name: 'aequinoctia'
};
dataPlotly.push(traceEquinoxes);

// Solstice points:
const solstices = [172, 355];
const decSolstices = solstices.map(dec);
const etSolstices = solstices.map(et);
// 2. Seria PUNKTOWA (zaznaczone, wybrane punkty)
// Odpowiednik z Pythona: ax.scatter(wybrane_x, wybrane_y)
const traceSolstices = {
  x: decSolstices, // Np. współrzędne dla przesilenia, równonocy, dziś
  y: etSolstices,
  type: 'scatter',
  mode: 'markers',         // <-- KLUCZ: Tylko punkty
  hovertext: ["solstitium aestivum", "solstitium hibernum"],
  marker: {
    color: 'yellow',          // Inny kolor dla wyróżnienia
    size: 8,              // Większy rozmiar punktu
    symbol: 'diamond',     // Opcjonalnie: inny kształt
    line: {                // Opcjonalnie: obramowanie punktu
      color: 'red',
      width: 1
    }
  },
  name: 'solstitia'
};
dataPlotly.push(traceSolstices);

// Today point:
const todayDate = new Date();
// console.log("todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay():",
//     todayDate.getFullYear(),  todayDate.getMonth() + 1, todayDate.getDate());
const todayNr = getDayOfYear(todayDate);
const decToday = dec(todayNr);
const etToday = et(todayNr);
// 2. Seria PUNKTOWA (zaznaczone, wybrane punkty)
// Odpowiednik z Pythona: ax.scatter(wybrane_x, wybrane_y)
const traceToday = {
  x: [decToday], // Np. współrzędne dla przesilenia, równonocy, dziś
  y: [etToday],
  type: 'scatter',
  mode: 'markers',         // <-- KLUCZ: Tylko punkty
  hovertext: `${todayDate.getFullYear()}-` +
    `${String(todayDate.getMonth() + 1).padStart(2, "0")}-` +
    `${String(todayDate.getDate()).padStart(2, "0")}`,  // zero-padding
  marker: {
    color: 'red',          // Inny kolor dla wyróżnienia
    size: 10,              // Większy rozmiar punktu
    symbol: 'diamond-dot',     // Opcjonalnie: inny kształt
    line: {                // Opcjonalnie: obramowanie punktu
      color: 'greenyellow',
      width: 1
    }
  },
  name: 'dies hodiernus'
};
dataPlotly.push(traceToday);

// Plotting proper:
Plotly.newPlot('analema', dataPlotly, layoutAn, config);

// Getting current date, its components
// to compute dnr, week day name and fill the 'placeholders':
const today_ = new Date();
const year = today_.getFullYear();
const month = today_.getMonth() + 1;
const month_txt = month.toString().padStart(2, '0');
const weekday = today_.getDay();
const fmt = new Intl.DateTimeFormat("en-GB", {month: "long", weekday: "long"});
const names = fmt.format(today_).split(" ");
const monthName = names[0];
// const weekdayName = dayNames[weekday];
const weekdayName = names[1];
const day = today_.getDate();
const day_txt = day.toString().padStart(2, '0');
const ymd_str = `${year}-${month_txt}-${day_txt}`;  // yyyy-mm-dd

const topElement = document.getElementById("top");
topElement.innerHTML = ymd_str;
const weekdayElement = document.getElementById("weekday");
weekdayElement.innerHTML = weekdayName;
const dmnrElement = document.getElementById("dmnr");
dmnrElement.innerHTML = day;
const mnameElement = document.getElementById("mname");
mnameElement.innerHTML = monthName;
const yearElement = document.getElementById("year");
yearElement.innerHTML = year;
// Nr of the day in the year:
const dayOfYear = getDayOfYear(today_);
const dnrElement = document.getElementById("dnr");
dnrElement.innerHTML = dayOfYear;

// calculating nr of days in the year:
const lastDate = new Date(year, 11, 31);
const nrOfDays = getDayOfYear(lastDate);
const daysyearElement = document.getElementById("daysyear");
daysyearElement.innerHTML = nrOfDays;
const partOfYearElement = document.getElementById("partOfYear");
partOfYearElement.innerHTML = `${(dayOfYear/nrOfDays*100).toFixed(1)}%`;

// dec:
const decElement = document.getElementById("DEC");
DEC = dec(dayOfYear);
const dDEC = ((DEC)/23.45)*100;
const DEC_next = dec(dayOfYear + 1);
const trend = (DEC > DEC_next) ? "decreasing" : "increasing";
decElement.innerHTML = DEC.toFixed(3) + "&deg; " + " (" + trend + `, ${DEC.toFixed(3)}/23.45&middot;100% = ` + dDEC.toFixed(1) + "%)";
const DEC_rel = DEC/23.45*100;
decElement.title = DEC_rel.toFixed(1) + "%";
decElement.data_tooltip = `${DEC_rel.toFixed(1)}%`;

// setting contents of div#memorylane
const memorylaneElement = document.getElementById("memorylanediv");

async function renderMemoryLane() {
  try {
    const response = await fetch('assets/memory.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const memorylane = await response.json();

    let contents = "<p>Commit to memory:</p>";
    for (const key in memorylane) {
      contents += `<p class="mitem tooltip" data-tooltip="${memorylane[key]['def']}">${memorylane[key]['item']}</p>\n`;
    }

    memorylaneElement.innerHTML = contents;
    // console.log("Script ended (0)");

  } catch (error) {
    console.error("Error while loading data:", error);
  }
}

// Uruchomienie funkcji
renderMemoryLane();

// console.log("Script ended (1)");
