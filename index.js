const NUM_COLUMNS = 5;
const NUM_ROWS = 15;

// Data is of a list of tanks and their attributes from the strategy game, "WARNO"
const DATA = [
  ["M1 Abrams", "M1A1 Abrams", "M1A1 HA Abrams", "M11P Abrams", "M551 Sheridan", "M60A3", "Challenger Mk2", "Challenger Mk3", "Chieftain Mk10", "Chieftain Mk9", "Chieftain Mk11", "AMX-30B", "AMX-30B2", "T-62", "T-80B", "T-80BV", "T-64B", "T-80U", "T-80UD"],
  [17, 20, 17, 14, 16, 20, 20, 20, 20, 20, 15, 17, 19, 17, 19, 19, 17, 21, 21],
  [15, 17, 20, 17, 10, 20, 20, 15, 15, 15, 9, 9, 10, 14, 14, 17, 16, 19, 21],
  [2275, 2275, 2275, 2275, 1925, 2100, 2275, 2275, 2275, 2100, 2275, 2275, 2275, 2100, 2275, 2275, 2275, 2275, 2275],
  [185, 250, 320, 205, 60, 100, 270, 280, 170, 160, 170, 90, 135, 145, 115, 190, 250, 210, 320, 350]
];

// The Column Header Titles
const DATA_COLUMN_NAMES = ["Model", "Pen", "Front Armor", "Range", "Cost"];

const table = document.getElementById("regularTable");

// Data Listener to render data
function dataListener(x0, y0, x1, y1) {
  return {
    num_rows: DATA[0].length,
    num_columns: DATA.length,
    column_headers: DATA_COLUMN_NAMES.slice(x0, x1).map(x => [x]),
    data: DATA.slice(x0, x1).map(col => col.slice(y0, y1)),
  };
}

// Styling to include sorting arrows
function style_th(th) {
  const meta = table.getMeta(th);
  if(th.classList.contains("headerSortUp")) {
  }
  else {
    th.classList.toggle("headerSortDown", meta.x % 1 === 0);
  }
}

// Styling to nuke all arrows to point downward
function style2_th(th) {
  if (th.classList.contains("headerSortUp")) {
    th.classList.replace("headerSortUp", "headerSortDown");
  }
}

function styleListener() {
  for (const th of table.querySelectorAll("thead th")) {
    style_th(th);
  }
}

async function clickEventListener(event) {
  if (event.target.tagName === "TH") {
    // check if user clicked on a header that was already pointed up
    if(event.target.classList.contains("headerSortUp")) {
      // if this is the case, just replace header
      event.target.classList.replace("headerSortUp", "headerSortDown");
    }
    else {
      // nuke all arrows to point downward
      for (const th of table.querySelectorAll("thead th")) {
        style2_th(th);
      }
      // change the arrow of the header we clicked to point upwards
      event.target.classList.replace("headerSortDown", "headerSortUp");
    }
    await table.draw();
  }
}

export function init() {
  table.setDataListener(dataListener);
  table.addStyleListener(styleListener);
  table.addEventListener("click", clickEventListener);
  table.draw();
  console.log(table);
}
