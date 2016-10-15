onload = function() {
  draw(document.getElementById('txt').value);
};

var WIDTH=42;
var VSPACE=100;

function draw(txt) {
	var canvas = document.getElementById('c1');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var ctx = canvas.getContext('2d');
  try{
	ctx.clearRect(0,0,10000,10000)
	var arr = txt.split("\n");
	for(var i=0; i<arr.length; i++) {
		writeLine2(ctx,arr[i],0,i) 
	}
	setTimeout(function(){dequeue(ctx);},250);
  }catch(e){
	alert(e);
  }
}



function writeLine2(ctx, str, m,n)
{
	writeLine(ctx, split_into_syllables(str), m,n);
}

function writeLine(ctx, array, m, n)
{
	for(var i=0; i<array.length; i++) {
		output_syllable(ctx, array[i], m+i,n);
	}
}

var QUEUE = [];

function make_image(ctx,chr,x,y)
{
	if(chr === "_") chr = "space";
	if(chr === ".") chr = "denpa";
	var img = new Image();
	img.src = "img/" + chr + ".png";
	QUEUE[QUEUE.length] = [img, x, y];
}

function dequeue(ctx)
{
	for(var i=0; i<QUEUE.length; i++){
		var obj = QUEUE[i];
		ctx.drawImage(obj[0],obj[1],obj[2]);
	}
	QUEUE = [];
}

function output_syllable(ctx, str, m,n)
{
	make_image(ctx,str.charAt(0), 30+WIDTH*m, 30+VSPACE*n);
	if(str.length >= 2) {
		var vowel = str.slice(1);
	
		if(["a","e","i","o","u","y","ai","ei","oi","au"].indexOf(vowel) !== -1) {
			make_image(ctx,vowel, 30+WIDTH*m, 30+VSPACE*n);
		} else {
			throw new Error("Unrecognized vowel sequence \""+vowel+"\"");
		}
	}
}
