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

$('#btn').click(function(e){
    $(this).toggleClass('isActive');
    $('.nav-side').fadeToggle();
})

var isFocus = false;

$('#search-box').click(function(e){
    isFocus = true;
});

$('#search-box').blur(function(e){
    isFocus = false;
});

$(document).keypress(function(e){
    var code = e.keyCode || e.which;
    if(code == 13 && isFocus){
        alert('huiche');
    }
});