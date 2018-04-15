var mysql = require('mysql');

function getTags() {
    var query = 'select tags from posts';
    return queryFunc(query);
}

function getComments(postID, start, sum) {
    var queryStart = start || 0;
    var querySum = sum || 5;
    var query = `select * from posts where postID=${postID} order by id limit ${queryStart},${querySum};`;
    return queryFunc(query);
}

function getPosts(start, sum) {
    var queryStart = start || 0;
    var querySum = sum || 10;
    var query = `select * from posts order by id limit ${queryStart},${querySum};`;
    return queryFunc(query);
}

function getAdmin() {
    var query = 'select * from admin;';
    return queryFunc(query);
}

function addPost(post) {
    var query = 'insert into posts'
        + `values(${post.id},${post.title},${post.content},${post.tags},${post.date});`;
    return queryFunc(query);
}

function getPost(id) {
    var query = `select * from posts where id=${id};`;
    return queryFunc(query);
}

function getSum(table) {
    var query = `select count(*) as sum from ${table}`;
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
}