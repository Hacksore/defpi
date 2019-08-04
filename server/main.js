const express = require('express')
const app = express();
const path = require('path');
const oui = require('oui');
const { exec } = require('child_process');
let port = 1337;

if (process.env.NODE_ENV !== 'production') {
  console.log('We are in dev mode 😎')
  port = 8080;
}

let connectedClients = [];

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
  
  const command = 'sudo arp-scan --localnet --interface=wlan0';
  exec(command, (err, stdout, stderr) => {

    let lines = stdout.split('\n');    
    lines = lines.splice(2, lines.length-6);
    
    lines.forEach(item => {
      const client = item.split(/(\s+)/).filter(item => item.trim().length > 0);

      if (item[0] !== undefined) {
        connectedClients.push({
          ip: client[0],
          mac: client[1],
          ouiInfo: oui(client[1]).split('\n')
        });
      }
    });

  });
}

// we are going to be on battery so keeping this scan limited is ideal
setInterval(scanForClients, 1000 * 30); // 30 seconds for now
scanForClients();

app.listen(port);
