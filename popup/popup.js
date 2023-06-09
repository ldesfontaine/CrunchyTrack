class Episode {
    constructor(nom, lien, lienImage, number, episodeName, episodeFullName, dateAjout) {
        this.nom = nom;
        this.lien = lien;
        this.lienImage = lienImage;
        this.number = number;
        this.episodeName = episodeName;
        this.episodeFullName = episodeFullName;
        // this.dateAjout = dateAjout;
    }

    getNom() {
        return this.nom;
    }

    getLien() {
        return this.lien;
    }

    getLienImage() {
        return this.lienImage;
    }

    getEpisode() {
        return this.number;
    }

    getEpisodeName() {
        return this.episodeName;
    }

    getEpisodeFullName() {
        return this.episodeFullName;
    }

    // getDateAjout() {
    //     return this.dateAjout;
    // }

    // SETTERS

    setNom(nom) {
        this.nom = nom;
    }

    setLien(lien) {
        this.lien = lien;
    }

    setLienImage(lienImage) {
        this.lienImage = lienImage;
    }

    setEpisode(number) {
        this.number = number;
    }

    setDateAjout(dateAjout) {
        this.dateAjout = dateAjout;
    }
}



// Main function
const allEpisodes = [];
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0].url.includes("crunchyroll.com")) {
            handle_addEpisode();
        } else {
            handle_redirectButton();
        }
        
    });
});




// Buttons

function showButton_byID(id) {
    document.getElementById(id).style.display = "block";
}

function hideButton_byID(id) {
    document.getElementById(id).style.display = "none";
}

function handle_addEpisode() {
    hideButton_byID('crunchyroll-button');
    showButton_byID('addEpisode');
    var getAnimeTitleButton = document.getElementById('addEpisode');
    getAnimeTitleButton.addEventListener('click', function() {
        getAnimeInfos();
    });
}

function handle_redirectButton() {
    showButton_byID('crunchyroll-button');
    hideButton_byID('addEpisode');
    var redirectButton = document.getElementById('crunchyroll-button');
    redirectButton.addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://www.crunchyroll.com/' });
    });
}

// Extensions modify informations # Only on extension popup.html

function modifyAnimeTitle(name) {
    document.getElementById("anime-name").innerText = name;
}

function modifyEpisodeTitle(title) {
    document.getElementById("anime-episode-title").innerText = title;
}

function modifyEpisodeNumber(number) {
    document.getElementById("anime-episode-number").innerText = number;
}

function modifyEpisodeLink(link) {
    let episodeLinkButton = document.getElementById("anime-episode-link")
    episodeLinkButton.href = link;
    episodeLinkButton.disabled = false;
}

function modifyDateAjout(dateAjout) {
    document.getElementById("anime-date-ajout").innerText = dateAjout;
}


function modifyLienImage(lienImage) {
    document.getElementById("anime-thumbnail").src = lienImage;
}

// --- End of Extensions informations (popup.html) ---"

// Scripts

function getAnimeInfos() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: getAllInfos
        }, (result) => {
            let results = result[0].result;
            // const YEAR = new Date().getFullYear(); // Get the current year
            // const MONTH = new Date().getMonth(); // Get the current month
            // const DAY = new Date().getDay(); // Get the current day

            let episode = new Episode(  nom             = results.AnimeTitle,
                                        lien            = tabs[0].url,
                                        lienImage       = results.LienImage,
                                        number          = results.EpisodeNumber,
                                        episodeName     = results.EpisodeName,
                                        episodeFullName = results.EpisodeFullName,
                                        // dateAjout       =  DAY + "/" + MONTH + "/" + YEAR
                                        );

            modifyAnimeTitle(episode.getNom()); // Name of the anime
            modifyLienImage(episode.getLienImage()); // Thumbnail of the episode
            modifyEpisodeTitle(episode.getEpisodeName()); // Name of the episode
            modifyEpisodeNumber(episode.getEpisode()); // Number of the episode
            modifyEpisodeLink(episode.getLien()); // Link of the episode
            // modifyDateAjout(episode.getDateAjout()); // Date d'ajout de l'épisode
            allEpisodes.push(episode);
            //document.getElementById("name").innerText = result[0].result;
        });
      });
};



// Page interaction


function getAllInfos() {
    // Anime Link
    episodeLink = document.getElementsByClassName('show-title-link');

    // Anime Title
    animeTitle = episodeLink[0].firstChild.innerHTML;

    // Anime Thumbnail
    lienImage = document.getElementsByClassName('erc-prev-next-episode episode');
    lienImage = lienImage[0].getElementsByTagName('div')
    lienImage = lienImage[1]
    lienImage = lienImage.getElementsByTagName('img')
    lienImage = lienImage[0].src
    
    // Anime Episode Title "Episode Number - Episode Title"
    episodeNameFull = document.getElementsByClassName('title')[0].innerHTML;

    // Anime Episode Title "Episode Title"
    episodeName = episodeNameFull.split("-")[1]; // Split par "-" et récupérer le deuxième élément

    // Anime Episode Number "Episode Number"
    episodeNumber = episodeNameFull.split("-")[0]; // Split par "-" et récupérer le premier élément
    episodeNumber = episodeNumber.replace("E", ""); // Remplacer le "E" par rien

    AllInfos = {
        "AnimeTitle" : animeTitle,
        "LienImage" : lienImage,
        "EpisodeName" : episodeName,
        "EpisodeFullName" : episodeNameFull,
        "EpisodeNumber" : episodeNumber,
        "EpisodeLink" : episodeLink
    };
    return AllInfos;
}