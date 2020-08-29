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
        return <div
            className="dieRoll"
            /*
            onMouseEnter={(e) => {
                this.setState({ showRolls: true });
            }}
            onMouseLeave={(e) => {
                this.setState({ showRolls: false });
            }}
            */
        >
            {roll.total}
            {getRollTooltip(roll)}
            {/* {this.state.showRolls ? getRollTooltip(roll) : ""} */}
        </div>
    }
}

function getRollTooltip(roll) {
    let str = [];
    roll.results.forEach((res, i) => {
        str.push(<div className={"roll " + (res.drop ? "drop" : "")}>{res.value}</div>);
        if (i < roll.results.length - 1) str.push("+");
    });
    return (
        <div
            className="rollTooltip"
            faces={roll.faces}
        >
            {str}
        </div>
    );
}