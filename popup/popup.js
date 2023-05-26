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

function showRedirectButton() {
    var notCrunchyDiv = document.getElementById('not-crunchy');
    notCrunchyDiv.style.display = 'block';

    var redirectButton = document.getElementById('redirect');
    redirectButton.addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://www.crunchyroll.com/' });
    });
}

function showCrunchy() {
    var crunchyList = document.getElementById('crunchy');
    crunchyList.style.display = 'block';
}


function logApiCrunchy() {

}
