let w = 370;
let h = 1100;
let e = 180;

let p_size = 8;
let f_size = 16;

let spacing = 30

let players = [];

let n = 0;
let n_max = 5;

let current_p;

let t = 0;
let t_max = 3;

function setup() {
  createCanvas(w, h);
  frameRate(2);

  strokeWeight(4);
  strokeJoin(ROUND);
  fill(0, 0);
  
  drawField();
}

function keyPressed() {
  if (keyCode === RETURN) {
    players = [];
    drawField();
    n = 0;
    t = 0;
  } else if (key === 's') {
    saveCanvas("play-" + year() + "-" + month() + "-" + day() + "_" + hour() + "-" + minute() + "-" + second(), ".png");
  }
}

function draw() {
  let x, y;
  if (n < n_max) 
  {//                    ------------------ draw players ------------------
    let nok = true;
    while (nok) {
      x = random(p_size * 3, w - p_size * 3);
      y = random(p_size * 3, h - p_size * 3);
      nok = false;
      for (const p of players) {
        if (abs(x - p[0]) < spacing || abs(y - p[1]) < spacing) {
          nok = true;
        }
      }
    }

    let r = random(2*PI);
    attacker(x, y);
    defence(x, y, r);
    
    // Draw spacing circle
    // push();
    //   strokeWeight(1);
    //   fill(0, 0);
    //   drawingContext.setLineDash([5, 5]);
    //   circle(x, y, spacing*2);
    // pop();

    players[n] = [x, y, r];

    n++;

    if (n === n_max) {
      players.sort((a, b) => b[1] - a[1]);
      current_p = min(floor(abs(randomGaussian(0, n_max / 3))), n_max-1);
    }
  } else if (t < t_max) 
  { //                    ------------------ draw throws ------------------
    let [cp_x, cp_y, cp_r] = players[current_p];

    let nok = true;
    while (nok) {
      x = random(p_size * 3, w - p_size * 3);
      if (t < t_max - 1) {
        y = random(e, cp_y - p_size * 3);
      } else {
        y = random(p_size * 3, e)
      }
      nok = false;
      for (const p of players) {
        if (abs(x - p[0]) < spacing || abs(y - p[1]) < spacing) {
          nok = true;
        }
      }
    }

    push();
      drawingContext.setLineDash([10, 10]);
      strokeWeight(2);
      fill(0, 0);

      // m_x = (cp_x + x) / 2
      // m_y = (cp_y + y) / 2
      // let c = p5.Vector.fromAngle(atan2(cp_y - y, cp_x - x) + PI / 2, 1/randomGaussian(0, 1));
      // let mag = createVector(c.x - x, c.y - y).mag()
      // arc(c.x + m_x, c.y + m_y, mag*2, mag*2, atan2(cp_y - m_y, cp_x - m_x), atan2(y - m_y, x - m_x));
      
      let curve_x = (cp_x + x) / 2 + random(-50, 50);
      let curve_y = (cp_y + y) / 2 + random(-50, 50);
      bezier(cp_x, cp_y, curve_x, curve_y, curve_x, curve_y, x, y); // make arc instead of bezier, looks better
      arrow(x, y, atan2(curve_y - y, curve_x - x), 6);
    pop();

    let old_c_p = current_p;
    while (current_p === old_c_p) {
      current_p = floor(random(n_max));
    }
    console.log(current_p);

    [cp_x, cp_y, cp_r] = players[current_p];

    push();
      // drawingContext.setLineDash([10, 10]);
      strokeWeight(2);
      fill(0, 0);
      line(cp_x, cp_y, x, y);
      arrow(x, y, atan2(cp_y - y, cp_x - x), 6);
    pop();
    
    players[current_p] = [x, y, cp_r];

    t++;
  }
}

function arrow(x, y, r, s) {
  push();
    drawingContext.setLineDash([]);
    translate(x, y);
    rotate(r);
    line(0, 0, s, s);
    line(0, 0, s, -s);
  pop();
}

function attacker(x, y) {
  push();
    translate(x, y);
    line(-p_size, -p_size, p_size, p_size);
    line(p_size, -p_size, -p_size, p_size);
  pop();
}

function defence(x, y, r) {
  push();
    translate(x, y);
    rotate(r);
    translate(0, -3*p_size);
    line(-p_size, 0, p_size, 0);
    line(0, 0, 0, -p_size/2);
  pop();
}

function drawField() {
  push();
    fill(160, 255, 160);
    strokeWeight(8);
    rect(0, 0, w, h);
    strokeWeight(4);
    line(0, e, w, e);
    line(0, h - e, w, h - e);
  pop();
}
