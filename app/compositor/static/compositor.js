
var music = document.getElementById('music');
music.playbackRate = 0.12;
var composing = false;
var clockInterval;
var tune = {};

window.onload = function(){
  if(typeof song !== 'undefined'){
    tune = song;
    if(!tune.conductor){
      tune.conductor = [];
    } else{
      tune.conductor = tune.conductor.split('*');
    }
    console.log('preparing, song', song);
    prepareWorkdesk(tune);
  }
}

function clock(){
  document.getElementById('clock').innerText = music.currentTime;
}

function spell(char, line){
  var text = tune.lyrics.split("\n")
  let pos = (100 * (char+1)) / text[line].length;
  if(typeof tune.conductor[line] == 'undefined'){
    tune.conductor[line] = '';
  }
  console.log(line);
  console.log('line', tune.conductor[line]);
  console.log(typeof tune.conductor[line]);
  tune.conductor[line] += '+' + ([pos.toFixed(2), music.currentTime.toFixed(2)]);
  console.log(tune.conductor);
}

function prepareWorkdesk(tune){
  document.getElementById('workdesk').innerText = '';
  var text = tune.lyrics.split("\n")
  for(i=0;i<text.length;i++){
    let d = document.createElement('div');
    d.id = `l${i}`;
    d.classList.add('line');
    document.getElementById('workdesk').append(d);
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
    if(tune.conductor[i]){
      d.classList.add('composed');
      let b = document.createElement('button');
      b.innerText = 'del';
      b.onclick = deleteLine;
      d.append(b);
      d.classList.add('clicked');
    }
  }
}

function deleteLine(e){
  console.log(e.target.parentElement.id);
  let n = e.target.parentElement.id.slice(1);
  tune.conductor[n] = '';
  prepareWorkdesk(tune);
}

document.addEventListener('keydown', startWork);

function startWork(e) {
  if(e.code == 'KeyW'){
    if(composing){
      composing = false;
      music.pause();
    } else{
      composing = true;
      music.play();
    }
  }
}

music.onplay = function(){
  console.log('Playing');
  clockInterval = setInterval(clock, 100);
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
      tune = res;
      console.log('tune', tune);
      prepareWorkdesk(tune);
      document.getElementById('editS').style.display = 'none';
    }   
  })
}

function send(){
  if(typeof tune.conductor !== 'string'){
    tune.conductor = tune.conductor.join('*');
  }
  tune.title = 'I dont cnow';
  let msg = {'id': tune.id, 'update': tune};
  console.log('msg', msg);
  fetchPost('/compositor/conduct', msg).then(function(res){
    console.log('res', res);
    if(res.cause){
      let txt = `args => ${res.args} \n couse => ${res.cause} \n traceback => ${res.traceback}`
      alert(txt);
    } else if(res.song_id){
      window.open(`rehersal/${res.song_id}`);
    }
  })
}

function reherse(){
  window.open(`rehersal/${tune.id}`);
}

function fetchPost(address, message){
  return fetch(address,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  }).then(response => response.json()).then(function(response){
    return response;
  }).catch(function(error){
  	console.log(error);
  })
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


