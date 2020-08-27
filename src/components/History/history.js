import React from 'react';
import './history.scss';

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.history != this.props.history;
    }

    render() {
        console.log("--History Render()--");
        // console.log(this.props.history);
        return (
            <div>
                {contents(this.props)}
            </div>
        )
    }
}

function contents(props) {
    let hist = props.history.map((line, idx) => {
        let lineEle = [];
        // let i = 0;
        line.outputString.split("#").forEach((s, i) => {
            lineEle.push(s);
            if (i < line.rolls.length) {
                lineEle.push(
                    <span
                        className="dieRoll"
                        faces={line.rolls[i].faces}
                    >
                        {line.rolls[i].total}
                    </span>
                );
            }
        });
        return lineEle;
    })
    console.log("NEW HISTORY");
    console.log(hist);

    let h = <span>--NO HISTORY--</span>;
    if (props.history && props.history.length > 0) {
        return (
            <ol>
                {hist.map((line, idx) => (
                    <li key={idx}>{
                        line
                    }</li>
                ))}
            </ol>
        );
    }

    return h;
}
