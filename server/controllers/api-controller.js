const tempDb = require('../db/temperature');

let clients = [];

exports.getTemps = (req, res) => {
  tempDb.getAllTemps().then((rows) => {
    res.json({
      temperatureData: rows.sort((row1, row2) => row2.timestamp - row1.timestamp).slice(0, 5000),
    });
  }).catch((err) => {
    res.status(500);
    res.json({
      error: err.message || err,
    });
  });
};

exports.addClient = (req, res) => {
  // Mandatory headers and http status to keep connection open
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  });
  res.flushHeaders();
  // After client opens connection send all nests as string
  res.write('Connection is ready \n\n');
  // Generate an id based on timestamp and save res
  // object of client connection on clients list
  // Later we'll iterate it and send updates to each client
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };
  // eslint-disable-next-line no-console
  console.log(`New connection: ${clientId}`);
  clients.push(newClient);
  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on('close', () => {
    // eslint-disable-next-line no-console
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((c) => c.id !== clientId);
  });
};

exports.sendDataToAllClient = (data) => {
  clients.forEach((c) => c.res.write(`data: ${JSON.stringify(data)}\n\n`));
};
