const db = require('../models/db');
const marked = require('marked');
var getInfo = require('../models/setting');

async function index(ctx, next) {
    var id = ctx.params.id;
    var post = await db.getPost(id);
    if (post.length != 0) {
        post = post[0];
        if (post.isPrivate == 1) {
            ctx.redirect('/forbid');
        }
        post.tags = post.tags.split(',');
        post.content = marked(post.content);
        var info = getInfo();
        ctx.render('article.html', {
            pagename: post.title,
            post: post,
            webname: info.title
        });
    } else {
        ctx.body = '文章不存在';
    }
}

async function privatePost(ctx, next) {
    if (ctx.session.admin) {
        var id = ctx.params.id;
        var post = await db.getPost(id);
        if (post.length != 0) {
            post = post[0];
            if (post.isPrivate == 0) {
                ctx.redirect('/forbid');
            }
            post.tags = post.tags.split(',');
            post.content = marked(post.content);
            var info = getInfo();
            ctx.render('article-private.html', {
                pagename: '草稿箱：' + post.title,
                post: post,
                webname: info.title
            });
        } else {
            ctx.body = '文章不存在';
        }
    } else {
        ctx.redirect('/forbid');
    }

}

module.exports = {
    index: {
        method: 'GET',
        url: '/post/:id',
        func: index
    },
    privatePost: {
        method: 'GET',
        url: '/private/:id',
        func: privatePost
    }
}