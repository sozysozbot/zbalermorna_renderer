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
		writeLine2(arr[i],0,i) 
	}
	dequeue(ctx);
  }catch(e){
	alert(e);
  }
}

function writeLine2(str, m,n)
{
	var array = split_into_syllables(str);
	for(var i=0; i<array.length; i++) {
		output_syllable(array[i], m+i,n);
	}
}

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

function output_syllable(str, m,n)
{
	make_image(str.charAt(0), 30+WIDTH*m, 30+VSPACE*n);
	if(str.length >= 2) {
		var vowel = str.slice(1);
	
		if(["a","e","i","o","u","y","ai","ei","oi","au"].indexOf(vowel) !== -1) {
			make_image(vowel, 30+WIDTH*m, 30+VSPACE*n);
		} else {
			throw new Error("Unrecognized vowel sequence \""+vowel+"\"");
		}
	}
}
