const express = require('express');

const postsRouter = require('./data/posts-router.js');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

//get the base url
server.get('/', (req, res) => {
    res.send(`
    <h2>Andrew's Posts API</h2>`)
});

server.listen(4000, () => {
    console.log(`\n*** Server Listening at 4000 ***\n`);
});