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

const username = "Lucas";
// Main function
const allEpisodes = [];
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs[0].url.includes("crunchyroll.com")) {
            handle_addEpisode();
            handle_openEpisode();
            desactiverBoutonAjouter();
        } else {
            handle_redirectButton();
        }
        copyright();
    });
    isWatching(function (result) {
        if (result) {
            activerBoutonAjouter();
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: checkIfNextEpisodeAvailableScript
                }, (result) => {
                    if (result[0].result) {
                        activerBoutonAjouter();
                    } else {
                        desactiverBoutonAjouter();
                    }
                });
            });   
        }
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
    getAnimeTitleButton.addEventListener('click', function () {
        getAnimeInfos();
    });
}

function handle_redirectButton() {
    showButton_byID('crunchyroll-button');
    hideButton_byID('addEpisode');
    var redirectButton = document.getElementById('crunchyroll-button');
    redirectButton.addEventListener('click', function () {
        chrome.tabs.create({url: 'https://www.crunchyroll.com/'});
    });
}

function handle_openEpisode() {
    var episodeLinkButton = document.getElementById('anime-episode-link');
    episodeLinkButton.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: episodeLinkButton.href});
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

function modifyEpisodeLink(link, number) {
    let episodeLinkButton = document.getElementById("anime-episode-link")
    if (number >= 10) {
        episodeLinkButton.classList.add("button-link-smaller");
    } else {
        episodeLinkButton.classList.remove("button-link-smaller");
    }
    episodeLinkButton.href = link;
    episodeLinkButton.disabled = false;
}

function modifyDateAjout(dateAjout) {
    document.getElementById("anime-date-ajout").innerText = dateAjout;
}


function modifyLienImage(lienImage) {
    document.getElementById("anime-thumbnail").src = lienImage;
}

function copyright() {
    let year = new Date().getFullYear();
    document.getElementById("year").innerText = year;
}

function desactiverBoutonAjouter() {
    var bouton = document.getElementById("addEpisode");
    bouton.disabled = true;
    bouton.classList.add("button-disabled");
}

function activerBoutonAjouter() {
    var bouton = document.getElementById("addEpisode");
    bouton.disabled = false;
}

// --- End of Extensions informations (popup.html) ---"

// Scripts

function getAnimeInfos() {
    isWatching(function (result) {
        if (result) {
            hideEpInfos();
        }
    });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: getAllInfos
        }, (result) => {
            setLocalStorage(result[0].result);
            let results = result[0].result;
            // const YEAR = new Date().getFullYear(); // Get the current year
            // const MONTH = new Date().getMonth(); // Get the current month
            // const DAY = new Date().getDay(); // Get the current day

            let episode = new Episode(nom = results.AnimeTitle,
                lien = results.EpisodeLink,
                lienImage = results.LienImage,
                number = results.EpisodeNumber,
                episodeName = results.EpisodeName,
                episodeFullName = results.EpisodeFullName,
                // dateAjout       =  DAY + "/" + MONTH + "/" + YEAR
            );

            modifyAnimeTitle(episode.getNom()); // Name of the anime
            modifyLienImage(episode.getLienImage()); // Thumbnail of the episode
            modifyEpisodeTitle(episode.getEpisodeName()); // Name of the episode
            modifyEpisodeNumber(episode.getEpisode()); // Number of the episode
            modifyEpisodeLink(episode.getLien(), episode.getEpisode()); // Link of the episode
            // modifyDateAjout(episode.getDateAjout()); // Date d'ajout de l'épisode
            allEpisodes.push(episode);
            //document.getElementById("name").innerText = result[0].result;
        });
    });
}

function isWatching(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs[0].url.includes("crunchyroll.com") && tabs[0].url.includes("watch")) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

// Page interaction

function checkIfNextEpisodeAvailableScript() {
    let nextEpisode = document.getElementsByClassName('prev-next-episodes');
    if (nextEpisode[0].childElementCount >= 2) {
        return true;
    }
    return false;
}


function getAllInfos() {
    // Next episode DIV
    let nextEpisode = document.getElementsByClassName('prev-next-episodes');
    let currentEpisode = document.getElementsByClassName('show-title-link');
    
    // console.log(nextEpisode);
    // console.log(currentEpisode);
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
        "AnimeTitle": animeTitle,
        "LienImage": lienImage,
        "EpisodeName": episodeName,
        "EpisodeFullName": episodeNameFull,
        "EpisodeNumber": episodeNumber,
        "EpisodeLink": nextEpisodeLink
    };
    return AllInfos;
}

function getLocalStorage() {
    try {
        var cache = JSON.parse(localStorage.getItem("cache"));
        console.log(cache);
        return cache || null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function setLocalStorage(data) {
    var animeTitle = data.AnimeTitle;
    var episodeFullName = data.EpisodeFullName;
    var episodeLink = data.EpisodeLink;
    var episodeName = data.EpisodeName;
    var episodeNumber = data.EpisodeNumber;
    var lienImage = data.LienImage;

    // Récupérer le cache existant depuis le localStorage et si il n'existe pas, créer un objet vide
    var cache = JSON.parse(localStorage.getItem("cache")) || {};
    // Récupérer les données de l'utilisateur depuis le cache et si il n'existe pas, créer un objet vide
    var userData = cache[username] || {};
    // Récupérer les données de l'anime depuis le cache et si il n'existe pas, créer un objet vide
    var animeData = userData[animeTitle] || {};

    // Vérifier si l'épisode existe déjà pour cet anime
    if (episodeFullName in animeData) {
        console.log("L'épisode existe déjà pour cet anime.");
        return;
    }

    // Ajouter les données de l'épisode dans l'objet animeData
    animeData[episodeFullName] = {
        "EpisodeLink": episodeLink,
        "EpisodeNumber": parseInt(episodeNumber),
        "LastUpdate": new Date().toLocaleString()
    };

    // Ajouter les données de l'anime dans l'objet userData
    userData[animeTitle] = animeData;
    // Ajouter les données de l'utilisateur dans le cache
    cache[username] = userData;

    // Enregistrer le cache dans le localStorage
    localStorage.setItem("cache", JSON.stringify(cache));

    console.log("Données enregistrées avec succès");
}

function getOnlineStorage(username) {
    fetch(`http://127.0.0.1:5000/get/${username}`)
        .then(response => {
            // Vérifier si la requête a fonctionné
            if (response.ok) {
                return response.json(); // Récupérer les données au format JSON
            } else {
                throw new Error("Erreur lors de la récupération des données depuis le serveur");
            }
        })
        // Récupérer les données depuis le serveur
        .then(data => {
            // console.log(data);
            storeUserDataLocal(username, data); // Enregistrer les données dans le localStorage
        })
        .catch(error => console.log(error)); // Afficher l'erreur dans la console
}

function storeUserDataLocal(username, data) {
    // Récupérer le cache existant depuis le localStorage et si il n'existe pas, créer un objet vide
    var cache = JSON.parse(localStorage.getItem("cache")) || {};
    cache[username] = data; // Ajouter les données de l'utilisateur dans le cache pour la clé "username" donc ce qui ya apres
    localStorage.setItem("cache", JSON.stringify(cache)); // Enregistrer le cache dans le localStorage
}

function convertDataForServer(data) {
    var convertedData = { // Créer un objet avec les données de l'utilisateur
        username: Object.keys(data)[0], // Récupérer le nom d'utilisateur depuis les clés de l'objet data (element 0 vu que c'est le seul)
        data: [] // Créer un tableau vide pour les données
    };

    for (var username in data) { // Pour chaque nom d'utilisateur dans l'objet data
        var userData = data[username]; // Récupérer les données de l'utilisateur
        for (var animeTitle in userData) { // Pour chaque titre d'anime dans les données de l'utilisateur
            var animeData = userData[animeTitle]; // Récupérer les données de l'anime
            for (var episodeName in animeData) { // Pour chaque nom d'épisode dans les données de l'anime
                var episodeData = animeData[episodeName]; // Récupérer les données de l'épisode
                var convertedEpisode = { // Créer un objet avec les données de l'épisode
                    Anime: { // Créer un objet avec les données de l'anime
                        Title: animeTitle,
                        EpisodeName: episodeName,
                        EpisodeNumber: episodeData.EpisodeNumber,
                        EpisodeLink: episodeData.EpisodeLink
                    }
                };
                convertedData.data.push(convertedEpisode); // Ajouter les données de l'épisode dans le tableau des données
            }
        }
    }

    return convertedData;
}

function synchronize(username) {
    // Récupérer les données stockées localement
    var cache = JSON.parse(localStorage.getItem("cache")) || {};

    // Convertir les données pour les mettre au bon format pour le serveur
    var convertedData = convertDataForServer(cache);

    // Envoyer les données vers le serveur
    fetch('http://127.0.0.1:5000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(convertedData)
    })
        .then(response => {
            if (response.ok) { // Vérifier si la requête a fonctionné
                console.log("Synchronisation réussie"); // Afficher un message de succès
            } else {
                console.log("Erreur lors de la synchronisation"); // Afficher un message d'erreur
            }
        })
        .catch(error => console.log(error)); // Afficher l'erreur dans la console
}


// Bouton d'ID "addTest" pour tester la fonction
// var button = document.getElementById("addTest");
// button.addEventListener("click", function() {
//     // synchronize('Pablo');
//     getOnlineStorage('Lucas');
// });

