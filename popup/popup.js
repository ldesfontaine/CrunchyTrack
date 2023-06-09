// Main function
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        console.log(document.title);
        console.log(tabs);
        console.log(currentTab);
        console.log(currentTab.url);
        if (currentTab.url.includes('crunchyroll.com')) {
            showCrunchy();
            showRefreshButton();
        } else {
            showRedirectButton();
        }
    });

});


// Buttons

function showCrunchy() {
    var crunchyList = document.getElementById('crunchy');
    crunchyList.style.display = 'block';
}

function showRefreshButton() {
    var getAnimeTitleButton = document.getElementById('refresh');
    getAnimeTitleButton.addEventListener('click', function() {
        getAnimeInfos();
    });
}

function showRedirectButton() {
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
        console.log("Execute Script");
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: getAllInfos
        }, (result) => {
            let results = result[0].result;
            modifyAnimeTitle(results.AnimeTitle);
            modifyEpisodeTitle(results.episodeTitle);
            modifyEpisodeNumber(results.EpisodeNumber);
            //document.getElementById("name").innerText = result[0].result;
        });
      });
};





// Page interaction


function getAllInfos() {
    // Anime Link
    animeLink = document.getElementsByClassName('show-title-link');

    // Anime Title
    animeTitle = animeLink[0].firstChild.innerHTML;

    // Anime Episode Title "Episode Number - Episode Title"
    episodeTitleFull = document.getElementsByClassName('title')[0].innerHTML;

    // Anime Episode Title "Episode Title"
    episodeTitle = episodeTitleFull.split("-")[1]; // Split par "-" et récupérer le deuxième élément

    // Anime Episode Number "Episode Number"
    episodeNumber = episodeTitleFull.split("-")[0]; // Split par "-" et récupérer le premier élément
    AllInfos = {
        "AnimeTitle" : animeTitle,
        "episodeTitle" : episodeTitle,
        "EpisodeNumber" : episodeNumber
    };
    return AllInfos;
}