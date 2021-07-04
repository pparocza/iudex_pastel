function InstrumentConstructorTemplate(){

	this.output = audioCtx.createGain();

}

InstrumentConstructorTemplate.prototype = {

	output: this.output,

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

function Instrument(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];

}

Instrument.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	instrumentMethod: function(){
		this.startArray = [];
	},

	filterTick: function(rate, type, freq, Q){

		this.rate = rate;
		this.type = type;
		this.freq = freq;
		this.Q = Q;

		this.o = new LFO(0, 1, this.rate);
		this.o.buffer.makeSawtooth(1);
		this.f = new MyBiquad(this.type, this.freq, this.Q);

		this.o.connect(this.f);
		this.f.connect(this.output);

		this.startArray = [this.o];

	},

	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},

	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	startAtTime: function(startTime){

		var startArray = this.startArray;
		var startTime = startTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].start();
			}
		}, startTime*1000);

	},

	stopAtTime: function(stopTime){

		var startArray = this.startArray;
		var stopTime = stopTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].stop();
			}
		}, startTime*1000);

	},

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

function Effect(){

	this.input = audioCtx.createGain();
	this.filterFade = new FilterFade(0);
	this.output = audioCtx.createGain();
	this.startArray = [];

	this.input.connect(this.filterFade.input);

}

Effect.prototype = {

	input: this.input,
	output: this.output,
	filterFade: this.filterFade,
	startArray: this.startArray,

	effectMethod: function(){
		this.startArray = [];
	},

	thru: function(){

		this.filterFade.connect(this.output);

	},

	shaperCrush: function(){

		this.w = new MyWaveShaper();
		this.w.makeSigmoid(100);

		this.c = new MyCompressor(20, 0.001, 0.001, -80, 1);

		this.filterFade.connect(this.w);
		this.w.connect(this.c);
		this.c.connect(this.output);

	},

	filter: function(type, freq, Q){

		this.type = type;
		this.freq = freq;
		this.Q = Q;

		this.f = new MyBiquad(this.type, this.freq, this.Q);
		this.filterFade.connect(this.f);

		this.f.connect(this.output);

	},

	fmShaper: function(inGain, cFreq, mFreq, mGain){

		this.inGain = inGain;
		this.cFreq = cFreq;
		this.mFreq = mFreq;
		this.mGain = mGain;

		this.wG = new MyGain(this.inGain);
		this.w = new MyWaveShaper();
		this.w.makeFm(this.cFreq, this.mFreq, this.mGain);

		this.filterFade.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.output);

	},

	amShaper: function(inGain, cFreq, mFreq, mGain){

		this.inGain = inGain;
		this.cFreq = cFreq;
		this.mFreq = mFreq;
		this.mGain = mGain;

		this.wG = new MyGain(this.inGain);
		this.w = new MyWaveShaper();
		this.w.makeAm(this.cFreq, this.mFreq, this.mGain);

		this.filterFade.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.output);

	},

	dSeq: function(){

		this.sL = new Sequence();
		this.sL.randomPowers(5, 4, [-2, -3, -1.1, -2.2, -3.3]);
		this.sL = this.sL.sequence;

		this.sR = new Sequence();
		this.sR.randomPowers(5, 4, [-2, -3, -1.1, -2.2, -3.3]);
		this.sR = this.sR.sequence;

		this.delays = [];
		this.nDelays = this.sL.length;

		for(var i=0; i<this.nDelays; i++){

			this.delays[i] = new MyStereoDelay(this.sL[i], this.sR[i], 0, 1);

			this.filterFade.connect(this.delays[i]);
			this.delays[i].output.gain.value = 1/this.nDelays;
			this.delays[i].connect(this.output);

		}

	},

	dSeqF: function(){

		this.sL = new Sequence();
		this.sL.randomPowers(5, 4, [-2, -3, -1.1, -2.2, -3.3]);
		this.sL = this.sL.sequence;

		this.sR = new Sequence();
		this.sR.randomPowers(5, 4, [-2, -3, -1.1, -2.2, -3.3]);
		this.sR = this.sR.sequence;

		this.delays = [];
		this.nDelays = this.sL.length;

		this.f1 = new MyBiquad("bandpass", 100, 50);
		this.f2 = new MyBiquad("bandpass", 200, 50);
		this.f3 = new MyBiquad("bandpass", 400, 100);

		for(var i=0; i<this.nDelays; i++){

			this.delays[i] = new MyStereoDelay(this.sL[i], this.sR[i], 0, 1);

			this.filterFade.connect(this.f1);
			this.filterFade.connect(this.f2);
			this.filterFade.connect(this.f3);
			this.f1.connect(this.delays[i]);
			this.f2.connect(this.delays[i]);
			this.f3.connect(this.delays[i]);
			this.delays[i].output.gain.value = 1;
			this.delays[i].connect(this.output);

		}

	},

	dSeqF2: function(){

		this.sL = new Sequence();
		this.sL.randomPowers(5, 4, [-2, -3, -1.1, -2.2, -3.3]);
		this.sL = this.sL.sequence;

		this.sR = new Sequence();
		this.sR.randomPowers(5, 4, [-2, -3, -1.1, -2.2, -3.3]);
		this.sR = this.sR.sequence;

		this.delays = [];
		this.nDelays = this.sL.length;

		this.f1 = new MyBiquad("bandpass", 10000, 50);
		this.f2 = new MyBiquad("bandpass", 8000, 50);
		this.f3 = new MyBiquad("bandpass", 5000, 100);

		for(var i=0; i<this.nDelays; i++){

			this.delays[i] = new MyStereoDelay(this.sL[i], this.sR[i], 0, 1);

			this.filterFade.connect(this.f1);
			this.filterFade.connect(this.f2);
			this.filterFade.connect(this.f3);
			this.f1.connect(this.delays[i]);
			this.f2.connect(this.delays[i]);
			this.f3.connect(this.delays[i]);
			this.delays[i].output.gain.value = 1;
			this.delays[i].connect(this.output);

		}

	},

	dSeqF3: function(){

		this.sL = new Sequence();
		this.sL.randomPowers(5, 4, [-2, -3, -1.1, -2.2, -3.3]);
		this.sL = this.sL.sequence;

		this.sR = new Sequence();
		this.sR.randomPowers(5, 4, [-2, -3, -1.1, -2.2, -3.3]);
		this.sR = this.sR.sequence;

		this.delays = [];
		this.nDelays = this.sL.length;

		this.f1 = new MyBiquad("bandpass", 300, 50);
		this.f2 = new MyBiquad("bandpass", 600, 50);
		this.f3 = new MyBiquad("bandpass", 1200, 100);

		for(var i=0; i<this.nDelays; i++){

			this.delays[i] = new MyStereoDelay(this.sL[i], this.sR[i], 0, 1);

			this.filterFade.connect(this.f1);
			this.filterFade.connect(this.f2);
			this.filterFade.connect(this.f3);
			this.f1.connect(this.delays[i]);
			this.f2.connect(this.delays[i]);
			this.f3.connect(this.delays[i]);
			this.delays[i].output.gain.value = 1;
			this.delays[i].connect(this.output);

		}

	},

	switch: function(switchVal){

		var switchVal = switchVal;

		this.filterFade.start(switchVal, 30);

	},

	switchAtTime: function(switchVal, time){

		var filterFade = this.filterFade;
		var switchVal = switchVal;

		setTimeout(function(){
			filterFade.start(switchVal, 20);
		}, time*1000);

	},

	switchSequence: function(valueSequence, timeSequence){

		this.valueSequence = valueSequence;
		this.timeSequence = timeSequence;
		this.v;
		this.j=0;

		for(var i=0; i<timeSequence.length; i++){
				this.v = this.valueSequence[this.j%this.valueSequence.length];
				this.filterFade.startAtTime(this.v, 20, this.timeSequence[i]);
				this.j++;
		}

	},

	on: function(){

		this.filterFade.start(1, 30);

	},

	off: function(){

		this.filterFade.start(0, 20);

	},

	onAtTime: function(time){

		var filterFade = this.filterFade;

		setTimeout(function(){filterFade.start(1, 20);}, time*1000);

	},

	offAtTime: function(time){

		var filterFade = this.filterFade;

		setTimeout(function(){filterFade.start(0, 20);}, time*1000);

	},

	start: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}

	},

	stop: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}

	},

	startAtTime: function(startTime){

		var startArray = this.startArray;
		var startTime = startTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].start();
			}
		}, startTime*1000);

	},

	stopAtTime: function(stopTime){

		var startArray = this.startArray;
		var stopTime = stopTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].stop();
			}
		}, startTime*1000);

	},

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------
