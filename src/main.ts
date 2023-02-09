import './css/style.css';
const initApp = () => {
    const currentValueElem = document.querySelector('.currentValue') as HTMLInputElement;
    const previousValueElem = document.querySelector('.previousValue');
    let itemArray: string[] = [];
    const equationArray: {
        num1: number;
        num2: number;
        op: string;
    }[] = [];
    let newNumberFlag = false;

    //NumberButtons
    const inputButtons = document.querySelectorAll('.number');
    inputButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const newInput = (event.target as HTMLElement).textContent as string;
            if (newNumberFlag) {
                currentValueElem.value = newInput;
                newNumberFlag = false;
            } else {
                currentValueElem.value =
                    currentValueElem.value == '0' ? newInput : `${currentValueElem.value}${newInput}`;
            }
        });
    });

    //optionsButtons
    const optButtons = document.querySelectorAll('.operator');
    optButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            //equal sign showing
            if (newNumberFlag) {
                previousValueElem!.textContent = '';
                itemArray = [];
            }

            const newOperator = (event.target as HTMLElement).textContent as string;
            const currentValue = currentValueElem.value;

            //need number first;
            if (!itemArray.length && currentValue == '0') return;

            //begin new equation
            if (!itemArray.length) {
                itemArray.push(currentValue, newOperator);
                previousValueElem!.textContent = `${currentValue} ${newOperator}`;
                return (newNumberFlag = true);
            }

            //complete equation
            if (itemArray.length) {
                itemArray.push(currentValue);

                const equationObj = {
                    num1: parseFloat(itemArray[0]),
                    num2: parseFloat(currentValue),
                    op: itemArray[1],
                };

                equationArray.push(equationObj);
                const equationString = `${equationObj['num1']} ${equationObj['op']} ${equationObj['num2']}`;

                const newValue = calculate(equationString, currentValueElem);

                previousValueElem!.textContent = `${newValue} ${newOperator}`;

                // start new equation
                itemArray = [newValue, newOperator];
                newNumberFlag = true;
                generateHistory(equationArray);
            }
        });
    });

    //equalButton
    const equalButton = document.querySelector('.equals');
    equalButton?.addEventListener('click', () => {
        const currentValue = currentValueElem.value;
        let equationObj;

        //pressing equals repeatedly
        if (!itemArray.length && equationArray.length) {
            const lastEquation = equationArray[equationArray.length - 1];
            equationObj = {
                num1: parseFloat(currentValue),
                num2: lastEquation.num2,
                op: lastEquation.op,
            };
        } else if (!itemArray.length) {
            return currentValue;
        } else {
            itemArray.push(currentValue);
            equationObj = {
                num1: parseFloat(itemArray[0]),
                num2: parseFloat(currentValue),
                op: itemArray[1],
            };
        }

        equationArray.push(equationObj);

        const equationString = `${equationObj['num1']} ${equationObj['op']} ${equationObj['num2']}`;

        calculate(equationString, currentValueElem);

        previousValueElem!.textContent = `${equationString} = `;

        newNumberFlag = true;
        itemArray = [];

        generateHistory(equationArray);
    });

    //ClearButtons
    const clearButtons = document.querySelectorAll('.clear, .clearEntry');
    clearButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            currentValueElem.value = '0';
            if ((event.target as HTMLElement).classList.contains('clear')) {
                previousValueElem!.textContent = '';
                itemArray = [];
                generateHistory([]);
            }
        });
    });

    //delete button
    const deleteButton = document.querySelector('.delete');
    deleteButton?.addEventListener('click', () => {
        currentValueElem.value = currentValueElem.value.slice(0, -1); //return everything expect last character
    });

    const signChangeButton = document.querySelector('.signChange');
    signChangeButton?.addEventListener('click', () => {
        currentValueElem.value = String(parseFloat(currentValueElem.value) * -1);
    });
};

document.addEventListener('DOMContentLoaded', initApp);

const calculate = (equation: string, currentValueElem: HTMLInputElement) => {
    const regex = /(^[*/=])|(\s)/g;
    equation.replace(regex, '');
    const divByZero = /(\/0)/.test(equation);
    if (divByZero) return (currentValueElem.value = '0');
    return (currentValueElem.value = eval(equation));
};

const generateHistory = (
    array: {
        num1: number;
        num2: number;
        op: string;
    }[]
) => {
    let historyBlock = document.querySelector('.history') as HTMLElement;
    let unorderedList = document.createElement('ul');

    array.forEach((item) => {
        const { num1, op, num2 } = item;
        let equation = document.createElement('li');
        let result = document.createElement('li');

        const itemString = `${num1} ${op} ${num2}`;
        result.innerHTML = eval(itemString);
        equation.innerHTML = itemString + ' =';
        unorderedList.append(equation);
        unorderedList.append(result);
    });
    historyBlock.innerHTML = '';
    historyBlock?.appendChild(unorderedList);
};
