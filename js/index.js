class Weight {
    initialWeightInput = null;
    initialWeightResult = null;
    desiredWeightInput = null;
    desiredWeightResult = null;
    heightInput = null;
    heightResult = null;
    startDateInput = null;
    endDateInput = null;
    today = new Date();
    days = null;

    initialWeight = 80;
    desiredWeight = 80;
    height = 170;
    startDate = null;
    endDate = null;

    startBtn = null;
    resultSection = null;
    resultParagraph = null;

    UiSelectors = {
        initialWeightInput: 'initial-weight',
        initialWeightResult: '[data-initial-weight-result]',
        desiredWeightInput: 'desired-weight',
        desiredWeightResult: '[data-desired-weight-result]',
        heightInput: 'height',
        heightResult: '[data-height-result]',
        startDateInput: 'start-date',
        endDateInput: 'end-date',
        startBtn: '[data-start-btn]',
        resultSection: '[data-result]',
        resultParagraph: '[data-result-paragraph]',
    }

    initializeApp() {
        this.initialWeightInput = document.getElementById(this.UiSelectors.initialWeightInput);
        this.initialWeightResult = document.querySelector(this.UiSelectors.initialWeightResult);
        this.desiredWeightInput = document.getElementById(this.UiSelectors.desiredWeightInput);
        this.desiredWeightResult = document.querySelector(this.UiSelectors.desiredWeightResult);
        this.heightInput = document.getElementById(this.UiSelectors.heightInput);
        this.heightResult = document.querySelector(this.UiSelectors.heightResult);
        this.startDateInput = document.getElementById(this.UiSelectors.startDateInput);
        this.endDateInput = document.getElementById(this.UiSelectors.endDateInput);
        this.startBtn = document.querySelector(this.UiSelectors.startBtn);
        this.resultSection = document.querySelector(this.UiSelectors.resultSection);
        this.resultParagraph = document.querySelector(this.UiSelectors.resultParagraph);

        this.setDate();
        this.addEventListeners();
    }

    addEventListeners() {
        this.initialWeightInput.addEventListener('input', (e) => this.updateParagraph(e, e.target.id));
        this.desiredWeightInput.addEventListener('input', (e) => this.updateParagraph(e, e.target.id));
        this.heightInput.addEventListener('input', (e) => this.updateParagraph(e, e.target.id));
        this.startBtn.addEventListener('click', () => this.startCount());
    }

    setDate() {
        let dd = this.today.getDate();
        let mm = this.today.getMonth() + 1;
        let yyyy = this.today.getFullYear();
        if (dd < 10) {
            dd = "0" + dd;
        }
        if (mm < 10) {
            mm = "0" + mm;
        }
        this.today = `${yyyy}-${mm}-${dd}`;

        this.startDateInput.setAttribute("min", this.today);
        this.startDateInput.value = this.today;

        this.endDateInput.setAttribute("min", this.today);
        this.endDateInput.value = this.today;
    }

    updateParagraph(e, id) {
        if (id === 'initial-weight') {
            this.initialWeight = parseInt(e.target.value);
            this.initialWeightResult.textContent = `${this.initialWeight} kg`
        } else if (id === 'desired-weight') {
            this.desiredWeight = parseInt(e.target.value);
            this.desiredWeightResult.textContent = `${this.desiredWeight} kg`
        } else if (id === 'height') {
            this.height = parseInt(e.target.value);
            this.heightResult.textContent = `${this.height} cm`
        }
    }

    startCount() {
        this.startDate = new Date(this.startDateInput.value).getTime();
        this.endDate = new Date(this.endDateInput.value).getTime();

        this.days = Math.floor((this.endDate / (1000 * 60 * 60 * 24)) - (this.startDate / (1000 * 60 * 60 * 24)));

        if (this.startDate >= this.endDate || this.initialWeight === this.desiredWeight) {
            this.resultSection.innerHTML = this.error();
            return
        }
        this.resultSection.innerHTML = this.createResult();
    }

    error() {
        return `<p class="result__paragraph" data-result-paragraph>Current and desired weight can't be equal, start and end date should be
different</p>`
    }

    createResult() {
        let weightDifference = null;
        const currentBmi = this.currentBmi();
        const desiredBmi = this.desiredBmi();
        const scopeCurrentBmi = this.scopeBmi(currentBmi);
        const scopeDesiredBmi = this.scopeBmi(desiredBmi);
        let perDay = null;
        let perWeek = null;
        if (parseInt(this.initialWeight) > parseInt(this.desiredWeight)) {
            weightDifference = parseInt(this.initialWeight) - parseInt(this.desiredWeight);
            perDay = this.perDay(weightDifference);
            perWeek = this.perWeek(weightDifference);
            return `
            <p class="result__paragraph">You can losse ${weightDifference} kg</p>
            <p class="result__paragraph">Your current BMI is ${currentBmi} (${scopeCurrentBmi})</p>
            <p class="result__paragraph">Your desired BMI is ${desiredBmi} (${scopeDesiredBmi})</p>
            <p class="result__paragraph">You should losse ${perDay} kg per day</p>
            <p class="result__paragraph">You should losse ${perWeek} kg per week</p>
            `
        } else {
            weightDifference = parseInt(this.desiredWeight) - parseInt(this.initialWeight);
            perDay = this.perDay(weightDifference);
            perWeek = this.perWeek(weightDifference);
            return `
            <p class="result__paragraph">You can gain ${weightDifference} kg</p>
            <p class="result__paragraph">Your current BMI is ${currentBmi} (${scopeCurrentBmi})</p>
            <p class="result__paragraph">Your desired BMI is ${desiredBmi} (${scopeDesiredBmi})</p>
            <p class="result__paragraph">You should gain ${perDay} kg per day</p>
            <p class="result__paragraph">You should gain ${perWeek} kg per week</p>
            `
        }
    }

    currentBmi() {
        return (this.initialWeight / Math.pow(this.height / 100, 2)).toFixed(2);
    }

    desiredBmi() {
        return (this.desiredWeight / Math.pow(this.height / 100, 2)).toFixed(2);
    }

    perDay(weightDifference) {
        return (weightDifference / this.days).toFixed(2);
    }
    perWeek(weightDifference) {
        return (weightDifference / (this.days / 7)).toFixed(2);
    }

    scopeBmi(bmi) {
        if (bmi < 18.5) return 'underweight';
        else if (bmi >= 18.5 && bmi <= 24.9) return 'normal';
        else if (bmi >= 25 && bmi <= 29.9) return 'overweight';
        else return 'obesity';
    }
}