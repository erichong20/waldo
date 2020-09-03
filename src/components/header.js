import React from 'react';

class Header extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="headerContainer">
        <h1 className="header">Where's Waldo?</h1>
      </div>
    );
  }
}

export default Header