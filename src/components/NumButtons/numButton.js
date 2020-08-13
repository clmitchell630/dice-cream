import React from 'react';
import './numButton.scss';

const NumButton = props => {
    return (
        <div className="numButton-style">
            {props.number}
        </div>
    )
}

export default NumButton;
