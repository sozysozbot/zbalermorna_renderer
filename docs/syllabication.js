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
			if(ans[ans.length - 1] && ans[ans.length - 1].fadni != null) {
				ans[ans.length - 1].fadni += str.slice(0,str.indexOf("."));
			} else {
				ans[ans.length] = {"fadni": str.slice(0,str.indexOf("."))};
			}
			
			str = str.slice(str.indexOf("."));
			var match = str.match(/^\.\s*[abcdefghijklmnopqrstuvwxyz,]*[bcdfghjklmnprstvxz]\s*\./);
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
		if(ans[ans.length - 1] && ans[ans.length - 1].fadni != null) {
			ans[ans.length - 1].fadni += str;
		} else {
			ans[ans.length] = {"fadni": str};
		}
		
		
		// remove initial period
		ans = ans.map(function(obj){
			if(obj.fadni != null && obj.fadni.charAt(0) === ".") {
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
	str = str.replace(/['’]/g,"h");
	str = str.replace(/ĭ/g,"q");
	str = str.replace(/ŭ/g,"w");
	var cmene_split = identify_cmene(str);
	var arr = [];
	
	for(var i=0; i < cmene_split.length; i++) {
		if(cmene_split[i].fadni != null) { //fadni
			arr = arr.concat(split_fadni_into_syllables(cmene_split[i].fadni));
		} else {
			arr = arr.concat(split_cmene_into_symbols(cmene_split[i].cmene));
		}
	}
	return arr;
}


/* 
	conforms to BPFK Decision "ban on semivowels preceded by a consonant"
	thus: 
		tciuauas = tci,ŭa,ŭas -> ["t","c","i","w","a","w","a","s"]
		tciauas = tci,au,as -> ["t","c","i","au","a","s"]
		iauas = ĭa,ŭas -> ["q","a","w","a","s"]
		nuiok = nu,ĭok -> ["n","u","q","o","k"]
	note:
		meiin -> ["m","ei","i","n"]
		me,iin -> ["m","e","q","i","n"]
*/
function split_cmene_into_symbols(str)
{
	var match = str.match(/[abcdefghijklmnopqrstuvwxyz,]*[bcdfghjklmnprstvxz]/);
	if(!match) {
		throw new Error("BUG!");
	}
	var cmene = match[0];
	
	var arr2 = [];
	var str = cmene;
	while(str.length) {
		if("bcdfghjklmnprstvxz".split("").indexOf(str.charAt(0)) !== -1) { //consonant
			arr2[arr2.length] = str.charAt(0);
			//falling diphthongs -> parse
			if(["au","ai","ei","oi"].indexOf(str.slice(1,3)) !== -1) {
				arr2[arr2.length] = str.slice(1,3) + "_sepli";
				str = str.slice(3);
				continue;
			} else if(["a","e","i","o","u","y"].indexOf(str.charAt(1)) !== -1) {
				arr2[arr2.length] = str.charAt(1) + "_sepli";
				str = str.slice(2);
				continue;
			} else {
				str = str.slice(1);
				continue;
			}
		} else if(str.charAt(0) === ",") { //serves as a mere splitter
			str = str.slice(1);
			continue;
		} else { //vowel-syllable; allows iV and uV
			if(["au","ai","ei","oi"].indexOf(str.slice(0,2)) !== -1) {
				arr2[arr2.length] = str.slice(0,2) + "_sepli";
				str = str.slice(2);
				continue;
			} else if(["i","u","q","w"].indexOf(str.charAt(0)) !== -1   // iai -> qai; iaia -> qaqa
				   && ["ai","ei","oi","au"].indexOf(str.slice(1,3)) !== -1
				   && ["a","e","i","o","u","y"].indexOf(str.charAt(3)) === -1) {
				arr2[arr2.length] = {"i":"q","q":"q","u":"w","w":"w"}[str.charAt(0)];
				arr2[arr2.length] = str.slice(1,3) + "_sepli";
				str = str.slice(3);
				continue;
			} else if(["i","u","q","w"].indexOf(str.charAt(0)) !== -1
				   && ["a","e","i","o","u","y"].indexOf(str.charAt(1)) !== -1) {
				arr2[arr2.length] = {"i":"q","q":"q","u":"w","w":"w"}[str.charAt(0)];
				arr2[arr2.length] = str.charAt(1) + "_sepli";
				str = str.slice(2);
				continue;
			} else {
				arr2[arr2.length] = str.charAt(0) + "_sepli";
				str = str.slice(1);
				continue;
			}
		}
	}
	return arr2;
}
