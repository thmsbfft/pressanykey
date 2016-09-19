function Toot(parameters) {

	this.synth = new Tone.MonoSynth({
		"oscillator" : {
			"type" : "sine"
		},
		"envelope" : {
			"attack" : 0.01,
			"decay" : 0.2,
			"sustain" : 0.2,
			"release" : 0.2,
		}
	}).toMaster();

	this.synth.portamento = 0.5;
	this.synth.volume.value = -7;

	this.pitchShift = new Tone.PitchShift().toMaster();
	this.synth.connect(this.pitchShift);

	this.polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
	this.polySynth.volume.value = -10;

}

Toot.prototype.tut = function(x, y) {

	var latitude = 15;
	var shift = (x/paper.view.viewSize.width)*(latitude*2)-latitude;

	this.pitchShift.pitch = Math.round(shift);
	this.synth.triggerAttack("C4", "2n");

}

Toot.prototype.shh = function() {

	this.synth.triggerRelease("+0.2");

}

Toot.prototype.tada = function() {

	this.polySynth.triggerAttackRelease(["C4", "E4", "G4", "B5"], "2n");
	this.polySynth.triggerAttackRelease(["C4", "E4", "G4", "B5"], "2n", "+0.15");

}