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
    
    // Find the text input/textarea for the answer
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    
    inputs.forEach(input => {
      // Check if this input is visible and not already filled
      if (input.offsetParent === null || input.value.trim()) return;
      
      // Find matching word on the page
      const match = pairs.find(pair => pageText.includes(normalize(pair.word)));
      
      if (match) {
        // Fill the input with the translation
        input.value = match.translation;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  };

  chrome.storage.local.get({ wordlist: '' }, ({ wordlist }) => {
    const pairs = parseWordList(wordlist);
    if (!pairs.length) return;
    
    // Auto-fill on page load
    autoFillAnswers(pairs);
    
    // Also try filling when DOM changes (in case new questions load)
    const observer = new MutationObserver(() => autoFillAnswers(pairs));
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
