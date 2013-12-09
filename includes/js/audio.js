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

	//token for nodes... yeah
	var nodeCreateToken = true;

	//Vars for listeners
	var cutoff = 22000;
	var octave = 1;

	//how to tell what sound is playing
	var soundCounter = 0;

	//delay vars
	var taps, dTime, decay = 0;
	var dTimeMod = 1;
	nodes.delay = {};

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

	$("#tempo").on("change", function() {
		bpm = $(this).val();
		beatCalc();
		beatToken = true;
		dTime = (tempo/1000) * dTimeMod;
		for (var i=1; i<=taps; i++) {
			nodes.delay[i].delayTime.value = i * dTime;
		}
	});

	$("#volume").on("change", function() {
		nodes.volume.gain.value = $(this).val();
	});




	$("#oct-down").mouseup(function() {
		octave = octave / 2;
		$("#oct-title").html("Octave:" + (Math.log(octave)/Math.log(2)));
	});

	$("#oct-up").mouseup(function() {
		octave = octave * 2;
		$("#oct-title").html("Octave:" + (Math.log(octave)/Math.log(2)));
	});





	$("#tempo-half").mouseup(function() {
		dTimeMod = 0.5;
		$("#tempo-half,#tempo-whole,#tempo-double").css("background-color", "#008cba");
		$(this).css("background-color", "#0079a1");
		dTime = (tempo/1000) * dTimeMod;
		for (var i=1; i<=taps; i++) {
			nodes.delay[i].delayTime.value = i * dTime;
		}
	});

	$("#tempo-whole").mouseup(function() {
		dTimeMod = 1;
		$("#tempo-half,#tempo-whole,#tempo-double").css("background-color", "#008cba");
		$(this).css("background-color", "#0079a1");
		dTime = (tempo/1000) * dTimeMod;
		for (var i=1; i<=taps; i++) {
			nodes.delay[i].delayTime.value = i * dTime;
		}
	});

	$("#tempo-double").mouseup(function() {
		dTimeMod = 2;
		$("#tempo-half,#tempo-whole,#tempo-double").css("background-color", "#008cba");
		$(this).css("background-color", "#0079a1");
		dTime = (tempo/1000) * dTimeMod;
		for (var i=1; i<=taps; i++) {
			nodes.delay[i].delayTime.value = i * dTime;
		}
	});





	$(".clear").mouseup(function() {
		clearBoard();
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
		nodes.volume = context.createGainNode();

		//Delay creation
		taps = 3;
		decay = 0.3;
		dTime = (tempo/1000) * dTimeMod;

		for (var i=1; i<=taps; i++) {
		nodes.delay["vol"+i] = context.createGainNode();
		nodes.delay[i] = context.createDelay(maxDelayTime = 100);

		nodes.delay["vol"+i].gain.value = decay / (Math.pow(i,i));
		nodes.delay[i].delayTime.value = i * dTime;
		}

		//Set Filter
		nodes.filter.type = 0;
		nodes.filter.frequency.value = cutoff;

		//Set Convolver
		// nodes.delay.buffer = buffers.ir;

		//Set Main Volume
		nodes.volume.gain.value = 0.8;

		//Set token to false
		nodeCreateToken = false;
	}

	//This routes through nodes, creating nodes if necessary.
	function sineSourceRouting(source,soundCount) {
		//Create unique nodes based on played note.
		if (nodes[soundCount + "ADSRnode"] == null) {
			nodes[soundCount + "ADSRnode"] = context.createGainNode();
		}
		var ADSR = nodes[soundCount + "ADSRnode"];

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
		nodes.filter.connect(nodes.volume);
		nodes.volume.connect(context.destination);

		//delay connections
		for (var i=1; i<=taps; i++) {
			nodes.volume.connect(nodes.delay["vol"+i]);
			nodes.delay["vol"+i].connect(nodes.delay[i]);
			nodes.delay[i].connect(context.destination);
		}

		return source;
	}

	function playSine(hz,soundCount) {
		allowed[hz] = false;
		source[soundCount] = context.createOscillator();
		source[soundCount].type = 3;
		source[soundCount].frequency.value = hz;
		source[soundCount] = sineSourceRouting(source[soundCount],soundCount);
		source[soundCount].noteOn(0);
		soundCounter++;
	}

	function stopSine(hz,soundCount) {
		allowed[hz] = true;
		var ADSR = nodes[soundCount + "ADSRnode"];
		var currTime = context.currentTime;

		//SET Release
		ADSR.gain.setTargetAtTime(0, currTime, 0.2);

		source[soundCount].noteOff(currTime + 5);
		setTimeout(delete source[soundCount], 5000);
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
	var bpm = 320;
	var tempo;
	var beatToken = false;
	var beatTime = null;
	var iBeat = 0;
	var iPrev = 0;

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
		beatTime = setInterval(function() {
			if (beatToken === true) {
				clearInterval(beatTime);
				beatToken = false;
				beatMarker();
			} else {
				if (iBeat === 0) {
					iPrev = 15;
				} else {
					iPrev = (iBeat - 1);
				}

				for (var y = 1; y<=8; y++){
					if (group[iBeat].select("circle:nth-child("+y+")")._selected === true) {
						playSeqSound(y);
						animSeqSound(iBeat,y);
					} else {
						group[iBeat].select("circle:nth-child("+y+")").attr({fill: "#aaa"});
					}

					if (group[iPrev].select("circle:nth-child("+y+")")._selected === true) {
					} else {
						group[iPrev].select("circle:nth-child("+y+")").attr({fill: "#ddd"});
					}
				}


				iBeat++;
				if (iBeat >= 16) {
					iBeat = 0;
				}
		}
		}, tempo);
	}

	function circleClick () {
		var colours = {
			0: "#76C6BE",
			1: "#FF5B60",
			2: "#008cba",
			3: "#a276cc"
		};
		var num = Math.floor(Math.random()*4);
		if (this._selected === true) {
			this.attr({fill: "#ddd"});
			this._selected = false;
		} else {
			this.attr({fill: colours[num]});
			this._selected = true;
		}
	}

	function clearBoard() {
		for (var x=0; x<16; x++){
			for (var y=1; y<9; y++) {
				var circle = group[x].select("circle:nth-child("+y+")");
				circle.attr({
					stroke: "#ddd",
					fill: "#ddd"
				});
				circle._selected = false;
			}
		}
	}

	function playSeqSound(row) {
		var hz = 440;
		switch (row)
		{
			case 8: //A
				hz = 440.0 * octave;
				break;
			case 7: //B
				hz = 493.88 * octave;
				break;
			case 6: //C#
				hz = 554.37 * octave;
				break;
			case 5: //D
				hz = 587.33 * octave;
				break;
			case 4: //E
				hz = 659.26 * octave;
				break;
			case 3: //F#
				hz = 739.99 * octave;
				break;
			case 2: //D#
				hz = 783.99 * octave;
				break;
			case 1: //D#
				hz = 880.0 * octave;
				break;
		}
		clearTimeout(sineTimer[hz]);
		var count = soundCounter;
		playSine(hz,count);
		sineTimer[count] = setTimeout(function(){
			stopSine(hz,count);
		}, 50);
	}

	function animSeqSound(groupnum,row) {
		group[groupnum].select("circle:nth-child("+row+")").animate({
			r: 25,
			"fill-opacity": 0.5
		}, 60, mina.easein, function(){
			group[groupnum].select("circle:nth-child("+row+")").attr({
				r: 20,
				"fill-opacity": 1
			});
		});
	}

	beatCalc();
	canvasInit();
});