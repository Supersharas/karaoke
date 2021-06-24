
var music = document.getElementById('music');
music.playbackRate = 0.2;

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
    let d = document.createElement('div');
    d.id = `l${i}`;
    d.classList.add('line');
    d.innerText = text[i];
    document.getElementById('tune').append(d);
  }
  singing(0,0);
}

function singing(lineNo, segment){
	// lines[lineNo].classList.add('sing');
  let line = document.getElementById(`l${lineNo}`);
  console.log(`l${lineNo}`, line);
  if(segment > 0){
    var duration = (tune.conductor[lineNo][segment][1] - tune.conductor[lineNo][segment - 1][1]) * 1000;
    console.log('tune.conductor[lineNo][segment]', tune.conductor[lineNo][segment][1], tune.conductor[lineNo][segment])
  } else{
    let duration = 0;
  }
  let segNo = tune.conductor[lineNo].length;
  console.log('segNo', segNo);
  // let computed = window.getComputedStyle(line)
  line.style.transition = `background-position ${duration}ms linear`;
  backPos = 100 - tune.conductor[lineNo][segment][0];
  line.style.backgroundPosition =  `${backPos}% 0`;
  if (segment + 1 < segNo){
		setTimeout(function(){
			singing(lineNo, segment + 1)
		}, duration);
	}
	if (lineNo + 1 < line.length){
		setTimeout(function(){
			singing(lineNo + 1, 0)
		}, duration);
	}
}


music.onplay = function(){
  singing(0, 0);
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