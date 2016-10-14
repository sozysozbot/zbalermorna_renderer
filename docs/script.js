onload = function() {
  draw();
};

var WIDTH=42;
var VSPACE=100;

function draw() {
  var canvas = document.getElementById('c1');
  if ( ! canvas || ! canvas.getContext ) { return false; }
  var ctx = canvas.getContext('2d');
  writeLine(ctx,"bi,r,ti,_,lo,l,di,_".split(","),0,0)
  writeLine(ctx,"b,c,d,f,g,j,k,l,m,n,p,r,s,t,v,x,z".split(","),0,1)
  writeLine(ctx,"xa,g,ji".split(","),0,2)
}

function output_syllable(ctx, str, m,n)
{
	for(var i=0; i<str.length; i++) {
		make_image(ctx,str.charAt(i), 30+WIDTH*m, 30+VSPACE*n);
	}
}

function writeLine(ctx, array, m, n)
{
	for(var i=0; i<array.length; i++) {
		output_syllable(ctx, array[i], m+i,n);
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
