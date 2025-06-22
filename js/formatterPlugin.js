export default class formatterPlugin {
    constructor(inputId = 'decimalPlaces') {
        this.input = document.getElementById(inputId);
        this.bindEvents();
    }

    formatAllNumbers() {
        const decimalPlaces = parseInt(this.input.value) || 0;
        const formattableElements = document.querySelectorAll('[data-formattable]');

        formattableElements.forEach(element => {
            if (element.tagName === 'INPUT') {
                const number = parseFloat(element.value);
                if (!isNaN(number)) {
                    element.value = number.toFixed(decimalPlaces);
                }
            } else {
                const number = parseFloat(element.textContent);
                if (!isNaN(number)) {
                    element.textContent = number.toFixed(decimalPlaces);
                }
            }
        });
    }

    bindEvents() {
        this.input.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                this.formatAllNumbers();
            }
        });

        this.input.addEventListener('click', e => {
            e.stopPropagation();
        });
    }
}
