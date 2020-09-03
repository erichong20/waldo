import React from 'react';

class BoundingBox extends React.Component {
  constructor(props){
    super(props);

  }

  render(){

    const style = {left: this.props.coords[0]-25, top: this.props.coords[1]-40}

    return(
      <div className={"selector " + (this.props.isHidden ? "hidden" : "")} style={style}>
        <div className="boundingBox"></div>
        <ul className="characterMenu">
          <li name="waldo" className="characterItem" onClick={this.props.onCharSelect}>Waldo</li>
          <li name="odlaw" className="characterItem" onClick={this.props.onCharSelect}>Odlaw</li>
          <li name="wizard" className="characterItem" onClick={this.props.onCharSelect}>Wizard</li>
        </ul>
      </div>
    );
  }
}

export default BoundingBox