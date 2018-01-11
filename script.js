// make references to HTML elements
var file = document.getElementById("audio-file");
var audio = document.getElementById("audio-controls");
var canvas = document.getElementById("canvas");

//provide the 2D rendering surface
var canvasContext = canvas.getContext('2d');

//
var cWidth;
var cHeight;

//automatic resizing
(function() {

	window.addEventListener('resize', resizeCanvas, false);

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		cWidth = canvas.width;
		cHeight = canvas.height;
		draw(); 
	}
	resizeCanvas();

	function draw() {
		canvasContext.fillStyle = "#eeeeee";
		canvasContext.fillRect(0, 0, cWidth, cHeight);
	}

})();

file.onchange = function() {

	//make sure canvas variables are accessible inside the animation method
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var canvasContext = canvas.getContext("2d");

	var files = this.files;
	audio.src = URL.createObjectURL(files[0]);
	audio.load();
	audio.play();
	
	var audioContext = new AudioContext();
	var src = audioContext.createMediaElementSource(audio);
	var analyser = audioContext.createAnalyser();
  	analyser.smoothingTimeConstant = 0.95;

	src.connect(analyser);
	analyser.connect(audioContext.destination);
	
	analyser.fftSize = 128;

	var slots = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(slots);

	var radius;

	function renderFrame() {
		requestAnimationFrame(renderFrame);

		x = 0 ;

		analyser.getByteFrequencyData(dataArray)

		canvasContext.fillStyle = "#333333";
		canvasContext.fillRect(0, 0, cWidth, cHeight);

		for (var i = 0; i < 64; i += 6) {
			radius = dataArray[i];

			var r = 25 * (i/3);
			var g = 50;
			var b = 50 * (radius/2);

			canvasContext.globalAlpha = 0.2;
			canvasContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			canvasContext.beginPath();
			canvasContext.arc(cWidth * 0.5, cHeight * 0.5, radius*1.8, 0, 2 * Math.PI, false);
			canvasContext.fill();
      	}
	}

	renderFrame();
	audio.play();

}
