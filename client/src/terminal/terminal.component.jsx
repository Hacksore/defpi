import React, { PureComponent } from 'react';
import './terminal.css';

class Terminal extends PureComponent {

  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      lines: [
        {color: '#fff', message: 'Waht the fuck mat this is a really long one that it has to wrap or else'},
        {color: '#fff', message: 'this is a test'},
        {color: '#fff', message: 'variying line length'},
        {color: '#fff', message: 'variying line length'},
        {color: '#fff', message: 'variying line length'},
        {color: '#fff', message: 'variying line length'},
        {color: '#fff', message: 'variying line length'},
        {color: '#fff', message: 'variying line length'},
        {color: '#fff', message: 'newest message'}
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
          return <div key={index} className="line">{line.message}</div>
        })}
        <div className="prompt">
          <span className="user">Hacksore</span>
          <span className="at">@</span>
          <span className="host">defcon</span>
          <span className="hash">#</span>
        </div>
      </div>
    )
  }
}

export default Terminal;
