
/** pre-loading **/
var IMGS = {};
var LOADED = {};
var USE_CAS = true; // attitudinal shorthand

function load_all_imgs()
{
	var list = ["a","a_sepli","ai","ai_sepli","au","au_sepli","b","c","cnimaho","d","denpa","denpa_pimu","e","e_sepli","ei","ei_sepli","f","g","h","h_pimu","i","i_sepli","j","k","l","m","n","o","o_sepli","oi","oi_sepli","p","q","r","s","t","u","u_sepli","v","w","x","y","y_sepli","z","canlu"];
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
	document.getElementById('txt').focus();
	draw(document.getElementById('txt').value);
	
	document.getElementById('txt').addEventListener('keyup', function() {
		if(timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		timeout = setTimeout(function(){
			draw(document.getElementById('txt').value);
		},150);
	}, false);
};


/** queue **/
var QUEUE = [];

function make_image(chr,x,y)
{
	if(chr === "_") chr = "canlu";
	if(chr === ".") chr = "denpa_pimu";
	if(chr === "h") chr = "h_pimu";
	QUEUE[QUEUE.length] = [IMGS[chr], x, y];
	if(!IMGS[chr]) throw new Error("bug: "+ chr + " is not known")
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
	var array = split_into_bases(str);
	var pos = 25;
	for(var i=0; i<array.length; i++) {
		if(USE_CAS 
		&& array[i].charAt(0) === "." 
		&& array[i].length > 1
		&& array[i+1]
		&& array[i+1].length > 1
		&& array[i+1].charAt(0) === "h" 
		) { // attitudinal shorthand
			pos = output_CAS(array[i], array[i+1], pos, n);
			i++;
		} else {
			pos = output_syllable(array[i], pos, n);
		}
	}
}

function output_CAS(syl1, syl2, x_pos, n)
{
	var vow1 = syl1.slice(1);
	var vow2 = syl2.slice(1);
	reject_unknown_diphthongs(vow1);
	reject_unknown_diphthongs(vow2);
	
	make_image("cnimaho", x_pos, 30+VSPACE*n);
	make_image(vow1, x_pos - WIDTH/4, 30+VSPACE*n);
	make_image(vow2, x_pos + WIDTH/4, 30+VSPACE*n);
	
	return x_pos + WIDTH; // next x_pos
}

function output_syllable(str, x_pos,n)
{
	if(str.indexOf("_sepli") + 1) {
		make_image(str, x_pos, 30+VSPACE*n);
		return x_pos + WIDTH;
	}
	
	var conson = str.charAt(0);
	var half = (conson === "." || conson === "h");
	make_image(conson, x_pos, 30+VSPACE*n);
	if(str.length >= 2) {
		var vowel = str.slice(1);
		reject_unknown_diphthongs(vowel)
		if(half) {
			make_image(vowel, x_pos - WIDTH/4, 30+VSPACE*n);
		} else {
			make_image(vowel, x_pos, 30+VSPACE*n);
		}
	}
	return x_pos + (half ? WIDTH/2 : WIDTH); // next x_pos
}

function reject_unknown_diphthongs(vowel)
{
	if(["a","e","i","o","u","y","ai","ei","oi","au"].indexOf(vowel) === -1) {
		throw new Error("Unrecognized vowel sequence \""+vowel+"\"");
	}
}
