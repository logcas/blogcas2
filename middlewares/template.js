const nunjucks = require('nunjucks');

function templating(opts){
    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views',{
        noCache:opts.noCache
    }));
    return async(ctx,next) => {
        ctx.render = (view,model) => {
            ctx.response.type = 'text/html';
            ctx.response.body = env.render(view,model);
        }
        await next();
    }
}

module.exports = templating;