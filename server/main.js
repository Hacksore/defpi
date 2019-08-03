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

function detminePlaform(input) {
  const vendor = input.toLowerCase();

  if (vendor.includes('asus')) {
    return 'windows';
  }
  if (vendor.includes('htc')) {
    return 'windows';
  }
  if (vendor.includes('intel')) {
    return 'windows';
  }
  else if (vendor.includes('mac')) {
    return 'mac';
  }
  else if (vendor.includes('apple')) {
    return 'apple';
  }
  else if (vendor.includes('google')) {
    return 'linux';
  } else {
    // all hackers use linux
    return 'linux'
  }
  
}


function scanForClients() {
  connectedClients = [];
  exec('sudo arp-scan --interface=en0 192.168.86.0/24', (err, stdout, stderr) => {
    let lines = stdout.split('\n');
    lines = lines.splice(2, lines.length-5);

    lines.forEach(item => {
      const client = item.split('\t').filter(item => item[1] !== undefined);
      //console.log(client);
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
setInterval(scanForClients, 1000 * 300); // 5 minutes per scan
scanForClients();

app.listen(port);
