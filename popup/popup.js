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
            handle_openEpisode();
        } else {
            handle_redirectButton();
        }
        copyright();

    });
});




// Buttons
function hideEpInfos() {
    document.getElementById("episode-info").style.display = "block";
}

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

function handle_openEpisode() {
    var episodeLinkButton = document.getElementById('anime-episode-link');
    episodeLinkButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.update(tabs[0].id, { url: episodeLinkButton.href });
        });
    });
}

// function goToURL(url) {
//     window.location.href = url;
// }

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
    hideEpInfos();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: getAllInfos
        }, (result) => {
            storeData(result[0].result);
            let results = result[0].result;
            // const YEAR = new Date().getFullYear(); // Get the current year
            // const MONTH = new Date().getMonth(); // Get the current month
            // const DAY = new Date().getDay(); // Get the current day

            let episode = new Episode(  nom             = results.AnimeTitle,
                                        lien            = results.EpisodeLink,
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
    // Next episode DIV
    let nextEpisode = document.getElementsByClassName('prev-next-episodes');
    let currentEpisode = document.getElementsByClassName('show-title-link');

    console.log(nextEpisode);
    console.log(currentEpisode);
    // Anime Link
    let nextEpisodeLink = nextEpisode[0].firstChild.firstChild.href

    // Anime Title
    animeTitle = currentEpisode[0].firstChild.innerHTML;

    // Anime Thumbnail
    lienImage = nextEpisode[0].getElementsByTagName('div')
    lienImage = lienImage[1]
    lienImage = lienImage.getElementsByTagName('img')
    lienImage = lienImage[0].src
    
    // Anime Episode Title "Episode Number - Episode Title"
    episodeNameFull = nextEpisode[0].firstChild.getElementsByTagName('div')[0].firstChild.title;

    // Anime Episode Title "Episode Title"
    // remove only first "-" from string

    episodeName = episodeNameFull.split(" - ")[1]; // Split par "-" et récupérer le deuxième élément

    // Anime Episode Number "Episode Number"
    episodeNumber = episodeNameFull.split("-")[0]; // Split par "-" et récupérer le premier élément
    episodeNumber = episodeNumber.replace("E", ""); // Remplacer le "E" par rien

    AllInfos = {
        "AnimeTitle" : animeTitle,
        "LienImage" : lienImage,
        "EpisodeName" : episodeName,
        "EpisodeFullName" : episodeNameFull,
        "EpisodeNumber" : episodeNumber,
        "EpisodeLink" : nextEpisodeLink
    };
    return AllInfos;
}

function storeData(data) {
    // console.log(data);
    var animeTitle = data.AnimeTitle;
    var episodeFullName = data.EpisodeFullName;
    var episodeLink = data.EpisodeLink;
    var episodeName = data.EpisodeName;
    var episodeNumber = data.EpisodeNumber;
    var lienImage = data.LienImage;
    // console.log(animeTitle, episodeFullName, episodeLink, episodeName, episodeNumber, lienImage);
    var username = "PABLO"
    // Construire l'objet cache avec les données

    // Construire l'objet cache avec les données
    var cacheObject = {
        [username]: {
            [animeTitle]: {
                [episodeFullName]: {
                    "EpisodeLink": episodeLink,
                    "EpisodeNumber": parseInt(episodeNumber),
                    "LastUpdate": new Date().toLocaleString()
                }
            }
        }
    };

    // Récupérer le cache existant depuis le localStorage
    var cache = JSON.parse(localStorage.getItem("cache")) || {};

    var userData = cache[username] || {};
    var animeData = userData[animeTitle] || {};

    // Vérifier si l'épisode existe déjà pour cet anime
    if (episodeFullName in animeData) {
        console.log("L'épisode existe déjà pour cet anime.");
        return;
    }

    animeData[episodeFullName] = {
        "EpisodeLink": episodeLink,
        "EpisodeNumber": parseInt(episodeNumber),
        "LastUpdate": new Date().toLocaleString()
    };

    userData[animeTitle] = animeData;
    cache[username] = userData;

    // Enregistrer le cache dans le localStorage
    localStorage.setItem("cache", JSON.stringify(cache));

    console.log("Données enregistrées avec succès");
}

function copyright(){
    let year = new Date().getFullYear();
    document.getElementById("year").innerText = year;
}
