import React from 'react';
import './Rolls.scss';

export default class Roll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        // console.log(this.props);
        let roll = this.props.roll;
        return getExpandedRoll(roll)
    }
}

function getExpandedRoll(roll) {
    let str = [];
    str.push("(");
    roll.results.forEach((res, i) => {
        str.push(
            <span faces={roll.faces} className={"roll " + (res.drop ? "drop" : "")}>
                {res.value}
            </span>
        );
        if (i < roll.results.length - 1) {
            str.push("+");
        }
    });
    str.push(")");
    return str;
    return (
        <div
            className="expanded"
            faces={roll.faces}
        >
            {str}
        </div>
    );
}