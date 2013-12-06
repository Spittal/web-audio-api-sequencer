// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).ready(function(){
	$(document).foundation();

	var context = new webkitAudioContext();

	//Sounds to load!
	var sounds = ['ir'];

	//Objects that will be useful
	var source = {},
	buffers = {},
	allowed = {},
	nodes = {};

	var nodeCreateToken = true;

	//Vars for listeners
	var cutoff = 22000;

	//Listeners
	$("#cutoff").on("change", function() {
		var mod = $(this).val();
		var minValue = 40;
		var maxValue = 20000;
		var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
		var multiplier = Math.pow(2, numberOfOctaves * ( mod - 1.0 ) );
		cutoff = maxValue * multiplier;
		nodes.filter.frequency.value = cutoff;
	});

	//Load Sounds, from the array "sounds" above
	function loadSounds(){
		var xhr = new XMLHttpRequest();
		for (var i = 0; i<sounds.length; i++){
			xhr = new XMLHttpRequest();
			xhr._soundName = sounds[i];
			xhr.open('GET', xhr._soundName + ".wav" , true);
			xhr.responseType = 'arraybuffer';
			xhr.addEventListener('load', bufferSound, false);
			function bufferSound() {
				context.decodeAudioData(xhr.response, function(buffer){
					buffers[xhr._soundName] = buffer;
				}, decodeError);
			}
			function decodeError(){
			}
			xhr.send();
		}
	}

	//nodeCreate, when needed
	function nodeCreate(){
		nodes.filter = context.createBiquadFilter();
		nodes.delay = context.createConvolver();

		//Set Filter
		nodes.filter.type = 0;
		nodes.filter.frequency.value = cutoff;

		//Set Convolver
		// nodes.delay.buffer = buffers.ir;

		//Set token to false
		nodeCreateToken = false;
	}

	//This routes through nodes, creating nodes if necessary.
	function sineSourceRouting(source) {
		//Create unique nodes based on played note.
		if (nodes[source.frequency.value + "ADSRnode"] == null) {
			nodes[source.frequency.value + "ADSRnode"] = context.createGainNode();
		}
		var ADSR = nodes[source.frequency.value + "ADSRnode"];

		//Create and Set uni-nodes ONLY ONCE
		if (nodeCreateToken !== false)  {
			nodeCreate();
		}

		//Get Current Time
		var currTime = context.currentTime;

		//SET Attack
		ADSR.gain.value = 0;
		ADSR.gain.setTargetAtTime(1, currTime, 0.01);

		//connect things
		source.connect(ADSR);
		ADSR.connect(nodes.filter);
		nodes.filter.connect(context.destination);
		// nodes.delay.connect(context.destination);

		return source;
	}

	function playSine(hz) {
		allowed[hz] = false;
		source[hz] = context.createOscillator();
		source[hz].type = 0;
		source[hz].frequency.value = hz;
		source[hz] = sineSourceRouting(source[hz]);
		source[hz].noteOn(0);
	}

	function stopSine(hz) {
		allowed[hz] = true;
		var ADSR = nodes[source[hz].frequency.value + "ADSRnode"];
		var currTime = context.currentTime;

		//SET Release
		ADSR.gain.setTargetAtTime(0, currTime, 0.2);

		source[hz].noteOff(currTime + 5);
	}

	function playSound(name) {
		source[name] = context.createBufferSource();
		source[name].buffer = buffers[name];
		source[name].connect(context.destination);
		source[name].noteOn(0);
	}

	loadSounds();



//canvas code
	var s = new Snap(800,600);
	var sWidth = $("svg").width();
	var sHeight = $("svg").height();
	var group = {};
	var showTimer = null;
	var sineTimer = {};
	var iShow = 0;
	var bpm = 120;
	var tempo;

	function canvasInit() {
		var i = 0;
		for (var x=25; x<sWidth; x+=(sWidth/16)){
			group[i] = s.group();
			for (var y=25; y<sHeight; y+=(sHeight/8)) {
				var circle = s.circle(x, y, 0);
				circle.attr({
					stroke: "#ddd",
					fill: "#ddd"
				});
				circle._selected = false;
				circle.mousedown(circleClick);
				group[i].add(circle);
			}
		i++;
		}
		firstShow();
	}

	function firstShow() {
		clearTimeout(showTimer);
		if (iShow >= Object.keys(group).length) {
			beatMarker();
		} else {
			for (var i = 1; i<=8; i++) {
				group[iShow].select("circle:nth-child("+i+")").animate({r: 20}, 1000);
			}
			showTimer = setTimeout(firstShow, 80);
			iShow++;
		}
	}

	function beatCalc() {
		tempo = 1/(bpm/60000);
	}

	function beatMarker() {
		var i = 0;
		var iPrev = 0;
		setInterval(function() {
			if (i === 0) {
				iPrev = 15;
			} else {
				iPrev = (i - 1);
			}

			for (var y = 1; y<=8; y++){
				if (group[i].select("circle:nth-child("+y+")")._selected === true) {
					playSeqSound(y);
				} else {
					group[i].select("circle:nth-child("+y+")").attr({fill: "#aaa"});
				}
				if (group[iPrev].select("circle:nth-child("+y+")")._selected === true) {
				} else {
					group[iPrev].select("circle:nth-child("+y+")").attr({fill: "#ddd"});
				}
			}


			i++;
			if (i >= 16) {
				i = 0;
			}
		}, tempo);
	}

	function circleClick () {
		if (this._selected === true) {
			this.attr({fill: "#ddd"});
			this._selected = false;
		} else {
		this.attr({fill: "#A29FE0"});
		this._selected = true;
		}
	}

	function playSeqSound(row) {
		var hz = 440;
		switch (row)
		{
			case 8: //C
				hz = 261.63;
				break;
			case 7: //C#
				hz = 277.18;
				break;
			case 6: //D
				hz = 293.66;
				break;
			case 5: //D#
				hz = 311.13;
				break;
		}
		clearTimeout(sineTimer[hz]);
		playSine(hz);
		sineTimer[hz] = setTimeout(function(){
			stopSine(hz);
		}, 50);
	}

	beatCalc();
	canvasInit();
});