const express = require('express')
const app = express();
const port = 1337;
const path = require('path');
const oui = require('oui');

let connectedClients = [];
const { exec, execSync, spawn } = require('child_process');
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/clients', (req, res) => {
  res.json(connectedClients);
});

function scanForClients() {
  connectedClients = [];
  exec('sudo arp-scan --localnet --interface=wlan0', (err, stdout, stderr) => {
    let lines = stdout.split('\n');
    lines = lines.splice(2, lines.length-5);

    lines.forEach(item => {
      const client = item.split('\t').filter(item => item[1] !== undefined);

      if (item[0] !== undefined) {
        connectedClients.push({
          ip: client[0],
          mac: client[1],
          vendor: client[2],
          ouiVendor: oui(client[1]).split('\n')
        });
      }
    });

    console.log(connectedClients);
    // after we gather all clients clear the arp table
    //execSync('sudo ip -s -s neigh flush all');
  });
}

// we are going to be on battery so keeping this scan limited is ideal
setInterval(scanForClients, 1000 * 30); // 30 seconds for now
scanForClients();

app.listen(port);
