async function index(ctx, next) {
    ctx.render('index.html', {
        pagename: 'Blogcas',
    });
}

async function posts(ctx, next) {
    ctx.render('posts.html', {
        pagename: '文章 - Blogcas'
    });
}

async function tags(ctx, next) {
    ctx.render('tags.html', {
        pagename: '标签 - Blogcas'
    });
}

async function about(ctx, next) {
    ctx.body = '还没写';
}

async function login(ctx, next) {
    if (ctx.session.admin) {
        ctx.redirect('/');
    } else {
        ctx.render("login.html", {
            pagename: 'Login'
        });
    }
}

async function forbiddenPage(ctx,next) {
    ctx.body = '你无权查看本文章';
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
    }
}