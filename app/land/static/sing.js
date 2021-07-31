
var is_singing = false;

var music = document.getElementById('music');
//music.playbackRate = 0.2;

function sing(e){
  let msg = {'id': e.id};
  fetchPost('/get_song', msg).then(function(res){
    if(res.lyrics){
      console.log('res', res);
      tune = res;
      let cons = tune.conductor.split('*');
      tune.conductor = [];
      var x = 0;
      var temp_list = [];
      cons.forEach(function(e){
        let line = e.split('+');
        line.forEach(function(f){
          if(f != ''){
            temp_list.push(f.split(','));
          }   
        })
        tune.conductor.push(temp_list);
        temp_list = []
        x++;     
      })
      console.log('tuneconductor', tune.conductor);
      prepareWorkdesk(tune);
    }   
  })
}

function prepareWorkdesk(tune){
  var text = tune.lyrics.split("\n")
  for(i=0;i<text.length;i++){
    let holder = document.createElement('div');
    let d = document.createElement('div');
    d.id = `l${i}`;
    d.classList.add('line');
    d.innerText = text[i];
    holder.append(d);
    document.getElementById('tune').append(holder);
  }
  //singing(0,0);
}

function singing(lineNo, segment){
  var line = document.getElementById(`l${lineNo}`);
  if(segment > 0){
    var duration = (tune.conductor[lineNo][segment][1] - (music.currentTime + 0.5)) * 1000;
    console.log('dyration', duration);
  } else{
    var duration = 0;
  }
  let segNo = tune.conductor[lineNo].length;
  line.style.transition = `background-position ${duration}ms linear`;
  if(tune.conductor[lineNo][segment]){
    backPos = (100 - tune.conductor[lineNo][segment][0]);
  } else{
    backPos = 0;
    console.log('line-duration', line, duration);
    insertClock(line, duration);
  }
  line.style.backgroundPosition =  `${backPos}% 0`;
  if (segment + 1 < segNo){
    if(is_singing){
      setTimeout(function(){
        singing(lineNo, segment + 1)
      }, duration);
    }
  } else if (lineNo + 1 < tune.conductor.length){
    if(is_singing){
      setTimeout(function(){
        singing(lineNo + 1, 0)
      }, duration);
    }
  }
}

function insertClock(line, duration){
  console.log('line, duration');
  var clock = document.getElementById('clock');
  clock.innerText = duration.toString();
  line.append(clock);
}

music.onplay = function(){
  is_singing = true;
  if(music.currentTime > 0){
    console.log('not fresh');
    let pos = findPos();
    console.log('pos', pos);
    singing(pos[0], pos[1]);
  } else{
    singing(0, 0);
  }  
}

music.onpause = () => is_singing = false;

music.onseeking = function(){
  findPos();
}

function findPos(){
  var pos;
  let t = music.currentTime;
  for (let i = 0; i < tune.conductor.length; i++){
    if(tune.conductor[i].length > 0){
      if(parseFloat(tune.conductor[i][tune.conductor[i].length -1][1]) > t){
        for(let j = 0; j < tune.conductor[i].length; j++){
          if(tune.conductor[i][j][1] > t){
            pos = [i, j];
            break;
          }
        }
        break;
      }
    }
  }
  for (let i=0; i<tune.conductor.length; i++){
    let line = document.getElementById(`l${i}`);
    if(i < pos[0]){
      line.style.backgroundPosition =  '0%'; 
    } else if(i == pos[0]){
      let backPos = (100 - tune.conductor[pos[0]][pos[1]][0]);
      line.style.backgroundPosition =  `${backPos}% 0`;
    } else if(i > pos[0]){
      line.style.backgroundPosition =  '100%';
    }
  }
  return pos;
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