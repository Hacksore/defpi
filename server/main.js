const express = require('express')
const app = express();
const port = 3000;
const path = require('path');

let connectedClients = [];
const { exec, execSync } = require('child_process');
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/clients', (req, res) => {
  res.json(connectedClients);
});

/* example output
pi@raspberrypi:~ $ arp
Address                  HWtype  HWaddress           Flags Mask            Iface
Seans-MBP                ether   f0:f0:f0:f0:f0:f0   C                     wlan0
GOTEM                    ether   f0:f0:f0:f0:f0:f0   C                     wlan0
*/

function scanForClients() {
  connectedClients = [];
  exec('arp', (err, stdout, stderr) => {
    let lines = stdout.split('\n');
    lines = lines.splice(1, lines.length);

    lines.forEach(item => {
      const client = item.split(/(\s+)/).filter(item => item.trim().length > 0);

      if (item[0] !== undefined) {
        connectedClients.push({
          hostname: client[0],
          address: client[2]
        });
      }
    });

    console.log(connectedClients);
    // after we gather all clients clear the arp table
    execSync('sudo ip -s -s neigh flush all');
  });
}

// we are going to be on battery so keeping this scan limited is ideal
setInterval(scanForClients, 1000 * 300); // 5 minutes per scan

scanForClients();

app.listen(port);
