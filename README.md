# Regular-Table Sorting Arrows
## Written By Timothy Chon
## Regular-Table provided by https://github.com/finos/regular-table#column-and-row-headers

### How it works
HTML:
```HTML
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1,
				 maximum-scale=1, minimum-scale=1, user-scalable=no">
    </head>
    <body>

        <regular-table id="regularTable"></regular-table>
        
        <script src="/node_modules/regular-table/dist/esm/regular-table.js"></script>
        <link rel="stylesheet" href="/node_modules/regular-table/dist/css/material.css" />

        <link rel="stylesheet" href="stylesheet.css">
        <script type="module" src="index.js"></script>
        <script type="module">
            import {init} from "./index.js";
            window.addEventListener("load", () => init());
        </script>
    </body>
</html>

```


1. Pass a dataset to regular-table's dataListener function. For demonstration purposes, I gathered data on tanks and their attributes from the strategy game, WARNO.
```Javascript
 // Data Listener to render data
function dataListener(x0, y0, x1, y1) {
 	return {
	  num_rows: DATA[0].length,
	  num_columns: DATA.length,
 	  column_headers: DATA_COLUMN_NAMES.slice(x0, x1).map(x => [x]),
		data: DATA.slice(x0, x1).map(col => col.slice(y0, y1)),
 	 };
	}
``` 
2. We need the CSS to be virtual-data-model-aware as the table must re-render each time we click on the table headers and change the sorting arrow's direction. As such, we will use regular-table's styleListener functionality.
```Javascript
function styleListener() {
	for (const th of table.querySelectorAll("thead th")) {
		style_th(th);
	}
}

function style_th(th) {
 	const meta = table.getMeta(th);
 	if(th.classList.contains("headerSortUp")) {
 	}
 	else {
	  th.classList.toggle("headerSortDown", meta.x % 1 === 0);
 	}
}
```
NOTE: regular-table styling appears to be defined by toggling the class of a particular element in a table. As such, we will toggle the 'th' (table header) class to switch between a headerSortDown state and a headerSortUp state. For now, the initial render will render all arrows as pointing downwards. However, we must be mindful that any action that 'changes' the table will cause it to rerender with the styleListener so we must make sure that any arrows that were pointed upwards does not rerender as pointed downwards.

3. Define the CSS of the unique table header classes
```CSS
.headerSortDown:after,
.headerSortUp:after{
    content: ' ';
    position: relative;
    left: 10px;
    border: 7px solid transparent;
}
.headerSortDown:after{
    top: 10px;
    border-top-color: silver;
}
.headerSortUp:after{
    bottom: 15px;
    border-bottom-color: silver;
}
.headerSortDown,
.headerSortUp{
    padding-left: 20px;
}
```
NOTE: This code snippet was copied from https://stackoverflow.com/questions/17639562/add-sorting-arrows-to-th-like-table-sorter

4. Create an eventlistener that will toggle the sorting arrow direction on click. Again, use class-based toggling so that it works well with the regular-table class. We'll also need to redraw the table after changing the class.
```Javascript
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

// Styling to nuke all arrows to point downward
function style2_th(th) {
  if (th.classList.contains("headerSortUp")) {
    th.classList.replace("headerSortUp", "headerSortDown");
  }
}
```

5. Initialize and draw the table
```Javascript
export function init() {
  table.setDataListener(dataListener);
  table.addStyleListener(styleListener);
  table.addEventListener("click", clickEventListener);
  table.draw();
  console.log(table);
}
```