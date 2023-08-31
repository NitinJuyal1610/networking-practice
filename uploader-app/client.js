const net = require('net');
const path = require('path');
const fs = require('fs/promises');

const PORT = 4000;
const HOST = '::1';

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

const socket = net.createConnection({ port: PORT, host: HOST }, async () => {
  const filePath = process.argv[2];

  const fileName = path.basename(filePath);

  const fileSize = (await fs.stat(filePath)).size;

  let uploadedPercentage = 0;
  let bytesUploaded = 0;
  socket.write(`fileName: ${fileName}------`);

  const fileHandle = await fs.open(filePath, 'r');
  const fileStream = fileHandle.createReadStream();

  fileStream.on('data', async (data) => {
    const canWrite = socket.write(data);
    if (!canWrite) {
      fileStream.pause();
    }

    bytesUploaded += data.length;
    let newPercentage = Math.floor((bytesUploaded / fileSize) * 100);
    if (newPercentage % 5 === 0 && newPercentage !== uploadedPercentage) {
      uploadedPercentage = newPercentage;
      // await moveCursor(0, -1);
      // await clearLine(0);
      // console.log(`Uploading... ${uploadedPercentage}%`);
    }
  });

  socket.on('drain', () => {
    fileStream.resume();
  });

  fileStream.on('end', () => {
    console.log('File successfully uploaded! ');
    fileHandle.close();
    socket.end();
  });
});
