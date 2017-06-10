# gridstrap.js 

[![Build Status](https://travis-ci.org/rosspi/gridstrap.js.svg?branch=master)](https://travis-ci.org/rosspi/gridstrap.js) 
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![NPM version](https://img.shields.io/npm/v/jquery.gridstrap.svg)](https://www.npmjs.com/package/jquery.gridstrap) 
![donate](https://img.shields.io/badge/donate%20bitcoin-1Q32bCvaoNPS4GUNxeBbPzkniMguKFVEtf-green.svg)
 
gridstrap.js is a jQuery plugin designed to take [Bootstrap's CSS grid system](https://getbootstrap.com/css/#grid) and turn it into a managed draggable and resizeable grid while truely maintaining its responsive behaviour. It will also work with any kind of CSS-driven layout.
I made this plugin to fill a gap that existed for easily creating Bootstrap-based drag 'n' drop grid responsive interfaces. 
Both gridster.js and gridstack.js inspired this jQuery plugin, however both have their own grid systems that don't play nicely with Bootstrap out of the box.

## Demo 
[https://rosspi.github.io/gridstrap.js/](https://rosspi.github.io/gridstrap.js/)

 

## Usage

* In the browser:
	1. Include jQuery:

		```html
		<script src="//code.jquery.com/jquery-3.2.1.js"></script>
		```

	2. Include plugin's code:

		```html	
		<link rel="stylesheet" href="dist/jquery.gridstrap.min.css"> 
		<script src="dist/jquery.gridstrap.min.js"></script>
		```

	3. Have some appropriate Html grid:
		```html
		<div id="grid" class="row">
			<div class="col-xs-4 col-sm-2 col-md-1"></div>
			<div class="col-xs-4 col-sm-2 col-md-1"></div>
			...
		</div>
		``` 

	3. Call the plugin:

		```javascript
		$(function(){
			$('#grid').gridstrap({
				/* default options */
			});
		});
		```
* NPM:

	**Download from NPM to have version details affixed to distributables. Using semantic-release means this info won't be in the distributables on GitHub.**

	[![NPM version](https://img.shields.io/npm/v/jquery.gridstrap.svg)](https://www.npmjs.com/package/jquery.gridstrap)
	
	```bash
	$ npm install jquery.gridstrap
	``` 


## API

### Options

```javascript
$.Gridstrap.defaultOptions = {
	gridCellSelector: '>*', // jQuery selector for grid's cells relative to parent element.
	hiddenCellClass: 'gridstrap-cell-hidden', // class applied to 'hidden' cells.
	visibleCellClass: 'gridstrap-cell-visible', // class applied to 'visible' cells.
	nonContiguousPlaceholderCellClass: 'gridstack-noncontiguous',  // class applied to non-contiguous placeholder cells.
	dragCellClass: 'gridstrap-cell-drag', // class applied to dragging cell.
	resizeCellClass: 'gridstrap-cell-resize', // class applied to resizing cell.
	mouseMoveSelector: 'body', // jQuery selector to bind mousemouse and mouseup events.
	visibleCellContainerParentSelector: null, // jQuery selector to append 'visible' cell container to. Null will use the element the plugin is initialised on.
	visibleCellContainerClass: 'gridstrap-container', // class applied to the cell container element.
	getHtmlOfSourceCell: function ($cell) { // function to return the html of a 'source' cell.
		return $cell[0].outerHTML;
	}, 	
	dragCellHandleSelector: '*', // jQuery selector relative to and including cell for drag handling.
	draggable: true, // toggle mouse dragging.
	rearrangeOnDrag: true, // toggle the triggering of rearranging cells before mouseup.
	resizeHandleSelector: null, // jQuery selector relative to cell for resize handling. Null disables.
	resizeOnDrag: true, // toggle mouse resizing.	
	swapMode: false, // toggle swap or insert mode when rearranging cells.
	nonContiguousCellHtml: null, // html to use for non-contiguous placeholder cells.
	autoPadNonContiguousCells: true, // toggle adding non-contiguous cells automatically on drag or as otherwise needed.
	updateCoordinatesOnWindowResize: true, // enable window resize event handler.
	debug: false, // toggle console output.
	dragMouseoverThrottle: 150, // throttle cell mouseover events for rearranging.
	windowResizeDebounce: 50,  // debounce redraw on window resize.
	mousemoveDebounce: 0 // debounce mousemove for dragging cells.
};
```

### Plugin's methods


#### [.attachCell](src/methods.js) 

Attach an existing html element to the grid. Will create a hidden cell and convert existing source cell to a visible cell.

**Params**

* `element` **{jQuery/String/Element}**: Existing html element to attach to grid. Element must be within the grid's element itself.
* `index` **{Number}**: Index within the existing ordered visible cell to attach the cell.

**Returns**

A jQuery object of the attached visible cell.

#### [.detachCell](src/methods.js) 

Detach an existing cell from the grid. Will delete hidden cell and convert visible cell to its original state.

**Params**

* `element` **{jQuery/String/Element}**: Existing cell element to detach from grid.

**Returns**

A jQuery object of the detached source cell.

#### [.$getCellContainer](src/methods.js) 

Get the div that contains the visible cells. It exists within the gridstrap element by default.

**Params**

None.

**Returns**

jQuery object of all visible cell container.

#### [.$getCellFromCoordinates](src/methods.js) 

Get the visible cell at certain coordinates.

**Params**

* `clientX` **{Number}**: Coordinate used in a `document.elementFromPoint(clientX, clientY);` call.
* `clientY` **{Number}**: Coordinate used in a `document.elementFromPoint(clientX, clientY);` call.

**Returns**

jQuery object of a visible cell.



#### [.getCellIndexFromCoordinates](src/methods.js) 

Get the index/order position of the visible cell at certain coordinates.

**Params**

* `clientX` **{Number}**: Coordinate used in a `document.elementFromPoint(clientX, clientY);` call.
* `clientY` **{Number}**: Coordinate used in a `document.elementFromPoint(clientX, clientY);` call.

**Returns**

0-based index or -1 if cannot find.

#### [.getCellIndexOfElement](src/methods.js) 

Get the index/order position of the visible cell.

**Params**

* `element` **{jQuery/String/Element}**: Visible cell element to retrieve index of.

**Returns**

0-based index or -1 if cannot find.

#### [.$getCells](src/methods.js) 

Get the visible cells in their current order.

**Params**

None.

**Returns**

jQuery object of all ordered visible cells.

#### [.$getCellOfElement](src/methods.js) 

Get jQuery object selection of the .closest() visible cell from the element.

**Params**

* `element` **{jQuery/String/Element}**: Html element. 

**Returns**

A jQuery object selection of the closest visible cell from the element.

#### [.$getHiddenCells](src/methods.js) 

Get the hidden cells in their current order.

**Params**

None.

**Returns**

jQuery object of all ordered hidden cells.

#### [.insertCell](src/methods.js) 

Create a new cell from a html string and attach to grid. Converts a html string to a hidden and visible cell.

**Params**

* `cellHtml` **{String}**: Html to create a new cell. 
* `index` **{Number}**: Index within the existing ordered visible cell to insert the html.

**Returns**

A jQuery object of the new created visible cell.


#### [.modifyCell](src/methods.js) 

Modify an existing visible and/or hidden cell. Provides an easy way to modify an existing cell without breaking gridstrap's management of them.

**Params**

* `cellIndex` **{Number}**: Index of visible to modify.
* `callback` **{Function}**: Provide a function with two function parameters for getting the visible and then hidden cell. E.g. `function ($getVisibleCell, $getHiddenCell) { var $hiddenCell = $getHiddenCell();  }`. A call to the first function to retrieve the visible cell will later cause its html to be copied into the hidden cell. Modify the visible cell if the goal is to modify the appearance of the cell. Modify the hidden cell if the goal is to resize or reposition the cell in some way outside of what gridstrap's API provides.

**Returns**

Nothing.


#### [.moveCell](src/methods.js) 

Move a cell within the grid.

**Params**

* `element` **{jQuery/String/Element}**: Existing visible cell element to move.
* `toIndex` **{Number}**: Index within visible cells to move the element to.
* `targetGridstrap` **{Gridstrap}** *Optional*: Instance of a different gridstrap (retrievable from `$().data('gridstrap');`) to move cell to. Instance must be one that has been previously referenced via `setAdditionalGridstrapDragTarget()`.

**Returns**

Nothing.


#### [.padWithNonContiguousCells](src/methods.js) 

Explicitly append non-contiguous cells to set of current cells. These cells are added automatically as required if the `autoPadNonContiguousCells` option is enabled, but for performance and behaviour reasons it may be better to setup a grid using this method.

**Params**

* `callback` **{Function}**: Provide a function with two Number parameters, `cellCount` and `nonContiguousCellCount`. Return `true` to append a new non-contiguous cell to the grid. The function will be continuously be called until `false` is returned.

**Returns**

Nothing.


#### [.removeCell](src/methods.js) 

Detach an existing cell from the grid and then removes it from the DOM.  

**Params**

* `element` **{jQuery/String/Element}**: Existing cell element to detach from grid.

**Returns**

Nothing.


#### [.setAdditionalGridstrapDragTarget](src/methods.js) 

Enable another gridstrap instance to be targetable for drag and moveCell calls.

**Params**

* `element` **{jQuery/String/Element}**: Another gridstrap instance.

**Returns**

Nothing.


#### [.setCellAbsolutePositionAndSize](src/methods.js)

Set a visible cell's position and size. This will also trigger the 'cellredraw' event.

**Params**

* `$cell` **{jQuery/String/Element}**: Visible cell Html element.
* `positionAndSize` **{Object}**: {left:left, top:top, width:width, height:height}. 

**Returns**

Nothing.

#### [.updateOptions](src/methods.js) 

Get the div that contains the visible cells. It exists within the gridstrap element by default.

**Params**

* `newOptions` **{Object}**: Options to replace existing ones.

**Returns**

Nothing.


#### [.updateVisibleCellCoordinates](src/methods.js)

Manually trigger a repositioning of the visible cell coordinates to match their respective hidden cells.

**Params**

None.

**Returns**

Nothing.


### Plugin's events

#### [celldrag](src/constants.js)

Triggered when a cell is being dragged during mousemove. Can be prevented.

**Event data**

* `left` **{Number}**: Left offset of mousedown cursor position relative to cell.
* `top` **{Number}**: Top offset of mousedown cursor position relative to cell.
* `target` **{Element}**: Visible cell being dragged.


#### [cellredraw](src/constants.js)

Triggered when a visible cell is being repositioned or redrawn. Can be prevented.

**Event data**

* `left` **{Number}**: Left absolute position of cell.
* `top` **{Number}**: Top absolute position of cell.
* `width` **{Number}**: Width of cell.
* `height` **{Number}**: Height of cell.
* `target` **{Element}**: Visible cell being redrawn.

#### [cellresize](src/constants.js)

Triggered when a visible cell is being resized. Can be prevented.

**Event data**

* `width` **{Number}**: Width of cell.
* `height` **{Number}**: Height of cell.
* `target` **{Element}**: Visible cell being resized. 



## Notes

Below is some explanation of how certain things work.

### Cell types
When gridstrap is initialised on a element, its child elements will become 'cells'. There are four kinds of cells.

* Source cells: The source cells are the html elements that become another kind before initialisation.
* Visible cells: Visible cells are what the source cells are turned into. They are moved inside a container div, and then the `visibleCellClass` is added to them. By default this gives them an absolute position, and their coordinates and width have a css transition applied. They are tracked against their respective hidden cells.
* Hidden cells: Upon initialisation, all the source cells are cloned into hidden cells. These then take the place in the DOM of the source cells and serve to act like the original html did. The visible cells should follow their respective hidden cells. The hidden cells are called so because of the `hiddenCellClass` applied which by default sets their opacity to 0.

### Resizing
As the aim of the extension was to easily enable draggable bootstrap grids, making them resizable doesn't really fit the Bootstrap grid design. However they will behave as expected upon resizing them. To make the cells resizable to always fit within Bootstrap's grid system, check out the example at https://rosspi.github.io/gridstrap.js/ .

### Non-contiguous
Non-contiguous mode grants the ability to move cells to anywhere within the grid area, rather than just in place of existing cells. It can create the illusion of there being no backing static/relative grid like there is with Bootstrap's grid system. The way this is pulled off is by appended new cells on the fly as needed upon dragging or performing cell operations beyond the existing cell count, and applying the `nonContiguousPlaceholderCellClass` class to them to set their opacity to 0 by default. Once created, the placeholder cells can serve as hidden cells for other regular hidden cells to move around. This implementation will not work well with cells that are of a different size. But of course, this extension will work with any kind of html layout.


## History

Check [Releases](https://github.com/rosspi/gridstrap.js/releases) for detailed changelog.

## License

[MIT License](http://mit-license.org/) © Ross P
