import React from 'react';
import ReactDOM from 'react-dom';


class LoadChart extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <button onClick={this.props.renderChart}>CLICK HERE</button>
            </div>
        )
    }
}

export default LoadChart;