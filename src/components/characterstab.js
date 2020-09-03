import React from 'react';

import waldo from "../imgs/waldo.png"
import odlaw from "../imgs/odlaw.png"
import wizard from "../imgs/wizard.png"

class CharactersTab extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="charactersTab">
        <div className="characterCard">
          <div className="iconContainer"><img src={waldo} className="charImg"></img></div>
          <p className={this.props.waldoFound ? "strikeout" : ""}>Waldo</p>
        </div>
        <div className="characterCard">
          <div className="iconContainer"><img src={odlaw} className="charImg"></img></div>
          <p className={this.props.odlawFound ? "strikeout" : ""}>Odlaw</p>
        </div>
        <div className="characterCard">
          <div className="iconContainer"><img src={wizard} className="charImg"></img></div>
          <p className={this.props.wizardFound ? "strikeout" : ""}>Wizard</p>
        </div>
      </div>
    );
  }

}


export default CharactersTab

