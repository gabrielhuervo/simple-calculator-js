const displayValueElement = document.getElementById('display-value');
const operatorIndicator = document.getElementById('operator-indicator');
const decimalButton = document.querySelector('.digit[data-value="."]');
let displayValue = '0';
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let decimalUsed = false;

function updateDisplay() {
    displayValueElement.textContent = displayValue;
    decimalButton.disabled = decimalUsed;
}

function resetCalculator() {
    displayValue = '0';
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    decimalUsed = false;
    operatorIndicator.textContent = '';
    updateDisplay();
}

function handleDigit(digit) {
    if (displayValue === '0' || waitingForSecondNumber) {
        displayValue = digit;
        waitingForSecondNumber = false;
        decimalUsed = (digit === '.');
    } else {
        if (digit === '.' && decimalUsed) return;
        displayValue += digit;
        decimalUsed = displayValue.includes('.');
    }
    updateDisplay();
}

function handleOperator(selectedOperator) {
    if (operator && waitingForSecondNumber) {
        operator = selectedOperator;
        operatorIndicator.textContent = selectedOperator;
        return;
    }
    
    if (firstNumber === null) {
        firstNumber = displayValue;
    } else if (operator) {
        const result = operate(operator, firstNumber, displayValue);
        if (result === null) {
            displayValue = 'Error: Division by zero';
            updateDisplay();
            resetCalculator();
            return;
        }
        displayValue = Math.round(result * 10000) / 10000;
        firstNumber = displayValue.toString();
        decimalUsed = displayValue.includes('.');
    }
    
    operator = selectedOperator;
    operatorIndicator.textContent = selectedOperator;
    waitingForSecondNumber = true;
}

function operate(op, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': 
            if (b === 0) return null;
            return a / b;
        default: return null;
    }
}

function handleEqual() {
    if (!operator || waitingForSecondNumber) return;
    
    const result = operate(operator, firstNumber, displayValue);
    if (result === null) {
        displayValue = 'Error: Division by zero';
        updateDisplay();
        resetCalculator();
        return;
    }
    
    displayValue = (Math.round(result * 10000) / 10000).toString();
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    decimalUsed = displayValue.includes('.');
    operatorIndicator.textContent = '';
    updateDisplay();
}

function handleBackspace() {
    if (displayValue.length === 1 || displayValue.startsWith('Error')) {
        displayValue = '0';
        decimalUsed = false;
    } else {
        displayValue = displayValue.slice(0, -1);
        decimalUsed = displayValue.includes('.');
    }
    updateDisplay();
}

document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('digit')) {
            handleDigit(button.dataset.value);
        } else if (button.classList.contains('operator')) {
            handleOperator(button.dataset.value);
        } else if (button.id === 'equal') {
            handleEqual();
        } else if (button.id === 'clear') {
            resetCalculator();
        } else if (button.id === 'backspace') {
            handleBackspace();
        }
    });
});

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') handleDigit(key);
    else if (['+', '-', '*', '/'].includes(key)) handleOperator(key);
    else if (key === 'Enter' || key === '=') handleEqual();
    else if (key === 'Backspace') handleBackspace();
    else if (key === '.') handleDigit('.');
    else if (key === 'Escape') resetCalculator();
    updateDisplay();
});

updateDisplay();