(() => {
  const parseWordList = (text) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line && line !== '0');
    const pairs = [];
    for (let i = 0; i + 1 < lines.length; i += 2) {
      pairs.push({ word: lines[i], translation: lines[i + 1] });
    }
    return pairs;
  };

  const normalize = value => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

  const autoFillAnswers = (pairs) => {
    const pageText = normalize(document.body.innerText);
    
    // Try to find the answer input - look for contenteditable divs, input fields, or textareas
    const inputs = Array.from(document.querySelectorAll(
      'input[type="text"], textarea, [contenteditable="true"], [contenteditable="plaintext-only"]'
    )).filter(el => {
      // Filter for visible elements
      if (el.offsetParent === null) return false;
      // Skip if already filled
      const value = el.value || el.textContent || el.innerText || '';
      return !value.trim();
    });

    inputs.forEach(input => {
      // Find matching word on the page
      const match = pairs.find(pair => pageText.includes(normalize(pair.word)));
      
      if (match) {
        // Try filling different types of inputs
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
          input.value = match.translation;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (input.contentEditable === 'true' || input.contentEditable === 'plaintext-only') {
          // For contenteditable divs
          input.textContent = match.translation;
          input.innerText = match.translation;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        }
      }
    });
  };

  chrome.storage.local.get({ wordlist: '' }, ({ wordlist }) => {
    const pairs = parseWordList(wordlist);
    if (!pairs.length) return;
    
    // Auto-fill on page load
    setTimeout(() => autoFillAnswers(pairs), 500);
    
    // Also try filling when DOM changes (in case new questions load)
    const observer = new MutationObserver(() => autoFillAnswers(pairs));
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
