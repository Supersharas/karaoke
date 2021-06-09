
var music = document.getElementById('music');
music.playbackRate = 0.2;
var clockInterval;

var songOpen = false;

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
  "Dreaming about the things that we could be",
  "But baby, I've been, I've been praying hard",
  "Said no more counting dollars",
  "We'll be counting stars",
  "Yeah, we'll be counting stars",
  "I see this life, like a swinging vine",
  "Swing my heart across the line",
  "And in my face is flashing signs",
  "Seek it out and ye shall find",
  "Old, but I'm not that old",
  "Young, but I'm not that bold",
  "And I don't think the world is sold",
  "On just doing what we're told",
  "I feel something so right",
  "Doing the wrong thing",
  "And I feel something so wrong",
  "Doing the right thing",
  "I couldn't lie, couldn't lie, couldn't lie",
  "Everything that kills me makes me feel alive"
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


function openSong(){
  if(songOpen){
    document.getElementById('newSong').style.display = 'none';
    songOpen = false;
  } else{
    document.getElementById('newSong').style.display = 'flex';
    songOpen = true;
  }
}

function subSong(){
  var name = document.getElementById('name').value;
  var audio = document.getElementById('audio').value;
  var lyrics = document.getElementById('lyrics').value;
  console.log('song', name, audio, lyrics)
  var msg ={'name': name, 'audio': audio, 'lyrics': lyrics }
  fetchPost('/compositor/create', msg).then(function(res){
    console.log('res', res);
  })
}

function fetchPost(address, message){
  return fetch(address,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(message)
  }).then(response => response.json()).then(function(response){
    return response;
  }).catch(function(error){
  	console.log(error);
  })
}
