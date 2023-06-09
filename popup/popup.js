class Episode {
    constructor(nom, lien, lienImage, number, episodeName) {
        this.nom = nom;
        this.lien = lien;
        this.lienImage = lienImage;
        this.number = number;
        this.episodeName = episodeName;
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

// --- End of Extensions informations (popup.html) ---"

// Scripts

function getAnimeInfos() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: getAllInfos
        }, (result) => {
            let results = result[0].result;
            let episode = new Episode(results.AnimeTitle, tabs[0].url, "", results.EpisodeNumber, results.EpisodeName);
            modifyAnimeTitle(episode.getNom());
            modifyEpisodeTitle(episode.getEpisodeName());
            modifyEpisodeNumber(episode.getEpisode());
            allEpisodes.push(episode);
            //document.getElementById("name").innerText = result[0].result;
        });
      });
};

function savetoCloud() {

}



// Page interaction


function getAllInfos() {
    // Anime Link
    episodeLink = document.getElementsByClassName('show-title-link');

    // Anime Title
    animeTitle = episodeLink[0].firstChild.innerHTML;

    // Anime Episode Title "Episode Number - Episode Title"
    episodeTitleFull = document.getElementsByClassName('title')[0].innerHTML;

    // Anime Episode Title "Episode Title"
    episodeName = episodeTitleFull.split("-")[1]; // Split par "-" et récupérer le deuxième élément

    // Anime Episode Number "Episode Number"
    episodeNumber = episodeTitleFull.split("-")[0]; // Split par "-" et récupérer le premier élément
    AllInfos = {
        "AnimeTitle" : animeTitle,
        "EpisodeName" : episodeName,
        "EpisodeNumber" : episodeNumber,
        "EpisodeLink" : episodeLink
    };
    return AllInfos;
}