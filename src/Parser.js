var Parser = Parser || { };

Parser.Tunnel = function (obj) {
	this._parse(obj);
};

 Parser.Tunnel.prototype = {
	_reset : function () {
		this._height = null;
		this._leftCurb      = null;
		this._rightCurb     = null;
	},

	_parse : function (obj) {
		this._reset();
		this._height      = obj.height;
		this._leftCurb      = obj.leftCurb.slice();
		this._rightCurb     = obj.rightCurb.slice();
	},

	get pointsCount() {
		return this._leftCurb.length / 3;
	},
	
	get height(){
		return this._height;
	},

	leftSideAt : function (index) {
		var idx = index * 3;
		return this._leftCurb.slice(idx, idx + 3);
	},

	rightSideAt : function (index) {
		var idx = index * 3;
		return this._rightCurb.slice(idx, idx + 3);
	},
};


Parser.Track = function (obj) {
	this._parse(obj);
};

Parser.Track.prototype = {
	_reset : function () {
		this._leftCurb      = null;
		this._rightCurb     = null;
	},

	_parse : function (obj) {
		this._reset();

		this._leftCurb      = obj.leftCurb.slice();
		this._rightCurb     = obj.rightCurb.slice();
	},

	get pointsCount() {
		return this._leftCurb.length / 3;
	},

	leftSideAt : function (index) {
		var idx = index * 3;
		return this._leftCurb.slice(idx, idx + 3);
	},

	rightSideAt : function (index) {
		var idx = index * 3;
		return this._rightCurb.slice(idx, idx + 3);
	},
};

 Parser.AreaLigth = function (obj) {
	this._parse(obj);
};

 Parser.AreaLigth.prototype = {
	_reset : function () {
		this._frame = [ 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,  0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0 ],
		this._size = [1,1],
		this._color = [0.8,0.8,0.8]
	},

	_parse : function (obj) {
		this._reset();

		this._frame = obj.frame;
		this._size   = obj.size;
		this._color   = obj.color;
	},

	get frame() {
		return this._frame;
	},

	get size() {
		return this._size;
	},

	get color() {
		return this._color;
	}
	
};
 Parser.Lamp = function (obj) {
	this._parse(obj);
};

 Parser.Lamp.prototype = {
	_reset : function () {
		this._position = [ 0.0, 0.0, 0.0 ];
		this._height   = 0.0;
	},

	_parse : function (obj) {
		this._reset();

		this._position = obj.position.slice();
		this._height   = obj.height;
	},

	get position() {
		return this._position.slice();
	},

	get height() {
		return this._height;
	}
};

 Parser.Tree = function (obj) {
	this._parse(obj);
};

Parser.Tree.prototype = {
	_reset : function () {
		this._position = [ 0.0, 0.0, 0.0 ];
		this._height   = 0.0;
	},

	_parse : function (obj) {
		this._reset();

		this._position = obj.position.slice();
		this._height   = obj.height;
	},

	get position() {
		return this._position.slice();
	},

	get height() {
		return this._height;
	}
};

 Parser.Building = function (obj) {
	this._parse(obj);
};

 Parser.Building.prototype = {
	_reset : function () {
		this._outline = null;
	},

	_parse : function (obj) {
		this._reset();

		this._outline = obj.outline.slice();
	},

	get pointsCount() {
		return this._outline.length / 4;
	},

	positionAt : function (index) {
		var idx = index * 4;
		return this._outline.slice(idx, idx + 3);
	},

	heightAt : function (index) {
		var idx = index * 4;
		return this._outline[idx + 3];
	}
};

 Parser.Weather = function (obj) {
	this._parse(obj);
};

 Parser.Weather.prototype = {
	_reset : function () {
		this._sunDir       = null
		this._cloudDensity = 0;
		this._rainStrength = 0;
	},

	_parse : function (obj) {
		this._reset();

		this._sunDir       = obj.sunLightDirection.slice();
		this._cloudDensity = obj.cloudDensity;
		this._rainStrength = obj.rainStrength;
	},

	get sunLightDirection() {
		return this._sunDir.slice();
	},

	get cloudDenstity() {
		return this._cloudDenstity;
	},

	get rainStrength() {
		return this._rainStrength;
	}
};

 Parser.Race = function (obj) {
	this._parse(obj);
};

 Parser.Race.prototype = {
	_reset : function () {
		this._startPosition = null;
		this._observerPosition = null;
		this._photoPosition = null;

		this._bbox 	= null;
		this._track     = null;
		this._tunnels     = null;
		this._arealigths     = null;
		this._lamps     = null;
		this._trees     = null;
		this._buildings = null;
		this._weather   = null;
	},
	_parseStartPosition:function (obj){
		if(!obj) return;
		this._startPosition =  obj;
	},
	_parsePhotoPosition:function (obj){
		if(!obj) return;
		this._photoPosition =  obj;
	},
	_parseObserverPosition:function (obj){
		if(!obj) return;
		this._observerPosition =  obj;
	},
	_parseBBox : function (obj) {
		if(!obj) return;
		this._bbox = [obj[0],obj[1],obj[2],obj[3],obj[4],obj[5]];
	},

	_parseTrack : function (obj) {
		this._track = new  Parser.Track(obj);
	},

	_parseTunnels : function (obj) {
		if (!obj) return;
		this._tunnels = new Array(obj.length);
		for (var i=0, n=this._tunnels.length; i<n; ++i) {
			this._tunnels[i] = new  Parser.Tunnel(obj[i]);
		}
	},

	_parseAreaLigths : function (obj) {
		if (!obj) return;
		this._arealigths = new Array(obj.length);
		for (var i=0, n=this._arealigths.length; i<n; ++i) {
			this._arealigths[i] = new  Parser.AreaLigth(obj[i]);
		}
	},

	_parseLamps : function (obj) {
		if (!obj) return;
		this._lamps = new Array(obj.length);
		for (var i=0, n=this._lamps.length; i<n; ++i) {
			this._lamps[i] = new  Parser.Lamp(obj[i]);
		}
	},

	_parseTrees : function (obj) {
		if (!obj) return;
		this._trees = new Array(obj.length);
		for (var i=0, n=this._trees.length; i<n; ++i) {
			this._trees[i] = new  Parser.Tree(obj[i]);
		}
	},

	_parseBuildings : function (obj) {
		if (!obj) return;
		this._buildings = new Array(obj.length);
		for (var i=0, n=this._buildings.length; i<n; ++i) {
			this._buildings[i] = new Parser. Building(obj[i]);
		}
	},

	_parseWeather : function (obj) {
		this._weather = new  Parser.Weather(obj);
	},

	_parse : function (obj) {
		this._reset();

		this._parseStartPosition  (obj.startPosition);
		this._parsePhotoPosition   (obj.photoPosition);
		this._parseObserverPosition   (obj.observerPosition);
		this._parseBBox     (obj.bbox);
		this._parseTrack     (obj.track);
		this._parseTunnels     (obj.tunnels);
		this._parseAreaLigths     (obj.arealigths);
		this._parseLamps     (obj.lamps);
		this._parseTrees     (obj.trees);
		this._parseBuildings (obj.buildings);
		this._parseWeather   (obj.weather);
	},

	get startPosition(){
		return this._startPosition;
	},
	get photoPosition(){
		return this._photoPosition;
	},
	get observerPosition(){
		return this._observerPosition;
	},
	get bbox(){
		return this._bbox;
	},
	get track() {
		return this._track;
	},

	get tunnels() {
		return this._tunnels;
	},

	get arealigths() {
		return this._arealigths;
	},

	get lamps() {
		return this._lamps;
	},

	get trees() {
		return this._trees;
	},

	get buildings() {
		return this._buildings;
	},

	get weather() {
		return this._weather;
	}
  };