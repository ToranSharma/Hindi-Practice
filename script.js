let box;
let button;
let i = 0;
let answer = "";
let ltoh;

let canvas;
let canvasRect;
let ctx;
let writing = false;
let sx = 0;
let sy = 0;
let touches = [];
let touchPaths = Object();
let lastTouchTime;
let lastTouchLocation;

let vowels = {
	"a":"अ", "ā":"आ",
	"i":"इ", "ī":"ई",
	"u":"उ", "ū":"ऊ",
	"r̥":"ऋ",
	"ē":"ए", "ai":"ऐ",
	"ō":"ओ", "au":"औ"
};

let consonants = {
	"k":"क", "kh":"ख", "g":"ग", "gh":"घ",
	"c":"च", "ch":"छ", "j":"ज", "jh":"झ",
	"ṭ":"ट", "ṭh":"ठ", "ḍ":"ड", "ḍh":"ढ", "ṇ":"ण",
	"t":"त", "th":"थ", "d":"द", "dh":"ध", "n":"न",
	"p":"प", "ph":"फ", "b":"ब", "bh":"भ", "m":"म",
	"y":"य", "r":"र", "l":"ल", "v":"व",
	"ś":"श", "ṣ":"ष", "s":"स", "h":"ह",
	"q":"क़", "k̲h̲":"ख़", "g̲":"ग़", "z":"ज़", "ṛ":"ड़", "ṛh":"ढ़", "f":"फ़" 
};

let diacritics = {
	"a":" ", "ā":"ा",
	"i":"ि", "ī":"ी",
	"u":"ु", "ū":"ू",
	"r̥":"ृ",
	"ē":"े", "ai":"ै",
	"ō":"ो", "au":"ौ"
}


letters = {...vowels, ...consonants};

letters = Object.entries(letters);

diacritics = Object.entries(diacritics);

function shuffle(array)
{
	let numUnshuffled = array.length;
	while (numUnshuffled > 0)
	{
		let randomIndex = Math.floor(Math.random() * numUnshuffled--);
		let endElem = array[numUnshuffled];
		array[numUnshuffled] = array[randomIndex];
		array[randomIndex] = endElem;
	}
}

function displayNext()
{
	canvasClear();

	let latin = letters[i][0];
	let hindi = letters[i][1];
    
	if (vowels.hasOwnProperty(latin))
	{
		if (ltoh)
		{
			box.innerText = `(${i+1}/${letters.length}) ${latin}`;
			answer = hindi;
		}
		else
		{
			box.innerText = `(${i+1}/${letters.length}) ${hindi}`;
			answer = latin;
		}
	}
	else
	{
		let vowel = diacritics[Math.floor(Math.random()*diacritics.length)];

		if (ltoh)
		{
			box.innerText = `(${i+1}/${letters.length}) ${latin + vowel[0]}`;
			answer = hindi + vowel[1];
		}
		else
		{
			box.innerText = `(${i+1}/${letters.length}) ${hindi + vowel[1]}`;
			answer = latin + vowel[0];
		}
	}

	button.innerText = "Show Answer";
	button.onclick = showAnswer;
}

function showAnswer()
{
	box.innerText += " → " + answer;
	button.innerText = "Next";
	button.onclick = displayNext;
	
	i++;

	if (i == letters.length)
	{
		button.innerText = "Restart?";
		button.onclick = function ()
		{
			button.parentNode.removeChild(button);
			initHindi();
			canvasClear();
		};
	}
}

function initHindi()
{
	shuffle(letters);
	i = 0;

	box = document.getElementById("box");
	box.innerText = "Devanagārī Practice!\nChoose practice type...";

	let buttonsHolder = document.getElementById("buttons");

	button = document.createElement("button");
	button.id = "button";
	button.innerText = "Latin to Hindi";
	button.onclick = function ()
	{
		ltoh = true;
		buttonsHolder.removeChild(button2);
		displayNext();
	};
	buttonsHolder.appendChild(button);

	let button2	= document.createElement("button");
	button2.id = "htol";
	button2.innerText = "Hindi to Latin";
	button2.onclick = function ()
	{
		ltoh = false;
		buttonsHolder.removeChild(button2);
		displayNext();
	};

	buttonsHolder.appendChild(button2);
}

function canvasClear()
{
	ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
}

function md(evnt)
{
	if (evnt.button == 2)
	{
		// RMB
		canvasClear();
		return false;
	}
	writing = true;
	
	let mx = evnt.offsetX;
	let my = evnt.offsetY;
	sx = mx;
	sy = my;

	ctx.beginPath();
	ctx.moveTo(mx,my);
}

function mu(evnt)
{
	writing = false;
	if (evnt.offsetX == sx &&
		evnt.offsetY == sy)
	{
		ctx.lineTo(sx+0.1,sy+0.1);
		ctx.stroke();
	}

}

function mm(evnt)
{
	if (!writing)
		return false;
	let mx = evnt.offsetX;
	let my = evnt.offsetY;
	ctx.lineTo(mx,my);
	ctx.stroke();
}

function ml(evnt)
{
	writing = false;
}

function ts(evnt)
{
	evnt.preventDefault();
	
	let startedTouches = evnt.changedTouches;
	
	for (let i = 0; i < startedTouches.length; i++)
	{
		touches.push(startedTouches[i]);
		
		let tx = startedTouches[i].pageX - canvasRect.x; 
		let ty = startedTouches[i].pageY - canvasRect.y;

		ctx.beginPath();
		ctx.moveTo(tx, ty);
		
		touchPaths[startedTouches[i].identifier] = {};
		touchPaths[startedTouches[i].identifier].x = tx;
		touchPaths[startedTouches[i].identifier].y = ty;
	}

	writing = true;
}

function te(evnt)
{
	evnt.preventDefault();

	let endedTouches = evnt.changedTouches;

	for (let i = 0; i < endedTouches.length; i++)
	{
		for (let j = 0; j < touches.length; j++)
		{
			if (touches[j].identifier == endedTouches[i].identifier)
			{
				delete touchPaths[touches[j].identifier];
				touches.splice(j);
			}
		}
	}
	if (touches.length == 0)
	{
		writing = false;
		
		if (endedTouches.length == 1 )
		{
			let touchTime = new Date();
			let touchLocation = [endedTouches[0].pageX, endedTouches[0].pageY];

			if (lastTouchTime != undefined && (touchTime - lastTouchTime) < 300)
			{
				let distance2 = Math.pow(touchLocation[0]-lastTouchLocation[0],2)
					+ Math.pow(touchLocation[1]-lastTouchLocation[1],2);
				if (distance2 < 16*16)
					canvasClear();
			}
			lastTouchTime = touchTime;
			lastTouchLocation = touchLocation;
		}
	}
}

function tm(evnt)
{
	evnt.preventDefault();
	if (!writing)
		return false;

	let movedTouches = evnt.changedTouches;

	for (let i = 0; i < movedTouches.length; i++)
	{
		let tx = movedTouches[i].pageX - canvasRect.x;
		let ty = movedTouches[i].pageY - canvasRect.y;
		
		let lx = touchPaths[movedTouches[i].identifier].x;
		let ly = touchPaths[movedTouches[i].identifier].y;

		ctx.beginPath();
		ctx.moveTo(lx, ly);
		ctx.lineTo(tx, ty);
		ctx.stroke();

		touchPaths[movedTouches[i].identifier].x = tx;
		touchPaths[movedTouches[i].identifier].y = ty;
	}
}

function initCanvas()
{
	canvas = document.getElementById("canvas");
	canvasRect = canvas.getBoundingClientRect();

	canvas.height = Math.floor(canvasRect.height);
	canvas.width = Math.floor(canvasRect.width);

	let context = canvas.getContext("2d");
	
	context.lineWidth = 10;
	context.lineCap = "round";
	context.strokeStyle = "white";

	canvas.addEventListener("mousedown", md);
	canvas.addEventListener("mouseup", mu);
	canvas.addEventListener("mousemove", mm);
	canvas.addEventListener("mouseleave", ml);

	canvas.addEventListener("touchstart", ts);
	canvas.addEventListener("touchend", te);
	canvas.addEventListener("touchmove", tm);

	return context;
}

window.onload = function (){
	initHindi();
	ctx = initCanvas();
};

window.onresize = function () {
	ctx = initCanvas();
};
