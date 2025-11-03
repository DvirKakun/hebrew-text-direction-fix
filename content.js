// Universal Hebrew BiDi Text Fix for AI Chat Platforms
(function() {
    'use strict';

    // Character ranges
    const HEBREW_REGEX = /[\u0590-\u05FF\uFB1D-\uFB4F]/;
    const ENGLISH_REGEX = /[a-zA-Z]/;

    // Function to detect if text contains Hebrew characters
    function containsHebrew(text) {
        return HEBREW_REGEX.test(text);
    }

    // Function to detect if text contains English characters
    function containsEnglish(text) {
        return ENGLISH_REGEX.test(text);
    }

    // Function to determine primary text direction
    function getPrimaryDirection(text) {
        if (!text || text.trim().length === 0) return 'ltr';

        // Remove whitespace and punctuation for analysis
        const cleanText = text.trim();

        // Find the first strong directional character
        let firstHebrewPos = -1;
        let firstEnglishPos = -1;

        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];
            if (HEBREW_REGEX.test(char) && firstHebrewPos === -1) {
                firstHebrewPos = i;
            }
            if (ENGLISH_REGEX.test(char) && firstEnglishPos === -1) {
                firstEnglishPos = i;
            }

            // If we found both, we can decide
            if (firstHebrewPos !== -1 && firstEnglishPos !== -1) {
                break;
            }
        }

        // Determine direction based on which appears first
        if (firstHebrewPos !== -1 && firstEnglishPos !== -1) {
            return firstHebrewPos < firstEnglishPos ? 'rtl' : 'ltr';
        } else if (firstHebrewPos !== -1) {
            return 'rtl';
        } else if (firstEnglishPos !== -1) {
            return 'ltr';
        }

        return 'ltr'; // Default to LTR
    }

    // Function to check if element is an input field
    function isInputField(element) {
        const tagName = element.tagName.toLowerCase();
        const inputTypes = ['input', 'textarea'];

        if (inputTypes.includes(tagName)) return true;

        // Check for contenteditable elements (common in AI chat platforms)
        if (element.contentEditable === 'true' || element.hasAttribute('contenteditable')) return true;

        // Check for elements with role="textbox"
        if (element.getAttribute('role') === 'textbox') return true;

        return false;
    }

    // Function to apply intelligent BiDi formatting
    function applySmartBiDiFormatting(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            const text = element.textContent;
            if (containsHebrew(text) || containsEnglish(text)) {
                const parent = element.parentElement;
                if (parent && !parent.classList.contains('hebrew-bidi-processed')) {
                    const direction = getPrimaryDirection(text);
                    applyDirectionToElement(parent, direction, text);
                }
            }
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            const text = element.textContent;
            if ((containsHebrew(text) || containsEnglish(text)) && !element.classList.contains('hebrew-bidi-processed')) {
                const direction = getPrimaryDirection(text);
                applyDirectionToElement(element, direction, text);
            }
        }
    }

    // Function to apply direction formatting to an element
    function applyDirectionToElement(element, direction, text) {
        // Skip if already processed or if it's a code element
        if (element.classList.contains('hebrew-bidi-processed') ||
            element.tagName === 'CODE' || element.tagName === 'PRE') {
            return;
        }

        const hasMixedContent = containsHebrew(text) && containsEnglish(text);
        const isInput = isInputField(element);

        if (direction === 'rtl') {
            // Hebrew primary direction
            element.style.direction = 'rtl';
            if (isInput) {
                // For input fields, use 'start' to align with direction
                element.style.textAlign = 'start';
            } else {
                element.style.textAlign = 'right';
            }
            element.style.unicodeBidi = 'plaintext';
            element.classList.add('hebrew-bidi-fixed', 'hebrew-bidi-processed');
        } else if (direction === 'ltr') {
            // English primary direction
            element.style.direction = 'ltr';
            if (isInput) {
                // For input fields, use 'start' to align with direction
                element.style.textAlign = 'start';
            } else if (hasMixedContent) {
                element.style.textAlign = 'left';
            }
            element.style.unicodeBidi = 'plaintext';
            element.classList.add('hebrew-bidi-fixed', 'hebrew-bidi-processed');
        }
    }

    // Function to handle input field events (real-time typing)
    function handleInputFieldChange(event) {
        const element = event.target;
        const text = element.value || element.textContent || '';

        if (text.length > 0 && (containsHebrew(text) || containsEnglish(text))) {
            const direction = getPrimaryDirection(text);

            // Remove previous processing class to reprocess
            element.classList.remove('hebrew-bidi-processed');

            // Apply new direction
            applyDirectionToElement(element, direction, text);
        } else {
            // Reset to default if no text or no mixed content
            element.style.direction = '';
            element.style.textAlign = '';
            element.style.unicodeBidi = '';
            element.classList.remove('hebrew-bidi-fixed', 'hebrew-bidi-processed');
        }
    }

    // Function to set up input field listeners
    function setupInputListeners() {
        // Find all input fields
        const inputSelectors = [
            'input[type="text"]',
            'input:not([type])', // inputs without type default to text
            'textarea',
            '[contenteditable="true"]',
            '[contenteditable]',
            '[role="textbox"]'
        ];

        inputSelectors.forEach(selector => {
            const inputs = document.querySelectorAll(selector);
            inputs.forEach(input => {
                if (!input.hasAttribute('data-bidi-listener')) {
                    // Add event listeners for real-time processing
                    input.addEventListener('input', handleInputFieldChange);
                    input.addEventListener('keyup', handleInputFieldChange);
                    input.addEventListener('paste', (event) => {
                        // Handle paste events with a small delay
                        setTimeout(() => handleInputFieldChange(event), 10);
                    });

                    // Mark as having listener to avoid duplicates
                    input.setAttribute('data-bidi-listener', 'true');

                    // Process current content if any
                    if (input.value || input.textContent) {
                        handleInputFieldChange({ target: input });
                    }
                }
            });
        });
    }

    // Function to process all text elements in a container
    function processTextElements(container) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    // Skip script, style, and already processed elements
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const tagName = node.tagName.toLowerCase();
                        if (['script', 'style', 'noscript'].includes(tagName)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }

        // Process text nodes first to determine direction
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                applySmartBiDiFormatting(node);
            }
        });

        // Then process element nodes that weren't already handled
        nodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && !isInputField(node)) {
                applySmartBiDiFormatting(node);
            }
        });
    }

    // Generic selectors for AI chat platform message content
    const AI_MESSAGE_SELECTORS = [
        // Generic message containers
        '[data-testid*="message"]',
        '[class*="message"]',
        '[class*="chat"]',
        'div[role="article"]',
        '[data-is-streaming]',

        // Claude.ai specific
        '.message-content',

        // ChatGPT specific
        '[data-message-author-role]',
        '.markdown',

        // Common AI platform patterns
        '[class*="conversation"]',
        '[class*="response"]',
        '[class*="assistant"]',
        '[class*="user"]',

        // Generic content areas
        'main [class*="content"]',
        'main p',
        'main div[class*="text"]'
    ];

    // Function to find AI chat message containers
    function findMessageElements() {
        const messages = [];
        AI_MESSAGE_SELECTORS.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (!el.classList.contains('ai-message-processed')) {
                        messages.push(el);
                        el.classList.add('ai-message-processed');
                    }
                });
            } catch (e) {
                // Skip invalid selectors
                console.debug('Skipping invalid selector:', selector);
            }
        });
        return messages;
    }

    // Main processing function for AI chat platforms
    function processAIMessages() {
        // Process message content
        const messages = findMessageElements();
        messages.forEach(message => {
            processTextElements(message);
        });

        // Set up input field listeners
        setupInputListeners();

        // Also process any standalone text elements (not input fields)
        const allTextElements = document.querySelectorAll('p, div, span, td, th, li');
        allTextElements.forEach(element => {
            if (!element.classList.contains('hebrew-bidi-processed') && !isInputField(element)) {
                const text = element.textContent;
                if (containsHebrew(text) && containsEnglish(text)) {
                    applySmartBiDiFormatting(element);
                }
            }
        });
    }

    // Function to detect current AI platform (for debugging/logging)
    function detectAIPlatform() {
        const hostname = window.location.hostname;

        if (hostname.includes('claude.ai')) return 'Claude';
        if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) return 'ChatGPT';
        if (hostname.includes('gemini.google.com') || hostname.includes('bard.google.com')) return 'Gemini';
        if (hostname.includes('copilot.microsoft.com') || hostname.includes('bing.com')) return 'Copilot';
        if (hostname.includes('perplexity.ai')) return 'Perplexity';
        if (hostname.includes('character.ai')) return 'Character.ai';
        if (hostname.includes('poe.com')) return 'Poe';
        if (hostname.includes('you.com')) return 'You.com';

        return 'Unknown AI Platform';
    }

    // Initialize and set up observers
    function initialize() {
        const platform = detectAIPlatform();
        console.log(`Hebrew BiDi Text Fix extension loaded on: ${platform}`);

        processAIMessages();

        // Set up MutationObserver for dynamic content
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent || '';
                            if (containsHebrew(text) || containsEnglish(text) || isInputField(node)) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                setTimeout(processAIMessages, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Process periodically for dynamic content and new input fields
        setInterval(processAIMessages, 3000);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also run after a short delay to catch late-loading content
    setTimeout(initialize, 1000);

    // Additional initialization for SPA (Single Page Applications)
    // Many AI platforms use client-side routing
    let currentPath = window.location.pathname;
    setInterval(() => {
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;
            console.log('Page navigation detected, reinitializing...');
            setTimeout(processAIMessages, 500);
        }
    }, 1000);

})();