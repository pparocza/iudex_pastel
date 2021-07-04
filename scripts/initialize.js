var audioCtx;
var offlineAudioCtx;
var pieceLength;

function init(){

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	audioCtx = new AudioContext();
	audioCtx.latencyHint = "playback";
	onlineButton.disabled = true;

	initUtilities();
	// initBuffers();
	initInstrumentsAndFX();
	initParts();
	initSections();
	initScript();

};

function initOffline(){

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	onlineCtx = new AudioContext();
	audioCtx = new OfflineAudioContext(2, onlineCtx.sampleRate*pieceLength, onlineCtx.sampleRate);
	audioCtx.latencyHint = "playback";
	onlineButton.disabled = true;

	initUtilities();
	// initBuffers();
	initInstrumentsAndFX();
	initParts();
	initSections();
	initScript();

};

// INITIALIZE UTILITIES

var includeUtilities;

function initUtilities(){

	includeUtilities = document.createElement('script');
	includeUtilities.src = "scripts/Utilities.js"
	document.head.appendChild(includeUtilities);

}

// INITIALIZE BUFFERS

var includeBufferLoader;
var includeLoadBuffers;

function initBuffers(){

	includeBufferLoader = document.createElement('script');
	includeBufferLoader.src = "scripts/bufferLoader.js"
	document.head.appendChild(includeBufferLoader);

	includeLoadBuffers = document.createElement('script');
	includeLoadBuffers.src = "scripts/loadBuffers.js"
	document.head.appendChild(includeLoadBuffers);

}

// INITIALIZE INSTRUMENTS AND EFFECTS

var includeInstrumentsAndFX;

function initInstrumentsAndFX(){

	includeInstrumentsAndFX = document.createElement('script');
	includeInstrumentsAndFX.src = "scripts/Instruments%20and%20FX.js"
	document.head.appendChild(includeInstrumentsAndFX);

	includeInstrumentsAndFX_L = document.createElement('script');
	includeInstrumentsAndFX_L.src = "scripts/Instruments%20and%20FX-LIBRARY.js"
	document.head.appendChild(includeInstrumentsAndFX_L);

}

// INITIALIZE PARTS

var includeParts;

function initParts(){

	includeParts = document.createElement('script');
	includeParts.src = "scripts/Parts.js"
	document.head.appendChild(includeParts);

}

// INITIALIZE SECTIONS

var includeSections;

function initSections(){

	includeSections = document.createElement('script');
	includeSections.src = "scripts/Sections.js"
	document.head.appendChild(includeSections);

}

// INITIALIZE SCRIPT

var includeScript;

function initScript(){

	includeScript = document.createElement('script');
	includeScript.src = "script.js"
	document.head.appendChild(includeScript);

}

//--------------------------------------------------------------

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//--------------------------------------------------------------

function randomArrayValue(array){

	var v = array[randomInt(0, array.length)];
	return v;

}

//--------------------------------------------------------------

function Sequence(){

	this.sequence = [];

}

Sequence.prototype = {

	sequence: this.sequence,

	duplicates: function(length, value){

		this.length = length;
		this.value = value;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.value;
		}

		return this.sequence;

	},

	pad: function(padLength, value){

		this.padLength = padLength;
		this.value = value;

		for(var i=0; i<this.padLength; i++){
			this.sequence.push(this.value);
		}

		return this.sequence;

	},

	additive: function(length, valuesArray){

		this.length = length;
		this.valuesArray = valuesArray;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += this.valuesArray[randomInt(0, this.valuesArray.length)];
		}

		return this.sequence;

	},

	additiveRandomInt: function(length, min, max){

		this.length = length;
		this.min = min;
		this.max = max;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += randomInt(this.min, this.max);
		}

		return this.sequence;

	},

	additiveRandomFloat: function(length, min, max){

		this.length = length;
		this.min = min;
		this.max = max;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += randomFloat(this.min, this.max);
		}

		return this.sequence;

	},

	additivePowers: function(length, base, powArray){

		this.length = length;
		this.base = base;
		this.powArray = powArray;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += Math.pow(this.base, randomArrayValue(this.powArray));
		}

		return this.sequence;

	},

	randomPowers: function(length, base, powArray){

		this.length = length;
		this.base = base;
		this.powArray = powArray;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = Math.pow(this.base, randomArrayValue(this.powArray));
		}

		return this.sequence;

	},

	evenDiv: function(div){

		this.div = div;

		for(var i=0; i<this.div; i++){
			this.sequence[i] = (i+1)/this.div;
		}

		return this.sequence;

	},

	randomSelect: function(length, valuesArray){

		this.length = length;
		this.valuesArray = valuesArray;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.valuesArray[randomInt(0, this.valuesArray.length)];
		}

		return this.sequence;

	},

	randomFloats: function(length, min, max){

		this.length = length;
		this.min = min;
		this.max = max;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = randomFloat(this.min, this.max);
		}

		return this.sequence;

	},

	randomInts: function(length, min, max){

		this.length = length;
		this.min = min;
		this.max = max;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = randomInt(this.min, this.max);
		}

		return this.sequence;

	},

	add: function(value){

		this.value = value;

		for(var i=0; i<this.sequence.length; i++){
			this.sequence[i] += this.value;
		}

		return this.sequence;

	},

	subtract: function(value){

		this.value = value;

		for(var i=0; i<this.sequence.length; i++){
			this.sequence[i] -= this.value;
		}

		return this.sequence;

	},

	multiply: function(value){

		this.value = value;

		for(var i=0; i<this.sequence.length; i++){
			this.sequence[i] *= this.value;
		}

		return this.sequence;

	},

	divide: function(value){

		this.value = value;

		for(var i=0; i<this.sequence.length; i++){
			this.sequence[i] /= this.value;
		}

		return this.sequence;

	},

	lace: function(newSequence){

		this.newSequence = newSequence;
		this.oldSequence = this.sequence;
		this.sequence = [];

		for(var i=0; i<this.newSequence.length; i++){
			this.sequence[i*2] = this.oldSequence[i];
			this.sequence[(i*2)+1] = this.newSequence[i];
		}

		return this.sequence;

	},

	laceAdd: function(newSequence){

		this.newSequence = newSequence;
		this.oldSequence = this.sequence;
		this.sequence = [];

		for(var i=0; i<this.newSequence.length; i++){
			this.sequence[i*2] = this.oldSequence[i];
			this.sequence[(i*2)+1] = this.newSequence[i];
		}

		for(var i=0; i<this.sequence.length; i++){
			if(i!=0){
				this.sequence[i] = this.sequence[i]+this.sequence[i-1];
			}
			else if(i==0){
				this.sequence[i] = this.sequence[i];
			}
		}

		return this.sequence;

	}

}

//--------------------------------------------------------------

function arrayMax(array){

	return(Math.max(...array));

}

// CALCULATE PIECE LENGTH

var sL = 40;

var s24 = new Sequence();
s24.additivePowers(sL, 1.5, [0, 1, -2, -3, 1.1, 0.5]);
s24 = s24.sequence;

var s44 = new Sequence();
s44.additivePowers(sL, 1.5, [0, 1, -2, -3, 1.1, 0.5]);
s44 = s44.sequence;

var s54 = new Sequence();
s54.additivePowers(sL, 1.5, [0, 1, -2, -3, 1.1, 0.5]);
s54 = s54.sequence;

var s64 = new Sequence();
s64.additivePowers(sL, 1.5, [0, 1, -2, -3, 1.1, 0.5]);
s64 = s64.sequence;

var s74 = new Sequence();
s74.additivePowers(sL, 1.5, [0, 1, -2, -3, 1.1, 0.5]);
s74 = s74.sequence;

var s25 = new Sequence();
s25.additivePowers(sL, 1.5, [0, 1, -2, -3, 1.1, 0.5]);
s25 = s25.sequence;

var s35 = new Sequence();
s35.additivePowers(sL, 1.5, [0, 1, -2, -3, 1.1, 0.5]);
s35 = s35.sequence;

var s45 = new Sequence();
s45.additivePowers(sL, 1.5, [0, 1, -2, -3, 1.1, 0.5]);
s45 = s45.sequence;

// GET LONGEST SEQUENCE

var sArray = [s24, s44, s54, s64, s74, s25, s35, s45];
var tArray = [];

for(var i=0; i<sArray.length; i++){
	tArray.push(arrayMax(sArray[i]));
}

var end = arrayMax(tArray);
pieceLength = end;
