import React, { PureComponent } from 'react';
import './terminal.css';

class Terminal extends PureComponent {

  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      lines: [
        {color: '#fff', message: '<strong>[DEFPI]</strong>'},
        {color: '#fff', message: 'An opensource raspiberry pi badge'},
        {color: '#fff', message: ''},
        {color: '#fff', message: 'git remote -v'},
        {color: '#fff', message: 'github.com/Hacksore/defpi'},
        {color: '#fff', message: ''},
        {color: '#fff', message: 'whoami'},
        {color: '#fff', message: '<div class="me">Sean "Hacksore" Boult</div>'},
        {color: '#fff', message: ''}
      ]
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const scrollHeight = this.ref.current.scrollHeight;
    const height = this.ref.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.ref.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    const { lines } = this.state;

    return (
      <div className="terminal" ref={this.ref}>        
        
        {lines.map((line, index) => {
          return <div key={index} dangerouslySetInnerHTML={{ __html: line.message }} className="line"></div>
        })}
        <div className="prompt">
          <span className="user">Hacksore</span>
          <span className="at">@</span>
          <span className="host">defcon</span>
          <span className="hash">$</span>
          <span className="caret"></span>
        </div>
      </div>
    )
  }
}

export default Terminal;
