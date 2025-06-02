var product,useData=[]
let sx; 
let sy// x position of the star
let starSize = 30; 
let particles = [];

function easeInOutCubic(x) {
return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function preload(){
  product = loadJSON("DataFileServicea.json")
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = 360 / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < 360; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}




function setup() {
  product = Object.values(product)
  for(let d of product){
     if(d.地區別 =="屏東縣"&&d.特用作物類別=="茶葉"&&d.年度>=2017){
       useData.push(d)
      print(d)
     }
  }
  angleMode(DEGREES);
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
  createCanvas(windowWidth, windowHeight);
  background(100);
  drawingContext.shadowColor=color(0,30)
  drawingContext.shadowOffsetY=10
  drawingContext.shadowOffsetX=10
  sx=0
  sy=height
  zy=height
}

function draw() {
  background(100)
  let stColor2 = color(22,214,214)
  let edColor2 = color(17,96,179)
  let midColo2 = lerpColor(stColor2,edColor2,0.9)
  let a=1.3
  fill("black")
  rect(0,0,width,height/a)
  fill("#A05A0F")
  rect(0,height/a,width,height-height/a)
  let animationProdress= easeInOutCubic(map(frameCount,0,300,0,1,true))
// Desenhar partículas
 for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p instanceof ParticleExplosion && p.isFinished()) {
      particles.splice(i, 1);
    }
  }

  // Desenhar estrela rotativa
  push();
  translate(width-width / 5, height / 6);
  rotate(frameCount);
  fill(255, 204, 0);
  noStroke();
  drawStar(0, 0, 100, 50, 5);
  pop();

  push()
    fill(255)
    textSize(30)
    text("屏東縣茶葉採收統計",50,50)
  pop()

  translate(width/8,height-40)
  noStroke()
  let stColor = color(158,111,31)
  let edColor = color(255,212,145)
  let stColor1 = color(24,102,23)
  let edColor1 = color(153,249,57)
  //let animationProdress= easeInOutCubic(map(frameCount,0,300,0,1,true))
  let animationProdress1= easeInOutCubic(map(frameCount,150,300,0,1,true))
  let powerNumber = 0.86

  push()
  // rotate(-PI/8)
  noFill()
    stroke(255,100)
    
    for(var i=0;i<=4;i++){
      let h = map(pow(i*2000,powerNumber),0,8000,0,-height)*animationProdress1
      line(0,h*2.7-40,width,h*2.7-40)
      push()
        fill(255)
        text(i*100,-80,h*2.8-40)
      pop()
    }
  pop()

  for(var i=0;i<useData.length;i++){
    let animationProdress2= easeInOutCubic(map(frameCount-i*5,0,300,0,1,true))

    let d = useData[i]
    let ratio = map (d.收穫面積,0,500,0,1)*animationProdress2
    let midColor = lerpColor(stColor,edColor,ratio)
    let midColor1 = lerpColor(stColor1,edColor1,ratio)
    fill(midColor)

    push()
      //rotate(i*(2*PI/useData.length))
      translate(i*150+width/8,-40)
      let h = map(pow(d.收穫面積,powerNumber),0,500,0,-height)*animationProdress2
      rect(0,0,30*animationProdress2*ratio,h*1.8)
      fill(midColor1)
      ellipse(0+10,h-20*ratio*18,120*ratio)
      ellipse(-30*ratio+5,(h-10*ratio)*1.8 ,120*ratio)
      ellipse(30*ratio+5,(h+10*ratio)*1.85,90*ratio)

      
      //rotate(-PI/2)
      fill(255)
      textSize(20)
      text(d.年度+"年",-5,20)
      
    pop() 
  }
  
}
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.alpha = random(100, 255);
    this.size = random(2, 5);
  }
update() {
    this.x += this.vx;
    this.y += this.vy;

    // Envolver nas bordas
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}
class ParticleExplosion extends Particle {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.alpha = 255;
    this.size = random(2, 5);
    this.lifetime = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime -= 5;
    this.alpha = this.lifetime;
  }

  isFinished() {
    return this.lifetime < 0;
  }
}

function mousePressed() {
  for (let i = 0; i < 50; i++) {
    particles.push(new ParticleExplosion(mouseX, mouseY));
  }
}
