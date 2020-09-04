import React from 'react';
import firebase from "./firebaseconfig.js"

class Timer extends React.Component{
  
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="timerContainer">
        {Math.round(this.props.time*100)/100}s
      </div>
    );
  }
}

export default Timer