var cover = document.createElement('div');
createCover(cover);
var commentPanel = document.querySelector('#commentpanel');

function createCover(cover) {
    cover.setAttribute('class', 'cover');
    cover.style.display = 'none';
    cover.style.width = '100%';
    cover.style.height = '100%';
    cover.style.backgroundColor = '#b9b6b6';
    cover.style.opacity = '0.7';
    cover.style.position = 'fixed';
    cover.style.top = '0';
    cover.style.left = '0';
    cover.style.zIndex = '99';
    document.querySelector('html').appendChild(cover);
}

function showCover() {
    cover.style.display = 'block';
}

function hideCover() {
    cover.style.display = 'none';
}

var commentBtn = document.querySelector('#commentBtn');

commentPanel.addEventListener('click', (e) => {
    console.log('showcover');
    showCover();
    $(commentPanel).slideDown();
});

cover.addEventListener('click', (e) => {
    console.log('hidecover');
    hideCover();
    $(commentPanel).slideUp();
})
