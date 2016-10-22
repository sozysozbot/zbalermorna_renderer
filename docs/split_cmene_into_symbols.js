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
