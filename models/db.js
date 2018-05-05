var mysql = require('mysql');
var config = require('../config/default');

var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USER,
    password: config.database.PASSWORD,
    database: config.database.DATABASE_NAME
});

// query function
function query(query,values){
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            if(err) {
                reject(new Error(err.message));
            }
            connection.query(query,values,(err,result,fields)=>{
                if(err) {
                    reject(new Error(err.message));
                }
                connection.release();
                resolve(result);
            });
        });
    });
}

// 获取所有标签
function getTags() {
    var sqlquery = 'select tags from posts';
    return query(sqlquery);
}

// 获取所有评论（包含未审核的、已审的）
function getComments(postID, page) {
    var queryStart = 0;
    var querySum = 5;
    var sqlquery = '';
    var values = [];
    if (postID != '') { // 按文章获取评论
        queryStart = (page - 1) * querySum;
        sqlquery = 'select * from comments where postID = ? order by id desc limit ?,?;';
        values.push(postID,queryStart,querySum);
    } else { // 获取所有评论
        querySum = 10;
        queryStart = (page - 1) * querySum;
        sqlquery = `select * from comments order by id desc limit ?,?;`;
        values.push(queryStart,querySum);
    }
    return query(sqlquery,values);
}

// 获取已审核的评论
function getPublishComment(postID,page){
    var queryStart = 0;
    var querySum = 5;
    var sqlquery = '';
    var values = [];
    if (postID != '') { // 按文章获取评论
        queryStart = (page - 1) * querySum;
        sqlquery = 'select * from comments where postID = ? and ispublish = 1 order by id desc limit ?,?;';
        values.push(postID,queryStart,querySum);
    } else { // 获取所有评论
        querySum = 10;
        queryStart = (page - 1) * querySum;
        sqlquery = `select * from comments where ispublish = 1 order by id desc limit ?,?;`;
        values.push(queryStart,querySum);
    }
    return query(sqlquery,values);
}

// 获取未审核的评论
function getUnpublishComment(postID,page){
    var queryStart = 0;
    var querySum = 5;
    var sqlquery = '';
    var values = [];
    if (postID != '') { // 按文章获取评论
        queryStart = (page - 1) * querySum;
        sqlquery = 'select * from comments where postID = ? and ispublish = 0 order by id desc limit ?,?;';
        values.push(postID,queryStart,querySum);
    } else { // 获取所有评论
        querySum = 10;
        queryStart = (page - 1) * querySum;
        sqlquery = `select * from comments where ispublish = 0 order by id desc limit ?,?;`;
        values.push(queryStart,querySum);
    }
    return query(sqlquery,values);
}

// 审核\关闭评论
function checkComments(id,isPublish){
    var sqlquery = `UPDATE comments set ispublish = ? where id in ${id}`;
    return query(sqlquery,[isPublish]);
}

// 获取所有文章
function getPosts(start, sum, isPrivate) {
    var queryStart = start || 0;
    var querySum = sum || 10;
    var sqlquery = '';
    var values = [];
    if (typeof isPrivate == 'number') {
        console.log('private');
        sqlquery = `select * from posts where isPrivate = ? order by id desc limit ?,?;`;
        values.push(isPrivate,queryStart,querySum);
    } else {
        sqlquery = `select * from posts order by id desc limit ?,?;`;
        values.push(queryStart,querySum);
    }
    return query(sqlquery,values);
}

// 按标签获取文章 bugs
function getPostsByTag(tagName, offset, isPrivate) {
    var sqlquery = '';
    var values = [];
    if (typeof isPrivate == 'number') {
        if (offset) {
            sqlquery = `select * from posts where tags like ? and isPrivate = ? order by id desc limit ?,5`;
            values.push(`%${tagName}%`,isPrivate,offset);
            return query(sqlquery,values);
        }
        sqlquery = `select * from posts where tags like ? and isPrivate = ? order by id desc`;
        values.push(`%${tagName}%`,isPrivate);
    } else {
        if (offset) {
            query = `select * from posts where tags like ? order by id desc limit ?,5`;
            return query(sqlquery,[`%${tagName}%`,offset]);
        }
        sqlquery = `select * from posts where tags like ? order by id desc`;
        values.push(`%${tagName}%`);
    }
    return query(sqlquery,values);
}

// 获取管理员
function getAdmin() {
    var sqlquery = 'select * from admin;';
    return query(sqlquery);
}

// 增加文章
function addPost(values) {
    var sqlquery = 'INSERT INTO posts(id,title,content,tags,publishDate,isPrivate) VALUES(?,?,?,?,?,?)';
    return query(sqlquery,values);
}

// 增加评论
function addComment(values) {
    var sqlquery = 'INSERT INTO comments(postid,posttitle,id,username,content,email,publishdate) VALUES(?,?,?,?,?,?,?)';
    return query(sqlquery,values);
}

// 根据文章ID获取文章
function getPost(id) {
    var sqlquery = `select * from posts where id=?;`;
    return query(sqlquery,[id]);
}

// 获取最新的ID(评论ID或文章ID)
function getID(table) {
    var sqlquery = `select max(id) as id from ??`;
    return query(sqlquery,[table]);
}

// 获取数量
function getSum(table, id) {
    var sqlquery = '';
    var values = [];
    if (typeof id == 'number') {
        sqlquery = `select count(*) as sum from ?? where postid = ?`;
        values.push(table,id);
    } else {
        sqlquery = `select count(*) as sum from ??`;
        values.push(table);
    }
    return query(sqlquery,values);
}

// 通过标签-获取文章数量
function getSumByTag(tagName) {
    var sqlquery = `select count(*) as sum from posts where tags like '%${tagName}%'`;
    return query(sqlquery);
}

// 修改文章
function editPost(values) {
    var sqlquery = 'UPDATE posts set title = ?,content = ?,tags = ?,isPrivate = ? where id = ?';
    return query(sqlquery,values);
}

// 删除文章或评论
function deleteSome(table, params) {
    var sqlquery = `delete from ?? where id in ${params}`;
    return query(sqlquery,[table]);
}

module.exports = {
    addPost: addPost,
    getPost: getPost,
    getSum: getSum,
    getAdmin: getAdmin,
    getPosts: getPosts,
    getComments: getComments,
    getTags: getTags,
    addComment: addComment,
    getPostsByTag: getPostsByTag,
    getSumByTag: getSumByTag,
    editPost: editPost,
    deleteSome: deleteSome,
    getID: getID,
    getPublishComment: getPublishComment,
    getUnpublishComment: getUnpublishComment,
    checkComments: checkComments
}