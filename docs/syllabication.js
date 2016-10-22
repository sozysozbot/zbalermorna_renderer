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
			var split = split_fadni_into_syllables(cmene_split[i].fadni);
			
			//insert space after cmene
			if(cmene_split[i-1]
			&& cmene_split[i-1].cmene != null
			&& split[0]
			&& split[0] !== "_") {
				arr[arr.length] = "_";
			}
			
			arr = arr.concat(split);
		} else {
			//insert pause before cmene
			if(arr[arr.length-1] != null && arr[arr.length-1] !== "_") {
				arr[arr.length] = "_";
			}
			arr = arr.concat(split_cmene_into_symbols(cmene_split[i].cmene));
		}
	}
	return arr;
}

