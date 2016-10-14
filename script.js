onload = function() {
  draw();
};

var WIDTH=42;

function draw() {
  var canvas = document.getElementById('c1');
  if ( ! canvas || ! canvas.getContext ) { return false; }
  var ctx = canvas.getContext('2d');
  make_image(ctx,"b", 30,30);
  make_image(ctx,"i", 30,30);
  make_image(ctx,"r", 30+WIDTH,30);
  make_image(ctx,"t", 30+WIDTH*2,30);
  make_image(ctx,"i", 30+WIDTH*2,30);

}

function make_image(ctx,chr,x,y)
{
	var img = new Image();
	img.src = chr + ".png?" + Math.random();
	img.onload = function() {
		ctx.drawImage(img, x, y);
	}	
}
