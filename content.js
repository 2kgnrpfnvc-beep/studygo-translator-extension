(() => {
  const ID = 'studygo-practice-helper';
  document.getElementById(ID)?.remove();

  const parseWordList = (text) => text.split(/\\r?\\n/).map(line => {
    const match = line.match(/^\\s*(.*?)\\s*(?:=|\\t|→|->)\\s*(.*?)\\s*$/);
    return match ? { word: match[1], translation: match[2] } : null;
  }).filter(Boolean);

  chrome.storage.local.get({ wordlist: '' }, ({ wordlist }) => {
    const pairs = parseWordList(wordlist);
    if (!pairs.length) return;

    const normalize = value => value.toLocaleLowerCase().replace(/[^\\p{L}\\p{N}]+/gu, ' ').trim();
    const pageText = normalize(document.body.innerText);
    const match = pairs.find(pair => {
      const word = normalize(pair.word);
      return word && (pageText.includes(` ${word} `) || pageText.startsWith(word) || pageText.endsWith(word));
    });

    const panel = document.createElement('aside');
    panel.id = ID;
    panel.style.cssText = 'position:fixed;z-index:2147483647;right:16px;bottom:16px;width:280px;padding:14px;background:#fff;color:#202124;border:1px solid #bbb;border-radius:10px;box-shadow:0 4px 18px #0003;font:14px system-ui,sans-serif';
    panel.innerHTML = `<button aria-label="Close" style="float:right;border:0;background:none;font-size:18px;cursor:pointer">×</button><strong>StudyGo practice helper</strong><p>${match ? `<b>${escapeHtml(match.word)}</b><br><span style="font-size:20px">${escapeHtml(match.translation)}</span>` : 'No matching word was found on this page.'}</p><small>Use the translation to answer yourself.</small>`;
    panel.querySelector('button').onclick = () => panel.remove();
    document.body.appendChild(panel);
  });

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }
})();
