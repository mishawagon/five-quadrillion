//Animated gradient for the canvas copied from https://codepen.io/kevinports/pen/abrHz
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


var Anim = { //animation settings
    'duration': 1000,
    'interval' : 10,
    'stepUnit' : 1.0,
    'currUnit' : 0.0
}

function Gradient(context, width, height){
    this.ctx = context;
    this.width = width;
    this.height = height;
    this.colorStops = [];
    this.currentStop = 0;
}

Gradient.prototype.addStop = function(pos, colors){
    var stop = {'pos': pos, 'colors':colors, 'currColor': null}
    this.colorStops.push(stop)
}

Gradient.prototype.updateStops = function(){ //interpolate colors of stops
    var steps = Anim.duration / Anim.interval,
    		step_u = Anim.stepUnit/steps
    		stopsLength = this.colorStops[0].colors.length - 1;

    for(var i = 0; i < this.colorStops.length; i++){ //cycle through all stops in gradient
        var stop = this.colorStops[i],
        		startColor = stop.colors[this.currentStop],//get stop 1 color
        		endColor, r, g, b;

				if(this.currentStop < stopsLength){ //get stop 2 color, go to first if at last stop
					endColor = stop.colors[this.currentStop + 1];
				} else {
					endColor = stop.colors[0];
				}

        //interpolate both stop 1&2 colors to get new color based on animaiton unit
        r = Math.floor(lerp(startColor.r, endColor.r, Anim.currUnit));
        g = Math.floor(lerp(startColor.g, endColor.g, Anim.currUnit));
        b = Math.floor(lerp(startColor.b, endColor.b, Anim.currUnit));

        stop.currColor = 'rgb('+r+','+g+','+b+')';
    }

    // update current stop and animation units if interpolaiton is complete
   	if (Anim.currUnit >= 1.0){
   		Anim.currUnit = 0;
   		if(this.currentStop < stopsLength){
   			this.currentStop++;
   		} else {
   			this.currentStop = 0;
   		}
   	}

   	Anim.currUnit += step_u; //increment animation unit
}

Gradient.prototype.draw = function(){
		var gradient = ctx.createLinearGradient(0,0,0,this.height);

    for(var i = 0; i < this.colorStops.length; i++){
        var stop = this.colorStops[i],
        		pos = stop.pos,
            color = stop.currColor;

        gradient.addColorStop(pos,color);
    }

    this.ctx.clearRect(0,0,this.width,this.height);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0,0,this.width,this.height);
}

var $width, $height, gradient,
		canvas = document.getElementById("backgradient"),
		ctx = canvas.getContext("2d"),
    stopAColor = [
        { 'r':'9', 'g':'117', 'b':'190' }, //blue
       	{ 'r':'59', 'g':'160', 'b':'89' }, //green
        { 'r':'230', 'g':'192', 'b':'39' }, //yellow
        { 'r':'238', 'g':'30', 'b':'77' }, //red
        { 'r': '0', 'g':'191', 'b':'255'}, //DeepSkyBlue
        { 'r': '224', 'g':'255', 'b':'255'}, //DeepSkyBlue2
        { 'r': '255', 'g':'127', 'b':'80'}, //Coral
        { 'r': '255', 'g':'20', 'b':'147'}, //DeepPink
    ],
    stopBColor = [
        { 'r':'205', 'g':'24', 'b':'75' }, //pink
        { 'r':'9', 'g':'117', 'b':'190' }, //blue
       	{ 'r':'59', 'g':'160', 'b':'89' }, //green
        { 'r':'230', 'g':'192', 'b':'39' }, //yellow
        { 'r':'238', 'g':'30', 'b':'77' }, //red
        { 'r': '0', 'g':'191', 'b':'255'}, //DeepSkyBlue
        { 'r': '224', 'g':'255', 'b':'255'}, //DeepSkyBlue2
        { 'r': '255', 'g':'127', 'b':'80'}, //Coral
    ];

    /*
    { 'r':'9', 'g':'117', 'b':'190' }, //blue
    { 'r':'59', 'g':'160', 'b':'89' }, //green
    { 'r':'230', 'g':'192', 'b':'39' }, //yellow
    { 'r':'238', 'g':'30', 'b':'77' }, //red
    { 'r': '0', 'g':'191', 'b':'255'}, //DeepSkyBlue
    { 'r': '224', 'g':'255', 'b':'255'}, //e	DeepSkyBlue
],
stopBColor = [
    { 'r':'205', 'g':'24', 'b':'75' }, //pink
    { 'r':'33', 'g':'98', 'b':'155' }, //blue
    { 'r':'64', 'g':'149', 'b':'69' }, //green
    { 'r':'228', 'g':'171', 'b':'33' }, //yellow
    { 'r': '255', 'g':'127', 'b':'80'}, //Coral
    { 'r': '255', 'g':'20', 'b':'147'}, //DeepPink
    */

var updateUI = function(){
		$width = $(window).width(),
		$height = $(window).height();

		canvas.width = $width;
		canvas.height = $height;

		gradient = new Gradient(ctx, canvas.width, canvas.height);
		gradient.addStop(0, stopAColor);
		gradient.addStop(1, stopBColor);
}

$(function(){

	  updateUI();

	  $(window).resize(function(){
		  updateUI();
      gradient.updateStops();
      gradient.draw();
	  });

    gradient.updateStops();
    gradient.draw();

});

//interpolation
function lerp(a, b, u) {
    return (1 - u) * a + u * b;
}
