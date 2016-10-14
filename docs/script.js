onload = function() {
  draw();
};

var WIDTH=42;
var VSPACE=100;

function draw() {
  var canvas = document.getElementById('c1');
  if ( ! canvas || ! canvas.getContext ) { return false; }
  var ctx = canvas.getContext('2d');
  output_syllable(ctx, "bi", 0,0);
  output_syllable(ctx, "r",  1,0);
  output_syllable(ctx, "ti", 2,0);
  output_syllable(ctx, "_",  3,0);
  output_syllable(ctx, "lo", 4,0);
  output_syllable(ctx, "l",  5,0);
  output_syllable(ctx, "di", 6,0);
  output_syllable(ctx, "_",  7,0);
 
  output_syllable(ctx, "b",  0,1);
  output_syllable(ctx, "c",  1,1);
  output_syllable(ctx, "d",  2,1);
  output_syllable(ctx, "f",  3,1);
  output_syllable(ctx, "g",  4,1);
  output_syllable(ctx, "j",  5,1);
  output_syllable(ctx, "k",  6,1);
  output_syllable(ctx, "l",  7,1);
  output_syllable(ctx, "m",  8,1);
  output_syllable(ctx, "n",  9,1);
  output_syllable(ctx, "p", 10,1);
  output_syllable(ctx, "r", 11,1);
  output_syllable(ctx, "s", 12,1);
  output_syllable(ctx, "t", 13,1);
  output_syllable(ctx, "v", 14,1);
  output_syllable(ctx, "x", 15,1);
  output_syllable(ctx, "z", 16,1);

}

function output_syllable(ctx, str, m,n)
{
	for(var i=0; i<str.length; i++) {
		make_image(ctx,str.charAt(i), 30+WIDTH*m, 30+VSPACE*n);
	}
}

function make_image(ctx,chr,x,y)
{
	var img = new Image();
	img.src = "../" + chr + ".png?" + Math.random();
	img.onload = function() {
		ctx.drawImage(img, x, y);
	}	
}
