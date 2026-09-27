(() => {
  const parseWordList = (text) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line && line !== '0');
    const pairs = [];
    for (let i = 0; i + 1 < lines.length; i += 2) {
      const orig = lines[i];
      const transl = lines[i + 1];
      if (orig && transl) pairs.push({ word: orig, translation: transl });
    }
    return pairs;
  };

  const normalize = value => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

  const getMatchingPair = (pairs, pageText) => {
    let best = null;
    let bestScore = -1;

    for (const pair of pairs) {
      const word = normalize(pair.word);
      const translation = normalize(pair.translation);
      const score = pageText.includes(word) ? 2 : 0;
      const score2 = pageText.includes(translation) ? 1 : 0;
      const total = score + score2;
      if (total > bestScore) {
        bestScore = total;
        best = pair;
      }
    }

    return best;
  };

  const autoFillAnswers = (pairs) => {
    const pageText = normalize(document.body.innerText);
    const textarea = document.querySelector('textarea.wrts-simple-input');
    if (!textarea) return;
    if (textarea.value.trim()) return;

    const match = getMatchingPair(pairs, pageText);
    if (!match) return;

    textarea.value = match.translation;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    textarea.focus();
  };

  chrome.storage.local.get({ wordlist: '' }, ({ wordlist }) => {
    const pairs = parseWordList(wordlist);
    if (!pairs.length) return;

    setTimeout(() => autoFillAnswers(pairs), 250);

    const observer = new MutationObserver(() => {
      autoFillAnswers(pairs);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
