//getting my html
const button = document.querySelector("#button");
const jokeContainer = document.querySelector("#joke");

const audioElement = document.querySelector("#audio");
const box = document.querySelector("#box");

// VoiceRSS Javascript SDK
const VoiceRSS = {
  speech: function (e) {
    this._validate(e), this._request(e);
  },
  _validate: function (e) {
    if (!e) throw "The settings are undefined";
    if (!e.key) throw "The API key is undefined";
    if (!e.src) throw "The text is undefined";
    if (!e.hl) throw "The language is undefined";
    if (e.c && "auto" != e.c.toLowerCase()) {
      var a = !1;
      switch (e.c.toLowerCase()) {
        case "mp3":
          a = new Audio().canPlayType("audio/mpeg").replace("no", "");
          break;
        case "wav":
          a = new Audio().canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          a = new Audio().canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          a = new Audio().canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          a = new Audio().canPlayType("audio/x-caf").replace("no", "");
      }
      if (!a) throw "The browser does not support the audio codec " + e.c;
    }
  },
  _request: function (e) {
    var a = this._buildRequest(e),
      t = this._getXHR();
    (t.onreadystatechange = function () {
      if (4 == t.readyState && 200 == t.status) {
        if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
        //the code we use to play the joke  if we just whant to play the response text we change new Audio(t.responseText).play();
        //now it plays my message
        audioElement.src = t.responseText;
        audioElement.play();
      }
    }),
      t.open("POST", "https://api.voicerss.org/", !0),
      t.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      ),
      t.send(a);
  },
  _buildRequest: function (e) {
    var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
    return (
      "key=" +
      (e.key || "") +
      "&src=" +
      (e.src || "") +
      "&hl=" +
      (e.hl || "") +
      "&r=" +
      (e.r || "") +
      "&c=" +
      (a || "") +
      "&f=" +
      (e.f || "") +
      "&ssml=" +
      (e.ssml || "") +
      "&b64=true"
    );
  },
  _detectCodec: function () {
    var e = new Audio();
    return e.canPlayType("audio/mpeg").replace("no", "")
      ? "mp3"
      : e.canPlayType("audio/wav").replace("no", "")
      ? "wav"
      : e.canPlayType("audio/aac").replace("no", "")
      ? "aac"
      : e.canPlayType("audio/ogg").replace("no", "")
      ? "ogg"
      : e.canPlayType("audio/x-caf").replace("no", "")
      ? "caf"
      : "";
  },
  _getXHR: function () {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml3.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    throw "The browser does not support HTTP request";
  },
};

//ativar/desativar o butão
function toggleButton() {
  button.disabled = !button.disabled;
}

let apiJoke = "";
let myJoke = "";

//making newJoke  with the Object data we took from the API
function newJoke() {
  //displaying the joke (we have 2 types simples joke and setup/delivery joke)
  if (apiJoke.joke) {
    myJoke = apiJoke.joke;
    jokeContainer.textContent = myJoke;
  } else if (apiJoke.delivery && apiJoke.setup) {
    myJoke = `${apiJoke.setup}...${apiJoke.delivery}`;
    jokeContainer.textContent = myJoke;
  }
  // text - to audio
  tellMe(myJoke);
  //disable Button
  toggleButton();
}

//getting joke from api
async function getJokes() {
  const jokeUrl = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw";
  try {
    const res = await fetch(jokeUrl);
    apiJoke = await res.json();

    newJoke();
  } catch (e) {
    console.log("ERRO api", e);
  }
}

//conectando jokesAPI com audioAPI
function tellMe(joke) {
  console.log("tell me: " + joke);
  //function that plays audio
  VoiceRSS.speech({
    key: "50f64208c0cd455681b8ffdfbf8eba99",
    //this src is playes with  *new Audio(t.responseText).play()* in request function we change this src to oure joke
    src: joke,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

// PUTTING IT ON THE BUTTON
button.addEventListener("click", getJokes);
//disable button while audio playing
audioElement.addEventListener("ended", toggleButton);
