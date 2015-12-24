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

setTimeout(function(){ // wait 4 seconds then start listening to mouse move
    document.body.onmousemove = function(e) {
        var mousePos = new Point(e.screenX, e.screenY); // current mouse position
        // calculate moues velocity based on distance between frames, breakability, and window size
        mouseVelocity = new Point(window.innerWidth * (mousePos.x - lastMousePos.x) / (window.innerWidth * (1-breakability)), window.innerHeight * (mousePos.y - lastMousePos.y) / (window.innerHeight * (1-breakability)));

        lastMousePos = mousePos;
    }
},4000);

var Polygon = React.createClass({
    getInitialState:function(){
        return {
            origFill:this.props.fill, // store the original fill color
            origPoints:this.props.points, // store the original positions that the polygon should be attracted to
            darkAmnt:0, // a number we will continue to increment and that then take the Math.sin() value of
            colorVelocity:randomRange(0.04,0.13), // how quickly to change the colors
            colorReach:randomRange(8,24), // how much the hue should be aloud to shift
            transform:'translate(0 0)', // transform amount, initially nothing. used to move the peices
            movable:(Math.random() <= .75), // whether or not the polygon is movable
            movability:new Point(randomRange(0.86,1),randomRange(0.86,1)), // how "movable" each polygon is
            polarity:new Point(Math.random() <= .5, Math.random() <= .5) // mouse polarity (which way to go when the mouse is moved)
        }
    },
    render:function() {
          // some otherwise unnecessary pointer variables to make things more legible
          var destColor = this.state.origFill;
          var colorVelocity = this.state.colorVelocity;
          var colorReach = this.state.colorReach;
          var movable = this.state.movable;
          var polarity = this.state.polarity;
          var movability = this.state.movability;

          // increment the darken amount. this number keeps getting bigger forever, but we take the sin of it so it fluctuates gradually between -1 and 1
          this.state.darkAmnt += colorVelocity;

          // calculate the destination color
          destColor = LightenDarkenColor(destColor,(Math.sin(this.state.darkAmnt) * colorReach));

          // let React do its thing
          return <polygon fill={destColor} transform={getTransform(movable,movability,polarity.x,polarity.y)} points={this.state.origPoints}></polygon>;

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
    }
});

var SuperCoolLion = React.createClass({
    render:function() {
        return (<div><SVGArt /></div>);
    }
});

var superCoolLion = document.getElementById('super-cool-lion');

function step(timestamp) { // onEnterFrame
    React.render(<SuperCoolLion />, superCoolLion); // trigger a repaint

    window.requestAnimationFrame(step); // keep the clock ticking

    // apply friction to mouse
    mouseVelocity.x *= 0.86;
    mouseVelocity.y *= 0.86;
}

// get the party started
window.requestAnimationFrame(step);
