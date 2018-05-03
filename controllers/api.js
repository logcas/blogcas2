const getDate = require('../models/date');
const db = require('../models/db');

// api

// 提交评论
async function publishComment(ctx, next) {
    var { username, email, content, postID, postTitle } = ctx.request.body;
    var date = getDate();
    var id = null;
    await db.getID('comments')
    .then((data)=>{
        id = data[0].id + 1;
    })
    .catch((err)=>{
        console.log(err.message);
        ctx.body = { done: false };
    });
    postID = parseInt(postID);
    var params = [postID, postTitle, id, username, content, email, date];
    console.log(params);
    await db.addComment(params)
        .then((data) => {
            ctx.body = { done: true };
        })
        .catch((err) => {
            console.log('error:' + err.message);
            ctx.body = { done: false }
        });
}

// 获取文章、评论总数
async function getSum(ctx, next) {
    var sum = 0;
    var id = null;
    if (ctx.query.id) {
        id = parseInt(ctx.query.id);
    }
    switch (ctx.query.table) {
        case 'posts': {
            await db.getSum('posts')
                .then((data) => {
                    ctx.body = data[0].sum;
                })
                .catch((err) => {
                    console.log(err.message);
                    ctx.body = 'Null';
                });
            break;
        }
        case 'comments': {
            if (typeof id == 'number') {
                await db.getSum('comments', id)
                    .then((data) => {
                        ctx.body = data[0].sum;
                    })
                    .catch((err) => {
                        console.log(err.message);
                        ctx.body = 'Null';
                    });
            } else {
                await db.getSum('comments')
                    .then((data) => {
                        ctx.body = data[0].sum;
                    })
                    .catch((err) => {
                        console.log(err.message);
                        ctx.body = 'Null';
                    });
            }
            break;
        }
    }
}

async function getSumByTag(ctx, next) {
    var tagName = ctx.query.tag;
    await db.getSumByTag(tagName)
        .then((data) => {
            ctx.body = data[0].sum;
        })
        .catch((err) => {
            ctx.body = 0;
            console.log(err.message);
        });
}

// 获取文章列表（包含标题与概括登信息)，用于首页和文章页
async function getPostList(ctx, next) {
    const sum = 10; // 一次获取文章的数量
    var page = ctx.query.page;
    var isPrivate = null;
    if (ctx.query.isPrivate) {
        isPrivate = Number(ctx.query.isPrivate);
    }
    var offset = (page - 1) * sum;
    await db.getPosts(offset, 10, isPrivate)
        .then((data) => {
            ctx.body = data;
        })
        .catch((err) => {
            ctx.body = [];
            console.log(err.message);
        });
}

// 按标签和页码获取文章列表
async function getPostsByTag(ctx, next) {
    var tagName = ctx.query.tag;
    var page = ctx.query.page;
    var isPrivate = null;
    if (ctx.query.isPrivate) {
        isPrivate = Number(ctx.query.isPrivate);
    }
    var postList = [];
    if (page) {

        postList = await db.getPostsByTag(tagName, null, isPrivate);
        await db.getPostsByTag(tagName, null, isPrivate)
            .then((data) => {
                ctx.body = data;
            })
            .catch((err) => {
                ctx.body = [];
                console.log(err.message);
            });

    } else {

        var offset = (page - 1) * 5;
        await db.getPostsByTag(tagName, offset, isPrivate)
            .then((data) => {
                ctx.body = data;
            })
            .catch((err) => {
                ctx.body = [];
                console.log(err.message);
            });

    }
}

// 获取文章评论
async function getComments(ctx, next) {
    var postID = ctx.query.postID || '';
    var page = ctx.query.page;
    await db.getComments(postID, page)
        .then((data) => {
            ctx.body = data;
        })
        .catch((err) => {
            ctx.body = [];
            console.log(err.message);
        });
}

// 获取所有标签
async function getTags(ctx, next) {
    await db.getTags()
        .then((rows) => {
            if (rows.length == 0) {
                ctx.body = [];
            }
            var tags = [];
            rows.forEach(row => {
                tags.push(row.tags);
            });
            tags = [...new Set(tags.join(',').split(','))];
            ctx.body = tags;
        })
        .catch((err) => {
            ctx.body = [];
            console.log(err.message);
        });
}

// 登陆
async function loginAdmin(ctx, next) {
    await db.getAdmin()
        .then((admin) => {
            if (ctx.query.username == admin[0].username && ctx.query.password == admin[0].pw) {
                ctx.session.admin = true;
                ctx.body = { check: true }
            } else {
                ctx.body = { check: false }
            }
        })
        .catch((err) => {
            ctx.body = { check: false };
            console.log(err.message);
        });
}

// 发表文章/保存草稿
async function publishPost(ctx, next) {
    var _id = (await db.getID('posts'))[0].id + 1;  // 获得序号
    var params = [
        _id,
        ctx.request.body.title,
        ctx.request.body.content,
        ctx.request.body.tags.trim(),
        getDate(),
        ctx.request.body.isPrivate
    ];
    await db.addPost(params)
    .then((data)=>{
        ctx.body = {done: true};
    })
    .catch((err)=>{
        ctx.body = {done:false,err:err.message};
        console.log(err.message);
    });
}

// 修改文章/修改草稿请求
async function editPost(ctx, next) {
    var params = [
        ctx.request.body.title,
        ctx.request.body.content,
        ctx.request.body.tags.trim(),
        ctx.request.body.isPrivate,
        ctx.request.body.id
    ];
    await db.editPost(params)
    .then((data)=>{
        ctx.body = {done: true};
    })
    .catch((err)=>{
        ctx.body = {done: false};
    });
}

// 删除文章
async function deletePosts(ctx, next) {
    var postids = '(' + ctx.request.body.arr.join(',') + ')';
    console.log(postids);
    await db.deleteSome('posts', postids)
    .then((data)=>{
        ctx.body = {done: true};
    })
    .catch((err)=>{
        console.log(err.message);
        ctx.body = {done: false};
    });
}

// 删除评论
async function deleteComments(ctx, next) {
    var commentids = '(' + ctx.request.body.arr.join(',') + ')';
    console.log(commentids);
    await db.deleteSome('comments', commentids)
    .then((data)=>{
        ctx.body = {done: true};
    })
    .catch((err)=>{
        ctx.body = {done: false};
    });
}

module.exports = {
    getPostList: {
        method: 'GET',
        url: '/api/getpostlist',
        func: getPostList
    },
    getComments: {
        method: 'GET',
        url: '/api/getcomments',
        func: getComments
    },
    getTags: {
        method: 'GET',
        url: '/api/gettags',
        func: getTags
    },
    loginAdmin: {
        method: 'GET',
        url: '/api/login',
        func: loginAdmin
    },
    publishPost: {
        method: 'POST',
        url: '/api/publishpost',
        func: publishPost
    },
    getSum: {
        method: 'GET',
        url: '/api/getsum',
        func: getSum
    },
    publishComment: {
        method: 'POST',
        url: '/api/publishcomment',
        func: publishComment
    },
    getPostsByTag: {
        method: 'GET',
        url: '/api/getpostsbytag',
        func: getPostsByTag
    },
    getSumByTag: {
        method: 'GET',
        url: '/api/getsumbytag',
        func: getSumByTag
    },
    editPost: {
        method: 'POST',
        url: '/api/editpost',
        func: editPost
    },
    deletePosts: {
        method: 'POST',
        url: '/api/deleteposts',
        func: deletePosts
    },
    deleteComments: {
        method: 'POST',
        url: '/api/deletecomments',
        func: deleteComments
    }
}