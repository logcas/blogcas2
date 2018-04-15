const getDate = require('../models/date');
const db = require('../models/db');

// api

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

// 获取文章列表（包含标题与概括登信息)，用于首页和文章页
async function getPostList(ctx,next) {
    const sum = 10; // 一次获取文章的数量
    var page = ctx.query.page;
    var offset = (page-1)*sum;
    var postList = await db.getPosts(offset,10);
    ctx.body = postList;
}

// 获取文章评论
async function getComments(ctx,next) {
    const sum = 5; // 一次获取评论的数量
    var postID = ctx.query.postID || '';
    var page = ctx.query.page;
    var offset = (page-1)*sum;
    if(postID==''){
        ctx.body = [];
    } else {
        var comments = await db.getComments(postID,offset,sum);
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
    var _id = await db.getPostsSum();  // 获得序号
    var post = {
        id:_id,
        title:ctx.body.title,
        content:ctx.body.content,
        tags:ctx.body.tags.trim(),
        isPrivate:ctx.body.private,
        date:getDate()
    };
    try{
        if(await db.addPost(post)){
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

async function testMysql(ctx,next) {
    try{
        var rows = await db.getTags();
        if(rows.length==0){
            ctx.body = '空';
        }
        var tags = [];
        rows.forEach(row=>{
            tags.push(row.tags);
        });
        tags = [...new Set(tags.join(',').split(','))];
        ctx.body = tags;
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
    testMysql:{
        method:'GET',
        url:'/api/test',
        func:testMysql
    }
}