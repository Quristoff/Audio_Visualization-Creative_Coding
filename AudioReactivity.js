var fall;
var button;
var fft;
var spectrum;
var reverb;
var edibleImage;
var lowPass;


function preload() {
  soundFormats("wav");
  fall = loadSound("Fall.wav");
  printer = loadImage("Printer.jpg");
}

function playMusic(){
  if (!fall.isPlaying()){
    fall.play();
  } else {
    fall.pause();
  }

}

function setup() {
  createCanvas(700,500);
  button = createButton("Play/Pause")
  fft = new p5.FFT;
  lowPass = new p5.LowPass();
  reverb = new p5.Reverb();

  button.mousePressed(playMusic);
  fall.disconnect();
  lowPass.process(fall);
  reverb.process(fall, 3, 2);





}


function draw(){


  edibleImage = {
    img : printer,
    xPos : width/4,
    yPos : height/2,
    counter :0,
    adjustedWidth : printer.width/10,
    adjustedHeight : printer.height/10,
    linearize : function (number) {
      while (this.counter < this.adjustedHeight){
        rectMode(CORNER);
        let color = get(this.xPos+0.5*(this.adjustedWidth)-number,
          this.yPos-0.5*(this.adjustedHeight)+this.counter+1);
        //console.log(mouseX,mouseY);
        fill(color);
        noStroke();
        rect(this.xPos+0.5*(this.adjustedWidth)-number,
          this.yPos-0.5*(this.adjustedHeight)+this.counter,number,1);
        this.counter+=1;
      }
    }
  }
  edibleImage.img.loadPixels();


  background(247,201,141,10);

  // image
  imageMode(CENTER);
  image(edibleImage.img,width/4,height/2,edibleImage.img.width/10,edibleImage.img.height/10);
  edibleImage.linearize(map(mouseX,0,width,200,0));


  // effect filter
  let frq = constrain (map(mouseX,0,width,50,20000),50,24000);
  lowPass.freq(frq);
  let wetness = map(mouseY,0,height,0,1);
  reverb.drywet(wetness);

  // effect reverb;




  // audio visualization
  spectrum = fft.analyze(1024);
  for(var i = 0; i <spectrum.length;i++){
    push();
    noStroke();
    fill(255);
    rectMode(CENTER);
    translate(3*width/4,height/2);
    rotate((PI/2)+i*(PI)/spectrum.length);
    let length = map(spectrum[i],0,150,10,40);
    rect(0,-80,0.5,length);
    pop();
  }
  for(var i = 0; i <spectrum.length;i++){
    push();
    noStroke();
    fill(255);
    rectMode(CENTER);
    translate(3*width/4,height/2);
    rotate((PI/2)-(i+1)*(PI)/spectrum.length);
    let length = map(spectrum[i],0,150,10,40);
    rect(0,-80,0.5,length);
    pop();
  }
}
