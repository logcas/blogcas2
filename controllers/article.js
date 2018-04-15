const db = require('../models/db');

async function index(ctx,next) {
    var id = ctx.params.id;
    var post = await db.getPost(id);
    post.tags = post.tags.split(',');
    ctx.render('article.html',{
        pagename:'Blogcas 2.0 demo article',
        post:post
    });
}

module.exports = {
    index:{
        method:'GET',
        url:'/post/:id',
        func:index
    }
}