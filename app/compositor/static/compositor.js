
var music = document.getElementById('music');
music.playbackRate = 0.2;
var composing = false;
var clockInterval;
var text;
var conductor = [];
var tuneId;
console.log(tune);


function clock(){
  document.getElementById('clock').innerText = music.currentTime;
}


function spell(char, line){
  let pos = (100 * (char+1)) / text[line].length;
  console.log('spell pos', char, line);
  console.log('paused', music.paused)
  conductor[line].push([pos, music.currentTime]);
}

function prepareWorkdesk(lyrics){
  text = lyrics.split("\n")
  console.log('ltext', text);
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
      char.onmouseleave = function(){
        if(composing){
          char.classList.add('clicked');
          spell(parseInt(this.id.slice(1)), parseInt(this.parentElement.id.slice(1)));
        }  
      }
      d.append(char);
    }
  }
}

function disclose(node){
  var temp = document.getElementById(node);
  var dis = getComputedStyle(temp).display;
  var all = document.getElementsByClassName('pop')
  for(i=0;i<all.length; i++){
    if(getComputedStyle(all[i]).display){
      all[i].style.display = 'none';
    }
  }
  if(dis == 'none'){
    temp.style.display = 'flex';
  }
}

function subSong(){
  let name = document.getElementById('name').value;
  let audio = document.getElementById('audio').value;
  let lyrics = document.getElementById('lyrics').value;
  console.log('song', name, audio, lyrics)
  let msg = {'name': name, 'audio': audio, 'lyrics': lyrics }
  fetchPost('/compositor/create', msg).then(function(res){
    console.log('res', res);
  })
}

function findSong(){
  let songId = document.getElementById('songId').value;
  let msg = {'id': songId};
  console.log('msg', msg);
  fetchPost('/compositor/get', msg).then(function(res){
    console.log('res', res);
    if(res.lyrics){
      prepareWorkdesk(res.lyrics);
      document.getElementById('editS').style.display = 'none';
      tuneId = res.id;
      console.log('tune Id', tuneId)
    }   
  })
}

function send(){
  let msg = {'id': tuneId, 'conductor': conductor};
  console.log('msg', msg);
  fetchPost('/compositor/get', msg).then(function(res){
    console.log('res', res);
    if(res.cause){
      let txt = `args => ${res.args} \n couse => ${res.cause} \n traceback => ${res.traceback}`
      alert(txt);
    }   
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

document.addEventListener('keydown', startWork);

function startWork(e) {
  if(e.code == 'KeyR'){
    if(composing){
      composing = false;
      console.log('conductor', conductor);
      music.pause();
    } else{
      composing = true;
      music.play();
    }
  }
}

music.onplay = function(){
  //singing(0, 0);
  console.log('Playing');
  clockInterval = setInterval(clock, 100);
}

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

