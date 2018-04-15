const fs = require('fs');

function addMapping(router,mappings){
    for(var key in mappings){
        let mapping = mappings[key];
        if(mapping.method == 'GET'){
            router.get(mapping.url,mapping.func);
            console.log(`setting router: GET ${mapping.url}`);
        } else if(mapping.method == 'POST'){
            router.post(mapping.url,mapping.func);
            console.log(`setting router: Post ${mapping.url}`);
        } else {
            console.log(`setting failed:${mapping.url}`);
        }
    }
}

function readFiles(dir){
    var files = fs.readdirSync(dir).filter((f)=>{
        return f.endsWith('.js');
    });
    return files;
}

function addRouters(files,router,dir){
    files.forEach(mapping =>{
        let mappings = require(__dirname + dir + mapping);
        addMapping(router,mappings);
    });
}

module.exports = function(dirname){
    var dir = dirname || '/controllers/';
    var router = require('koa-router')();
    var files = readFiles(__dirname + dir);
    addRouters(files,router,dir);
    return router.routes();
}