
var text = document.getElementById('text');
var sung = document.getElementById('sung');

console.log('line', text.children[0].innerText.length);

l = text.children[0].innerText.length;
t = text.children[0].innerText;

char1 = 0;

function singing(char, speed) {
	console.log('speed', speed);
	if(char >= l){
		return
	}

	sung.innerText += t[char];
	if(t[char] != ' '){
		text.children[0].innerText = text.children[0].innerText.slice(1);
	}

	console.log('singing');
    setTimeout(function()
  {
    singing(char + 1, speed);

  }, speed);
}

function lineSpeed(len, time){
	console.log('len', len);
	return time / len;
}

var sp = lineSpeed(l, 5000);

console.log('speed', sp);

singing(char1, sp);