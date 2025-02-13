const FormStore = {
    // Key for localStorage
    STORAGE_KEY: 'property_form_data',

    // Initialize storage with empty data structure
    initializeStore() {
        localStorage.removeItem(this.STORAGE_KEY);
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialData = {
                currentStep: 1,
                propertyType: '',
                formData: {
                    step1: {},
                    step2: {},
                    step3: {},
                    step4: {},
                    step5: {},
                    step6: {},
                    step7: {},
                    step8: {},
                    step9: {}
                }
            };
            this.saveData(initialData);
        }
    },

    // Save all form data
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Get all form data
    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    // Clear all form data
    clearData() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.initializeStore();
    },

    // Save data for a specific step
    saveStepData(step, data) {
        const formData = this.getData();
        if (formData) {
            // Handle special case for steps 4-6 which have property type suffix
            const stepKey = step.toString().includes('-') ? step : `step${step}`;
            formData.formData[stepKey] = data;
            this.saveData(formData);
        }
    },

    // Get data for a specific step
    getStepData(step) {
        const formData = this.getData();
        if (formData) {
            const stepKey = step.toString().includes('-') ? step : `step${step}`;
            return formData.formData[stepKey];
        }
        return null;
    },

    // Save current step
    saveCurrentStep(step) {
        const formData = this.getData();
        if (formData) {
            formData.currentStep = step;
            this.saveData(formData);
        }
    },

    // Save property type
    savePropertyType(type) {
        const formData = this.getData();
        if (formData) {
            formData.propertyType = type;
            this.saveData(formData);
        }
    },

    // Get current step
    getCurrentStep() {
        const formData = this.getData();
        return formData ? formData.currentStep : 1;
    },

    // Get property type
    getPropertyType() {
        const formData = this.getData();
        return formData ? formData.propertyType : '';
    },

    // Collect form data for each step
    collectStepData(step) {
        const currentStepElement = document.querySelector(`[data-step="${step}"]`);
        if (!currentStepElement) return null;

        const data = {};

        switch (step) {
            case 1:
                const searchInput = currentStepElement.querySelector('.search-input');
                data.address = searchInput ? searchInput.value : '';
                break;

            case 2:
                const addressInputs = currentStepElement.querySelectorAll('.text-input');
                addressInputs.forEach(input => {
                    data[input.placeholder.toLowerCase()] = input.value;
                });
                break;

            case '4-appartement':
            case '4-maison':
                const surfaces = currentStepElement.querySelectorAll('.number-value');
                const selects = currentStepElement.querySelectorAll('select');
                
                surfaces.forEach((surface, index) => {
                    data[`surface${index + 1}`] = surface.textContent;
                });
                
                selects.forEach(select => {
                    data[select.previousElementSibling.textContent.toLowerCase()] = select.value;
                });
                break;

            case '5-appartement':
            case '5-maison':
                const roomSelects = currentStepElement.querySelectorAll('select');
                roomSelects.forEach(select => {
                    data[select.previousElementSibling.textContent.toLowerCase()] = select.value;
                });
                break;

            case '6-appartement':
            case '6-maison':
                const stateSelect = currentStepElement.querySelector('select');
                const checkboxes = currentStepElement.querySelectorAll('input[type="checkbox"]');
                
                data.etatGeneral = stateSelect ? stateSelect.value : '';
                checkboxes.forEach(checkbox => {
                    data[checkbox.id] = checkbox.checked;
                });
                break;

            case 7:
                const roleSelect = currentStepElement.querySelector('#role-select');
                const intentionSelect = currentStepElement.querySelector('#intention-select');
                const estimationInput = currentStepElement.querySelector('input[type="text"]');
                
                data.role = roleSelect ? roleSelect.value : '';
                data.intention = intentionSelect ? intentionSelect.value : '';
                data.estimation = estimationInput ? estimationInput.value : '';
                break;

            case 8:
                const contactInputs = currentStepElement.querySelectorAll('.text-input');
                contactInputs.forEach(input => {
                    data[input.placeholder.toLowerCase()] = input.value;
                });
                break;

            case 9:
                const codeInputs = currentStepElement.querySelectorAll('.code-input');
                const consentCheckbox = currentStepElement.querySelector('.consent-checkbox');
                
                data.verificationCode = Array.from(codeInputs).map(input => input.value).join('');
                data.consent = consentCheckbox ? consentCheckbox.checked : false;
                break;
        }

        return data;
    },

    // Restore form data for a step
    restoreStepData(step) {
        const data = this.getStepData(step);
        if (!data) return;

        const currentStepElement = document.querySelector(`[data-step="${step}"]`);
        if (!currentStepElement) return;

        switch (step) {
            case 1:
                const searchInput = currentStepElement.querySelector('.search-input');
                if (searchInput && data.address) searchInput.value = data.address;
                break;

            case 2:
                const addressInputs = currentStepElement.querySelectorAll('.text-input');
                addressInputs.forEach(input => {
                    const key = input.placeholder.toLowerCase();
                    if (data[key]) input.value = data[key];
                });
                break;

            // Add cases for other steps following the same pattern
            // ...
        }
    }
};

// Initialize store when the script loads
FormStore.initializeStore();

// Export the FormStore object
export default FormStore;