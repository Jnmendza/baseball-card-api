console.log("API", config.apiKey)

const btnContainer = document.getElementById('btn__container');
const names = ['fernando tatis jr.', 'manny machado', 'jake cronenworth', 'yu darvish', 'mark melancon'];

(() => {
    names.map(name => {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button')
        btn.innerHTML = name;
        btnContainer.appendChild(btn);
    })
})()

const sdImg = document.getElementById('sd__logo');
const container = document.getElementById("right__container");
const friarLogo = document.getElementById("friar-logo");

const allBtns = document.querySelectorAll('.post__title button');

const reload = () => {
    reload = location.reload()
}
sdImg.addEventListener('click', reload, false);

allBtns.forEach((btn, index) => {
    btn.addEventListener('click', async () => {
        if(container.children['friar-logo']){
            removeFriar()
        }
        // gets the names off the buttons and formats 
        const playerName = btn.innerHTML.toLowerCase().split(' ').join('%20');
        const playerInfo = await getPlayerInfo(playerName)
        const playerId = playerInfo.player_id;
        
        console.log("testing player info", playerInfo)
        console.log("testing player ID", playerId)
        console.log("index", index)
        allBtns.forEach(btn => btn.classList.remove('activeBtn'))
        btn.classList.add('activeBtn');
        createCard(playerInfo);
    })
})

// Gets players info with players name as a param
const getPlayerInfo = async (playerName) => {
    try {
        const url = `https://mlb-data.p.rapidapi.com/json/named.search_player_all.bam?name_part='${playerName}'&sport_code='mlb'&active_sw='Y'`;
        const res = await fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": config.apiKey,
		        "x-rapidapi-host": "mlb-data.p.rapidapi.com"
            }
        });
        console.log(res.ok);
        const data = await res.json();
        const playerInfo = data.search_player_all.queryResults.row
        return playerInfo;
    } catch (err) {
        console.error(err);
    }
} 

// gets the hitting stats with player id as a param
const getHittingStats = async (id) => {
    try {
        const url = `https://mlb-data.p.rapidapi.com/json/named.sport_career_hitting.bam?player_id='${id}'&game_type='R'&league_list_id='mlb'`;
        const res = await fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": config.apiKey,
                "x-rapidapi-host": "mlb-data.p.rapidapi.com"
            }
        });
        console.log(res.ok);
        const data = await res.json();
        const hittingStat = data.sport_career_hitting.queryResults.row;
        return hittingStat;
    } catch (err) {
        console.error(err)
    }
}

// gets the pitching stats with player id as a param
const getPitchingStats = async (id) => {
    try {
        const url = `https://mlb-data.p.rapidapi.com/json/named.sport_career_pitching.bam?player_id='${id}'&league_list_id='mlb'&game_type='R'`;
        const res = await fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": config.apiKey,
                "x-rapidapi-host": "mlb-data.p.rapidapi.com"
            }
        });
        console.log(res.ok);
        const data = await res.json();
        const pitchingStat = data.sport_career_pitching.queryResults.row;
        return pitchingStat;
    } catch (err) {
        console.error(err)
    }
}

const createCard = async (playerInfo) => {
    const allCards = document.querySelectorAll('.post__content')

    // creates the main div for player card
    let cardContainer = document.createElement("div");
    cardContainer.setAttribute("id", "player__card");
    cardContainer.classList.add('post__content')

    // creates the div that holds the players image
    let imgContainer = document.createElement("div");
    imgContainer.setAttribute("id", "player__img")
    imgContainer.classList.add('post__img')

    // creates the div that holds the players info and stats
    let infoContainer = document.createElement("div");
    infoContainer.setAttribute("id", "player__info");
    infoContainer.classList.add('post__text');

    // creates the img tag that goes in imgContainer
    let imgElem = document.createElement("img")
    imgElem.setAttribute("src", `./images/${playerInfo.name_first}.jpg`)
    imgElem.setAttribute("alt", `${playerInfo.name_display_first_last}`)

    // creates h3 that holds players name and position
    let titleElem = document.createElement("h3");
    titleElem.innerHTML = `${playerInfo.name_display_first_last} - ${playerInfo.position}`;

    const playerId = playerInfo.player_id
    const hittingStats = await getHittingStats(playerId)
    const pitchingStats = await getPitchingStats(playerId)
    // creates span that hold players stats
    let statElem = document.createElement("span");
    // statElem.innerHTML = `This is the players bio ------>`


    // playerInfo.position === 'P' ? statElem.innerHTML = pitchStats : statElem.innerHTML = hitterStats 
    if(playerInfo.position === 'P'){
        statElem.innerHTML = `Career pitching stats: WHIP: ${pitchingStats.whip}, K/BB: ${pitchingStats.kbb}, QS: ${pitchingStats.qs}, K9: ${pitchingStats.k9}`
    } else {
        statElem.innerHTML = `Career hitting stats: Avg: ${hittingStats.avg}, BB: ${hittingStats.bb}, RBI: ${hittingStats.rbi}, HR: ${hittingStats.hr}`
    }

    // creates p tag with player bio
    let bioElem = document.createElement("p");
    let proDebut = new Date(playerInfo.pro_debut_date).toISOString().substring(0,10);;
    bioElem.innerHTML = `${playerInfo.name_display_first_last} is currently playing for ${playerInfo.team_full} as a starting ${playerInfo.position}. He is from ${playerInfo.birth_city}, ${playerInfo.birth_country} and made his Major League debut on ${proDebut}.`

    // append the info elements to its parent infoContainer
    infoContainer.appendChild(titleElem)
    infoContainer.appendChild(statElem)
    infoContainer.appendChild(bioElem)

    // append the img element to its parent imgContainer
    imgContainer.appendChild(imgElem);

    // append both the imgContainer and infoContainer to cardContainer
    cardContainer.appendChild(imgContainer);
    cardContainer.appendChild(infoContainer);

    if(container.children.length > 0){
        console.log("cards exists")
        removeCard();
        container.appendChild(cardContainer);
        cardContainer.classList.add('showPost')
    } else {
        // removeFriar()
        console.log("card does not exist")
        container.appendChild(cardContainer);
        cardContainer.classList.add('showPost')
    }
}

const removeCard = () => {
    const cardToRemove = document.getElementById("player__card");
    cardToRemove.remove()
}

const removeFriar = () => {
    friarLogo.remove()
}
