import React from 'react';

class FoundBox extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    if(this.props.location !==null){
      let style = {left: this.props.location[0]-15, top: this.props.location[1]-15};

      console.log(this.props.location[0]);

      console.log();

      return(
        <div>
          <div className="foundBox" style={style}>  </div>
        </div>
      );
    }
  }
}

export default FoundBox