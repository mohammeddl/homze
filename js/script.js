document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 1;
    let currentPath = '';
    const totalSteps = 9;
    const progressSection = document.querySelector(".progress-section");
    const progressBar = document.querySelector(".progress-bar");
    const backLink = document.querySelector(".back-link");
    const steps = document.querySelectorAll(".step");

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
        const inputs = currentStepElement.querySelectorAll('input, select');
        const errorMessages = currentStepElement.querySelectorAll('.error-message');
        
        // Remove existing error messages
        errorMessages.forEach(msg => msg.remove());

        inputs.forEach(input => {
            // Reset styles
            input.style.borderColor = '';
            
            // Skip validation for optional fields
            if (!input.required && input.value === '') return;
            
            // Skip checkbox validation unless required
            if (input.type === 'checkbox' && !input.required) return;

            // Validate based on input type
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.style.borderColor = '#ff4d4d';
                    showError(input, 'Please enter a valid email address');
                }
            } else if (input.type === 'tel') {
                const phoneRegex = /^\+?[\d\s-]{8,}$/;
                if (!phoneRegex.test(input.value)) {
                    isValid = false;
                    input.style.borderColor = '#ff4d4d';
                    showError(input, 'Please enter a valid phone number');
                }
            } else if (input.tagName === 'SELECT' && input.value === '') {
                isValid = false;
                input.style.borderColor = '#ff4d4d';
                showError(input, 'Please select an option');
            } else if (input.type !== 'checkbox' && input.value.trim() === '') {
                isValid = false;
                input.style.borderColor = '#ff4d4d';
                showError(input, 'This field is required');
            }
        });

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
    document.querySelectorAll(".next-button, .next-btn, .suivant-btn").forEach(button => {
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
            nextStep = document.querySelector(`[data-step="${step}-${currentPath}"]`);
        }

        if (nextStep) {
            nextStep.style.display = 'block';
            nextStep.classList.add('active');
            
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
                currentStep++;
                showStep(currentStep);
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
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // If footer is in view
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
                // Scrolling down
                progressBarFlex.style.transition = 'all 0.3s ease-out';
            } else {
                // Scrolling up
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