
const username = "Pano";
var episodeCount = 0;
// Main function
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs[0].url.includes("crunchyroll.com")) {
            handle_addEpisode();
            desactiverBoutonAjouter();

        } else {
            handle_redirectButton();
        }
        getFromLocalStorage();
        copyright();
        handle_deleteEpisode();
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

function handle_deleteEpisode() {
var deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(function(deleteButton) {
        deleteButton.addEventListener('click', function () {
            deleteEpisode();
        });
    });
}



function getFromLocalStorage() {
    var cache = JSON.parse(localStorage.getItem("cache")) || {};

    // Iterate through the cache object
    for (var username in cache) {
    var userData = cache[username];
    
    // Iterate through the anime data for each user
    for (var animeTitle in userData) {
        var animeData = userData[animeTitle];
        
        // Iterate through the episodes for each anime
        for (var episodeFullName in animeData) {
        var episode = animeData[episodeFullName];
        
        var episodeData = {
            "AnimeTitle": episode.AnimeTitle,
            "EpisodeName": episode.EpisodeName,
            "EpisodeThumbnail": episode.EpisodeThumbnail,
            "EpisodeLink": episode.EpisodeLink,
            "EpisodeNumber": parseInt(episode.EpisodeNumber),
            "LastUpdate": episode.LastUpdate
        }
        createEpisode(episodeData);
        }
    }
    }
}

function createEpisode(data) {

    let episodesDIV = document.getElementById("episodes");
    let episode_section = document.createElement("section");
    episode_section.id = episodeCount;
    episodesDIV.appendChild(episode_section);

    // Container Header episode
    let episode_header = document.createElement("span");
    episode_header.classList.add("episode-header");
    episode_section.appendChild(episode_header);

    // Anime Title
    let anime_title = document.createElement("p"); // HTML element
    anime_title.classList.add("anime-name"); // Add class to the element
    anime_title.innerText = data.AnimeTitle; // Text inside the element

    let episode = document.getElementById(episodeCount);
    episode_header.appendChild(anime_title);

    // Delete button
    let delete_button = document.createElement("a");
    delete_button.classList.add("delete-button");
    delete_button.innerText = "x";
    episode_header.appendChild(delete_button);

    // Container
    let container = document.createElement("div")
    container.classList.add("anime-title-date-container");
    episode.appendChild(container);
    
    var containerElement = episode.getElementsByClassName("anime-title-date-container")[0];

    // Thumbnail Container + thumbnail
    var thumbnail_container = document.createElement("div")
    thumbnail_container.classList.add("episode-thumbnail-container");
    var thumbnail = document.createElement("img")
    thumbnail.classList.add("episode-thumbnail");
    thumbnail.src = data.EpisodeThumbnail;
    containerElement.appendChild(thumbnail_container);
    thumbnail_container.appendChild(thumbnail);
    

    //  episode title + link button
    var episode_title_link_container = document.createElement("div");
    episode_title_link_container.classList.add("anime-episode-title-link-container");
    container.appendChild(episode_title_link_container);
    var episode_title = document.createElement("p");
    episode_title.classList.add("anime-episode-title");
    episode_title.innerText = data.EpisodeName;
    episode_title_link_container.appendChild(episode_title);

    var episode_link = document.createElement("a");
    episode_link.classList.add("anime-episode-link");
    episode_link.classList.add("button-link");
    episode_link.innerText = "Regarder l'épisode" + " " + data.EpisodeNumber;
    var arrow = document.createElement("span");
    arrow.innerText = "→";
    episode_link.appendChild(arrow);
    episode_link.href = data.EpisodeLink;
    episode_title_link_container.appendChild(episode_link);

    // add event listener
    episode_link.addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.update(tabs[0].id, {url: episode_link.href});
        });
    });

    episodeCount++;
}

function deleteEpisode(){
    var episodeId = event.target.parentNode.parentNode.id;
    try {
        var episodeData = getLocalStorage()[username]["anime"][episodeId];
        var cache = JSON.parse(localStorage.getItem("cache"));
        var userData = cache[username];
        var animeData = userData["anime"];
        animeData.splice(episodeId, 1);
        userData["anime"] = animeData;
        cache[username] = userData;
        localStorage.setItem("cache", JSON.stringify(cache));
        var episode = document.getElementById(episodeId);
        episode.remove();

    }
    catch (e) {
        console.log(e);
    }

}

function copyright() {
    document.getElementById("year").innerText = new Date().getFullYear();
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
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: getAllInfos
        }, (result) => {
            setLocalStorage(result[0].result);
            let results = result[0].result;
            let episode = {
                "AnimeTitle": results.AnimeTitle,
                "EpisodeName": results.EpisodeName,
                "EpisodeThumbnail": results.LienImage,
                "EpisodeLink": results.EpisodeLink,
                "EpisodeNumber": parseInt(results.EpisodeNumber),
                "LastUpdate": new Date().toLocaleString()
            }

            createEpisode(episode);
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
    episodesChildren = nextEpisode[0].children;
    console.log(episodesChildren);
    for (let i = 0; i < episodesChildren.length; i++) {
        if (episodesChildren[i].attributes["data-t"].value === "next-episode") {
            return true;
        }
    }
    return false;
}


function getAllInfos() {
    // Next episode DIV
    let nextEpisode = document.getElementsByClassName('prev-next-episodes');
    let currentEpisode = document.getElementsByClassName('show-title-link');
    
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
        return cache || null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function checkExistEpisode() {
   // Retrieve existing cache from localStorage or create an empty object
   var cache = JSON.parse(localStorage.getItem("cache")) || {};
   // Retrieve user data from the cache or create an empty object
   var userData = cache[username] || {};
   // Retrieve anime data from the cache or create an empty object
   var animeData = userData["anime"] || [];

   // Check if the episode already exists for this anime
   var existingEpisode = animeData.find(function (episode) {
   return episode.AnimeTitle === animeTitle && episode.EpisodeName === episodeName;
   });

   if (existingEpisode) {
   console.log("The episode already exists for this anime.");
   }
}


function setLocalStorage(data) {
    var animeTitle = data.AnimeTitle;
    var episodeFullName = data.EpisodeFullName;
    var episodeLink = data.EpisodeLink;
    var episodeName = data.EpisodeName;
    var episodeNumber = data.EpisodeNumber;
    var lienImage = data.LienImage;

    // Retrieve existing cache from localStorage or create an empty object
    var cache = JSON.parse(localStorage.getItem("cache")) || {};
    // Retrieve user data from the cache or create an empty object
    var userData = cache[username] || {};

    // Retrieve anime data from the cache or create an empty object
    var animeData = userData["anime"] || [];

    // Check if the episode already exists for this anime
    var existingEpisode = animeData.find(function (episode) {
    return episode.AnimeTitle === animeTitle && episode.EpisodeName === episodeName;
    });

    if (existingEpisode) {
        console.log("The episode already exists for this anime.");
        return;
    }

    // Create a new episode object
    var newEpisode = {
    "AnimeTitle": animeTitle,
    "EpisodeName": episodeName,
    "EpisodeThumbnail": lienImage,
    "EpisodeLink": episodeLink,
    "EpisodeNumber": parseInt(episodeNumber),
    "LastUpdate": new Date().toLocaleString()
    };

    // Add the new episode to the animeData array
    animeData.push(newEpisode);

    // Add the updated animeData to the userData
    userData["anime"] = animeData;
    // Add the userData to the cache
    cache[username] = userData;

    // Save the cache to localStorage
    localStorage.setItem("cache", JSON.stringify(cache));
}



// --- API ---

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


