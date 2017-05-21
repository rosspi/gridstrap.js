# gridstrap.js
=====

[![Build Status](https://travis-ci.org/rosspi/gridstrap.js.svg?branch=master)](https://travis-ci.org/rosspi/gridstrap.js) 
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/jquery.gridstrap)
[![NPM version](https://img.shields.io/npm/v/jquery.gridstrap.svg)](https://www.npmjs.com/package/jquery.gridstrap) 
![donate](https://img.shields.io/badge/donate%20bitcoin-1Q32bCvaoNPS4GUNxeBbPzkniMguKFVEtf-green.svg)
 
gridstrap.js is a jQuery plugin designed to take [Bootstrap's CSS grid system](https://getbootstrap.com/css/#grid) and turn it into a managed draggable and resizeable grid while truely maintaining its responsive behaviour. It will also work with any kind of CSS-driven layout.

Demo
=====
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
		<div id="basic-grid" class="row">
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

The basic structure of the project is given in the following way:

```
├── demo/
│   └── index.html
├── dist/
│   ├── jquery.boilerplate.js
│   └── jquery.boilerplate.min.js
├── src/
│   ├── jquery.boilerplate.coffee
│   └── jquery.boilerplate.js
├── .editorconfig
├── .gitignore
├── .jshintrc
├── .travis.yml
├── Gruntfile.js
└── package.json
``` 

## Contributing

Check [CONTRIBUTING.md](https://github.com/jquery-boilerplate/boilerplate/blob/master/CONTRIBUTING.md) for more information.

## History

Check [Releases](https://github.com/jquery-boilerplate/jquery-boilerplate/releases) for detailed changelog.

## License

[MIT License](http://zenorocha.mit-license.org/) © Zeno Rocha
>>>>>>> 58c8493d2c12ecbfcb557fe18e3b775f29c15d44

The way non-contiguous mode works is by appending (or removing as needed) placeholder cells to the end of the cell container. These placeholders therefore act dynamically so that the quantity of cells within the grid will be sufficient for whatever is required as if they were 'real' cells. However, because.. somethign about misbehaving with things moving between cells.
