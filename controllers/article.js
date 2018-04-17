const db = require('../models/db');

async function index(ctx, next) {
    var id = ctx.params.id;
    var post = await db.getPost(id);
    if (post.length != 0) {
        post = post[0];
        post.tags = post.tags.split(',');
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