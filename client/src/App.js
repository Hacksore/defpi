import React, { PureComponent } from 'react';
import './App.css';
import Terminal from './terminal/terminal.component';
import hacker from './img/icon/hacker.png';

class App extends PureComponent {

  constructor() {
    super();

    this.state = {
      clients: []
    }
  }

  fetchData = event => {
    fetch('http://localhost:1337/clients')
      .then(response => response.json())
      .then((response) => {
        this.setState({
         clients: response
        });
      });
  }

  componentWillMount() {
    this.fetchData();

    setInterval(() => {
      this.fetchData();
    }, 1000 * 30);
  }

  render() {
    const { clients } = this.state;

    return (
      <div className="app">

        <div className="connection-info">
          <h2>SSID: NoHakePls</h2>
        </div>
  
        <div className="section">
          <p>{clients.length}</p>
          <img src={hacker} alt="hackers"/>
        </div>
        <div className="info">
          <h2>HACKERS CONNECTED</h2>
        </div>

        <Terminal/>
         
      </div>
    )
  }
}

export default App;
