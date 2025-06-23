console.log(" Hello world ");

  let currentsong= new Audio();

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

const playMusic = (track) => {
    // let audio = new Audio("/songs/" + track);
    currentsong.src= "/songs/" + track
    currentsong.play();
}

async function main() {

  



    let songs = await getsongs();
    console.log(songs);


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

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach( e => {
      e.addEventListener("click" , element =>{
          console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      })
    })
 
};
main();