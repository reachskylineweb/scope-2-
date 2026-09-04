/* ==========================================================================
   NATIONAL ENDOSCOPY CONFERENCE 2026 - REGISTRATION & GOOGLE SHEETS INTEGRATION
   Universal Popup, Form Validation, & Google Sheets Auto-Sync
   ========================================================================== */

// 1. GOOGLE SHEETS APPS SCRIPT ENDPOINT URL
// Replace the URL below with your deployed Google Apps Script Web App URL
const GOOGLE_SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkQ-Ir71MQZsL40bbGLZE8Tt3nxUpsnRA26qoUR_XFzoTIeIviPVpRVOVQ0KAbhO2e0Q/exec';

document.addEventListener('DOMContentLoaded', () => {
    initRegistrationModal();
    initContactRegistrationForm();
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
                clearErrors(registerForm);
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

    // 4. Modal Form Validation & Submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateModalForm(registerForm)) {
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
                    submittedAt: new Date().toLocaleString()
                };

                // Send data to Google Sheets & LocalStorage
                submitRegistration(formData);

                // Show Success Screen
                registerForm.style.display = 'none';
                if (successState) {
                    const ticketId = 'SCOPE2027-' + Math.floor(100000 + Math.random() * 900000);
                    const ticketEl = document.getElementById('ticket-number');
                    if (ticketEl) ticketEl.textContent = ticketId;
                    
                    successState.style.display = 'block';
                }
            }
        });
    }
}

/**
 * Handles Form Submission on contact.html page
 */
function initContactRegistrationForm() {
    const contactForm = document.getElementById('contact-inquiry-form');
    const successMsg = document.getElementById('contact-success-msg');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameEl = document.getElementById('contact-name');
        const emailEl = document.getElementById('contact-email');
        const phoneEl = document.getElementById('contact-phone');
        const hospitalEl = document.getElementById('contact-hospital');
        const designationEl = document.getElementById('contact-designation');
        const specialtyEl = document.getElementById('contact-specialty');
        const cityEl = document.getElementById('contact-city');
        const workshopEl = document.getElementById('contact-workshop');
        const messageEl = document.getElementById('contact-message');

        const formData = {
            fullName: nameEl ? nameEl.value.trim() : '',
            email: emailEl ? emailEl.value.trim() : '',
            phone: phoneEl ? phoneEl.value.trim() : '',
            hospital: hospitalEl ? hospitalEl.value.trim() : '',
            designation: designationEl ? designationEl.value.trim() : '',
            category: specialtyEl ? specialtyEl.value : '',
            city: cityEl ? cityEl.value.trim() : '',
            workshop: workshopEl ? workshopEl.value : '',
            message: messageEl ? messageEl.value.trim() : '',
            submittedAt: new Date().toLocaleString()
        };

        // Send data to Google Sheets & LocalStorage
        submitRegistration(formData);

        // Display Success State on Contact Page
        contactForm.style.display = 'none';
        if (successMsg) {
            successMsg.style.display = 'block';
        }
    });
}

function validateModalForm(form) {
    clearErrors(form);
    let isValid = true;

    const fullName = document.getElementById('reg-fullname');
    const email = document.getElementById('reg-email');
    const phone = document.getElementById('reg-phone');
    const hospital = document.getElementById('reg-hospital');
    const designation = document.getElementById('reg-designation');
    const category = document.getElementById('reg-category');
    const city = document.getElementById('reg-city');
    const workshop = document.getElementById('reg-workshop');

    function checkRequired(field, message) {
        if (!field.value.trim()) {
            showError(field, message);
            isValid = false;
        }
    }

    if (fullName) checkRequired(fullName, 'Full Name is required');
    if (hospital) checkRequired(hospital, 'Hospital / Institution is required');
    if (designation) checkRequired(designation, 'Designation is required');
    if (city) checkRequired(city, 'City is required');

    if (category && !category.value) {
        showError(category, 'Please select your category');
        isValid = false;
    }

    if (workshop && !workshop.value) {
        showError(workshop, 'Please select your workshop preference');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && (!email.value.trim() || !emailRegex.test(email.value.trim()))) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{7,15}$/;
    if (phone && (!phone.value.trim() || !phoneRegex.test(phone.value.trim()))) {
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

function clearErrors(container) {
    const parent = container || document;
    parent.querySelectorAll('.form-input, .form-select').forEach(el => el.classList.remove('error'));
    parent.querySelectorAll('.error-text').forEach(el => {
        el.classList.remove('visible');
        el.textContent = '';
    });
}

/**
 * Submits Registration Data to Google Sheets Web App Endpoint & LocalStorage Backup
 * @param {Object} formData 
 */
function submitRegistration(formData) {
    console.log('SCOPE 2027 Registration Data:', formData);

    // 1. LocalStorage Local Backup
    try {
        const existing = JSON.parse(localStorage.getItem('scope2027_registrations') || '[]');
        existing.push(formData);
        localStorage.setItem('scope2027_registrations', JSON.stringify(existing));
    } catch (err) {
        console.warn('LocalStorage save error:', err);
    }

    // 2. Google Sheets Web App Sync
    if (GOOGLE_SHEET_SCRIPT_URL && GOOGLE_SHEET_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        try {
            const params = new URLSearchParams();
            for (const key in formData) {
                params.append(key, formData[key] || '');
            }

            fetch(GOOGLE_SHEET_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            })
            .then(() => console.log('Successfully posted registration to Google Sheet.'))
            .catch(err => console.error('Error posting to Google Sheet:', err));
        } catch (e) {
            console.error('Fetch error:', e);
        }
    }
}
