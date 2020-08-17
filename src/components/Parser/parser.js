

let beforeRE = /(?<=^|[\(\+\-\*\/])/;
let afterRE = /(?=[\+\-\*\/\)]|$)/;

let indent = 0;
let indent_mult = 4;

export function evaluate(str) {
    str = str.replace(/\s+/g, "");
    // console.log(`---- EVAL ---- ${str}`);
    indent = 0;
    let result = _evaluate(evalDice(str));
    if (!!Number(result)) {
        return result;
    } else {
        throw new Error (`Did not evaluate to a number: '${result}`);
    }
}

let dieRE = /(?<count>\d*)d(?<faces>\d+)(?<dropkeep>(?<dk>[dk])(?<lh>[lh])(?<dknum>\d+))?/;
let diceMatch = new RegExp(beforeRE.source + dieRE.source + afterRE.source);

function evalDice(str) {
    str = str.replace(/\s+/g, "");
    // console.log(`     EVAL DICE ---- ${str}`);
    let matched = false;
    /* Replace a matched die string with a rolled die */
    let remaining = str.replace(diceMatch, (match, groups, offset, orig) => {
        matched = true;
        let roll = rollDie(match);
        // console.log(`     ${match} -> ${roll}`);
        return roll;
    });
    if (matched) {
        str = evalDice(remaining);
    } else {
        // console.log(`No more dice found: '${str}'`);
        // throw new Error (`Invalid die syntax: '${str}'`);
    }
    return str;
}

function rollDie(str) {
    let matches = str.match(diceMatch);
    // console.log(matches.groups);
    let count = parseInt(matches.groups.count) || 1;
    let faces = parseInt(matches.groups.faces);
    let rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.ceil(Math.random() * faces));
    }
    if (matches.groups.dk) {
        rolls.sort((a, b) => a - b);
        // console.log("Sorted Rolls ", rolls);
        let dkNum = parseInt(matches.groups.dknum);
        if (dkNum >= count) {
            /* Can't drop/keep (more than) all the dice! */
            throw new Error(`Cannot drop/keep '${dkNum}' out of '${count}' dice!`);
        };
        switch (matches.groups.dk + matches.groups.lh) {
            case 'dl':
                rolls.splice(0, dkNum);
                break;
            case 'dh':
                rolls.splice(0 - dkNum);
                break;
            case 'kl':
                rolls.splice(dkNum);
                break;
            case 'kh':
                rolls.splice(0, rolls.length - dkNum);
                break;
            default:
                throw new Error(`Invalid drop/keep`);
        }
    }
    // console.log("Rolls ", rolls);
    return rolls.reduce((a, b) => { return a + b; });
}

let parensRE = new RegExp(beforeRE.source + /\([^\(\)]*\)/.source + afterRE.source);
let multiRE = new RegExp(beforeRE.source + /(\d+)([\*\/])(\d+)/.source + afterRE.source);
let addRE = new RegExp(beforeRE.source + /(\d+)([\+\-])(\d+)/.source + afterRE.source);

function _evaluate(str) {
    indent += indent_mult;
    let ind = ' '.repeat(indent);
    // console.log(`${ind}PARSING -- ${str}`);

    let found;

    /* Solve Parenthesis */
    found = str.match(parensRE);
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
    found = str.match(multiRE);
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
    found = str.match(addRE);
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