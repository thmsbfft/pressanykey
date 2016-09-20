function Toot(parameters) {

	this.synth = new Tone.MonoSynth({
		"oscillator" : {
			"type" : "sine"
		},
		"envelope" : {
			"attack" : 0.01,
			"decay" : 0.01,
			"sustain" : 0.01,
			"release" : 0.01,
		}
	}).toMaster();

	this.synth.portamento = 0.5;
	this.synth.volume.value = -7;

	this.pitchShift = new Tone.PitchShift().toMaster();
	this.synth.connect(this.pitchShift);

}

Toot.prototype.tut = function(x, y) {

	var latitude = 15;
	var shift = (x/paper.view.viewSize.width)*(latitude*2)-latitude;

	this.pitchShift.pitch = Math.round(shift);
	this.synth.triggerAttackRelease("C4", "2n");

}

Toot.prototype.shh = function() {

	this.synth.triggerRelease();

}

Toot.prototype.brr = function() {

	this.pitchShift.pitch = 0;
	this.synth.triggerAttackRelease("D4", "2n");

}

Toot.prototype.tada = function() {

	this.pitchShift.pitch = 0;
	this.synth.triggerAttackRelease("E6", "2n");

}