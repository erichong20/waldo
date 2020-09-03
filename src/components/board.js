import React from 'react';

import img1 from "../imgs/waldo1.jpg"
import img2 from "../imgs/waldo2.jpg"
import img3 from "../imgs/waldo3.jpg"
import img4 from "../imgs/waldo4.jpg"
import img5 from "../imgs/waldo5.jpg"
import img6 from "../imgs/waldo6.jpg"
import img7 from "../imgs/waldo7.jpg"

import BoundingBox from "./boundingbox.js"
import FoundBox from "./foundbox.js"
import CharactersTab from "./characterstab.js"

import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database"

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF4j_1OTDcIyxD7rVu2YOZZQ5JUbQX8Sw",
        authDomain: "waldo-fb77e.firebaseapp.com",
        databaseURL: "https://waldo-fb77e.firebaseio.com",
        projectId: "waldo-fb77e",
        storageBucket: "waldo-fb77e.appspot.com",
        messagingSenderId: "673162512383",
        appId: "1:673162512383:web:8ea82ebc02f93b00c7c9ca",
        measurementId: "G-P9MHP1K83K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function PlayButton(props){
  return(
    <button className={"playButton " + (props.isBoardHidden ? '' : 'hidden')} value="start" onClick={props.onClick}>START</button>
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
      currentTryRef: null
    }

    this.onStartClick = this.onStartClick.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.onCharSelect = this.onCharSelect.bind(this);
    this.verifyClick = this.verifyClick.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.checkForHighScore = this.checkForHighScore.bind(this);

    this.initializeCharData().then((data)=>{
      this.setState({charData: data});
    })
  }

  onStartClick(e){
    this.setState({boardHidden: false});

    let startTime = new firebase.firestore.Timestamp.now();
    const ref = firebase.firestore().collection("times");

    ref.add({
      start: startTime,
      end: null
    }).then((docRef) => {
      this.setState({currentTryRef: docRef});
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

    console.log(startTime);
  }

  onImageClick(e){
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.

    console.log(x);
    console.log(y);

    this.setState({isSelectorHidden: !this.state.isSelectorHidden});

    this.setState({guessLocation: [x,y]});
  }

  initializeCharData(){
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
      this.state.currentTryRef.update({
        end: new firebase.firestore.Timestamp.now()
      }).then(()=>{
        console.log("success");
        this.state.currentTryRef.get().then((doc)=>{
          let sec = doc.data().end.seconds - doc.data().start.seconds;
          let milli = (doc.data().end.nanoseconds - doc.data().start.nanoseconds)/1000000;
          let time = sec+(milli/1000);
          this.checkForHighScore(time);
          window.alert(`You win! You completed the game in ${time} seconds`);
        });
      });

      //this.setState({waldoFound: false, odlawFound: false, wizardFound: false});
    }
  }

  checkForHighScore(newTime){

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
        <PlayButton onClick={this.onStartClick} isBoardHidden={this.state.boardHidden}/>
        <div className={"board " + (this.state.boardHidden ? "hidden" : "")}>
          <img src={this.state.displayBoard} alt="waldo" className="boardImage" onClick={this.onImageClick}></img>
          <BoundingBox coords={this.state.guessLocation} isHidden={this.state.isSelectorHidden} onCharSelect={this.onCharSelect}/>

          {waldoBox}
          {odlawBox}
          {wizardBox}
        </div>
        <div className={"secondaryDisplay " + (this.state.boardHidden ? "hidden" : "")}>
          <CharactersTab waldoFound={this.state.waldoFound} odlawFound={this.state.odlawFound} wizardFound={this.state.wizardFound}/>
        </div>
      </div>
    );
  }
}



export default Board