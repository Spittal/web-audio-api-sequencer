$(document).ready(function(){

	window.group = {};
	var canWidth = $("#sequencer").width();
	var canHeight = $("#sequencer").height();

	function Cell() {
		this.create = function (x,y,r) {
			var cell = new Path.Circle(new Point(x,y), r);
			var secondCircle = Path.Circle(new Point(x,y), r);
				secondCircle.strokeColor = "#ccc";
			return cell;
		}
		this.play = function (play) {
			if (play == true) {
				var secondCircle = Path.Circle(new Point(this.position.x,this.position.y), 20);
				secondCircle.strokeColor = "#ccc";
				secondCircle.scale(1.01);
			}
		}
	}

	function canvasInit() {
		var i = 0;
		for (var x=25; x<canWidth; x+=(canWidth/16)){
			group[i] = new Group();
			for (var y=25; y<canHeight; y+=(canHeight/8)) {
				var cell = new Path.Circle(new Point(x, y), 1);
				cell.strokeColor = "#aaa";
				group[i].addChild(cell);
			}
		i++;
		}
	}

	canvasInit();

});

function onFrame(e) {
	window.eCount = e.count;
	//SCALE UP
	if (e.count >= 0 && e.count <= 15) {
		children = group[0].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 2 && e.count <= 17) {
		children = group[1].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 4 && e.count <= 19) {
		children = group[2].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 6 && e.count <= 21) {
		children = group[3].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 8 && e.count <= 23) {
		children = group[4].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 10 && e.count <= 25) {
		children = group[5].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 11 && e.count <= 26) {
		children = group[6].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 13 && e.count <= 28) {
		children = group[7].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 15 && e.count <= 30) {
		children = group[8].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 16 && e.count <= 31) {
		children = group[9].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 17 && e.count <= 32) {
		children = group[10].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}
	if (e.count >= 18 && e.count <= 33) {
		children = group[11].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(1.22);
		}
	}




	//Scale Down
	if (e.count >= 15 && e.count <= 20) {
		children = group[0].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 17 && e.count <= 22) {
		children = group[1].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 19 && e.count <= 24) {
		children = group[2].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 21 && e.count <= 26) {
		children = group[3].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 23 && e.count <= 28) {
		children = group[4].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 25 && e.count <= 30) {
		children = group[5].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 26 && e.count <= 31) {
		children = group[6].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 28 && e.count <= 33) {
		children = group[7].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 30 && e.count <= 35) {
		children = group[8].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 31 && e.count <= 36) {
		children = group[9].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 32 && e.count <= 37) {
		children = group[10].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
	if (e.count >= 33 && e.count <= 38) {
		children = group[11].children;
		for (var i = 0; i < children.length; i++) {
			children[i].scale(0.95);
		}
	}
}