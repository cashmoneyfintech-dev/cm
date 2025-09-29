// Comprehensive Fintech Website JavaScript Functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    setupNavigation();
    setupPasswordStrength();
    setupSmoothScrolling();
    setupFormValidation();
    setupServiceSelection();
    setupAnimations();
}

// Navigation Functions
function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
        });
    }

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('nav__menu--active');
            navToggle.classList.remove('nav__toggle--active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('nav__menu--active');
            navToggle.classList.remove('nav__toggle--active');
        }
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function showRegistrationModal() {
    showModal('registrationModal');
    resetRegistrationForm();
}

function showLoginModal() {
    showModal('loginModal');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        hideModal(modalId);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal) {
            hideModal(openModal.id);
        }
    }
});

// Registration Functions
let currentStep = 1;
let selectedRole = '';
let selectedServices = [];
let registrationData = {};

function resetRegistrationForm() {
    currentStep = 1;
    selectedRole = '';
    selectedServices = [];
    registrationData = {};
    updateRegistrationStep(1);
}

function selectRole(role) {
    selectedRole = role;
    registrationData.role = role;
    showRegistrationModal();
    
    // Show role selection in step 2
    setTimeout(() => {
        if (currentStep === 2) {
            const roleSelect = document.querySelector('#step2 select[name="role"]');
            if (roleSelect) {
                roleSelect.value = role;
            }
        }
    }, 100);
}

function goToStep(stepNumber) {
    if (stepNumber <= currentStep + 1) {
        currentStep = stepNumber;
        updateRegistrationStep(stepNumber);
    }
}

function nextStep(event, stepNumber) {
    event.preventDefault();
    
    const currentStepForm = event.target;
    const formData = new FormData(currentStepForm);
    
    // Validate current step
    if (!validateStep(currentStep, formData)) {
        return;
    }
    
    // Store step data
    storeStepData(currentStep, formData);
    
    // Handle specific step logic
    if (currentStep === 1) {
        // Simulate mobile OTP verification
        showOTPVerification();
        return;
    }
    
    if (stepNumber <= 5) {
        currentStep = stepNumber;
        updateRegistrationStep(stepNumber);
        
        if (stepNumber === 5) {
            showRegistrationSummary();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateRegistrationStep(currentStep);
    }
}

function updateRegistrationStep(stepNumber) {
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    const stepPanels = document.querySelectorAll('.registration__step');
    
    steps.forEach((step, index) => {
        if (index + 1 <= stepNumber) {
            step.classList.add('step--active');
        } else {
            step.classList.remove('step--active');
        }
    });
    
    // Show current step panel
    stepPanels.forEach(panel => panel.classList.remove('registration__step--active'));
    
    let currentPanel = document.getElementById(`step${stepNumber}`);
    if (!currentPanel) {
        // Create step panels if they don't exist
        currentPanel = createStepPanel(stepNumber);
    }
    
    if (currentPanel) {
        currentPanel.classList.add('registration__step--active');
    }
}

function createStepPanel(stepNumber) {
    const container = document.getElementById('registrationContent');
    let panel = document.getElementById(`step${stepNumber}`);
    
    if (panel) {
        return panel;
    }
    
    panel = document.createElement('div');
    panel.id = `step${stepNumber}`;
    panel.className = 'registration__step';
    
    switch (stepNumber) {
        case 2:
            panel.innerHTML = createBusinessDetailsStep();
            break;
        case 3:
            panel.innerHTML = createKYCDocumentsStep();
            break;
        case 4:
            panel.innerHTML = createVerificationStep();
            break;
        case 5:
            panel.innerHTML = createApprovalStep();
            break;
    }
    
    container.appendChild(panel);
    setupStepEventListeners(stepNumber);
    return panel;
}

function createBusinessDetailsStep() {
    return `
        <h3>Business Details & Service Selection</h3>
        <form onsubmit="nextStep(event, 3)">
            <div class="form-group">
                <label class="form-label">User Role *</label>
                <select class="form-control" name="role" required>
                    <option value="">Select Role</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="White Label">White Label</option>
                    <option value="Distributors">Distributors</option>
                    <option value="Retailers">Retailers</option>
                </select>
            </div>
            
            <div class="service-selection">
                <h4>Service Categories Selection *</h4>
                <p>Choose which services you want to offer to your customers:</p>
                <div class="service-categories-grid">
                    <div class="service-category-option" data-category="financial">
                        <h5>💳 Financial Services</h5>
                        <p>Mobile recharge, bill payments, money transfer, AEPS, UPI collection, payouts</p>
                    </div>
                    <div class="service-category-option" data-category="travel">
                        <h5>✈️ Travel Services</h5>
                        <p>Flight bookings, train tickets, bus reservations with IRCTC partnership</p>
                    </div>
                    <div class="service-category-option" data-category="lending">
                        <h5>💰 Lending Services</h5>
                        <p>Personal loans, business loans through RBI regulated lending partners</p>
                    </div>
                    <div class="service-category-option" data-category="insurance">
                        <h5>🛡️ Insurance Services</h5>
                        <p>Life, health, motor insurance with leading insurance companies</p>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Business Name</label>
                <input type="text" class="form-control" name="businessName">
                <small class="form-text">Leave blank if individual</small>
            </div>
            <div class="form-group">
                <label class="form-label">Date of Birth *</label>
                <input type="date" class="form-control" name="dob" required>
            </div>
            <div class="form-group">
                <label class="form-label">Gender *</label>
                <select class="form-control" name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Current Address *</label>
                <textarea class="form-control" name="currentAddress" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox" name="sameAddress">
                    <span class="checkmark"></span>
                    Permanent address same as current address
                </label>
            </div>
            <div class="form-group" id="permanentAddressGroup">
                <label class="form-label">Permanent Address *</label>
                <textarea class="form-control" name="permanentAddress" rows="3" required></textarea>
            </div>
            <div class="flex gap-16">
                <button type="button" class="btn btn--outline" onclick="previousStep()">Previous</button>
                <button type="submit" class="btn btn--primary">Continue to KYC</button>
            </div>
        </form>
    `;
}

function createKYCDocumentsStep() {
    return `
        <h3>KYC Documents Upload</h3>
        <p class="text-secondary">Please upload clear images of the following documents:</p>
        <form onsubmit="nextStep(event, 4)">
            <div class="form-group">
                <label class="form-label">Aadhaar Card (Front & Back) *</label>
                <input type="file" class="form-control" name="aadhaarFront" accept="image/*" required>
                <input type="file" class="form-control" name="aadhaarBack" accept="image/*" required>
            </div>
            <div class="form-group">
                <label class="form-label">PAN Card *</label>
                <input type="file" class="form-control" name="panCard" accept="image/*" required>
            </div>
            <div class="form-group">
                <label class="form-label">Bank Account Number *</label>
                <input type="text" class="form-control" name="accountNumber" required>
            </div>
            <div class="form-group">
                <label class="form-label">Bank IFSC Code *</label>
                <input type="text" class="form-control" name="ifscCode" required>
            </div>
            <div class="form-group">
                <label class="form-label">Cancelled Cheque *</label>
                <input type="file" class="form-control" name="cancelledCheque" accept="image/*" required>
            </div>
            <div class="form-group" id="businessDocGroup" style="display: none;">
                <label class="form-label">Business Registration Certificate</label>
                <input type="file" class="form-control" name="businessReg" accept="image/*">
            </div>
            <div class="form-group" id="travelDocGroup" style="display: none;">
                <label class="form-label">Travel Agent License (Optional)</label>
                <input type="file" class="form-control" name="travelLicense" accept="image/*">
                <small class="form-text">Required for travel services partnership benefits</small>
            </div>
            <div class="form-group" id="insuranceDocGroup" style="display: none;">
                <label class="form-label">Insurance Agent License (Optional)</label>
                <input type="file" class="form-control" name="insuranceLicense" accept="image/*">
                <small class="form-text">Required for insurance services commission benefits</small>
            </div>
            <div class="flex gap-16">
                <button type="button" class="btn btn--outline" onclick="previousStep()">Previous</button>
                <button type="submit" class="btn btn--primary">Upload & Continue</button>
            </div>
        </form>
    `;
}

function createVerificationStep() {
    const selectedServicesText = selectedServices.length > 0 ? selectedServices.join(', ') : 'All Services';
    return `
        <h3>Service Verification & Compliance</h3>
        <div class="verification-status">
            <div class="status-item">
                <span class="status status--info">📋 Documents Uploaded</span>
                <p>Your documents have been uploaded successfully</p>
            </div>
            <div class="status-item">
                <span class="status status--info">🎯 Services Selected: ${selectedServicesText}</span>
                <p>Selected service categories are being verified</p>
            </div>
            <div class="status-item">
                <span class="status status--warning">⏳ Under Review</span>
                <p>Our team is currently reviewing your documents and service eligibility</p>
            </div>
        </div>
        <form onsubmit="nextStep(event, 5)">
            <h4>Multi-Service Compliance Agreements</h4>
            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox" required>
                    <span class="checkmark"></span>
                    I agree to comply with all RBI guidelines and regulations for financial services
                </label>
            </div>
            <div class="form-group" id="travelAgreement" style="display: none;">
                <label class="checkbox-container">
                    <input type="checkbox" required>
                    <span class="checkmark"></span>
                    I agree to IRCTC terms and conditions for railway ticket booking services
                </label>
            </div>
            <div class="form-group" id="lendingAgreement" style="display: none;">
                <label class="checkbox-container">
                    <input type="checkbox" required>
                    <span class="checkmark"></span>
                    I agree to lending partner agreements and RBI regulations for loan services
                </label>
            </div>
            <div class="form-group" id="insuranceAgreement" style="display: none;">
                <label class="checkbox-container">
                    <input type="checkbox" required>
                    <span class="checkmark"></span>
                    I agree to insurance regulatory compliance and partner terms
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox" required>
                    <span class="checkmark"></span>
                    I authorize the processing of my personal and financial data for KYC verification
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox" required>
                    <span class="checkmark"></span>
                    I consent to receive transaction alerts and service communications
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    Schedule Video KYC (Recommended for faster approval of all services)
                </label>
            </div>
            <div class="flex gap-16">
                <button type="button" class="btn btn--outline" onclick="previousStep()">Previous</button>
                <button type="submit" class="btn btn--primary">Submit Multi-Service Application</button>
            </div>
        </form>
    `;
}

function createApprovalStep() {
    const selectedServicesText = selectedServices.length > 0 ? selectedServices.join(', ') : 'All Services';
    return `
        <h3>Multi-Service Application Submitted Successfully! 🎉</h3>
        <div class="success-message">
            <div class="status status--success">✅ Application Received</div>
            <p>Your comprehensive registration application has been submitted successfully.</p>
            <p><strong>Selected Services:</strong> ${selectedServicesText}</p>
        </div>
        <div class="approval-info">
            <h4>Service Activation Timeline</h4>
            <ul>
                <li><strong>Financial Services:</strong> 1-2 business days</li>
                <li><strong>Travel Services:</strong> 2-3 business days (IRCTC verification)</li>
                <li><strong>Lending Services:</strong> 3-4 business days (Partner verification)</li>
                <li><strong>Insurance Services:</strong> 2-3 business days (Regulatory compliance)</li>
            </ul>
            <p><strong>Complete Activation:</strong> 3-5 business days for all services</p>
        </div>
        <div class="contact-info">
            <h4>Need Help?</h4>
            <p>📧 Email: support@mycashmoney.in</p>
            <p>📞 Phone: +91 9876543210</p>
            <p>💬 WhatsApp: +91 9876543210</p>
            <p>Reference ID: <code>CM${Date.now()}</code></p>
        </div>
        <div class="form-actions">
            <button class="btn btn--primary btn--full-width" onclick="closeRegistration()">
                Continue to Multi-Service Login
            </button>
        </div>
    `;
}

function setupStepEventListeners(stepNumber) {
    if (stepNumber === 2) {
        setupServiceSelection();
        setupAddressSync();
        setupRoleBasedFields();
    }
}

function setupServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-category-option');
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            const category = this.dataset.category;
            this.classList.toggle('selected');
            
            if (this.classList.contains('selected')) {
                if (!selectedServices.includes(category)) {
                    selectedServices.push(category);
                }
            } else {
                selectedServices = selectedServices.filter(service => service !== category);
            }
            
            updateServiceDependentFields();
        });
    });
}

function updateServiceDependentFields() {
    // Show/hide service-specific document fields
    const travelDoc = document.getElementById('travelDocGroup');
    const insuranceDoc = document.getElementById('insuranceDocGroup');
    const travelAgreement = document.getElementById('travelAgreement');
    const lendingAgreement = document.getElementById('lendingAgreement');
    const insuranceAgreement = document.getElementById('insuranceAgreement');
    
    if (travelDoc) {
        travelDoc.style.display = selectedServices.includes('travel') ? 'block' : 'none';
    }
    if (insuranceDoc) {
        insuranceDoc.style.display = selectedServices.includes('insurance') ? 'block' : 'none';
    }
    if (travelAgreement) {
        travelAgreement.style.display = selectedServices.includes('travel') ? 'block' : 'none';
        travelAgreement.querySelector('input').required = selectedServices.includes('travel');
    }
    if (lendingAgreement) {
        lendingAgreement.style.display = selectedServices.includes('lending') ? 'block' : 'none';
        lendingAgreement.querySelector('input').required = selectedServices.includes('lending');
    }
    if (insuranceAgreement) {
        insuranceAgreement.style.display = selectedServices.includes('insurance') ? 'block' : 'none';
        insuranceAgreement.querySelector('input').required = selectedServices.includes('insurance');
    }
}

function setupAddressSync() {
    const sameAddressCheckbox = document.querySelector('input[name="sameAddress"]');
    if (sameAddressCheckbox) {
        sameAddressCheckbox.addEventListener('change', function() {
            const permanentAddressGroup = document.getElementById('permanentAddressGroup');
            const permanentAddressField = document.querySelector('textarea[name="permanentAddress"]');
            
            if (this.checked) {
                permanentAddressGroup.style.display = 'none';
                permanentAddressField.required = false;
            } else {
                permanentAddressGroup.style.display = 'block';
                permanentAddressField.required = true;
            }
        });
    }
}

function setupRoleBasedFields() {
    const roleSelect = document.querySelector('select[name="role"]');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const businessDocGroup = document.getElementById('businessDocGroup');
            const businessRoles = ['White Label', 'Super Admin', 'Admin'];
            
            if (businessDocGroup) {
                if (businessRoles.includes(this.value)) {
                    businessDocGroup.style.display = 'block';
                    businessDocGroup.querySelector('input').required = true;
                } else {
                    businessDocGroup.style.display = 'none';
                    businessDocGroup.querySelector('input').required = false;
                }
            }
        });
    }
}

function showOTPVerification() {
    const stepContent = document.querySelector('.registration__step--active');
    if (stepContent) {
        stepContent.innerHTML = `
            <h3>Mobile Number Verification</h3>
            <p>We've sent a 6-digit OTP to your mobile number. Please enter it below:</p>
            <form onsubmit="verifyOTP(event)">
                <div class="form-group">
                    <label class="form-label">Enter OTP *</label>
                    <input type="text" class="form-control" name="otp" maxlength="6" required 
                           placeholder="Enter 6-digit OTP" style="text-align: center; font-size: 1.2rem;">
                </div>
                <div class="otp-info">
                    <p>Didn't receive OTP? <button type="button" class="btn-link" onclick="resendOTP()">Resend OTP</button></p>
                    <p>OTP expires in: <span id="otpTimer">120</span> seconds</p>
                </div>
                <button type="submit" class="btn btn--primary btn--full-width">Verify OTP & Continue</button>
            </form>
        `;
        startOTPTimer();
    }
}

function verifyOTP(event) {
    event.preventDefault();
    
    // Simulate OTP verification
    const otpInput = event.target.querySelector('input[name="otp"]');
    const otp = otpInput.value;
    
    if (otp.length === 6) {
        // Show loading state
        const submitButton = event.target.querySelector('button[type="submit"]');
        const hideLoading = showLoading(submitButton);
        
        // Simulate successful verification
        setTimeout(() => {
            hideLoading();
            currentStep = 2;
            updateRegistrationStep(2);
        }, 1500);
    } else {
        showNotification('Please enter a valid 6-digit OTP', 'error');
    }
}

function resendOTP() {
    showNotification('OTP has been resent to your mobile number', 'success');
    startOTPTimer();
}

function startOTPTimer() {
    let timeLeft = 120;
    const timerElement = document.getElementById('otpTimer');
    
    const timer = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.textContent = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (timerElement) {
                timerElement.textContent = 'expired';
            }
        }
    }, 1000);
}

function validateStep(stepNumber, formData) {
    // Add validation logic for each step
    switch (stepNumber) {
        case 1:
            const password = formData.get('password');
            if (password && password.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return false;
            }
            break;
        case 2:
            if (selectedServices.length === 0) {
                showNotification('Please select at least one service category', 'error');
                return false;
            }
            break;
        case 3:
            // Validate document uploads
            break;
        case 4:
            // Validate agreements
            break;
    }
    return true;
}

function storeStepData(stepNumber, formData) {
    registrationData[`step${stepNumber}`] = Object.fromEntries(formData);
    if (stepNumber === 2) {
        registrationData.selectedServices = [...selectedServices];
    }
}

function closeRegistration() {
    hideModal('registrationModal');
    showLoginModal();
}

// Password Strength Indicator
function setupPasswordStrength() {
    document.addEventListener('input', function(e) {
        if (e.target.id === 'password' || e.target.name === 'password') {
            updatePasswordStrength(e.target);
        }
    });
}

function updatePasswordStrength(passwordInput) {
    const password = passwordInput.value;
    const strengthBar = passwordInput.parentNode.querySelector('.strength-bar');
    const strengthText = passwordInput.parentNode.querySelector('.strength-text');
    
    if (!password) {
        updateStrengthUI(strengthBar, strengthText, 0, 'Password strength');
        return;
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 12.5;
    if (/[A-Z]/.test(password)) score += 12.5;
    if (/[0-9]/.test(password)) score += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 12.5;
    
    let strength = 'Weak';
    if (score >= 75) strength = 'Strong';
    else if (score >= 50) strength = 'Medium';
    
    updateStrengthUI(strengthBar, strengthText, score, strength);
}

function updateStrengthUI(strengthBar, strengthText, score, text) {
    if (strengthBar) {
        const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
        strengthBar.style.setProperty('--strength-width', `${score}%`);
        strengthBar.style.setProperty('--strength-color', color);
    }
    
    if (strengthText) {
        strengthText.textContent = text;
    }
}

// Dashboard Functions
function showDashboard(dashboardType) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab__button');
    const dashboardPanels = document.querySelectorAll('.dashboard__panel');
    
    tabButtons.forEach(button => {
        button.classList.remove('tab__button--active');
    });
    
    dashboardPanels.forEach(panel => {
        panel.classList.remove('dashboard__panel--active');
    });
    
    // Activate current tab and panel
    const activeButton = document.querySelector(`.tab__button[onclick*="${dashboardType}"]`);
    const activePanel = document.getElementById(`${dashboardType}-dashboard`);
    
    if (activeButton) activeButton.classList.add('tab__button--active');
    if (activePanel) activePanel.classList.add('dashboard__panel--active');
}

// Form Handling
function setupFormValidation() {
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields', 'error');
            }
        }
    });
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (email && password) {
        const submitButton = event.target.querySelector('button[type="submit"]');
        const hideLoading = showLoading(submitButton);
        
        // Simulate login process
        setTimeout(() => {
            hideLoading();
            showNotification('Login functionality would be implemented with backend integration. Multi-service dashboard access granted!', 'info');
            hideModal('loginModal');
        }, 1500);
    }
}

function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    if (name && email && phone && service && message) {
        const submitButton = event.target.querySelector('button[type="submit"]');
        const hideLoading = showLoading(submitButton);
        
        // Simulate form submission
        setTimeout(() => {
            hideLoading();
            showNotification('Thank you for your interest in our multi-service platform! We will get back to you soon.', 'success');
            event.target.reset();
        }, 1500);
    }
}

function showForgotPassword() {
    hideModal('loginModal');
    showNotification('Password reset functionality would be implemented with backend integration', 'info');
}

// Animation Functions
function setupAnimations() {
    // Animate service cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all service cards and feature cards
    const animatedElements = document.querySelectorAll('.service__card, .role__card, .feature__card, .category__card, .security__badge');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '3000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '350px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Loading States
function showLoading(element) {
    const originalText = element.textContent;
    element.textContent = 'Loading...';
    element.disabled = true;
    
    return function hideLoading() {
        element.textContent = originalText;
        element.disabled = false;
    };
}

// Service-specific Functions
function bookService(serviceType, serviceName) {
    showNotification(`${serviceName} booking interface would be implemented with backend integration`, 'info');
}

function applyLoan(loanType) {
    showNotification(`${loanType} application process would be implemented with lending partner integration`, 'info');
}

function buyInsurance(insuranceType) {
    showNotification(`${insuranceType} policy purchase would be implemented with insurance partner integration`, 'info');
}

// Enhanced Service Selection
function selectServiceCategory(category) {
    const categoryCards = document.querySelectorAll('.service-category-option');
    categoryCards.forEach(card => {
        if (card.dataset.category === category) {
            card.classList.add('selected');
            if (!selectedServices.includes(category)) {
                selectedServices.push(category);
            }
        }
    });
    updateServiceDependentFields();
}

// Add CSS for strength bar animation and other styles
const style = document.createElement('style');
style.textContent = `
    .strength-bar:after {
        content: '';
        display: block;
        height: 100%;
        width: var(--strength-width, 0%);
        background: var(--strength-color, #ef4444);
        transition: width 0.3s ease, background-color 0.3s ease;
    }
    
    .btn-link {
        background: none;
        border: none;
        color: var(--fintech-teal);
        text-decoration: underline;
        cursor: pointer;
        font-size: inherit;
    }
    
    .btn-link:hover {
        color: var(--fintech-navy);
    }
    
    .otp-info {
        text-align: center;
        margin: var(--space-16) 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }
    
    .status-item {
        margin-bottom: var(--space-16);
        padding: var(--space-12);
        background: var(--fintech-gray);
        border-radius: var(--radius-base);
    }
    
    .status-item p {
        margin: var(--space-8) 0 0 0;
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
    }
    
    .success-message {
        background: var(--fintech-light-teal);
        border: 1px solid var(--fintech-teal);
        border-radius: var(--radius-base);
        padding: var(--space-20);
        margin-bottom: var(--space-24);
        text-align: center;
    }
    
    .approval-info {
        background: var(--fintech-gray);
        border-radius: var(--radius-base);
        padding: var(--space-20);
        margin-bottom: var(--space-24);
    }
    
    .approval-info ul {
        margin: var(--space-16) 0;
        padding-left: var(--space-20);
    }
    
    .approval-info li {
        margin-bottom: var(--space-8);
        color: var(--color-text-secondary);
    }
    
    .contact-info {
        background: var(--fintech-light-gold);
        border-radius: var(--radius-base);
        padding: var(--space-20);
        margin-bottom: var(--space-24);
    }
    
    .contact-info p {
        margin: var(--space-8) 0;
        color: var(--fintech-navy);
    }
    
    .contact-info code {
        background: var(--fintech-navy);
        color: var(--fintech-white);
        padding: var(--space-4) var(--space-8);
        border-radius: var(--radius-sm);
        font-weight: bold;
    }
    
    .form-text {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        margin-top: var(--space-4);
    }
    
    .step {
        cursor: pointer;
        transition: all var(--duration-fast) var(--ease-standard);
    }
    
    .step:hover {
        opacity: 0.8;
    }
    
    .step--active {
        cursor: default;
    }
    
    .text-secondary {
        color: var(--color-text-secondary);
    }
    
    .flex {
        display: flex;
    }
    
    .gap-16 {
        gap: var(--space-16);
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        setupAnimations();
    }, 500);
});