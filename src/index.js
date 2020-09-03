import React from 'react';
import ReactDOM from 'react-dom';
import Header from "./components/header.js"
import Footer from "./components/footer.js"
import Board from "./components/board.js"

import './css/styles.css';
import './css/fireworks.css';
import './css/reset.css';

import './fonts/Alata/Alata-Regular.ttf'

class Home extends React.Component {
  constructor(){
    super();
    this.state = {

    }
  }

  render(){
    return(
    <div className="pageContainer">
      <div className="main">
        <Header address={this.state.displayAddress}/>
        <Board />
      </div>
      <Footer />
    </div>
    );
  }
}


ReactDOM.render(
  <Home />,
  document.getElementById('root')
);