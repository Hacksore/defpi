const express = require('express')
const app = express();
const path = require('path');
const oui = require('oui');
const { exec } = require('child_process');
const _ = require('lodash');
const fs = require('fs');

let port = 1337;
let wifiConfig = '/etc/hostapd/hostapd.conf';

let arpCommand = 'sudo arp-scan --localnet --interface=wlan0'
if (process.env.NODE_ENV === 'development') {
  console.log('We are in dev mode 😎')
  port = 8080;
  wifiConfig = path.join(__dirname, '../config/hostapd.conf');;
  // the ole macbook haz different interface
  arpCommand = 'sudo arp-scan --localnet --interface=en0'
}

app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  next();
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/clients', async (req, res) => {
  const clients = await scanForClients();
  res.json(clients);
});

// TODO: make ssid random?
app.get('/ssid', (req, res) => {
  const fileData = fs.readFileSync(wifiConfig).toString();
  const regex = /ssid=(.*)/gi;
  const match = regex.exec(fileData)[1];

  res.json({ 
    network: match
  });
});

function scanForClients() {

  return new Promise((resolve, reject) => {
    let connectedClients = [];
    
    exec(arpCommand, (err, stdout, stderr) => {

      let lines = stdout.split('\n');    
      lines = lines.splice(2, lines.length-6);
      
      lines.forEach(item => {
        const client = item.split(/(\s+)/).filter(item => item.trim().length > 0);

        if (item[0] !== undefined) {
          const info = {
            ip: client[0],
            mac: client[1]
          }

          try {
            info.vendor = oui(client[1]).split('\n')[0];
          } catch (e) {
            info.vendor = 'Anonymous'
          }

          connectedClients.push(info);
        }
      });

      const groupClients = _.groupBy(connectedClients, 'vendor');
      const vendorCounts = [];
      for (const key in groupClients) {
        vendorCounts.push({
          name: key,
          count: groupClients[key].length
        });
      }

      resolve({
        clients: connectedClients,
        vendorCounts: _.sortBy(vendorCounts, 'count').reverse()
      });

    });
  });
}

// we don't want everyone to access this only the pi
app.listen(port, '127.0.0.1');
