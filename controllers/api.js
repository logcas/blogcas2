const getDate = require('../models/date');
const db = require('../models/db');

// api

// 提交评论
async function publishComment(ctx,next) {
    var { username,email,content,postID,postTitle } = ctx.request.body;
    var date = getDate();
    var id = parseInt((await db.getSum('comments'))[0].sum + 1);
    postID = parseInt(postID);
    var params = [postID,postTitle,id,username,content,email,date];
    console.log(params);
    try{
        await db.addComment(params);
        ctx.body = {
            done:true
        };
    } catch(e) {
        console.log('error:' + e);
        ctx.body = {
            done:false
        }
    }
}

// 获取文章、评论总数
async function getSum(ctx,next) {
    try {
        var sum = 0;
        switch(ctx.query.table){
            case 'posts':{
                sum = (await db.getSum('posts'))[0].sum;
                break;
            }
            case 'comments':{
                sum = (await db.getSum('comments'))[0].sum;
            }
        }
        ctx.body = sum;
        
    } catch(e){
        console.log('发生错误：' + e);
    }
}

async function getSumByTag(ctx,next) {
    var tagName = ctx.query.tag;
    var sum = (await db.getSumByTag(tagName))[0].sum;
    ctx.body = sum;
}

// 获取文章列表（包含标题与概括登信息)，用于首页和文章页
async function getPostList(ctx,next) {
    const sum = 10; // 一次获取文章的数量
    var page = ctx.query.page;
    var offset = (page-1)*sum;
    var postList = await db.getPosts(offset,10);
    ctx.body = postList;
}

// 按标签和页码获取文章列表
async function getPostsByTag(ctx,next) {
    var tagName = ctx.query.tag;
    var page = ctx.query.page;
    var postList = [];
    if(page) {
        postList = await db.getPostsByTag(tagName);
    } else {
        var offset = (page-1) * 5;
        postList = await db.getPostsByTag(tagName,offset);
    }
    ctx.body = postList;
}

// 获取文章评论
async function getComments(ctx,next) {
    var postID = ctx.query.postID || '';
    var page = ctx.query.page;
    if(postID==''){
        var comments = await db.getComments(postID,page);
        ctx.body = comments;
    } else {
        var comments = await db.getComments(postID,page);
        ctx.body = comments;
    }
}

// 获取所有标签
async function getTags(ctx,next) {
    var rows = await db.getTags();
    if(rows.length==0){
        ctx.body = [];
    }
    var tags = [];
    rows.forEach(row=>{
        tags.push(row.tags);
    });
    tags = [...new Set(tags.join(',').split(','))];
    ctx.body = tags;
}

// 登陆
async function loginAdmin(ctx,next) {
    var admin = await db.getAdmin();
    if(ctx.query.username == admin[0].username && ctx.query.password == admin[0].pw){
        ctx.session.admin = true;
        ctx.body = {
            check:true
        }
    } else {
        ctx.body = {
            check:false
        }
    }
}

// 发表文章/保存草稿
async function publishPost(ctx,next) {
    var _id = (await db.getSum('posts'))[0].sum + 1;  // 获得序号
    var params = [
        _id,
        ctx.request.body.title,
        ctx.request.body.content,
        ctx.request.body.tags.trim(),
        getDate(),
        ctx.request.body.isPrivate
    ];
    try{
        if(await db.addPost(params)){
            ctx.body = {
                done:true
            };
        }
    } catch(e){
        console.log('error:' + e);
        ctx.body = {
            done:false,
            err:'发生错误'
        };
    }
}

// 修改文章/修改草稿请求
async function editPost(ctx,next) {
    var params = [
        ctx.request.body.title,
        ctx.request.body.content,
        ctx.request.body.tags.trim(),
        ctx.request.body.isPrivate,
        ctx.request.body.id
    ];
    if(await db.editPost(params)){
        ctx.body = {
            done:true
        };
    } else {
        ctx.body = {
            done:false
        };
    }
}

// 删除文章
async function deletePosts(ctx,next) {
    var postids = '(' + ctx.request.body.arr.join(',') + ')';
    console.log(postids);
    if(await db.deleteSome('posts',postids)){
        ctx.body = {
            done:true
        };
    } else {
        ctx.body = {
            done:false
        };
    }
}

// 删除评论
async function deleteComments(ctx,next) {
    var commentids = '(' + ctx.request.body.arr.join(',') + ')';
    console.log(commentids);
    if(await db.deleteSome('comments',commentids)){
        ctx.body = {
            done:true
        };
    } else {
        ctx.body = {
            done:false
        };
    }
}

async function testMysql(ctx,next) {
    try{
        var params = [1,1,'Lucas','testcomments','123456@qq.com','2018/04/17'];
        await db.addComment(params);
        ctx.body = '插入成功';
    } catch (e) {
        console.log('error:' + e);
        ctx.body = '测试失败';
    }
}

module.exports = {
    getPostList:{
        method:'GET',
        url:'/api/getpostlist',
        func:getPostList
    },
    getComments:{
        method:'GET',
        url:'/api/getcomments',
        func:getComments
    },
    getTags:{
        method:'GET',
        url:'/api/gettags',
        func:getTags
    },
    loginAdmin:{
        method:'GET',
        url:'/api/login',
        func:loginAdmin
    },
    publishPost:{
        method:'POST',
        url:'/api/publishpost',
        func:publishPost
    },
    getSum:{
        method:'GET',
        url:'/api/getsum',
        func:getSum
    },
    publishComment:{
        method:'POST',
        url:'/api/publishcomment',
        func:publishComment
    },
    testMysql:{
        method:'GET',
        url:'/api/test',
        func:testMysql
    },
    getPostsByTag:{
        method:'GET',
        url:'/api/getpostsbytag',
        func:getPostsByTag
    },
    getSumByTag:{
        method:'GET',
        url:'/api/getsumbytag',
        func:getSumByTag
    },
    editPost:{
        method:'POST',
        url:'/api/editpost',
        func:editPost
    },
    deletePosts:{
        method:'POST',
        url:'/api/deleteposts',
        func:deletePosts
    },
    deleteComments:{
        method:'POST',
        url:'/api/deletecomments',
        func:deleteComments
    }
}