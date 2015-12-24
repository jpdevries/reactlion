function randomRange(min,max) {
    return min + (Math.random() * max-min);
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function explode() {
  mouseVelocity = new Point(Math.random() * (window.innerWidth * .4), Math.random() * (window.innerHeight * .4)); // base the initial mouse velocity off screensize
}

var lastMousePos = new Point(window.innerWidth * .5, window.innerHeight * .5); // assume the mouse starts at the center
var mouseVelocity;
var breakability = .9; // decimal between 0-1, closer to 1 the further polygons push away from eachother

explode();

document.addEventListener('keydown', function(event) {
  event.preventDefault();
    if (event.which === 32) {
        explode();
    }
});

function getTransform(movable,movability,polarX,polarY) {
    if(!movable) return ('translate(0,0)');

    var x = mouseVelocity.x;
    var y = mouseVelocity.y;

    if(polarX) x = 0-x;
    if(polarY) y = 0-y;

    x *= movability.x;
    y *= movability.y;

    return ('translate(' + x + ' ' + y + ')');
}

function LightenDarkenColor(col, amt) { //https://css-tricks.com/snippets/javascript/lighten-darken-color/
    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

setTimeout(function(){ // wait 4 seconds then start listening to mouse move
    document.body.onmousemove = function(e) {
        var mousePos = new Point(e.screenX, e.screenY); // current mouse position
        // calculate moues velocity based on distance between frames, breakability, and window size
        mouseVelocity = new Point(window.innerWidth * (mousePos.x - lastMousePos.x) / (window.innerWidth * (1-breakability)), window.innerHeight * (mousePos.y - lastMousePos.y) / (window.innerHeight * (1-breakability)));

        lastMousePos = mousePos;
    }
},4000);

function step(timestamp) { // onEnterFrame
    // apply friction to mouse
    mouseVelocity.x *= 0.86;
    mouseVelocity.y *= 0.86;

    window.requestAnimationFrame(step); // keep the clock ticking
}

// get the party started
window.requestAnimationFrame(step);
