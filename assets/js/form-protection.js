/**
 * Perfect Key Locksmith - Form Protection
 * Anti-bot measures: Honeypot + Time Check + Cloudflare Turnstile
 */

(function() {
    'use strict';

    // Configuration
    const WEBHOOK_URL = 'https://hook.us1.make.com/um8bvzhfnhd3v1ynrfv7rf2teb08aes7';
    const MIN_SUBMIT_TIME = 3000; // Minimum 3 seconds before form can be submitted
    
    // Cloudflare Turnstile Site Key
    // Get yours free at: https://dash.cloudflare.com/sign-up?to=/:account/turnstile
    // Leave empty to use only honeypot + time-based protection
    const TURNSTILE_SITE_KEY = ''; // Add your site key here

    // Track when form was loaded
    let formLoadTime = Date.now();

    // Initialize protection when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initFormProtection();
    });

    // Also run on window load as backup (for dynamically loaded forms)
    window.addEventListener('load', function() {
        setTimeout(initFormProtection, 100);
    });

    function initFormProtection() {
        const oldForm = document.getElementById('contactForm');
        if (!oldForm || oldForm.dataset.protected) return;

        // Clone form to remove any existing event listeners
        const form = oldForm.cloneNode(true);
        oldForm.parentNode.replaceChild(form, oldForm);
        form.dataset.protected = 'true';

        formLoadTime = Date.now();

        // Add honeypot field (hidden from humans, visible to bots)
        addHoneypot(form);

        // Add Turnstile widget if available
        addTurnstileWidget(form);

        // Override form submission
        form.addEventListener('submit', handleFormSubmit);
    }

    function addHoneypot(form) {
        // Create honeypot container - hidden with CSS
        const honeypot = document.createElement('div');
        honeypot.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
        honeypot.innerHTML = `
            <label for="website">Website</label>
            <input type="text" name="website" id="website" tabindex="-1" autocomplete="off">
        `;
        form.appendChild(honeypot);
    }

    function addTurnstileWidget(form) {
        // Only add Turnstile if site key is configured
        if (!TURNSTILE_SITE_KEY) return;

        // Find submit button and add Turnstile before it
        const submitBtn = form.querySelector('button[type="submit"], .form-btn');
        if (submitBtn && typeof turnstile !== 'undefined') {
            const turnstileDiv = document.createElement('div');
            turnstileDiv.className = 'cf-turnstile';
            turnstileDiv.setAttribute('data-sitekey', TURNSTILE_SITE_KEY);
            turnstileDiv.setAttribute('data-theme', 'light');
            turnstileDiv.setAttribute('data-size', 'flexible');
            turnstileDiv.style.marginBottom = '12px';
            submitBtn.parentNode.insertBefore(turnstileDiv, submitBtn);
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"], .form-btn');
        const responseDiv = document.getElementById('responseMessage');

        // Check 1: Honeypot - if filled, it's a bot
        const honeypot = form.querySelector('#website');
        if (honeypot && honeypot.value) {
            showSuccess(responseDiv, submitBtn);
            return; // Silently fail for bots
        }

        // Check 2: Time check - too fast = bot
        const elapsed = Date.now() - formLoadTime;
        if (elapsed < MIN_SUBMIT_TIME) {
            showSuccess(responseDiv, submitBtn);
            return; // Silently fail for bots
        }

        // Check 3: Turnstile token (if Turnstile is enabled)
        let turnstileToken = null;
        if (TURNSTILE_SITE_KEY) {
            const turnstileInput = form.querySelector('[name="cf-turnstile-response"]');
            if (turnstileInput) {
                turnstileToken = turnstileInput.value;
                if (!turnstileToken) {
                    responseDiv.innerHTML = '<p style="color:#dc2626;margin-top:12px">Please complete the security check.</p>';
                    return;
                }
            }
        }

        // Collect form data
        const formData = collectFormData(form);
        formData.turnstile_token = turnstileToken;
        formData.submission_time = elapsed;

        // Submit the form
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(function() {
            showSuccess(responseDiv, submitBtn);
            form.reset();
            formLoadTime = Date.now(); // Reset timer
            
            // Reset Turnstile if present
            if (typeof turnstile !== 'undefined') {
                turnstile.reset();
            }
        })
        .catch(function() {
            showSuccess(responseDiv, submitBtn);
        });
    }

    function collectFormData(form) {
        const data = {};
        
        // Common fields
        const fields = ['name', 'phone', 'email', 'address', 'location', 'vehicle', 
                        'subject', 'message', 'emergency', 'service'];
        
        fields.forEach(function(field) {
            const input = form.querySelector('#' + field);
            if (input) {
                data[field] = input.value;
            }
        });

        // Get page source
        data.source = document.title || 'Perfect Key Locksmith';
        data.page_url = window.location.href;
        data.timestamp = new Date().toISOString();

        return data;
    }

    function showSuccess(responseDiv, submitBtn) {
        responseDiv.innerHTML = '<p style="color:#16a34a;font-weight:600;margin-top:12px">✓ Thank you! We\'ll contact you shortly.</p>';
        if (submitBtn) {
            submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Get Free Quote';
            submitBtn.disabled = false;
        }
    }
})();

