
function eval_parens(str) {

}

let indent = 0;
let indent_mult = 4;

export function evaluate(str) {
    str = str.replace(/\s+/g, "");
    // console.log(`---- EVAL ---- ${str}`);
    indent = 0;
    return _evaluate(str);
}

let diceMatch = /(?<count>\d*)d(?<faces>\d+)(?<dropkeep>(?<dk>[dk])(?<lh>[lh])(?<dknum>\d+))?/;

export function evalDice(str) {
    str = str.replace(/\s+/g, "");
    let matched = false;
    let remaining = str.replace(diceMatch, (match, groups, offset, orig) => {
        // console.log(match);
        matched = true;
        return rollDie(match);
    });
    if (matched) {
        // console.log(remaining);
        str = evalDice(remaining);
    } else {
        // console.log(str);
    }
    return str;
}

function rollDie(str) {
    let matches = str.match(diceMatch);
    // console.log(matches.groups);
    let count = parseInt(matches.groups.count) || 1;
    let faces = parseInt(matches.groups.faces);
    let roll = [];
    for (let i = 0; i < count; i++) {
        roll.push(Math.ceil(Math.random() * faces));
    }
    return roll.reduce((a, b) => { return a + b; });
}

function _evaluate(str) {
    indent += indent_mult;
    let ind = ' '.repeat(indent);
    // console.log(`${ind}PARSING -- ${str}`);

    let found;

    /* Solve Parenthesis */
    found = str.match(/\([^\(\)]*\)/);
    if (found) {
        let firstParen = found.index;
        let lastParen = found.index + found[0].length - 1;
        // console.log(`${ind}`, found);
        if (firstParen >= 0 && lastParen > firstParen) {
            str = str.slice(0, firstParen) + _evaluate(str.slice(firstParen + 1, lastParen)) + str.substr(lastParen + 1);
            // console.log(`${ind}newstr -- ${str}`);
            str = _evaluate(str);
        }
    }

    let val;
    /* Solve Multiplication and Division */
    found = str.match(/(\d+)([\*\/])(\d+)/);
    if (found) {
        // console.log(`${ind}${found}`);
        switch (found[2]) {
            case '*':
                val = parseInt(found[1]) * parseInt(found[3]);
                break;
            case '/':
                val = parseInt(found[1]) / parseInt(found[3]);
                break;
        }
        let newstr = str.slice(0, found.index) + val + str.substr(found.index + found[0].length)
        // console.log(`${ind}newstr -- ${newstr}`);
        str = _evaluate(newstr);
    }

    /* Solve Addition and Subtraction */
    found = str.match(/(\d+)([\+\-])(\d+)/);
    if (found) {
        // console.log(`${ind}${found}`);
        switch (found[2]) {
            case '+':
                val = parseInt(found[1]) + parseInt(found[3]);
                break;
            case '-':
                val = parseInt(found[1]) - parseInt(found[3]);
                break;
        }
        let newstr = str.slice(0, found.index) + val + str.substr(found.index + found[0].length)
        // console.log(`${ind}newstr -- ${newstr}`);
        str = _evaluate(newstr);
    }

    // console.log(`${ind}RETURNING -- ${str}`);
    indent -= indent_mult;
    return str;
}