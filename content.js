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

    /* Saved resumes: "Resumes and application data" dialog on /jobs/. */
    [data-li-settings-dialog] {
      width: min(1000px, calc(100vw - 48px)) !important;
      max-width: calc(100vw - 48px) !important;
      box-sizing: border-box !important;
    }
    [data-li-settings-stretch] {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
    }
    [data-li-settings-card] {
      display: flex !important;
      align-items: center !important;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    [data-li-settings-main] {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      max-width: none !important;
    }
    [data-li-settings-fileinfo] {
      min-width: 0 !important;
      max-width: none !important;
      overflow: visible !important;
      -webkit-line-clamp: unset !important;
    }
    [data-li-settings-name] {
      display: block !important;
      white-space: nowrap !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      text-overflow: clip !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
      max-width: 100% !important;
      -webkit-line-clamp: unset !important;
    }
    [data-li-settings-menu] {
      margin-left: auto !important;
      flex: 0 0 auto !important;
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


  function findSettingsDialog() {
    const title = Array.from(document.querySelectorAll('h1,h2,h3,h4,[role="heading"]'))
      .find((el) => el.textContent.trim().toLowerCase() === "resumes and application data"
        && el.getClientRects().length);
    if (!title) return null;

    let dialog = title.closest('dialog, [role="dialog"], [aria-modal="true"]');
    if (!dialog) {
      // Older LinkedIn UI sometimes renders the popup without a dialog role.
      // Find the outermost visible, modal-sized ancestor instead.
      for (let element = title.parentElement; element && element !== document.body;
        element = element.parentElement) {
        const box = element.getBoundingClientRect();
        if (box.width >= 450 && box.width <= 1020 &&
            box.height >= 300 && box.height <= window.innerHeight + 60) {
          dialog = element;
        }
      }
    }
    if (!dialog || (dialog.tagName === "DIALOG" && !dialog.open)) return null;
    return { dialog, title };
  }

  function settingsFilenameNodes(dialog) {
    // A rendered ellipsis is normally CSS; the element still contains the full
    // text. Scan leaf elements to avoid treating enclosing paragraphs as names.
    return Array.from(dialog.querySelectorAll("span, p, a, div, strong, b"))
      .filter((el) => !el.children.length &&
        FILE_EXTENSION.test(el.textContent.trim()) &&
        el.textContent.trim().length > 8);
  }

  function findSettingsCard(name, dialog) {
    let card = null;
    for (let element = name.parentElement; element && element !== dialog;
      element = element.parentElement) {
      const box = element.getBoundingClientRect();
      if (box.width < 230 || box.height < 48 || box.height > 130) continue;

      // A card has one filename, and typically a date and a menu button.
      const names = settingsFilenameNodes(element);
      if (names.length !== 1 || names[0] !== name) continue;
      const hasDate = /(?:last used on|uploaded on|added on)/i.test(element.textContent);
      const hasMenu = !!element.querySelector('button, [role="button"], [aria-haspopup]');
      if (hasDate && hasMenu) card = element;
    }
    return card;
  }

  function fixSettingsCard(name, dialog, title) {
    const card = findSettingsCard(name, dialog);
    if (!card) return;

    card.setAttribute("data-li-settings-card", "");
    name.setAttribute("data-li-settings-name", "");
    name.title = name.textContent.trim();

    let textParent = name.parentElement;
    while (textParent && textParent !== card) {
      textParent.setAttribute("data-li-settings-fileinfo", "");
      textParent = textParent.parentElement;
    }

    const sections = Array.from(card.children);
    const main = sections.find((el) => el.contains(name));
    const menu = [...sections].reverse().find((el) =>
      el !== main && !!el.querySelector('button, [role="button"], [aria-haspopup]')
    ) || sections.find((el) => el !== main &&
      el.matches('button, [role="button"], [aria-haspopup]'));
    main?.setAttribute("data-li-settings-main", "");
    menu?.setAttribute("data-li-settings-menu", "");

    // LinkedIn also constrains the shared list wrapper to about 376px.
    // Widen wrappers below the dialog heading, but leave the header and
    // non-resume parts of the popup alone.
    for (let element = card.parentElement; element && element !== dialog;
      element = element.parentElement) {
      if (element.contains(title)) break;
      element.setAttribute("data-li-settings-stretch", "");
    }
  }

  function fixSettingsDialog() {
    const settings = findSettingsDialog();
    if (!settings) return;
    const { dialog, title } = settings;
    ensureStyles();
    dialog.setAttribute("data-li-settings-dialog", "");

    for (const name of settingsFilenameNodes(dialog)) {
      fixSettingsCard(name, dialog, title);
    }
  }

  function scan() {
    const dialog = document.querySelector(DIALOG_SELECTOR);
    if (dialog && dialog.open) {
      ensureStyles();
      // Download links are optional, particularly for newly uploaded resumes.
      for (const radio of dialog.querySelectorAll('input[type="radio"]')) {
        fixCard(radio, dialog);
      }
    }

    fixSettingsDialog();
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
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["open", "hidden", "aria-expanded"]
  });
  // Covers controls that reveal already-rendered resumes without inserting nodes.
  document.addEventListener("click", scheduleScan, true);
})();
