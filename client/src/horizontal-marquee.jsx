import React, { PureComponent } from 'react';
import './horizontal-marquee.css';

class HorizontalMarquee extends PureComponent {

  constructor(props) {
    super(props);
    console.log('component craeted');

    this.state = {
      scrollTimer: null
    }

    this.scrollRef = React.createRef();

  }

  componentWillMount() {
    if (this.state.scrollTimer !== null) {
      console.log('clearing scroll timer');
      clearInterval(this.state.scrollTimer);
      this.scrollRef.current.scrollTop = 0;
    }

    // let topIndex = 0;

    // const timer = setInterval(() => {
    //   const ele = this.scrollRef.current;
    //   ele.style.top = topIndex + 'px';

    //   topIndex -= 1;

    //   if (topIndex < -320) {
    //     topIndex = 100;
    //   }
    //   // console.log(ele.scrollTop, ele.offsetTop);

    // }, 30);

    // this.setState({ scrollTimer: timer });
  }

  render() {
    return <div className="container">
      <div className="slider">
        {this.props.children}
      </div>
   </div>
  }

}

export default HorizontalMarquee;
