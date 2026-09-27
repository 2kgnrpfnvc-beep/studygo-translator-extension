(() => {
  const ID = 'studygo-practice-helper';
  document.getElementById(ID)?.remove();

  const parseWordList = (text) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line && line !== '0');
    const pairs = [];
    for (let i = 0; i + 1 < lines.length; i += 2) {
      pairs.push({ word: lines[i], translation: lines[i + 1] });
    }
    return pairs;
  };

  chrome.storage.local.get({ wordlist: '' }, ({ wordlist }) => {
    const pairs = parseWordList(wordlist);
    if (!pairs.length) return;

    const normalize = value => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const pageText = normalize(document.body.innerText);
    const match = pairs.find(pair => pageText.includes(normalize(pair.word)));

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
