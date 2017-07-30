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
var coloringMethodSelect;
var fullScreenBtn;
var canvasContainer;

function setup() {
  pixelDensity(1);
  noLoop();
  // Initialise controls
  resetBtn              = select('#reset');
  maxIterationsInput    = select('#max-iterations');
  resolutionSelect      = select('#resolution');
  coloringMethodSelect  = select('#coloring-method');
  fullScreenBtn         = select('#full-screen');
  body                  = select('body');

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
    initVariables(width, height, false);

    var resolution = getResolution(resolutionSelect.value());
    canvas = resizeCanvas(resolution.width, resolution.height);
  });

  fullScreenBtn.mousePressed(function () {
    var fs          = fullscreen();
    fullscreen(!fs);
  });

  initVariables(width, height);
}

function windowResized() {
  var resolution  = getResolution(resolutionSelect.value());
  var fs = false;
  if (window.innerHeight == screen.height) {
    body.addClass('full-screen');
    fs = true;
  } else {
    body.removeClass('full-screen');
    fs = false;
  }

  var newWidth    = fs ? windowWidth : resolution.width;
  var newHeight   = fs ? windowHeight : resolution.height;

  initVariables(newWidth, newHeight);
  canvas = resizeCanvas(newWidth, newHeight);
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

      var rgb;

      switch(coloringMethodSelect.value()) {
        case 'escape-linear' :
          rgb = escapeTimeLinear(n);
          break;
        case 'escape-map' :
          rgb = escapeTimeColorMap(n)
          break;
        default:
          rgb = escapeTimeLinear(n);
      }

      // console.log(rgb);
      
      stroke(rgb.r, rgb.g, rgb.b);
      point(x, y);
    }
  }
}

function initVariables(newWidth, newHeight) {
  maxIterations = parseInt(maxIterationsInput.value());

  startMinA = -2;
  startMaxA = 2;
  startMinB = newHeight * startMinA / newWidth;
  startMaxB = newHeight * startMaxA / newWidth;

  minA = startMinA;
  maxA = startMaxA;
  minB = startMinB;
  maxB = startMaxB;
}

function getResolution(input) {
  var arr = input.split('x');

  return {
    width: parseInt(arr[0]),
    height: parseInt(arr[1])
  };
}

function escapeTimeLinear(n) {
  var bright = map(n, 0, maxIterations, 0, 1);
      bright = map(sqrt(bright), 0, 1, 0, 255);

  if (n === maxIterations) {
    bright = 0;
  }

  return {
    r: bright,
    g: bright,
    b: bright,
  }
}

function escapeTimeColorMap(n) {
  if (n == maxIterations) {
    return {
      r: 0,
      g: 0,
      b: 0,
    }
  } else {
    var mapping = [];
    mapping[0]  = {r: 66,  g: 30,  b: 15};
    mapping[1]  = {r: 25,  g: 7,   b: 26};
    mapping[2]  = {r: 9,   g: 1,   b: 47};
    mapping[3]  = {r: 4,   g: 4,   b: 73};
    mapping[4]  = {r: 0,   g: 7,   b: 100};
    mapping[5]  = {r: 12,  g: 44,  b: 138};
    mapping[6]  = {r: 24,  g: 82,  b: 177};
    mapping[7]  = {r: 57,  g: 125, b: 209};
    mapping[8]  = {r: 134, g: 181, b: 229};
    mapping[9]  = {r: 211, g: 236, b: 248};
    mapping[10] = {r: 241, g: 233, b: 191};
    mapping[11] = {r: 248, g: 201, b: 95};
    mapping[12] = {r: 255, g: 170, b: 0};
    mapping[13] = {r: 204, g: 128, b: 0};
    mapping[14] = {r: 153, g: 87,  b: 0};
    mapping[15] = {r: 106, g: 52,  b: 3};

    var i = n % mapping.length;

    return mapping[i];
  }
}