# gridstrap.js 

[![Build Status](https://travis-ci.org/rosspi/gridstrap.js.svg?branch=master)](https://travis-ci.org/rosspi/gridstrap.js) 
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![NPM version](https://img.shields.io/npm/v/jquery.gridstrap.svg)](https://www.npmjs.com/package/jquery.gridstrap) 
![donate](https://img.shields.io/badge/donate%20bitcoin-1Q32bCvaoNPS4GUNxeBbPzkniMguKFVEtf-green.svg)
 
gridstrap.js is a jQuery plugin designed to take [Bootstrap's CSS grid system](https://getbootstrap.com/css/#grid) and turn it into a managed draggable and resizeable grid while truely maintaining its responsive behaviour. It will also work with any kind of CSS-driven layout.

## Demo 
[https://rosspi.github.io/gridstrap.js/](https://rosspi.github.io/gridstrap.js/)

 

## Usage

* In the browser:
	1. Include jQuery:

		```html
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
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
	nonContiguousOptions: { // TODO// TODO// TODO// TODO
		selector: null,
		getHtml: function () {
			return null;
		}
	},
	updateCoordinatesOnWindowResize: true, // enable window resize event handler.
	debug: false, // toggle console output.
	dragMouseoverThrottle: 500, // throttle cell mouseover events for rearranging.
	windowResizeDebounce: 50,  // debounce redraw on window resize.
	mousemoveDebounce: 0 // debounce mousemove for dragging cells.
};
```
### Plugin's methods

#### [.$getCellOfElement](methods.js) 

**Params**

* `element` **{jQuery/String/Element}**: Html element. 

**Returns**

A jQuery object selection of the closest visible cell from the element.

#### [.setCellAbsolutePositionAndSize](methods.js)

Write markdown API documentation to the given `dest` from the code
comments in the given JavaScript `src` file.

**Params**

* `src` **{String}**: Source file path.
* `dest` **{String}**: Destination file path.
* `options` **{Object}**
* `returns` **{String}**: API documentation

## Notes

Below is some explanation of how certain things work.

### Cell types
When you initialise gridstrap on a element within which there are elements, those elements then become known as 'cells'. There are four kinds of cells.
* Source cells: The source cells are the html elements that become another kind before initialisation.
* Visible cells: Visible cells are what the source cells are turned into. They are moved inside a container div, and then the visibleCellClass is added to them. By default this gives them an absolute position, and their coordinates are a
``` 

## History

Check [Releases](https://github.com/rosspi/gridstrap.js/releases) for detailed changelog.

## License

[MIT License](http://mit-license.org/) © Ross P

The way non-contiguous mode works is by appending (or removing as needed) placeholder cells to the end of the cell container. These placeholders therefore act dynamically so that the quantity of cells within the grid will be sufficient for whatever is required as if they were 'real' cells. However, because.. somethign about misbehaving with things moving between cells.
