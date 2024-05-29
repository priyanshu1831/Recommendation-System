const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger'); // Add logger middleware
const path = require('path');
const fs = require('fs');




const app = new Koa();
const router = new Router();

app.use(logger()); // Use logger middleware
app.use(bodyParser());
app.use(require('koa-static')(path.resolve(__dirname, 'public')));
// Dummy in-memory database for logs
const logsData = [];

async function retrieveLogs() {
  return logsData;
}

async function addLog(log) {
  logsData.push(log);
}

// Validate log object
function validateLog(log) {
  if (!log || typeof log.text !== 'string' || !log.text.trim()) {
    throw new Error('Invalid log object. Text field is required.');
  }
}

// Routes
router.get('/logs', async (ctx) => {
  try {
    const logs = await retrieveLogs();
    ctx.body = logs;
  } catch (error) {
    console.error('Error retrieving logs:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message }; // Include error message
  }
});

router.post('/logs', async (ctx) => {
  try {
    const newLog = ctx.request.body;

    validateLog(newLog);

    await addLog(newLog);
    ctx.body = { message: 'Log added successfully' };
  } catch (error) {
    console.error('Error adding log:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message }; // Include error message
  }
});

// Serve HTML page
router.get('/', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(path.resolve(__dirname, 'public', 'index.html'));
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
