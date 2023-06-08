// Main function
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];

        if (currentTab.url.includes('crunchyroll.com')) {
            showCrunchy();
        } else {
            showRedirectButton();
        }
    });

});


function injectTheScript() {
    // Query the active tab, which will be only one tab and inject the script in it.
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['../background.js']})
    })
}
document.getElementById('animeTitle').addEventListener('click', injectTheScript)






function showRedirectButton() {
    var redirectButton = document.getElementById('crunchyroll-button');
    redirectButton.addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://www.crunchyroll.com/' });
    });
}

function printTitle() {
    const title = document.title;
    console.log(title);
};


function showAnimeTitle() {
    // var animeTitle = document.getElementsByClassName('show-title-link');
    var animeTitle = document.querySelector('.show-title-link');
    var animeTitle2 = document.querySelector('h4');

    console.log(animeTitle);
    console.log(animeTitle2);
    if (animeTitle != null || animeTitle != undefined) 
    {
        document.getElementById('name').innerHTML = document.title;
        return;
    }
    document.getElementById('name').innerHTML = "Undefined";

    
    chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: printTitle,
        //        files: ['contentScript.js'],  // To call external file instead
    }).then(() => console.log('Injected a function!'));
    
}

function showCrunchy() {
    var crunchyList = document.getElementById('crunchy');
    crunchyList.style.display = 'block';
}


function logApiCrunchy() {

}
