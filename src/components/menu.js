import React from 'react';

class Menu extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    return(
      <div className={"menuContainer " + (this.props.isMenuHidden ? "hidden" : "")}>
        <div className="boardOptions">
          <button name="waldo1" className={"boardButton " + (this.props.currentBoard==="waldo1" ? "boardSelected" : "")} onClick={this.props.onSwap}>Board 1</button>
          <button name="waldo2" className={(this.props.currentBoard==="waldo2" ? "boardSelected" : "") + " boardButton"} onClick={this.props.onSwap}>Board 2</button>
          <button name="waldo3" className={(this.props.currentBoard==="waldo3" ? "boardSelected" : "") + " boardButton"} onClick={this.props.onSwap}>Board 3</button>
          <button name="waldo4" className={(this.props.currentBoard==="waldo4" ? "boardSelected" : "") + " boardButton"} onClick={this.props.onSwap}>Board 4</button>
          <button name="waldo5" className={(this.props.currentBoard==="waldo5" ? "boardSelected" : "") + " boardButton"} onClick={this.props.onSwap}>Board 5</button>
        </div>

      </div>
    );
  }

}

export default Menu