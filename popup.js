const wordlist = document.getElementById('wordlist');
const status = document.getElementById('status');

chrome.storage.local.get({ wordlist: '' }, (data) => {
  wordlist.value = data.wordlist;
});

document.getElementById('save').addEventListener('click', () => {
  chrome.storage.local.set({ wordlist: wordlist.value }, () => {
    status.textContent = 'Word list saved.';
  });
});

document.getElementById('show').addEventListener('click', async () => {
  const list = wordlist.value.trim();
  if (!list) {
    status.textContent = 'Paste a word list first.';
    return;
  }

  chrome.storage.local.set({ wordlist: list });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    status.textContent = 'No active page found.';
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    status.textContent = 'Translation helper shown on the page.';
  } catch (error) {
    status.textContent = 'Open the StudyGo practice page and try again.';
  }
});
