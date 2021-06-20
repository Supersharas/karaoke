
var music = document.getElementById('music');
music.playbackRate = 0.2;

function sing(e){
  let msg = {'id': e.id};
  console.log('msg', msg);
  fetchPost('/get_song', msg).then(function(res){
    console.log('res', res);
    if(res.lyrics){
      tune = res;
      console.log('tune', tune);
      let cons = tune.conductor.split('*');
      console.log('cons', cons);
      tune.conductor = []
      cons.forEach(function(e){
        if(e != ''){
          tune.conductor.push(e.split('+'));
        }     
      })
      console.log('tuneconstructor', tune.conductor);
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
}

function singing(lineNo, segment){
	// lines[lineNo].classList.add('sing');
  let line = document.getElementById(`l{lineNo}`);
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