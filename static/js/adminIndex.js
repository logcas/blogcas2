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

function createMsgBox(msg,type){
    var msgType = type || 'default';
    var message = msg || '';
    var msgBox = document.createElement('div');
    msgBox.className = 'msg';
    switch(msgType){
        case 'success':{
            msgBox.className += ' success';
            break;
        }
        case 'error':{
            msgBox.className += ' error';
            break;
        }
    }
    msgBox.style.width = '400px';
    msgBox.style.position = 'fixed';
    msgBox.style.top = '10%';
    msgBox.style.left = '50%';
    msgBox.style.transform = 'translateX(-50%)';
    msgBox.style.display = 'none';
    msgBox.style.zIndex = '999';
    msgBox.innerText = message;
    document.querySelector('body').appendChild(msgBox);
    return msgBox;
}

function showCover() {
    //cover.style.display = 'block';
    $(cover).fadeIn();
}

function hideCover() {
    //cover.style.display = 'none';
    $(cover).fadeOut();
}

function hidePanel(p){
    p.slideUp();
    p = null;
}

var cover = document.createElement('div');
createCover(cover);
var loginPanel = document.querySelector('#loginpanel');
var panel = null;
var loginBtn = document.querySelector('a[href="#Login"]');
var loginSubmit = document.querySelector('#login-submit');

loginBtn.addEventListener('click', (e) => {
    console.log('showcover');
    showCover();
    $(loginPanel).slideDown();
    panel = $(loginPanel);
});

loginSubmit.addEventListener('click',(e)=>{
    var msg = createMsgBox('登陆成功','success');
    $(msg).slideDown();
    setTimeout(()=>{
        $(msg).slideUp();
    },2000);
});

cover.addEventListener('click', (e) => {
    console.log('hidecover');
    hideCover();
    hidePanel(panel);
});

var registBtn = document.querySelector('a[href="#Register"]');
registBtn.addEventListener('click',(e)=>{
    showCover();
    var msg = createMsgBox('暂未开放注册','error');
    $(msg).slideDown();
    panel = $(msg);
});