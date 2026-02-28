/**
 * Reverse String App (no frameworks)
 * - No "Reverse" button
 * - Reversed output + Copy button appear automatically after the 3rd character
 * - If input drops below 3 characters, both are hidden again
 */

'use strict';

const MIN_CHARS_TO_REVERSE = 3;

/**
 * Reverse a string in a way that handles most Unicode (including emojis) better than split('').
 */
function reverseString(str) {
  return Array.from(str).reverse().join('');
}

function showToast(toastEl, message) {
  toastEl.textContent = message;
  setTimeout(() => {
    toastEl.textContent = '';
  }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const resultBlock = document.getElementById('resultBlock');
  const outputEl = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');
  const helperEl = document.getElementById('helper');
  const toastEl = document.getElementById('toast');

  // If any element is missing, the app cannot work.
  if (!textInput || !resultBlock || !outputEl || !copyBtn || !helperEl || !toastEl) {
    console.error('Missing required elements. Check element IDs in index.html.');
    return;
  }

  /**
   * Show/hide the result block based on input length.
   * - < 3 chars: hide reversed text + copy button
   * - >= 3 chars: show both and keep updating reversed text as user types
   */
  function updateUI() {
    const value = textInput.value;

    if (value.length < MIN_CHARS_TO_REVERSE) {
      resultBlock.classList.remove('visible');
      outputEl.textContent = '';
      toastEl.textContent = '';
      helperEl.textContent = `Type at least ${MIN_CHARS_TO_REVERSE} characters to show the reversed text and Copy button. (${value.length}/${MIN_CHARS_TO_REVERSE})`;
      return;
    }

    resultBlock.classList.add('visible');
    outputEl.textContent = reverseString(value);
    helperEl.textContent = 'Reversed text updates automatically as you type.';
  }

  async function handleCopy() {
    const textToCopy = outputEl.textContent || '';

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast(toastEl, 'Copied!');
    } catch (err) {
      // Fallback: execCommand copy
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);

      ta.select();
      try {
        document.execCommand('copy');
        showToast(toastEl, 'Copied!');
      } catch (e) {
        showToast(toastEl, 'Copy failed');
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  // Auto-trigger reversal on every input change (typing, paste, autofill, etc.)
  textInput.addEventListener('input', updateUI);
  copyBtn.addEventListener('click', handleCopy);

  // Initialize (handles browser restoring previous input)
  updateUI();
});
