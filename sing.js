
var lines = document.getElementById('song').children;
var l = lines.length;
var music = document.getElementById('music');
music.playbackRate = 0.2;
console.log('lines', lines);



function singing(lineNo, segment){
	// lines[lineNo].classList.add('sing');
  let line = lines[lineNo];
  let duration = conductor[lineNo][segment][1]
  let segNo = conductor[lineNo].length
  // let computed = window.getComputedStyle(line)
  line.style.transition = `background-position ${duration}ms linear`;
  backPos = 100 - conductor[lineNo][segment][0]
  line.style.backgroundPosition =  `${backPos}% 0`;
	console.log('lineNo, l, duration', lineNo, l, duration);
	console.log('singing', lines[lineNo]);
  if (segment + 1 < segNo){
		setTimeout(function(){
			singing(lineNo, segment + 1)
		}, duration);
	}
	if (lineNo + 1 < l){
		setTimeout(function(){
			singing(lineNo + 1, 0)
		}, duration);
	}
}


var conductor = [
  [[100, 20]],
  [[100, 4980]],
  [[20, 2000],[60, 200],[100, 800]]
]

var text = [
  "Lately, I've been, I've been losing sleep",
  "But baby, I've been, I've been praying hard"
]

music.onplay = function(){
  singing(0, 0);
}
