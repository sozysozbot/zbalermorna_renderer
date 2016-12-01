function split_fadni_into_syllables(str)
{
	var arr = [];
	while(str.length){
		if(str.charAt(0) === " "){ 
			str = str.slice(1); 
			arr[arr.length] = "_";
			continue;
		}
		
		// "ia" -> "qa"
		if(str.length > 1 && "iu".indexOf(str.charAt(0)) !== -1 && "aeiouy".indexOf(str.charAt(1)) !== -1) { 
			var semivowel = str.charAt(0) === "i" ? "q" : "w";
			str = semivowel + str.slice(1);
			continue;
		}
		
		// ".ia" -> "qa"
		if(str.length > 2 && str.charAt(0) === "." && "iu".indexOf(str.charAt(1)) !== -1 && "aeiouy".indexOf(str.charAt(2)) !== -1) {
			var semivowel = str.charAt(1) === "i" ? "q" : "w";
			str = semivowel + str.slice(2);
			continue;
		}
		
		// "irci" -> ".irci"
		if("aeiouy".indexOf(str.charAt(0)) !== -1) {
			str = "." + str;
			continue;
		}
		
		var syl = str.match(/^[bcdfghjklmnpqrstvwxz.][aeiouy]*/);
		if(syl){
			str = str.slice(syl[0].length);
			arr[arr.length] = syl[0];
			continue;
		} else if(str.charAt(0) === ",") { // slaka bu
			str = str.slice(1); //just ignore and continue
			continue;
		} else {
			str = str.slice(1); //failed to parse a character; thus overlooks it
			if(arr[arr.length-1] !== "_" && str.charAt(0) !== " ") { // "a*b" -> "a b"; "a* b" -> "a b"
				arr[arr.length] = "_";
			}
			continue;
		}
		
	}
	return arr;
}
