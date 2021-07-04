function tickEffect4(rate){

	var rate = rate;

	var output = audioCtx.createGain();
	output.gain.value = 1;

	// INSTRUMENTS

	var t = new Instrument();
	t.filterTick(rate, "highpass", 20, 0);

	// EFFECTS

	var e2 = new Effect();
	e2.fmShaper(0.1, 30, 140, 1);
	e2.output.gain.value = 0.15;

	var e4 = new Effect();
	e4.dSeq();
	e4.output.gain.value = 1;

	var e5 = new Effect();
	e5.dSeqF();
	e5.output.gain.value = 3;

	var e6 = new Effect();
	e6.dSeqF2();
	e6.output.gain.value = 3;

	var e7 = new Effect();
	e7.dSeqF3();
	e7.output.gain.value = 3;

	var sC = new Effect();
	sC.shaperCrush();
	sC.on();

	t.connect(e2);

	e2.connect(e4);
	e2.connect(e7);

	e4.connect(e5);
	e4.connect(e6);

	e4.connect(output);
	e5.connect(output);
	e6.connect(output);
	e7.connect(output);

	// OUTPUT

	output.connect(sC.input);
	sC.connect(masterGain);

	t.start();
	e2.switchSequence([1, 0], s24);
	e4.switchSequence([1, 0], s44);
	e5.switchSequence([1, 0], s54);
	e6.switchSequence([1, 0], s64);
	e7.switchSequence([1, 0], s74);

}

//--------------------------------------------------------------

function tickEffect5(rate){

	var rate = rate;

	var output = audioCtx.createGain();
	output.gain.value = 1;

	// INSTRUMENTS

	var t = new Instrument();
	t.filterTick(rate, "highpass", 20, 0);

	// EFFECTS

	var e2 = new Effect();
	e2.fmShaper(0.1, 30, 140, 1);
	e2.output.gain.value = 0.15;

	var e3 = new Effect();
	e3.fmShaper(0.05, 50, 140, 1);
	e3.output.gain.value = 0.2;

	var e4 = new Effect();
	e4.dSeq();
	e4.output.gain.value = 1;

	var sC = new Effect();
	sC.shaperCrush();
	sC.on();

	t.connect(e2);
	t.connect(e3);

	e2.connect(e4);
	e4.connect(e3);

	e3.connect(output);
	e4.connect(output);

	// OUTPUT

	output.connect(sC.input);
	sC.connect(masterGain);

	t.start();
	e2.switchSequence([1, 0], s25);
	e3.switchSequence([1, 0], s35);
	e4.switchSequence([1, 0], s45);

}

//--------------------------------------------------------------
