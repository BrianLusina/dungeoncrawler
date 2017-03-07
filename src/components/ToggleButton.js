import React, { Component, PropTypes } from 'react';

/**
 * Toggle button component*/
export default class ToggleButton extends Component{

    render(){
        return(
            <button id={this.props.id} className="toggleButton" onClick={this.props.handleClick}>
                {this.props.label}
            </button>
        )
    }
}

ToggleButton.propTypes = {
    label: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    handleClick: React.PropTypes.func.isRequired
};