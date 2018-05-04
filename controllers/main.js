var fs = require('mz/fs');
var path = require('path');
var getInfo = require('../models/setting');

async function index(ctx, next) {
    var info = getInfo();
    ctx.render('index.html', {
        pagename: info.title,
        introduction: info.introduction,
        webname: info.title
    });
}

async function posts(ctx, next) {
    var info = getInfo();
    ctx.render('posts.html', {
        pagename: '文章 - ' + info.title,
        webname: info.title
    });
}

async function tags(ctx, next) {
    var info = getInfo();
    ctx.render('tags.html', {
        pagename: '标签 - ' + info.title,
        webname: info.title
    });
}

async function about(ctx, next) {
    ctx.body = '还没写 - ';
}

async function login(ctx, next) {
    if (ctx.session.admin) {
        ctx.redirect('/');
    } else {
        var info = getInfo();
        ctx.render("login.html", {
            pagename: 'Login - ' + info.title,
            webname: info.title
        });
    }
}

async function forbiddenPage(ctx,next) {
    ctx.body = '你无权查看本文章';
}

async function testPage(ctx,next) {
    ctx.body = getInfo();
}

module.exports = {
    index: {
        method: 'GET',
        func: index,
        url: '/'
    },
    posts: {
        method: 'GET',
        func: posts,
        url: '/posts'
    },
    tags: {
        method: 'GET',
        func: tags,
        url: '/tags'
    },
    about: {
        method: 'GET',
        func: about,
        url: '/about'
    },
    login: {
        method: 'GET',
        func: login,
        url: '/login'
    },
    forbiddenPage: {
        method: 'GET',
        func: forbiddenPage,
        url:'/forbid'
    },
    testPage: {
        method: 'GET',
        func: testPage,
        url:'/getinfo'
    }
}