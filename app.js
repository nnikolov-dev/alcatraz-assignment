const Koa = require('koa');
const mongoose = require('mongoose')
const koaBody = require('koa-body');
const serve = require('koa-static');
const path = require('path')
const Router = require('koa-router')

// DB Config
if (process.env.NODE_ENV === 'TEST') {
    mongoose.connect(process.env.MONGODB_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
  } else {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// Creating app instance
const app = new Koa();

// Route Config
const router = new Router();
const threadRoutes = require('./api/thread/index')
router.use('/thread', threadRoutes.routes(), threadRoutes.allowedMethods());

app
    .use(koaBody())
    .use(router.routes())
    .use(serve(path.join(__dirname , './public')))

module.exports = app