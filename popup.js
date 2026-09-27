const wordlist = document.getElementById('wordlist');
const status = document.getElementById('status');

chrome.storage.local.get({ wordlist: '' }, (data) => {
  wordlist.value = data.wordlist;
});

document.getElementById('save').addEventListener('click', () => {
  chrome.storage.local.set({ wordlist: wordlist.value }, () => {
    status.textContent = '✓ Word list saved! Refresh your StudyGo page.';
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
});
