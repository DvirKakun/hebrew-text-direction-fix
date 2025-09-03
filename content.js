// Hebrew BiDi Text Fix for Claude - Improved Version
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

        if (direction === 'rtl') {
            // Hebrew primary direction
            element.style.direction = 'rtl';
            element.style.textAlign = 'right';
            element.style.unicodeBidi = hasMixedContent ? 'plaintext' : 'embed';
            element.classList.add('hebrew-bidi-fixed', 'hebrew-bidi-processed');
        } else if (direction === 'ltr' && hasMixedContent) {
            // English primary direction with Hebrew content
            element.style.direction = 'ltr';
            element.style.textAlign = 'left';
            element.style.unicodeBidi = 'plaintext';
            element.classList.add('hebrew-bidi-fixed', 'hebrew-bidi-processed');
        }
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
                        if (['script', 'style', 'noscript'].includes(tagName) ||
                            node.classList.contains('hebrew-bidi-processed')) {
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
            if (node.nodeType === Node.ELEMENT_NODE) {
                applySmartBiDiFormatting(node);
            }
        });
    }

    // Claude-specific selectors for message content
    const CLAUDE_MESSAGE_SELECTORS = [
        '[data-testid*="message"]',
        '.message-content',
        '.chat-message',
        'div[role="article"]',
        'div[data-is-streaming="false"]',
        'div[data-is-streaming="true"]'
    ];

    // Function to find Claude message containers
    function findClaudeMessages() {
        const messages = [];
        CLAUDE_MESSAGE_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!el.classList.contains('claude-message-processed')) {
                    messages.push(el);
                    el.classList.add('claude-message-processed');
                }
            });
        });
        return messages;
    }

    // Main processing function
    function processClaudeMessages() {
        const messages = findClaudeMessages();
        messages.forEach(message => {
            processTextElements(message);
        });

        // Also process any standalone text elements
        const allTextElements = document.querySelectorAll('p, div, span, td, th, li');
        allTextElements.forEach(element => {
            if (!element.classList.contains('hebrew-bidi-processed')) {
                const text = element.textContent;
                if (containsHebrew(text) && containsEnglish(text)) {
                    applySmartBiDiFormatting(element);
                }
            }
        });
    }

    // Initialize and set up observers
    function initialize() {
        processClaudeMessages();

        // Set up MutationObserver for dynamic content
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent || '';
                            if (containsHebrew(text) || containsEnglish(text)) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                setTimeout(processClaudeMessages, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Process periodically for dynamic content
        setInterval(processClaudeMessages, 2000);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also run after a short delay to catch late-loading content
    setTimeout(initialize, 1000);

    console.log('Hebrew BiDi Text Fix extension loaded - Smart Direction Detection');
})();