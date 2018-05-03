var Koa = require('koa');
const app = new Koa();
const staticServe = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const templating = require('./template');
const session = require('koa-session-minimal');
const sessionStore = require('koa-mysql-session');
const config = require('./config/default');

var isProduction = process.env.NODE_ENV === 'production';

var sessionConfig = {
    user: config.database.USER,
    password: config.database.PASSWORD,
    database: config.database.DATABASE_NAME,
    host: config.database.HOST,
};

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });
  
  
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});


app.use(session({
    key: 'USER_SID',
    store: new sessionStore(sessionConfig)
}));

app.use(staticServe(__dirname + '/static'));

app.use(bodyParser());
app.use(templating({
    noCache:!isProduction
}));
app.use(router());
app.listen(8080);