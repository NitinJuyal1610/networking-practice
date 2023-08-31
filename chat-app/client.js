const net = require('net');
const readline = require('readline/promises');

const PORT = 3000;
const HOST = '::1';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = async (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = async (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;

const socket = net.createConnection({ port: PORT, host: HOST }, async () => {
  const ask = async () => {
    const message = await rl.question('Enter a message > ');
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(`${id}-message-${message}`);
  };
  ask();
  socket.on('data', async (data) => {
    console.log();
    await moveCursor(0, -1);
    await clearLine(0);

    if (data.toString('utf-8').substring(0, 2) === 'id') {
      //we get an id
      id = data.toString('utf-8').substring(3);

      console.log('Your Id is ', id);
    } else {
      //we get a message
      console.log(data.toString('utf-8'));
    }
    ask();
  });

  socket.on('close', () => {
    console.log('Connected to the server was ended !');
  });

  socket.on('error', () => {
    socket.end();
  });
});
