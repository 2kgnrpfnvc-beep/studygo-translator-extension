# StudyGo Practice Helper

A Manifest V3 extension for Opera GX/Chromium browsers that displays a translation from a word list on a StudyGo practice page.

It is intentionally a study aid: it does **not** identify or fill test answer fields. Use it for revision or a practice set where revealing the answer is allowed.

## Install in Opera GX

1. Download or clone this repository.
2. Open `opera://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this repository folder.
5. Open a StudyGo practice page, click the extension, paste your list, and save it.
6. Click **Show translation on this page** when you want to study.

## Word-list format

Use one pair per line with `=`, a tab, `→`, or `->` between the word and translation:

```text
house = huis
book = boek
```

The extension keeps the list in the browser's local extension storage. It does not upload it anywhere.
