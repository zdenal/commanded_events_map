const Koa = require('koa');
const cors = require('koa2-cors');

const PORT = 5000;

const server = new Koa();

server
  .use(cors())
  .use(ctx => {
    const jsonData = require('../data.json');
    ctx.body = jsonData;
  })
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
