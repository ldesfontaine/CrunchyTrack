document.getElementById('bouton').addEventListener('click', function() {
    if (window.location.href !== 'www.crunchyroll.com') {
        window.location.href = 'www.crunchyroll.com';
    } else {
        alert('Bravo');
    }
});
