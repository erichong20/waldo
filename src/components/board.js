import React from 'react';

import img1 from "../imgs/waldo1.jpg"
import img2 from "../imgs/waldo2.jpg"
import img3 from "../imgs/waldo3.jpg"
import img4 from "../imgs/waldo4.jpg"
import img5 from "../imgs/waldo5.jpg"

import BoundingBox from "./boundingbox.js"
import FoundBox from "./foundbox.js"
import CharactersTab from "./characterstab.js"
import Menu from "./menu.js"
import HighScores from "./highscores.js"
import Timer from "./timer.js"
import firebase from "./firebaseconfig.js"

function PlayButton(props){
  return(
    <button className={"playButton " + (props.isButtonHidden ? 'hidden' : '')} value="start" onClick={props.onClick}>START</button>
  );
}

function BackButton(props){
  return(
    <button className={"playButton " + (!props.isButtonHidden ? 'hidden' : '')} value="back" onClick={props.onClick}>BACK</button>
  );
}

function FireWorks(){
  return(
    <div class="pyro">
      <div class="before"></div>
      <div class="after"></div>
    </div>
);
}

class Board extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      boardHidden: true,
      isSelectorHidden: true,
      displayBoard: img1,
      boardDoc: "waldo1",
      guessLocation: [null,null],
      waldoFound: false,
      odlawFound: false,
      wizardFound: false,
      charData: null,
      currentTryRef: null,
      interval: null,
      time: 0,
      start: 0
    }

    this.onStartClick = this.onStartClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.onCharSelect = this.onCharSelect.bind(this);
    this.verifyClick = this.verifyClick.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.checkForHighScore = this.checkForHighScore.bind(this);
    this.changeBoard = this.changeBoard.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  onBackClick(){
    this.setState({time: 0});
    clearInterval(this.timer);
    this.setState({guessLocation: [null,null]});

    this.setState({boardHidden: true});
    this.setState({waldoFound: false, odlawFound: false, wizardFound: false});
  }

  onStartClick(e){
    this.setState({boardHidden: false});
    this.startTimer();

    this.setCharData().then((data)=>{
      this.setState({charData: data});
    })

    let startTime = new firebase.firestore.Timestamp.now();

    const ref = firebase.firestore().collection("times");

    ref.add({
      start: startTime
    }).then((docRef) => {
      this.setState({currentTryRef: docRef});
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  onImageClick(e){
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.

    this.setState({isSelectorHidden: !this.state.isSelectorHidden});

    this.setState({guessLocation: [x,y]});
  }

  setCharData(){
    const ref = firebase.firestore().collection("characterLocations").doc(this.state.boardDoc);

    return ref.get().then((doc) => {
      if (doc.exists) {
          let data = doc.data();
          return data;
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    });
  }

  verifyClick(x,y,char){
    const real = this.state.charData[char];

    if(x<=real[0]+25 && x>=real[0]-25 && y<=real[1]+40 && y>=real[1]-40){
      return true;
    } else {
      return false;
    }
  }

  onCharSelect(e){
    this.setState({isSelectorHidden: true});

    const char = e.target.getAttribute("name")

    const result = this.verifyClick(this.state.guessLocation[0],this.state.guessLocation[1],char);

    if(result){
      window.alert(`Congratulations! You found ${char}!`);
      let stateId = `${char}Found`;
      this.setState({[stateId]: true},()=>this.checkForWin());
    } else {
      window.alert(`${char} was not in the box.`);
    }
  }

  checkForWin(){
    if(this.state.waldoFound && this.state.odlawFound && this.state.wizardFound){
      clearInterval(this.timer);

      console.log(this.state.time);
      this.state.currentTryRef.update({
        elapsedTime: this.state.time
      }).then(()=>{
        console.log("success");
        this.state.currentTryRef.get().then((doc)=>{
          this.checkForHighScore(doc.data().elapsedTime);
          window.alert(`You win! You completed the game in ${doc.data().elapsedTime} seconds`);
        });
      });
    }
  }

  checkForHighScore(newTime){
    const ref = firebase.firestore().collection("highScores").doc(this.state.boardDoc);

    ref.get().then((doc) => {
      if (doc.exists) {
          let data = doc.data();
          return data;
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).then((data)=>{
      if(data.highscore[1] > newTime){
        let newName = window.prompt("Congratulations! You achieved a high score! What would you like your name to be on the leaderboard?","Anonymous");
        ref.update({
          highscore: [newName, newTime],
          highscore2: data.highscore,
          highscore3: data.highscore2
        });
      } else if (data.highscore2[1] > newTime){
        let newName = window.prompt("Congratulations! You achieved a high score! What would you like your name to be on the leaderboard?","Anonymous");
        ref.update({
          highscore2: [newName, newTime],
          highscore3: data.highscore2
        });
      } else if (data.highscore3[1] > newTime){
        let newName = window.prompt("Congratulations! You achieved a high score! What would you like your name to be on the leaderboard?","Anonymous");
        ref.update({
          highscore3: [newName, newTime]
        });
      }
    });
  }

  startTimer(){
    this.setState({
      time: this.state.time,
      start: Date.now() - this.state.time
    })
    this.timer = setInterval(() => this.setState({
      time: (Date.now() - this.state.start)/1000
    }), 1);
  }

  changeBoard(e){

    this.setState({boardDoc: e.target.name});

    switch(e.target.name){
      case "waldo1":
        this.setState({displayBoard: img1})
        break;
      case "waldo2":
        this.setState({displayBoard: img2})
        break;
      case "waldo3":
        this.setState({displayBoard: img3})
        break;
      case "waldo4":
        this.setState({displayBoard: img4})
        break;
      case "waldo5":
        this.setState({displayBoard: img5})
        break;
    };

    //change boardDoc and also displayBoard
  }

  render(){
    let waldoBox, odlawBox, wizardBox, fireworks;

    if(this.state.waldoFound){
      waldoBox = <FoundBox location={this.state.charData.waldo}/>;
    }

    if(this.state.odlawFound){
      odlawBox = <FoundBox location={this.state.charData.odlaw}/>;
    }

    if(this.state.wizardFound){
      wizardBox = <FoundBox location={this.state.charData.wizard}/>;
    }

    if(this.state.waldoFound && this.state.odlawFound && this.state.wizardFound){
      fireworks = <FireWorks />;
    }

    return(
      <div className="boardContainer">
        {fireworks}
        <PlayButton onClick={this.onStartClick} isButtonHidden={!this.state.boardHidden}/>
        <BackButton onClick={this.onBackClick} isButtonHidden={!this.state.boardHidden}/>
        <Menu onSwap={this.changeBoard} isMenuHidden={!this.state.boardHidden} currentBoard={this.state.boardDoc}/>
        <HighScores currentBoard={this.state.boardDoc} isHidden={!this.state.boardHidden}/>
        <div className={"board " + (this.state.boardHidden ? "hidden" : "")}>
          <img src={this.state.displayBoard} alt="waldo" className="boardImage" onClick={this.onImageClick}></img>
          <BoundingBox coords={this.state.guessLocation} isHidden={this.state.isSelectorHidden} onCharSelect={this.onCharSelect}/>

          {waldoBox}
          {odlawBox}
          {wizardBox}
        </div>
        <div className={"secondaryDisplay " + (this.state.boardHidden ? "hidden" : "")}>
          <CharactersTab waldoFound={this.state.waldoFound} odlawFound={this.state.odlawFound} wizardFound={this.state.wizardFound}/>
          <Timer time={this.state.time} />
        </div>
      </div>
    );
  }
}



export default Board