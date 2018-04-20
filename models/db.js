var mysql = require('mysql');

function getTags() {
    var query = 'select tags from posts';
    return queryFunc(query);
}

function getComments(postID, start, sum) {
    var queryStart = start || 0;
    var querySum = sum || 5;
    var query = `select * from comments where postID=${postID} order by id desc limit ${queryStart},${querySum};`;
    return queryFunc(query);
}

function getPosts(start, sum) {
    var queryStart = start || 0;
    var querySum = sum || 10;
    var query = `select * from posts order by id desc limit ${queryStart},${querySum};`;
    return queryFunc(query);
}

function getPostsByTag(tagName, offset) {
    var query = '';
    if (offset) {
        query = `select * from posts where tags like '%${tagName}%' order by id desc limit ${offset},5`;
        return queryFunc(query);
    }
    query = `select * from posts where tags like '%${tagName}%' order by id desc`;
    return queryFunc(query);
}

function getAdmin() {
    var query = 'select * from admin;';
    return queryFunc(query);
}

function addPost(params) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '3321666',
            database: 'blogcas'
        });
        connection.connect((err) => {
            if (err) {
                console.log(err);
                throw new Error('连接数据库时出错');
            }
            connection.query('INSERT INTO posts(id,title,content,tags,publishDate,isPrivate) VALUES(?,?,?,?,?,?)'
                , params
                , function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        throw new Error('插入失败');
                    }
                    resolve(true);
                });
        });
    });
}

function addComment(params) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '3321666',
            database: 'blogcas'
        });
        connection.connect((err) => {
            if (err) {
                console.log(err);
                throw new Error('连接数据库时出错');
            }
            connection.query('INSERT INTO comments(postid,id,username,content,email,publishdate) VALUES(?,?,?,?,?,?)'
                , params
                , function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        throw new Error('插入失败');
                    }
                    resolve(true);
                });
        });
    });
}

function testMysql(params) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '3321666',
            database: 'blogcas'
        });
        connection.connect((err) => {
            if (err) {
                console.log(err);
                throw new Error('连接数据库时出错');
            }
            connection.query('INSERT INTO test(id,text) VALUES(?,?)'
                , params
                , function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        throw new Error('插入失败');
                    }
                    resolve(true);
                });
        });
    });
}

function getPost(id) {
    var query = `select * from posts where id=${id};`;
    return queryFunc(query);
}

function getSum(table) {
    var query = `select count(*) as sum from ${table}`;
    return queryFunc(query);
}

function getSumByTag(tagName) {
    var query = `select count(*) as sum from posts where tags like '%${tagName}%'`;
    return queryFunc(query);
}

function queryFunc(query) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '3321666',
            database: 'blogcas'
        });
        connection.connect((err) => {
            if (err) {
                console.log(err);
                throw new Error('连接数据库时出错');
            }
            connection.query(query, (err, rows, fields) => {
                connection.end();
                if (err) {
                    console.log(err);
                    throw (new Error('查询出错'));
                }
                resolve(rows);
            });
        });
    });
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
    testMysql: testMysql,
    getPostsByTag: getPostsByTag,
    getSumByTag: getSumByTag
}