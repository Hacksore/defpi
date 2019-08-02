const express = require('express')
const app = express();
const port = 3000;
const path = require('path');

const connectedClients = [];
const { exec } = require('child_process');
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
  exec('arp', response => {
    const lines = response.split('\n').splice(1, lines.length);

    lines.forEach(item => {
      const client = response.split(/(\s+)/).filter(item => item.trim().length > 0);
      connectedClients.push({
        hostname: client[0],
        address: client[2]
      });
    });
    console.log(stdout);
  });
}

// we are going to be on battery so keeping this scan limited is ideal
setInterval(scanForClients, 1000 * 300); // 5 minutes per scan

scanForClients();

app.listen(port);
