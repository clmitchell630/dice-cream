import React from 'react';
import './numButton.scss';

export default class NumButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div
                className={`numButton-style ${this.props.className||''}`}
                value={this.props.number}
                // onClick={event => { this.props.callback(event); }}
                onClick={(event) => {this.props.handleClick(event);}}
            >
                {this.props.number}
            </div>
        );
    }
}