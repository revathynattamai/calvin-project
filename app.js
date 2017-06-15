const express = require('express');

const app = express();

app.use(require('body-parser').json());

app.use('/circle', require('./api/circle'));

app.use('/mailbox', require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox/', require('./api/follow'));

module.exports = app;
