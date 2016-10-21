var REQUIRE_DOTSIDE = true;


// identify cmene and mark it as such
/*

identify_cmene("la.kocon.ctuca la .  soran . .ui fo la .lojban .u'i")
[{"fadni":"la"},
 {"cmene":".kocon."},
 {"fadni":"ctuca la "},
 {"cmene":".  soran ."},
 {"fadni":" .ui fo la "},
 {"cmene":".lojban ."},
 {"fadni":"u'i"}
]

identify_cmene(".i .ui.ui.ui.ui. tadni fe la .lojban. fa mi")
[{"fadni":"i .ui.ui.ui.ui. tadni fe la "},
 {"cmene":".lojban."},
 {"fadni":" fa mi"}
]

*/

function identify_cmene(str)
{
	var ans = [];
	if(!REQUIRE_DOTSIDE) {
		/* FIXME */
	} else {
		//loops are required to handle something like ".loj.ban."
		//detect cmene
		while(str.indexOf(".") + 1) { //after finding a period
			// merge normal texts if preceded by normal texts
			if(ans[ans.length - 1] && ans[ans.length - 1].fadni) {
				ans[ans.length - 1].fadni += str.slice(0,str.indexOf("."));
			} else {
				ans[ans.length] = {"fadni": str.slice(0,str.indexOf("."))};
			}
			
			str = str.slice(str.indexOf("."));
			var match = str.match(/^\.\s*[abcdefghijklmnopqrstuvwxyz]*[bcdfghjklmnprstvxz]\s*\./);
			if(!match){
				str = str.slice(1); //skip the period
				ans[ans.length - 1].fadni += ".";
				continue;
			} else {
				ans[ans.length] = {"cmene": match[0]};
				str = str.slice(match[0].length - 1); //leave the period
			}
		}
		
		// str still might have unprocessed fadni
		if(ans[ans.length - 1] && ans[ans.length - 1].fadni) {
			ans[ans.length - 1].fadni += str;
		} else {
			ans[ans.length] = {"fadni": str};
		}
		
		
		// remove initial period
		ans = ans.map(function(obj){
			if(obj.fadni && obj.fadni.charAt(0) === ".") {
				obj.fadni = obj.fadni.slice(1);
			}
			return obj;
		});
	}
	
	return ans;
}

// main parser

function split_into_bases(str)
{
	var cmene_split = identify_cmene(str);
	var arr = [];
	
	for(var i=0; i < cmene_split.length; i++) {
		if(cmene_split[i].fadni) { //fadni
			arr = arr.concat(split_into_syllables(cmene_split[i].fadni));
		} else {
			throw new Error("FIXME!");
		}
	}
	return arr;
}

function split_into_syllables(str)
{
	str = str.replace(/['’]/g,"h");
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
