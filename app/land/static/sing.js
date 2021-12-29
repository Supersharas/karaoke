
var is_singing = false;

var lineHeight;
var topHeight = 0;
const delay = 0.2
var allLines = document.getElementsByClassName('line');

var music = document.getElementById('music');


// << Retreves the song and decodes conductor >>
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

// << Renders song text and lifts first line >>
function prepareWorkdesk(tune){
  var text = tune.lyrics.split("\n")
  for(i=0;i<text.length;i++){
    let holder = document.createElement('div');
    holder.classList.add('lineHolder');
    let d = document.createElement('div');
    d.id = `l${i}`;
    d.classList.add('line');
    if(text[i] != ''){
      d.innerText = ' ' + text[i];
      //d.innerText = text[i];
    } else{
      d.innerText = text[i];
    }
    holder.append(d);
    document.getElementById('tune').append(holder);
  }
  //singing(0,0);
  lineHeight = document.getElementById('l0').parentElement.offsetHeight;
  var line = document.getElementById(`l0`);
  line.parentElement.style.top = '-100px';
  line.parentElement.style.transition = `top 600ms linear`;
}


//<< Moves subsequent lines to singing level. >>
function chaseLine(lineNo){
  console.log('chasingLine', lineNo);
  if(tune.conductor[lineNo + 1].length == 0){
    //var nextLine = document.getElementById(`l${lineNo +  2}`);
    var toLift = lineNo + 2;
    var moveDuration = (tune.conductor[lineNo + 2][0][1] - (music.currentTime + delay)) * 1000
  } else{
    var toLift = lineNo + 1;
    //var nextLine = document.getElementById(`l${lineNo +  1}`);
    var moveDuration = (tune.conductor[lineNo + 1][0][1] - (music.currentTime + delay)) * 1000;
  }
  
  //nextLine.style.transition = `top ${moveDuration}ms linear`;
  //nextLine.style.top = '-100px';

  // var tuneDisplay = document.getElementById('tune');
  // tuneDisplay.style.transitionDuration = moveDuration.toString() + 'ms';
  // topHeight -= lineHeight;
  // tuneDisplay.style.top = topHeight.toString() + 'px';
  topHeight -= lineHeight; 
  for(i=0; i < allLines.length; i++){
    allLines[i].parentElement.style.transition = `top ${moveDuration}ms linear`;
    if(allLines[i].id.slice(1) <= toLift){
      allLines[i].parentElement.style.top = (topHeight - 100).toString() + 'px';
      //console.log('haha', allLines[i].style);
    } else{
      allLines[i].parentElement.style.top = topHeight.toString() + 'px';
    }    
  }
}


// << Colors text acording to moment in time of singing. >>
function singing(lineNo, segment){
  console.log('singing');
  var line = document.getElementById(`l${lineNo}`);
  
  if(segment > 0){
    var duration = (tune.conductor[lineNo][segment][1] - (music.currentTime + delay)) * 1000;
  } else{
    var duration = 0;
  }
  let segNo = tune.conductor[lineNo].length;
  line.style.transition = `background-position ${duration}ms linear`;
  console.log('line', duration, line.style.transition);
  if(tune.conductor[lineNo][segment]){
    backPos = (100 - tune.conductor[lineNo][segment][0]);
  } else{
    backPos = 0;
  }
  line.style.backgroundPosition =  `${backPos}% 0`;
  if (segment + 1 < segNo){
    if(is_singing){
      setTimeout(function(){
        singing(lineNo, segment + 1)
      }, duration);
    }
  } else if (lineNo + 1 < tune.conductor.length){
    if(tune.conductor[lineNo + 1].length != 0){
      duration = (tune.conductor[lineNo + 1][0][1] - (music.currentTime + delay)) * 1000;
    } else {
      duration = (tune.conductor[lineNo + 2][0][1] - (music.currentTime + delay)) * 1000;
      lineNo++;
    }
    if(is_singing){
      setTimeout(function(){
        chaseLine(lineNo + 1);
        singing(lineNo + 1, 0)
      }, duration);
    }
  }
}

// function insertClock(line, duration){
//   console.log('line, duration');
//   var clock = document.getElementById('clock');
//   clock.innerText = duration.toString();
//   line.append(clock);
// }

// << Starts karaoke. >>
music.onplay = function(){
  is_singing = true;
  if(music.currentTime > 0){
    console.log('not fresh');
    let pos = findPos();
    console.log('pos', pos);
    singing(pos[0], pos[1]);
  } else{
    singing(0, 0);
    chaseLine(0);
  }  
}

music.onpause = () => is_singing = false;

// << Sets color while seeking.>>
music.onseeking = function(){
  findPos();
}

// << Finds line and coloring position in time. >>
function findPos(){
  var pos;
  let t = music.currentTime;
  for (let i = 0; i < tune.conductor.length; i++){
    if(tune.conductor[i].length > 0){
      if(parseFloat(tune.conductor[i][tune.conductor[i].length -1][1]) > t){
        for(let j = 0; j < tune.conductor[i].length; j++){
          if(tune.conductor[i][j][1] > t){
            pos = [i, j];
            console.log('pos', pos);
            // Setting clientHeight
            topHeight = lineHeight * -i;
            var tuneDisplay = document.getElementById('tune');
            tuneDisplay.style.transitionDuration = '0s';
            tuneDisplay.style.top = topHeight.toString() + 'px';
            break;
          }
        }
        break;
      }
    }
  }
  for (let i=0; i<tune.conductor.length; i++){
    let line = document.getElementById(`l${i}`);
    line.style.transition = `background-position 0ms linear`;
    console.log('pos latter', pos);
    if(i < pos[0]){
      line.style.backgroundPosition =  '0%'; 
      //line.style.top = '-100px';
    } else if(i == pos[0]){
      let backPos = (100 - tune.conductor[pos[0]][pos[1]][0]);
      line.style.backgroundPosition =  `${backPos}% 0`;
      //line.style.top = '-100px';
    } else if(i > pos[0]){
      line.style.backgroundPosition =  '100%';
      //line.style.top = '0px';
    }
  }
  return pos;
}

// << Helper function to fetch song. >>
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