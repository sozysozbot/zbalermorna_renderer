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
	str = str.replace(/['’]/g,"h");
	var arr = [];
	while(str.length){
		if(str.charAt(0) === " "){ 
			str = str.slice(1); 
			arr[arr.length] = "_";
			continue;
		}
		if("aeiouy".indexOf(str.charAt(0)) !== -1) {
			str = "." + str;
			continue;
		}
		
		var syl = str.match(/^[bcdfghjklmnprstvxz.][aeiouy]*/);
		if(syl){
			str = str.slice(syl[0].length);
			arr[arr.length] = syl[0];
			continue;
		} else {
			str = str.slice(1); //failed to parse a character; thus overlooks it
			if(arr[arr.length-1] !== "_" && str.charAt(0) !== " ") { // "a*b" -> "a b"; "a* b" -> "a b"
				arr[arr.length] = "_";
			}
			continue;
		}
		
	}
	writeLine(ctx, arr, m,n);
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
	for(var i=0; i<str.length; i++) {
		make_image(ctx,str.charAt(i), 30+WIDTH*m, 30+VSPACE*n);
	}
}
