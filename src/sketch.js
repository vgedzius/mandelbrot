// Global variables
var startMinA;
var startMaxA;
var startMinB;
var startMaxB;

var minA;
var maxA;
var minB;
var maxB;

// Declare controls
var canvas;
var resetBtn;
var maxIterationsInput;
var resolutionSelect;

function setup() {
  pixelDensity(1);
  noLoop();
  // Initialise controls
  resetBtn            = select('#reset');
  maxIterationsInput  = select('#max-iterations');
  resolutionSelect    = select('#resolution');

  var resolution = getResolution(resolutionSelect.value());

  canvas = createCanvas(resolution.width, resolution.height);
  canvas.parent('canvas-container');
  canvas.mousePressed(function() {
    var mappedX = map(mouseX, 0, width, minA, maxA);
    var aLength = abs(maxA - minA);
    minA = mappedX - aLength / 4;
    maxA = mappedX + aLength / 4;

    var mappedY = map(mouseY, 0, height, minB, maxB);
    var bLength = abs(maxB - minB);
    minB = mappedY - bLength / 4;
    maxB = mappedY + bLength / 4;

    redraw();
  });

  

  // Code for reset button
  resetBtn.mousePressed(function () {
    initVariables();

    var resolution = getResolution(resolutionSelect.value());
    canvas = resizeCanvas(resolution.width, resolution.height);

    redraw();
  });

  initVariables();
}

function draw() {
  for(x = 0; x < width; x++) {
    for(y = 0; y < height; y++) {

      var a = map(x, 0, width, minA, maxA);
      var b = map(y, 0, height, minB, maxB);

      var ca = a;
      var cb = b;

      var n = 0;
      
      while( n < maxIterations) {
        var aa = a * a - b * b;
        var bb = 2 * a * b;

        a = aa + ca;
        b = bb + cb;

        if ( a * a + b * b > 4 ) {
          break;
        }

        n++;
      }

      var bright = map(n, 0, maxIterations, 0, 1);
      bright = map(sqrt(bright), 0, 1, 0, 255);

      if (n === maxIterations) {
        bright = 0;
      }
      
      stroke(bright);
      point(x, y);
    }
  }
}

function initVariables() {
  maxIterations = parseInt(maxIterationsInput.value());

  startMinA = -2;
  startMaxA = 2;
  startMinB = -1.5;
  startMaxB = 1.5;

  minA = startMinA;
  maxA = startMaxA;
  minB = startMinB;
  maxB = startMaxB;
}

function getResolution(input) {
  var arr = input.split('x');

  return {
    width: arr[0],
    height: arr[1]
  };
}