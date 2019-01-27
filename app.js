const express = require('express');
const middlewares = require('./lib/middlewares');
const { server, debug } = require('./etc/config');
const router = require('./lib/router');

const { port, host } = server;
const app = express();

app.use(middlewares.cors);
app.use(router);

app.listen({ port, host }, () => {
    console.log(`Listening ${ host }:${ port }...`);
});

module.exports = app;
