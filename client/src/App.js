import React, { PureComponent } from 'react';
import './App.css';
import Terminal from './terminal/terminal.component';
import hacker from './img/icon/hacker.png';
import troll from './img/icon/troll.png';

const randomMessages = [
  'scanning network',
  'hacking your bank account',
  'sending a tweet',
  'I am a M$ technician',
  'Hello world',
  'PHP sucks ballz',
  'wtfjs',
  'Ok Google',
  'Apple maps lmao',
  'First time @ defcon',
  'Doing the needful',
  'uwotm8',
  'Vegas born',
  'I <3 React',
  '3.14',
  'Annie dog is watching!',
  '#badgelife',
  'GOTEM',
  'Leeroy Jenkins',
  'It works on my computer',
  'This is bad, but sooo good',
  'doing an ARP scan',
]

class App extends PureComponent {

  constructor() {
    super();

    this.state = {
      clients: [],
      scanning: false,
      scanInterval: 60,
      randomText: ''
    }
  }

  fetchData = async (event) => {
    const randomString = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    this.setState({ scanning: true, randomText: randomString });

    const response = await fetch('/clients');
    const json = await response.json();

    this.setState({ clients: json });

    setTimeout(() => {
      this.setState({ scanning: false });
    }, 3000);

  }

  componentWillMount() {
    this.fetchData();

    setInterval(this.fetchData, 1000 * this.state.scanInterval);
  }

  render() {
    const { clients, scanning, randomText } = this.state;
    
    return (
      <div className="app">

        <div className="vendor-info">
          { /* TODO: move this to a seperate method so they dont move ever render call */}
          { /* IS this a feature or a bug lol? def want to dedup the list tho, maybe out a count next to it, like Apple x3 */}
          {clients.map(client => {
            return <p style={{position: 'absolute', top: 50 + (Math.random() * 100), left: Math.random() * 320}}>{client.vendor}</p>
          })}
        </div>

        { scanning && (
          <div className="loading-wrapper">
            {randomText}
            <img className="img img-left" src={troll} alt="troll"/> 
            <img className="img img-right" src={troll} alt="troll"/> 
          </div>
        )}

        <div className="connection-info" onClick={this.fetchData}>
          <h1>SSID: NoHakePls</h1>
        </div>

        <div className="section">
          <img src={hacker} onClick={window.location.reload} alt="hackers"/>
          <div className="info">
            <h1>{clients.length} CONNECTED</h1>
          </div>
        </div>

        <Terminal/>

         
      </div>
    )
  }
}

export default App;
