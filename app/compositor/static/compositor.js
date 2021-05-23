
var music = document.getElementById('music');
music.playbackRate = 0.2;
var clockInterval;

// function singing(lineNo, segment){
// 	// lines[lineNo].classList.add('sing');
//   let line = lines[lineNo];
//   let duration = conductor[lineNo][segment][1]
//   let segNo = conductor[lineNo].length
//   // let computed = window.getComputedStyle(line)
//   line.style.transition = `background-position ${duration}ms linear`;
//   backPos = 100 - conductor[lineNo][segment][0]
//   line.style.backgroundPosition =  `${backPos}% 0`;
// 	console.log('lineNo, l, duration', lineNo, l, duration);
// 	console.log('singing', lines[lineNo]);
//   if (segment + 1 < segNo){
// 		setTimeout(function(){
// 			singing(lineNo, segment + 1)
// 		}, duration);
// 	}
// 	if (lineNo + 1 < l){
// 		setTimeout(function(){
// 			singing(lineNo + 1, 0)
// 		}, duration);
// 	}
// }

function clock(){
  document.getElementById('clock').innerText = music.currentTime;
}


var conductor = [
]

var text = [
  "Lately, I've been, I've been losing sleep",
  "But baby, I've been, I've been praying hard"
]

function spell(char, line){
  let pos = (100 * (char+1)) / text[line].length;
  console.log('spell pos', char, pos);
  console.log('paused', music.paused)
  if(!music.paused){
    conductor[line].push([pos, music.currentTime]);
    console.log(conductor);
  }
}

for(i=0;i<text.length;i++){
  let d = document.createElement('div');
  d.id = `l${i}`;
  d.classList.add('line');
  document.getElementById('workdesk').append(d);
  conductor.push([]);
  for(j=0;j<text[i].length;j++){
    let char = document.createElement('div');
    char.innerText = text[i][j];
    char.id =`c${j}`
    char.classList.add('char');
    char.onclick = function(){
      char.classList.add('clicked');
      spell(parseInt(this.id.slice(1)), parseInt(this.parentElement.id.slice(1)));
    }
    d.append(char);
  }
}

music.onplay = function(){
  //singing(0, 0);
  console.log('Playing');
  clockInterval = setInterval(clock, 100);
}
