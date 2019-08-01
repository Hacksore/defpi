import React from 'react';
import './App.scss';
import Terminal from 'terminal-in-react';
import linux from './img/icon/linux.png';
import win from './img/icon/windows.png';
import mac from './img/icon/mac.png';

function App() {
  return (
    <div className="app">

      <div className="test">
        <h1>Hackers Connected</h1>     
      </div>

      <div className="connection-info">
        <h4>SSID: NoHakePls</h4>
      </div>

      <header className="header">
        <div className="section">
          <p>32</p>     
          <img src={win} alt="win"/>
        </div>

        <div className="section">
          <p>32</p>
          <img src={mac} alt="mac"/>
        </div>

        <div className="section">
          <p>32</p>
          <img src={linux} alt="linux"/>
        </div>

      </header>

      <Terminal
        color='#fff'
        allowTabs={false}
        promptSymbol="hacksore@defcon "
        hideTopBar={true}
        backgroundColor='black'
        
        barColor='black'
        style={{ fontWeight: "bold", fontSize: "1em" }}
      />
    </div>
  );
}

export default App;
