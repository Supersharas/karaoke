
var lines = document.getElementById('song').children;
var l = lines.length;
console.log('lines', lines);



function singing(lineNo){
	lines[lineNo].classList.add('sing');
	console.log('lineNo, l', lineNo, l);
	console.log('singing', lines[lineNo]);
	if (lineNo + 1 < l){
		setTimeout(function(){
			singing(lineNo + 1)
		}, 5000);
	}
}

singing(0);