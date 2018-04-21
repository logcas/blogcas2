const db = require('../models/db');

async function admin(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    ctx.render('admin.html', {
        pagename: '后台管理'
    });
}

async function adminPosts(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    ctx.render('admin-post.html', {
        pagename: '文章管理'
    });
}

async function adminComments(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    ctx.render('admin-comment.html', {
        pagename: '评论管理'
    });
}

async function writePost(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    ctx.render('admin-write.html', {
        pagename: '发表文章'
    });
}

async function editPost(ctx, next) {
    if (!ctx.session.admin) {
        ctx.redirect('/');
    }
    var id = ctx.query.id;
    var sum = (await db.getSum('posts'))[0].sum;
    if (id <= sum) {
        var post = (await db.getPost(id))[0];
            ctx.render('admin-edit.html', {
                pagename: '编辑文章',
                post:post
            });
    } else {
        ctx.redirect('/');
    }

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
    },
    editPost: {
        method:'GET',
        url:'/admin/edit',
        func:editPost
    }
}