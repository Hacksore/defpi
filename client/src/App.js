import React, { PureComponent } from 'react';
import './App.css';
import Terminal from './terminal/terminal.component';
import hacker from './img/icon/hacker.png';
import troll from './img/icon/troll.png';
import _ from 'lodash';

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
      randomText: '',
      scrollTimer: null
    }

    this.scrollRef = React.createRef();
  }

  fetchData = async (event) => {
    const randomString = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    this.setState({ scanning: true, randomText: randomString });

    const response = await fetch('/clients');
    const json = await response.json();

    // don't go to zero on scanning, looks stupid
    if (this.state.clients.length !== json.length) {

      this.setState({ 
        clients: json        
      });
    }

    setTimeout(() => {
      this.setState({ scanning: false });
    }, 3000);

    if (this.state.scrollTimer !== null) {
      clearInterval(this.state.scrollTimer);
      this.scrollRef.current.scrollTop = 0;
    }

    const timer = setInterval(() => {
      const ele = this.scrollRef.current;
      ele.scrollTop += 1;
    }, 50);

    this.setState({ scrollTimer: timer });
  }

  componentWillMount() {
    this.fetchData();

    setInterval(this.fetchData, 1000 * this.state.scanInterval);
  }

  render() {
    const { clients, scanning, randomText } = this.state;
    const uniqueList = _.sortBy(_.uniqBy(clients, 'vendor'), 'vendor');

    return (
      <div className="app">

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
          <div className="vendor-info" ref={this.scrollRef}>
            {uniqueList.map((client, index) => {
              return <div key={client.ip} className="vendor">{client.vendor} {client.ip}</div>
            })}
          </div>
        
          <img src={hacker} onClick={window.location.reload} alt="hackers"/>
          <div className="info">
            <h1 onClick={this.fetchData}>{clients.length} CONNECTED</h1>
          </div>
        </div>
    

        <div style={{height: 220, overflow: 'hidden'}} className="terminal">
          <Terminal/>
        </div>
         
      </div>
    )
  }
}

export default App;
