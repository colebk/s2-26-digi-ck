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

function preload() {
  let endpoint = USE_OFFLINE_MOCK ? "sample-data.json" : PROXY_URL;
  aquariumData = loadJSON(endpoint, onDataLoaded, onError);
  sucxk = loadImage('tenor.gif');
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
  background(20, 30, 45);

  // Display each bubble
  for (let bubble of bubbles) {
    bubble.move();
    bubble.display();
    bubble.resetIfOffscreen();
  }

  image(sucxk, 50, 50, 400, 400);
  // 1. Draw Title Header
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Fish Environment Dashboard", 30, 30);

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

    // Call your custom graphic widgets
    drawTempWidget(30, 120, temp);
    drawGaugeWidget(260, 120, "pH Level", ph, 6.0, 8.5);
    drawGaugeWidget(490, 120, "Ammonia (NH3)", nh3, 0.0, 0.05);
    drawGaugeWidget(720, 120, "Oxygen Level", o2, 0.0, 0.05);

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
    this.speed = random(1, 3);
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

// Example Widget Function: Temperature Card
function drawTempWidget(x, y, tempVal) {
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, 170, 150, 10);

  noStroke();
  fill(180, 200, 220);
  textSize(14);
  text("Water Temp", x + 15, y + 15);

  fill(100, 220, 255);
  textSize(36);
  text(tempVal + "°C", x + 15, y + 50);
}

// Example Widget Function: Simple Bar Gauge
function drawGaugeWidget(x, y, label, val, minVal, maxVal) {
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, 200, 150, 10);

  noStroke();
  fill(180, 200, 220);
  textSize(14);
  text(label, x + 15, y + 15);

  fill(255);
  textSize(28);
  text(val, x + 15, y + 50);
}