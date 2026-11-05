/*
 * LinkedIn Easy Apply - Full Resume Filenames & Aligned Buttons
 * No permissions, external requests, or modifications to application data.
 * Targets resume cards by their download link, radio button and filename,
 * rather than LinkedIn's frequently changing generated CSS class names.
 */
(() => {
  "use strict";

  const DIALOG_SELECTOR = 'dialog[data-testid="dialog"]';
  const DOWNLOAD_SELECTOR = 'a[href*="/ambry/"]';
  const FILE_EXTENSION = /\.(?:pdf|docx?)$/i;
  const STYLE_ID = "li-easy-apply-resume-layout-css";

  const css = `
    [data-li-resume-card] {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      display: flex !important;
      align-items: center !important;
    }
    [data-li-resume-main] {
      display: flex !important;
      align-items: center !important;
      flex: 1 1 auto !important;
      min-width: 0 !important;
    }
    [data-li-resume-clickable] {
      flex: 1 1 auto !important;
      min-width: 0 !important;
    }
    [data-li-resume-download] {
      margin-left: auto !important;
      margin-right: 16px !important;
      flex: 0 0 auto !important;
    }
    [data-li-resume-radio] {
      flex: 0 0 auto !important;
    }
    [data-li-resume-text-ancestor] {
      min-width: 0 !important;
      max-width: none !important;
      overflow: visible !important;
      -webkit-line-clamp: unset !important;
    }
    [data-li-resume-filename] {
      display: block !important;
      width: auto !important;
      max-width: 100% !important;
      white-space: nowrap !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      text-overflow: clip !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
      -webkit-line-clamp: unset !important;
    }
    [data-li-resume-filename] > span {
      white-space: nowrap !important;
      overflow: visible !important;
      text-overflow: clip !important;
      -webkit-line-clamp: unset !important;
    }
  `;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function getFilename(card) {
    return Array.from(card.querySelectorAll("p > span")).find((span) =>
      FILE_EXTENSION.test(span.textContent.trim())
    );
  }

  function getCard(download, dialog) {
    // The first ancestor with a resume radio button AND a filename is the card.
    // This avoids depending on LinkedIn's changing class names and inline widths.
    for (let element = download.parentElement; element && element !== dialog;
      element = element.parentElement) {
      if (element.querySelector('input[type="radio"]') && getFilename(element)) {
        return element;
      }
    }
    return null;
  }

  function fixCard(download, dialog) {
    const card = getCard(download, dialog);
    if (!card) return;

    const filename = getFilename(card);
    const paragraph = filename?.closest("p");
    const main = download.parentElement;
    const clickable = main?.querySelector('[role="button"]');
    const radio = card.querySelector('input[type="radio"]');

    if (!filename || !paragraph || !clickable || !radio) return;
    if (!clickable.contains(filename)) return;

    card.setAttribute("data-li-resume-card", "");
    main.setAttribute("data-li-resume-main", "");
    clickable.setAttribute("data-li-resume-clickable", "");
    download.setAttribute("data-li-resume-download", "");

    const radioSection = Array.from(card.children).find((child) => child.contains(radio));
    radioSection?.setAttribute("data-li-resume-radio", "");

    paragraph.setAttribute("data-li-resume-filename", "");
    // LinkedIn truncates the text on several nested elements.
    for (let element = paragraph.parentElement, level = 0;
      element && level < 2; element = element.parentElement, level++) {
      element.setAttribute("data-li-resume-text-ancestor", "");
    }

    // If a filename is longer than the dialog, it stays on one line and can
    // be scrolled horizontally; the right-hand controls remain accessible.
    filename.title = filename.textContent.trim();
  }

  function scan() {
    const dialog = document.querySelector(DIALOG_SELECTOR);
    if (!dialog || !dialog.open) return;
    ensureStyles();
    for (const download of dialog.querySelectorAll(DOWNLOAD_SELECTOR)) {
      fixCard(download, dialog);
    }
  }

  let scanScheduled = false;
  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(() => {
      scanScheduled = false;
      scan();
    });
  }

  scan();
  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
