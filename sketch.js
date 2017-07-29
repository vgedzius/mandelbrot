var maxIterations = 1000;

var mina = -2;
var maxa = 2;
var minb = -1.5;
var maxb = 1.5;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);

  frDiv = createDiv('');
  noLoop();
}

function draw() {
  for(x = 0; x < width; x++) {
    for(y = 0; y < height; y++) {

      var a = map(x, 0, width, mina, maxa);
      var b = map(y, 0, height, minb, maxb);

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

function mousePressed() {
  var mappedX = map(mouseX, 0, width, mina, maxa);
  var aLength = abs(maxa - mina);
  mina = mappedX - aLength / 4;
  maxa = mappedX + aLength / 4;

  var mappedY = map(mouseY, 0, height, minb, maxb);
  var bLength = abs(maxb - minb);
  minb = mappedY - bLength / 4;
  maxb = mappedY + bLength / 4;

  redraw();
}