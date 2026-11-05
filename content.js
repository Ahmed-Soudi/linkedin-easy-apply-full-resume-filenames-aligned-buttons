/*
 * LinkedIn Easy Apply - Full Resume Filenames & Aligned Buttons
 * No permissions, external requests, or modifications to application data.
 * Uses the filename and resume-selection radio to identify cards, including
 * newly uploaded resumes which may not have a download button.
 * This script only changes presentation, never application data or selection.
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
      margin-left: auto !important;
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

  function getCard(radio, dialog) {
    // Choose the closest ancestor with exactly this one radio and a filename.
    // A broader fieldset could also contain other resume cards; avoid it.
    for (let element = radio.parentElement; element && element !== dialog;
      element = element.parentElement) {
      if (element.querySelectorAll('input[type="radio"]').length !== 1) continue;
      const filename = getFilename(element);
      if (filename) return { card: element, filename };
    }
    return null;
  }

  function fixCard(radio, dialog) {
    const result = getCard(radio, dialog);
    if (!result) return;

    const { card, filename } = result;
    const paragraph = filename.closest("p");
    const children = Array.from(card.children);
    const main = children.find((child) => child.contains(filename));
    const radioSection = children.find((child) => child.contains(radio));
    if (!paragraph || !main || !radioSection || main === radioSection) return;

    const clickable = filename.closest('[role="button"]');
    const download = main.querySelector(DOWNLOAD_SELECTOR);

    card.setAttribute("data-li-resume-card", "");
    main.setAttribute("data-li-resume-main", "");
    radioSection.setAttribute("data-li-resume-radio", "");
    if (clickable && main.contains(clickable)) {
      clickable.setAttribute("data-li-resume-clickable", "");
    }
    if (download) download.setAttribute("data-li-resume-download", "");

    paragraph.setAttribute("data-li-resume-filename", "");
    for (let element = paragraph.parentElement, level = 0;
      element && element !== card && level < 2;
      element = element.parentElement, level++) {
      element.setAttribute("data-li-resume-text-ancestor", "");
    }
    filename.title = filename.textContent.trim();
  }

  function scan() {
    const dialog = document.querySelector(DIALOG_SELECTOR);
    if (!dialog || !dialog.open) return;
    ensureStyles();
    // Download links are optional, particularly for newly uploaded resumes.
    for (const radio of dialog.querySelectorAll('input[type="radio"]')) {
      fixCard(radio, dialog);
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
