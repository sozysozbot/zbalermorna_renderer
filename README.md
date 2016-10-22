# zbalermorna_renderer

A simple, on-browser renderer of [zbalermorna](https://mw.lojban.org/images/b/b3/ZLM4_Writeup_v2.pdf), a diacritic orthography for Lojban.  
Just access https://sozysozbot.github.io/zbalermorna_renderer/renderer.htm to try it out.  
Uses `canvas`; thus, it might not work well with old browsers.  
Conforms to BPFK Decision "ban on semivowels preceded by a consonant" when parsing cmevla

## Major changes
2016/10/22 Implement full vowels; can now handle cmevla (also allow slaka bu inside cmevla) 
2016/10/17 Implement attitudinal shorthand  
2016/10/17 Make `.` and `'` half the width of other consonants  
2016/10/16 Now with faster rendering & automatic output  
2016/10/15 Can now handle diphthongs and semivowels  

## To do
1. Silence, stretch & intonation
2. Dynamics (stress dots)
3. slaka bu inside brivla (allowed, at least in CLL)

## What you can contribute
1. Think up of a good lojban phrase for "attitudinal shorthand"
2. Think up of a good lojban word for "renderer"
3. Use & suggest improvements
