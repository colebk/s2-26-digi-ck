// ===================================================
// STUDENT TASK: Build a graphical dashboard for Seneye
// ===================================================

// Replace this with your teacher's Cloudflare Worker URL:
const PROXY_URL = "https://seneye-proxy.ezankov.workers.dev/";

// Toggle to true if you are working offline without network access
const USE_OFFLINE_MOCK = false;

let aquariumData = null;
let lastUpdated = "";
let sucxk;
let bubbles = [];
const NUM_BUBBLES = 50;
// let aqyu
let titlecol = [100, 220, 255];
let widgetcommony = (100)
let widgetcol = [9, 27, 52]

function preload() {
  let endpoint = USE_OFFLINE_MOCK ? "sample-data.json" : PROXY_URL;
  aquariumData = loadJSON(endpoint, onDataLoaded, onError);
  sucxk = loadImage('tenor.gif');
  // aqyu = loadImage('shek.png');
}

function setup() {
  createCanvas(960, 540);
  for (let i = 0; i < NUM_BUBBLES; i++) {
    bubbles.push(new Bubble()); 
  }
}

function onDataLoaded(data) {
  aquariumData = data;
  lastUpdated = new Date().toLocaleTimeString();
  console.log("Data refreshed successfully:", data);
}

function onError(err) {
  console.error("Failed to load aquarium data. Check proxy URL or network.", err);
}

function draw() {
  // background(aqyu);
  background(0, 0, 0)

  // Display each bubble
  for (let bubble of bubbles) {
    bubble.move();
    bubble.display();
    bubble.resetIfOffscreen();
  }

  image(sucxk, 50, 50, 400, 400);
  rect
  // 1. Draw Title Header
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Fish Environment Dashboard", 30, 30);


    // 1. Calculate the pulsing blur size (oscillates between 10 and 50)
  let dynamicBlur = 30 + sin(frameCount * 0.03) * 10;
  push(); 

  // Display connection status
  textSize(12);
  fill(150, 200, 255);
  text("Last updated: " + (lastUpdated || "Loading..."), 30, 65);

  // 2. Render Dashboard Graphics safely after checking aquariumData exists
  if (aquariumData && aquariumData[0]) {
    let temp = Math.round(aquariumData[0].exps.temperature.curr * 100) / 100;
    let ph = aquariumData[0].exps.ph.curr;
    let nh3 = aquariumData[0].exps.nh3.curr;
    let o2 = aquariumData[0].exps.o2.curr;

    let tempcol = color(0, 255, 255);

    // Call your custom graphic widgets
    drawingContext.shadowBlur = dynamicBlur;
    drawingContext.shadowColor = tempcol;
    drawTempWidget(30, widgetcommony, temp, 0, 0, 139, titlecol);
    drawingContext.shadowColor = color(0, 128, 0);
    drawGaugeWidget(260, widgetcommony, "pH Level", ph, 0, 128, 0, 0, 14, 6, 8);
    drawingContext.shadowColor = color(255, 244, 79);
    drawGaugeWidget(490, widgetcommony, "Ammonia (NH3)", nh3, 255, 244, 79, 0, 1, -1, 0.05);
    drawingContext.shadowColor = color(255, 197, 211);
    drawGaugeWidget(720, widgetcommony, "Oxygen Level", o2, 255, 197, 211, 2, 12);
    drawingContext.shadowBlur = 0;


    // Checks if pH is too low or high inside the data check block
    if (ph <= 6) {
      textSize(12);
      fill(255, 0, 0);
      text("Warning pH too low", 300, 90);
    } else if (ph >= 9) {
      textSize(12);
      fill(255, 0, 0);
      text("Warning pH too high", 300, 90);
    }

  } else {
    // Loading State
    fill(255, 100, 100);
    textSize(18);
    text("Connecting to sensor stream...", 30, 120);
  }
} //NOTE THIS IS WHERE THE DRAWING ENDS DUMDNAS <<<------------------------------------------------------------------------------------------------------


// Bubble Class )
class Bubble {
  constructor() {
    this.reset(true);
  }

  reset(firstTime = false) {
    this.x = random(width);
    this.y = firstTime ? random(height) : height + random(10, 50);
    this.radius = random(5, 20);
    this.speed = random(1, 2);
    this.alpha = random(100, 200);
  }

  move() {
    this.y -= this.speed;
    this.x += sin(frameCount * 0.05 + this.radius) * 0.5;
  }

  display() {
    noFill();
    stroke(255, 255, 255, this.alpha);
    strokeWeight(1.5);
    circle(this.x, this.y, this.radius * 2);
    
    fill(255, 255, 255, this.alpha);
    noStroke();
    circle(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3);
  }

  resetIfOffscreen() {
    if (this.y < -this.radius * 2) {
      this.reset();
    }
  }
}


// underline function is cool
function drawline(word, x, y) {
  // Underline
  stroke(...titlecol)
  strokeWeight(1);
  line(
    x + 13,
    y + 30,
    x + 17 + textWidth(word),
    y + 30
  );
  noStroke();
}

// visual guage
function drawTempGauge(
  x,
  y,
  tempVal,
  minTemp = 10,
  maxTemp = 30,
  dangerMin = 15,
  dangerMax = 25,
  gaugeCol = [100, 100, 100],
  safeCol = [0, 255, 255],
  dangerCol = [255, 0, 0],
  markerCol = [255, 255, 255],
  labelCol = [180, 180, 180]
) {

  // -------------------------
  // Gauge coordinates
  // -------------------------
  let gaugeX = x + 15;
  let gaugeY = y + 115;
  let gaugeWidth = 170;

  // -------------------------
  // Calculate danger positions
  // -------------------------
  let dangerMinX = map(
    dangerMin,
    minTemp,
    maxTemp,
    gaugeX,
    gaugeX + gaugeWidth
  );

  let dangerMaxX = map(
    dangerMax,
    minTemp,
    maxTemp,
    gaugeX,
    gaugeX + gaugeWidth
  );

  // Keep danger boundaries inside gauge
  dangerMinX = constrain(
    dangerMinX,
    gaugeX,
    gaugeX + gaugeWidth
  );

  dangerMaxX = constrain(
    dangerMaxX,
    gaugeX,
    gaugeX + gaugeWidth
  );

  // -------------------------
  // Background gauge
  // -------------------------
  stroke(...gaugeCol);
  strokeWeight(6);

  line(
    gaugeX,
    gaugeY,
    gaugeX + gaugeWidth,
    gaugeY
  );

  // -------------------------
  // Low danger region
  // -------------------------
  stroke(...dangerCol);
  strokeWeight(6);

  line(
    gaugeX,
    gaugeY,
    dangerMinX,
    gaugeY
  );

  // -------------------------
  // Safe region
  // -------------------------
  stroke(...safeCol);
  strokeWeight(6);

  line(
    dangerMinX,
    gaugeY,
    dangerMaxX,
    gaugeY
  );

  // -------------------------
  // High danger region
  // -------------------------
  stroke(...dangerCol);
  strokeWeight(6);

  line(
    dangerMaxX,
    gaugeY,
    gaugeX + gaugeWidth,
    gaugeY
  );

  // -------------------------
  // Temperature marker
  // -------------------------
  let markerX = map(
    tempVal,
    minTemp,
    maxTemp,
    gaugeX,
    gaugeX + gaugeWidth
  );

  markerX = constrain(
    markerX,
    gaugeX,
    gaugeX + gaugeWidth
  );

  // Marker becomes red when
  // temperature is dangerous
  if (tempVal < dangerMin || tempVal > dangerMax) {
    stroke(...dangerCol);
  } else {
    stroke(...safeCol);
  }

  fill(...markerCol);
  strokeWeight(2);

  circle(
    markerX,
    gaugeY,
    12
  );

  // -------------------------
  // Min / Max labels
  // -------------------------
  noStroke();
  fill(...labelCol);
  textSize(10);

  textAlign(LEFT, TOP);
  text(minTemp + "°C", gaugeX, gaugeY + 10);

  textAlign(RIGHT, TOP);
  text(maxTemp + "°C", gaugeX + gaugeWidth, gaugeY + 10);

  // Reset
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
}


// Example Widget Function: Temperature Card
function drawTempWidget(x, y, tempVal) {

  // -------------------------
  // Widget box
  // -------------------------
  fill(widgetcol);
  stroke(0, 255, 255);
  strokeWeight(2);
  rect(x, y, 200, 150, 10);

  // -------------------------
  // Title
  // -------------------------
  noStroke();
  fill(...titlecol);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("Water Temp", x + 15, y + 15);

  drawline("Water Temp", x, y);

  // -------------------------
  // Temperature number
  // -------------------------
  fill(0, 255, 255);
  textSize(36);
  textStyle(NORMAL);
  text(tempVal + "°C", x + 15, y + 50);

  // -------------------------
  // Temperature gauge
  // -------------------------
  drawTempGauge(
    x,
    y,
    tempVal,
    10,               // Minimum temperature
    35,               // Maximum temperature
    20,    // Dangerous minimum
    28,    // Dangerous maximum
    [100, 100, 100],  // Gauge background
    [0, 255, 255],    // Active/safe colour
    [255, 0, 0],      // Danger colour
    [255, 255, 255],  // Marker colour
    [180, 180, 180],   // Label colour
    "°C"
  );


  // Reset
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
}

// Example Widget Function: Simple Bar Gauge
function drawGaugeWidget(
  x,
  y,
  label,
  val,
  sr,
  sg,
  sb,
  minb,
  maxb,
  dmin,
  dmax
) {

  // -------------------------
  // Widget box
  // -------------------------
  fill(widgetcol);
  stroke(sr, sg, sb);
  strokeWeight(2);
  rect(x, y, 200, 150, 10);

  // -------------------------
  // Title
  // -------------------------
  noStroke();
  fill(...titlecol);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(label, x + 15, y + 15);

  drawline(label, x, y);

  // -------------------------
  // Value
  // -------------------------
  fill(sr, sg, sb);
  textSize(36);
  textStyle(NORMAL);
  text(val, x + 15, y + 50);

  // -------------------------
  // Gauge
  // -------------------------
  drawTempGauge(
    x,
    y,
    val,

    minb,              // Gauge minimum
    maxb,              // Gauge maximum

    dmin,              // Dangerous minimum
    dmax,              // Dangerous maximum

    [100, 100, 100],   // Gauge background
    [sr, sg, sb],      // Safe colour
    [255, 0, 0],       // Danger colour
    [255, 255, 255],   // Marker colour
    [180, 180, 180],    // Label colour
    ""
  );

  // Reset
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
}