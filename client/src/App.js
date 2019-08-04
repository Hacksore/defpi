import React, { PureComponent } from 'react';
import './App.css';
import Terminal from './terminal/terminal.component';
import hacker from './img/icon/hacker.png';
import troll from './img/icon/troll.png';

class App extends PureComponent {

  constructor() {
    super();

    this.state = {
      clients: [],
      scanning: false,
      scanInterval: 60,
      randomText: [
        'scanning network',
        'hacking your bank account',
        'sending a tweet',
        'I am a M$ technician',
        'Hello world',
        'PHP sucks ballz',
        '#badgelife',
        'GOTEM',
        'This is bad, but good',
        'doing an ARP scan',
      ]
    }
  }

  fetchData = async (event) => {
    this.setState({ scanning: true });

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
    const { clients, scanning, randomText} = this.state;
    const randomString = randomText[Math.floor(Math.random() * randomText.length)];
    return (
      <div className="app">

        { scanning && (
          <div className="loading-wrapper">
            {randomString}
            <img className="img img-left" src={troll} alt="troll"/> 
            <img className="img img-right" src={troll} alt="troll"/> 
          </div>
        )}

        <div className="connection-info">
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
