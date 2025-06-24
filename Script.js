console.log(" Hello world ");

let currentsong = new Audio();

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs() {

    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const Element = as[i];
        if (Element.href.endsWith(".mp3")) {
            songs.push(Element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play();
        play.src = "pause.svg"

    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    let songs = await getsongs();
    console.log(songs);
    playMusic(songs[0], true)


    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
         
                                <img class="invert" src="music.svg" alt="">
                                <div class="info">
                                    <div class="song-name">  ${song.replaceAll("%20", " ")} </div>
                                    <div class="song-info"> Unknown </div>
                                </div>
                                <div class="play-Now">
                                    <span>Play Now </span>
                                    <img class="invert" src="play.svg" alt="">
                                </div>
                            
 </li>`;
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        } else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })


    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} : ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width);
        document.querySelector(".circle").style.left = percent * 100 + "%";
        currentsong.currentTime = (currentsong.duration) * percent;
    })


};
main();