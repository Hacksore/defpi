import React, { PureComponent } from 'react';
import './App.css';
import Terminal from './terminal/terminal.component';
import hacker from './img/icon/hacker.png';
import troll from './img/icon/troll.png';
import HorizontalMarquee from './horizontal-marquee';
import DebugMenu from './debug/debugmenu.component';

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
  'Hacking the matrix',
  'Agile dev lmao',
  'sending $.ajax',
  '3.14',
  'First badge!!!1',
  'Annie dog is watching!',
  '#badgelife',
  'GOTEM',
  'Leeroy Jenkins',
  'Rekt m9',
  'Vape Naysh Y\'all',
  'REEEEEEEEEEEE',
  'I\'M Pickle Rick',
  'Lit AF 🔥',
  'Woke',
  'Fetching from cloud',
  'Running nessus scan',
  'Powered by 💩',
  'Slack is down',
  'DefCon is canceled',
  'My badge is better than yours',
  'I AM ROOT',
  'Pixel 4 will suck',
  'Apple is dumb',
  'California Fruit',
  'Drink Bawls',
  'Doritos & Mtn. Dew',
  'It works on my computer',
  'This is bad, but sooo good',
  'doing an ARP scan',
]

class App extends PureComponent {

  constructor() {
    super();

    this.state = {
      clients: [],
      vendorCounts: [],
      scanning: false,
      scanInterval: 60,
      randomText: '',
      scrollTimer: null,
      ssidInfo: {
        network: ''
      }
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
        clients: json.clients,    
        vendorCounts: json.vendorCounts,    
      });
    }

    setTimeout(() => {
      this.setState({ scanning: false });
    }, 3000);

    if (this.state.scrollTimer !== null) {
      console.log('clearing scroll timer');
      clearInterval(this.state.scrollTimer);
      this.scrollRef.current.scrollTop = 0;
    }

    const timer = setInterval(() => {
      const ele = this.scrollRef.current;
      ele.scrollTop += 1;
    }, 50);

    this.setState({ scrollTimer: timer });
  }

  async componentWillMount() {
    this.fetchData();

    const promise = await fetch('/ssid');
    const json = await promise.json();

    this.setState({ ssidInfo: json });

    setInterval(this.fetchData, 1000 * this.state.scanInterval);
  }

  render() {

    const { clients, vendorCounts, scanning, randomText, ssidInfo } = this.state;

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
          <h1>{ssidInfo.network}</h1>          
        </div>

        <div className="section">
          <div className="vendor-info" ref={this.scrollRef}>
            <HorizontalMarquee>
              {vendorCounts.map((client, index) => {
                return <div key={client.name} className="vendor">
                  {client.count} - {client.name}
                </div>
              })}
            </HorizontalMarquee>
          </div>
        
          <img src={hacker} alt="hackers"/>

          <div className="info">
            <h1 onClick={this.fetchData}>{clients.length} CONNECTED</h1>
          </div>
        </div>
    
        <div style={{height: 220, overflow: 'hidden'}} className="terminal">
          <Terminal/>

          <div className="debug-menu">
            <DebugMenu fetchData={this.fetchData}></DebugMenu>
          </div>
          {/* <button className='menu-button'>Test</button> */} 
        </div>
         
      </div>
    )
  }
}

export default App;
