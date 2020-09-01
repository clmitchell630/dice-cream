import React from 'react';
import Roll from './Rolls';
import './history.scss';

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.history !== this.props.history;
    }

    render() {
        console.log("--History Render()--");

        let histLines = <span>--NO HISTORY--</span>;
        if (this.props.history && this.props.history.length > 0) {
            histLines = [];
            this.props.history.forEach((line, idx) => {
                let lineExpr = [];
                line.outputString.split("#").forEach((s, i) => {
                    lineExpr.push(s);
                    if (i < line.rolls.length) {
                        lineExpr.push(
                            <Roll roll={line.rolls[i]} />
                        );
                    }
                });

                histLines.push(
                    <div className="line">
                        <div className="input" >{line.input}</div>
                        <div className="rolled" >{lineExpr}</div>
                        <div className="result">{line.total}</div>
                    </div>
                );
            });
        }
        return (
            <div id={this.props.id} className="history-wrap">
                {histLines}
            </div>
        )
    }
}
