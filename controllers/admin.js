async function admin(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    ctx.render('admin.html', {
        pagename: '后台管理demo'
    });
}

async function adminPosts(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    ctx.render('admin-post.html', {
        pagename: '后台管理demo'
    });
}

async function adminComments(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    ctx.render('admin-comment.html', {
        pagename: '后台管理demo'
    });
}

async function writePost(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    ctx.render('admin-write.html', {
        pagename: '后台管理demo'
    });
}

async function logout(ctx, next) {
    ctx.session.admin = false;
    ctx.body = '已登出';
}

module.exports = {
    admin: {
        method: 'GET',
        url: '/admin/',
        func: admin
    },
    adminPosts: {
        method: 'GET',
        url: '/admin/posts',
        func: adminPosts
    },
    adminComments: {
        method: 'GET',
        url: '/admin/comments',
        func: adminComments
    },
    writePost: {
        method: 'GET',
        url: '/admin/posts/publish',
        func: writePost
    },
    logout: {
        method: 'GET',
        url: '/admin/logout',
        func: logout
    }
}