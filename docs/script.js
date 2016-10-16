
/** pre-loading **/
var IMGS = {};
var LOADED = {};

function load_all_imgs()
{
	var list = ["a","ai","au","b","c","d","denpa","e","ei","f","g","h","i","j","k","l","m","n","o","oi","p","q","r","s","t","u","v","w","x","y","z","space"];
	for(var i=0; i<list.length; i++) {
		LOADED[list[i]] = false;
	}
	for(var i=0; i<list.length; i++) {
		var img = new Image();
		IMGS[list[i]] = img;
		img.src = "img/" + list[i] + ".png";
		img.onload = function(){
			LOADED[list[i]] = true;
		};
	}
}

load_all_imgs();

var timeout;
onload = function() {
	draw(document.getElementById('txt').value);
	document.getElementById('txt').addEventListener('keypress', function() {
	if(timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
	timeout = setTimeout(function(){
		draw(document.getElementById('txt').value);
	},150);
	
	}, false)
};


/** queue **/
var QUEUE = [];

function make_image(chr,x,y)
{
	if(chr === "_") chr = "space";
	if(chr === ".") chr = "denpa";
	QUEUE[QUEUE.length] = [IMGS[chr], x, y];
}

function dequeue(ctx)
{
	for(var i=0; i<QUEUE.length; i++){
		var obj = QUEUE[i];
		ctx.drawImage(obj[0],obj[1],obj[2]);
	}
	QUEUE = [];
}


/** draw **/
var WIDTH = 42;
var VSPACE = 100;

function draw(txt) {
	var canvas = document.getElementById('c1');

  try{
	if (!canvas || !canvas.getContext) {
		throw new Error("Sorry, this browser does not support canvas. Use a newer browser.");
	}
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,10000,10000)
	var arr = txt.split("\n");
	for(var i=0; i<arr.length; i++) {
		writeLine2(arr[i],i) 
	}
	dequeue(ctx);
  }catch(e){
	alert(e);
  }
}

function writeLine2(str, n)
{
	var array = split_into_syllables(str);
	var pos = 25;
	for(var i=0; i<array.length; i++) {
		pos = output_syllable(array[i], pos, n);
	}
}

function output_syllable(str, x_pos,n)
{
	make_image(str.charAt(0), x_pos, 30+VSPACE*n);
	if(str.length >= 2) {
		var vowel = str.slice(1);
	
		if(["a","e","i","o","u","y","ai","ei","oi","au"].indexOf(vowel) !== -1) {
			make_image(vowel, x_pos, 30+VSPACE*n);
		} else {
			throw new Error("Unrecognized vowel sequence \""+vowel+"\"");
		}
	}
	return x_pos + WIDTH; // next x_pos
}
