const db = require('../models/db');
const marked = require('marked');

async function index(ctx, next) {
    var id = ctx.params.id;
    var post = await db.getPost(id);
    if (post.length != 0) {
        post = post[0];
        if(post.isPrivate == 1) {
            ctx.redirect('/forbid');
        }
        post.tags = post.tags.split(',');
        post.content = marked(post.content);
        ctx.render('article.html', {
            pagename: post.title,
            post: post,
        });
    } else {
        ctx.body = '文章不存在';
    }

}

module.exports = {
    index: {
        method: 'GET',
        url: '/post/:id',
        func: index
    }
}