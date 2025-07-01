console.log(" Hello world ");
let songs;
let currentsong = new Audio();
let currfolder;
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let i = 0; i < as.length; i++) {
        const Element = as[i];
        if (Element.href.endsWith(".mp3")) {
            songs.push(Element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
         
                                <img class="invert" src="/assets/music.svg" alt="">
                                <div class="info">
                                    <div class="song-name">  ${song.replaceAll("%20", " ")} </div>
                                    <div class="song-info"> Unknown </div>
                                </div>
                                <div class="play-Now">
                                    <span>Play Now </span>
                                    <img class="invert" src="/assets/play.svg" alt="">
                                </div>
                            
 </li>`;
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
}

const playMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play();
        play.src = "assets/pause.svg"

    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let i = 0; i < array.length; i++) {
        const e = array[i]

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").splice(-2)[0]

            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                        <div class="play-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="black"
                                viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="12" fill="#1db954" />
                                <polygon points="9,7 17,12 9,17" fill="black" />
                            </svg>

                        </div>
                    </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);

        })
    })
}
async function main() {
    await getsongs("songs/ncs");
    console.log(songs);
    playMusic(songs[0], true)



    displayAlbums();



    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "/assets/pause.svg"
        } else {
            currentsong.pause()
            play.src = "/assets/play.svg"
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

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {

            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length - 1) {
            playMusic(songs[index + 1])
        }
    })
    document.querySelector(".volume").addEventListener("click", () => {
        const rangeElement = document.getElementsByClassName("range")[0];
        if (rangeElement) {
            rangeElement.style.display = (rangeElement.style.display === "block") ? "none" : "block";
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })


};
main();