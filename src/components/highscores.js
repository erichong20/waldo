import React from 'react';

import firebase from "./firebaseconfig.js"

class HighScores extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      highscores: [[null,null],[null,null],[null,null]]
    }
  }

  render(){
    const ref = firebase.firestore().collection("highScores").doc(this.props.currentBoard);
    
    ref.get().then((doc) => {
      if (doc.exists) {
          let data = doc.data();
          return data;
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).then((data)=>{
      this.setState({highscores: [data.highscore,data.highscore2,data.highscore3]});
    });

    return(
      <div className={"highScoreDisplay " + (this.props.isHidden ? "hidden" : "")}>
        <h1 className="highScoreLabel">High Scores</h1>
        <div className="highScoreItem">1. {this.state.highscores[0][0]} <span>{this.state.highscores[0][1]}s</span></div>
        <div className="highScoreItem">2. {this.state.highscores[1][0]} <span>{this.state.highscores[1][1]}s</span></div>
        <div className="highScoreItem">3. {this.state.highscores[2][0]} <span>{this.state.highscores[2][1]}s</span></div>
      </div>
    );
  }
}

export default HighScores