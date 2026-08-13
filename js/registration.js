/* ==========================================================================
   NATIONAL ENDOSCOPY CONFERENCE 2026 - REGISTRATION MODAL
   Universal Popup, Form Validation, & Registration Submission Hook
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initRegistrationModal();
});

function initRegistrationModal() {
    const modalOverlay = document.getElementById('registration-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const registerForm = document.getElementById('registration-form');
    const successState = document.getElementById('modal-success-state');
    const registerButtons = document.querySelectorAll('.open-register-modal, [data-action="register"]');

    if (!modalOverlay) return;

    // 1. Attach Open Listener to all Register Now Buttons
    registerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openRegistrationModal();
        });
    });

    // 2. Open Modal Function
    window.openRegistrationModal = function() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // 3. Close Modal Function
    window.closeRegistrationModal = function() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form & success state after modal closes
        setTimeout(() => {
            if (registerForm) {
                registerForm.reset();
                registerForm.style.display = 'flex';
                clearErrors();
            }
            if (successState) {
                successState.style.display = 'none';
            }
        }, 300);
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeRegistrationModal);
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeRegistrationModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeRegistrationModal();
        }
    });

    // 4. Form Validation & Submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                const formData = {
                    fullName: document.getElementById('reg-fullname').value.trim(),
                    email: document.getElementById('reg-email').value.trim(),
                    phone: document.getElementById('reg-phone').value.trim(),
                    hospital: document.getElementById('reg-hospital').value.trim(),
                    designation: document.getElementById('reg-designation').value.trim(),
                    category: document.getElementById('reg-category').value,
                    city: document.getElementById('reg-city').value.trim(),
                    workshop: document.getElementById('reg-workshop').value,
                    message: document.getElementById('reg-message')?.value.trim() || '',
                    submittedAt: new Date().toISOString()
                };

                // Invoke Future Backend Hook
                submitRegistration(formData);

                // Show Success Screen
                registerForm.style.display = 'none';
                if (successState) {
                    // Generate random mock registration ticket ID
                    const ticketId = 'END2026-' + Math.floor(100000 + Math.random() * 900000);
                    const ticketEl = document.getElementById('ticket-number');
                    if (ticketEl) ticketEl.textContent = ticketId;
                    
                    successState.style.display = 'block';
                }
            }
        });
    }

    function validateForm() {
        clearErrors();
        let isValid = true;

        const fullName = document.getElementById('reg-fullname');
        const email = document.getElementById('reg-email');
        const phone = document.getElementById('reg-phone');
        const hospital = document.getElementById('reg-hospital');
        const designation = document.getElementById('reg-designation');
        const category = document.getElementById('reg-category');
        const city = document.getElementById('reg-city');
        const workshop = document.getElementById('reg-workshop');

        // Required check helper
        function checkRequired(field, message) {
            if (!field.value.trim()) {
                showError(field, message);
                isValid = false;
            }
        }

        checkRequired(fullName, 'Full Name is required');
        checkRequired(hospital, 'Hospital / Institution is required');
        checkRequired(designation, 'Designation is required');
        checkRequired(city, 'City is required');

        // Select Check
        if (!category.value) {
            showError(category, 'Please select your category');
            isValid = false;
        }

        if (!workshop.value) {
            showError(workshop, 'Please select your workshop preference');
            isValid = false;
        }

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Phone check
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{7,15}$/;
        if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        return isValid;
    }

    function showError(field, message) {
        field.classList.add('error');
        const errorEl = field.parentElement.querySelector('.error-text');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    }

    function clearErrors() {
        document.querySelectorAll('.form-input, .form-select').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-text').forEach(el => {
            el.classList.remove('visible');
            el.textContent = '';
        });
    }
}

/**
 * Clean function structure for future API / Backend integration
 * @param {Object} formData 
 */
function submitRegistration(formData) {
    console.log('Registration Data Submitted:', formData);
    // Future API endpoint call example:
    // fetch('/api/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
}
