import FormStore from './store.js';
document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 1;
    let currentPath = '';
    const totalSteps = 9;
    const progressSection = document.querySelector(".progress-section");
    const progressBar = document.querySelector(".progress-bar");
    const backLink = document.querySelector(".back-link");
    const steps = document.querySelectorAll(".step");
    const savedStep = FormStore.getCurrentStep();
    const savedPropertyType = FormStore.getPropertyType();

    if (savedStep > 1) {
        currentStep = savedStep;
        currentPath = savedPropertyType;
        showStep(currentStep);
    }

    // Initialize renovation selects
    function initializeRenovationSelects() {
        const renovationContainers = document.querySelectorAll('.renovation-container');
        
        renovationContainers.forEach(container => {
            const select = container.querySelector('#renovation-select');
            const yearContainer = container.querySelector('#renovation-year-container');
            
            if (select && yearContainer) {
                // Remove existing listeners to prevent duplicates
                const newSelect = select.cloneNode(true);
                select.parentNode.replaceChild(newSelect, select);
                
                newSelect.addEventListener('change', function() {
                    if (this.value.toLowerCase() === 'oui') {
                        yearContainer.style.display = 'block';
                    } else {
                        yearContainer.style.display = 'none';
                        const yearSelect = yearContainer.querySelector('#renovation-year');
                        if (yearSelect) {
                            yearSelect.value = '';
                        }
                    }
                });
            }
        });
    }

    // Property type selection
    document.querySelectorAll('.property-card').forEach(card => {
        const button = card.querySelector('.choose-btn');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const propertyType = card.querySelector('h3').textContent.trim().toLowerCase();
            currentPath = propertyType;
            
            FormStore.savePropertyType(propertyType);
            steps.forEach(step => {
                step.style.display = 'none';
                step.classList.remove('active');
            });

            if (propertyType === 'maison') {
                const maisonFrame = document.querySelector('[data-step="4-maison"]');
                if (maisonFrame) {
                    currentStep = 4;
                    maisonFrame.style.display = 'block';
                    maisonFrame.classList.add('active');
                }
            } else if (propertyType === 'appartement') {
                const appartementFrame = document.querySelector('[data-step="4-appartement"]');
                if (appartementFrame) {
                    currentStep = 4;
                    appartementFrame.style.display = 'block';
                    appartementFrame.classList.add('active');
                }
            }
            
            setTimeout(initializeRenovationSelects, 100);
            updateProgress();
        });
    });

    // Form validation function
    function validateStep(step) {
        const currentStepElement = document.querySelector(`[data-step="${step}"]`);
        if (!currentStepElement) return true;
    
        let isValid = true;
        let errorMessage = '';
    
        switch (step) {
            case 1:
                const searchInput = currentStepElement.querySelector('.search-input');
                if (!searchInput?.value.trim()) {
                    errorMessage = 'Veuillez entrer une adresse';
                    isValid = false;
                }
                break;
    
            case 2:
                const addressInputs = currentStepElement.querySelectorAll('.text-input');
                let emptyFields = [];
                addressInputs.forEach(input => {
                    if (!input.value.trim()) {
                        emptyFields.push(input.placeholder);
                    }
                });
                if (emptyFields.length > 0) {
                    errorMessage = `Veuillez remplir: ${emptyFields.join(', ')}`;
                    isValid = false;
                }
                break;
    
            case '4-appartement':
            case '4-maison':
                const surfaces = currentStepElement.querySelectorAll('.number-value');
                const surfaceSelects = currentStepElement.querySelectorAll('select');
    
                if ([...surfaces].some(s => parseInt(s.textContent) <= 0)) {
                    errorMessage = 'La surface doit être supérieure à 0';
                    isValid = false;
                    break;
                }
    
                if ([...surfaceSelects].some(s => !s.value)) {
                    errorMessage = 'Veuillez remplir tous les champs de sélection';
                    isValid = false;
                }
                break;
    
            case '5-appartement':
            case '5-maison':
                const roomSelects = currentStepElement.querySelectorAll('select');
                if ([...roomSelects].some(s => !s.value)) {
                    errorMessage = 'Veuillez sélectionner le nombre de pièces et de salles de bain';
                    isValid = false;
                }
                break;
    
            case '6-appartement':
            case '6-maison':
                const stateSelect = currentStepElement.querySelector('select');
                if (!stateSelect?.value) {
                    errorMessage = 'Veuillez sélectionner l\'état général du bien';
                    isValid = false;
                }
                break;
    
            case 7:
                const roleSelect = currentStepElement.querySelector('#role-select');
                const intentionContainer = document.getElementById('intention-vente-container');
                const estimationInput = currentStepElement.querySelector('input[type="text"]');
    
                if (!roleSelect?.value) {
                    errorMessage = 'Veuillez sélectionner votre rôle';
                    isValid = false;
                    break;
                }
    
                if (intentionContainer?.style.display !== 'none') {
                    const intentionSelect = intentionContainer.querySelector('select');
                    if (!intentionSelect?.value) {
                        errorMessage = 'Veuillez sélectionner votre intention de vente';
                        isValid = false;
                        break;
                    }
                }
    
                if (!estimationInput?.value.trim() || isNaN(parseFloat(estimationInput.value.replace(/\s/g, '')))) {
                    errorMessage = 'Veuillez entrer une estimation valide';
                    isValid = false;
                }
                break;
    
            case 8:
                const contactFields = currentStepElement.querySelectorAll('.text-input');
                for (const field of contactFields) {
                    if (!field.value.trim()) {
                        errorMessage = 'Tous les champs sont obligatoires';
                        isValid = false;
                        break;
                    }
                    if (field.type === 'email' && !validateEmail(field.value)) {
                        errorMessage = 'Adresse email invalide';
                        isValid = false;
                        break;
                    }
                    if (field.placeholder === 'Téléphone' && !validatePhone(field.value)) {
                        errorMessage = 'Numéro de téléphone invalide';
                        isValid = false;
                        break;
                    }
                }
                break;
    
            case 9:
                const codeInputs = currentStepElement.querySelectorAll('.code-input');
                const code = [...codeInputs].map(input => input.value).join('');
                const consentCheckbox = currentStepElement.querySelector('.consent-checkbox');
    
                if (code.length !== 4) {
                    errorMessage = 'Veuillez entrer le code complet';
                    isValid = false;
                    break;
                }
    
                if (!consentCheckbox?.checked) {
                    errorMessage = 'Veuillez accepter les conditions';
                    isValid = false;
                }
                break;
        }
    
        if (!isValid) {
            showAlert(errorMessage);
        }
    
        return isValid;
    }
    

    // Helper function to show error messages
    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff4d4d';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
    }

    // Navigation button handlers
    document.querySelectorAll(".next-button, .next-btn, .suivant-btn, .addr-submit").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            nextStep();
        });
    });

    if (backLink) {
        backLink.addEventListener("click", (e) => {
            e.preventDefault();
            prevStep();
        });
    }

    function showStep(step) {
        steps.forEach(el => {
            el.style.display = 'none';
            el.classList.remove('active');
        });
    
        let nextStep;
        if (step <= 3) {
            nextStep = document.querySelector(`[data-step="${step}"]`);
        } else if (step >= 7) {
            nextStep = document.querySelector(`[data-step="${step}"]`);
        } else {
            // For steps 4-6, we need to ensure the property type path is included
            const savedPropertyType = FormStore.getPropertyType();
            if (savedPropertyType) {
                nextStep = document.querySelector(`[data-step="${step}-${savedPropertyType}"]`);
            }
            // If no property type specific step is found, fall back to the base step
            if (!nextStep) {
                nextStep = document.querySelector(`[data-step="${step}"]`);
            }
        }
    
        if (nextStep) {
            nextStep.style.display = 'block';
            nextStep.classList.add('active');
            FormStore.restoreStepData(step);
    
            // Restore property type specific data
            const savedPropertyType = FormStore.getPropertyType();
            if (savedPropertyType && (step === 4 || step === 5 || step === 6)) {
                const propertyTypeStep = FormStore.getStepData(`${step}-${savedPropertyType}`);
                if (propertyTypeStep) {
                    Object.entries(propertyTypeStep).forEach(([key, value]) => {
                        const element = nextStep.querySelector(`[name="${key}"]`) || 
                                      nextStep.querySelector(`#${key}`) ||
                                      nextStep.querySelector(`[data-name="${key}"]`);
                        if (element) {
                            if (element.type === 'checkbox') {
                                element.checked = value;
                            } else {
                                element.value = value;
                            }
                        }
                    });
                }
            }
    
            // Add input event listeners for real-time validation
            const inputs = nextStep.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    input.style.borderColor = '';
                    const errorMessage = input.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                });
            });
    
            setTimeout(initializeRenovationSelects, 100);
        }
    
        progressSection.classList.toggle("active", step > 1);
        backLink.style.visibility = step === 1 ? "hidden" : "visible";
        updateProgress();
    }
    

    function nextStep() {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) {
                // Save current step data
                const stepData = FormStore.collectStepData(currentStep);
                FormStore.saveStepData(currentStep, stepData);
                
                currentStep++;
                FormStore.saveCurrentStep(currentStep);
                
                showStep(currentStep);
                showAlert('Étape validée avec succès', 'success');
            }
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }

    function updateProgress() {
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;

        const stepCounter = document.querySelector(".current-step");
        if (stepCounter) {
            stepCounter.textContent = currentStep;
        }
    }

    // Initialize number inputs
    function initializeNumberInputs() {
        document.querySelectorAll('.number-input-group').forEach(group => {
            const valueDisplay = group.querySelector('.number-value');
            const decreaseBtn = group.querySelector('[data-action="decrease"]');
            const increaseBtn = group.querySelector('[data-action="increase"]');
            let value = parseInt(valueDisplay.textContent) || 0;

            // Remove existing listeners
            const newDecreaseBtn = decreaseBtn.cloneNode(true);
            const newIncreaseBtn = increaseBtn.cloneNode(true);
            decreaseBtn.parentNode.replaceChild(newDecreaseBtn, decreaseBtn);
            increaseBtn.parentNode.replaceChild(newIncreaseBtn, increaseBtn);

            newDecreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (value > 0) {
                    value--;
                    valueDisplay.textContent = value;
                }
            });

            newIncreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                value++;
                valueDisplay.textContent = value;
            });
        });
    }

    // Initialize role select
    function initializeRoleSelect() {
        const roleSelect = document.getElementById('role-select');
        const intentionContainer = document.getElementById('intention-vente-container');
        
        if (roleSelect && intentionContainer) {
            roleSelect.addEventListener('change', function() {
                const selectedValue = this.value.toLowerCase();
                
                if (selectedValue === 'propriétaire' || selectedValue === 'acheteur') {
                    intentionContainer.style.display = 'block';
                } else {
                    intentionContainer.style.display = 'none';
                    const intentionSelect = document.getElementById('intention-select');
                    if (intentionSelect) {
                        intentionSelect.value = '';
                    }
                }
            });
        }
    }

    // Handle progress bar visibility

function handleProgressBarVisibility() {
    const footer = document.querySelector('.footer');
    const progressBarFlex = document.querySelector('.progress-bar-flex');
    let lastScrollTop = 0;

    function checkVisibility() {
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 767;
        
        // If on mobile, always show the progress bar
        if (isMobile) {
            progressBarFlex.style.opacity = '1';
            progressBarFlex.style.transform = 'translateY(0)';
            progressBarFlex.style.pointerEvents = 'auto';
            return;
        }

        // Desktop behavior
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (footerRect.top <= windowHeight) {
            progressBarFlex.style.opacity = '0';
            progressBarFlex.style.transform = 'translateY(100%)';
            progressBarFlex.style.pointerEvents = 'none';
        } else {
            progressBarFlex.style.opacity = '1';
            progressBarFlex.style.transform = 'translateY(0)';
            progressBarFlex.style.pointerEvents = 'auto';
        }

        // Handle scroll direction
        if (currentScroll > lastScrollTop) {
            progressBarFlex.style.transition = 'all 0.3s ease-out';
        } else {
            progressBarFlex.style.transition = 'all 0.3s ease-in';
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }

    // Add smooth transition styles
    progressBarFlex.style.transition = 'all 0.3s ease';

    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
    // Check on load
    checkVisibility();
    // Check on resize
    window.addEventListener('resize', checkVisibility);
}

    // Initial setup
    showStep(currentStep);
    initializeRenovationSelects();
    initializeNumberInputs();
    initializeRoleSelect();
    handleProgressBarVisibility();
});


function showError(element, message) {
    // Remove any existing error message
    const existingError = element.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4d4d';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;

    // Add error styles to the input
    if (element.classList.contains('text-input') || element.tagName === 'SELECT') {
        element.style.borderColor = '#ff4d4d';
    }

    // Insert error message after the element
    element.parentElement.appendChild(errorDiv);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone.replace(/\s/g, ''));
}

// Add input event listeners to clear errors on input
function addInputListeners(element) {
    element.addEventListener('input', function() {
        // Remove error styles
        this.style.borderColor = '';
        // Remove error message if it exists
        const errorMessage = this.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

// Initialize validation listeners for all form inputs
function initializeValidation() {
    document.querySelectorAll('input, select').forEach(addInputListeners);
}


function showAlert(message, type = 'error') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    
    alert.innerHTML = `
        <span class="alert-icon">
            ${type === 'error' ? '⚠️' : '✅'}
        </span>
        <span class="alert-message">${message}</span>
        <span class="alert-close">×</span>
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('show');
    }, 10);

    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    });

    setTimeout(() => {
        if (alert && document.body.contains(alert)) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}


