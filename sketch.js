// Global variables
var startMinA;
var startMaxA;
var startMinB;
var startMaxB;

var minA;
var maxA;
var minB;
var maxB;

var maxIterations;
var escapeRadius = 2;

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

        if ( a * a + b * b > escapeRadius * escapeRadius ) {
          break;
        }

        n++;
      }

      switch(coloringMethodSelect.value()) {
        case 'escape-linear' :
          pixel(x, y, escapeTimeLinear(n));
          break;
        case 'escape-map' :
          pixel(x, y, escapeTimeColorMap(n));
          break;
        case 'smooth-color' :
          pixel(x, y, smoothColor(n, a, b));
          break;
        default:
          pixel(x, y, escapeTimeLinear(n));
      }
    }
  }
}

function pixel(x, y, color) {
  stroke(color);
  point(x, y);
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

  return color(bright, bright, bright);
}

function escapeTimeColorMap(n) {
  if (n == maxIterations) {
    return color(0, 0, 0);
  } else {
    var pallete = getPallete();
    var i = n % pallete.length;

    return pallete[i];
  }
}

function smoothColor(n, a, b) {
  // colorMode(HSB);
  if (n == maxIterations) {
    return color(0, 0, 0);
  } else {
    var pallete = getPallete();

    var logZn   = Math.log(a * a + b * b) / escapeRadius;
    var mu      = n + 1 -
                  Math.log( logZn / Math.log(escapeRadius) ) / Math.log(escapeRadius);
    mu          = mu / maxIterations * pallete.length;

    var clr1 = floor(abs(mu));
    var t2 = mu - clr1;
    var t1 = 1 - t2;
    clr1 = clr1 % pallete.length;
    var clr2 = (clr1 + 1) % pallete.length;

    var r = red(pallete[clr1]) * t1 + red(pallete[clr2]) * t2;
    var g = green(pallete[clr1]) * t1 + green(pallete[clr2]) * t2;
    var b = blue(pallete[clr1]) * t1 + blue(pallete[clr2]) * t2;

    return color(r, g, b);
  }
}

function getPallete() {
  var mapping = [];
  mapping[0]  = color(60,  30,  15);
  mapping[1]  = color(25,  7,   26);
  mapping[2]  = color(9,   1,   47);
  mapping[3]  = color(4,   4,   73);
  mapping[4]  = color(0,   7,   100);
  mapping[5]  = color(12,  44,  138);
  mapping[6]  = color(24,  82,  177);
  mapping[7]  = color(57,  125, 209);
  mapping[8]  = color(134, 181, 229);
  mapping[9]  = color(211, 236, 248);
  mapping[10] = color(241, 233, 191);
  mapping[11] = color(248, 201, 95);
  mapping[12] = color(255, 170, 0);
  mapping[13] = color(204, 128, 0)
  mapping[14] = color(153, 87,  0);
  mapping[15] = color(106, 52,  3);

  return mapping;
}