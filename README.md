# LinkedIn Easy Apply - Full Resume Filenames & Aligned Buttons

A lightweight Chrome/Chromium extension that expands resume filenames and aligns controls in both LinkedIn Easy Apply and the saved-resumes list under LinkedIn Jobs.

## Version 1.0.4

Fixes the underlying issue in LinkedIn's **Resumes and application data** window. The legacy Artdeco modal is mounted inside an **open Shadow DOM** (`#interop-outlet`), which ordinary `document.querySelector` calls cannot reach and ordinary document-level styles cannot affect. The extension now discovers and observes the shadow root, inserts the stylesheet inside it, and applies the 1000px modal width, full-width cards, single-line names, and right-aligned menus. Dynamic uploads and expanded lists are handled inside the shadow root too.

If you were testing an earlier update, check the installed version in `chrome://extensions/`: it must show **1.0.4**. Reload the unpacked extension and refresh the LinkedIn tab before retesting.

## Version 1.0.3

Fixes the **Resumes and application data** dialog when LinkedIn uses its older Artdeco/Ember markup. In that interface, filename elements are `h3.ui-attachment__filename` inside `.jobs-resume-card__container`, unlike the Easy Apply cards. The extension now detects that structure independently of the dialog heading and widens the cards, displays filenames on one line and keeps each three-dot menu at the right. It also handles more-resume expansion and new uploads.

## Version 1.0.2

Adds support for **Resumes and application data** at `https://www.linkedin.com/jobs/`, including the saved-resumes list, “+ more resumes” expansion, and newly uploaded files (even when no usage date is shown). The settings dialog can widen up to 1000px so longer filenames fit on one line. Version 1.0.1 previously fixed freshly uploaded resumes in Easy Apply.

## Features

- Shows **full resume filenames on a single line**, without `...` truncation.
- Expands the resume cards to fill the available width of the Easy Apply dialog.
- Supports **both previously saved resumes and newly uploaded resumes**, including uploaded resumes that have **no download button**.
- Aligns existing download icons in a right-hand column and radio selection circles at the far right, including for newly uploaded resumes.
- Automatically formats dynamically loaded resume cards, without reopening DevTools.
- Expands the separate **Resumes and application data** dialog on LinkedIn Jobs, shows full saved-resume names on one line, and keeps the three-dot menus in an aligned column.
- Applies the settings fix to **all expanded and newly uploaded resumes**, including uploads without a “Last used on” date.
- Does not change files, selection behavior or application submission.

Extremely long names can scroll horizontally within the filename area. Hover over a name to read its full title.

## Install in Chrome

1. [Download this repository as a ZIP](https://github.com/Ahmed-Soudi/linkedin-easy-apply-full-resume-filenames-aligned-buttons/archive/refs/heads/main.zip), then extract it. Or clone the repo.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the extracted folder **containing `manifest.json`** (not the ZIP).
5. Refresh any already-open LinkedIn Jobs tab. Open either an Easy Apply dialog or **Resumes and application data** in Jobs settings.

## Update the extension

If installed from a Git clone, run `git pull` from the clone folder. If installed from a ZIP, download and extract the newest repo files into the folder originally loaded into Chrome. Go to `chrome://extensions/`, click the extension's **Reload** button, then refresh LinkedIn.

Unpacked Chrome extensions **do not automatically update from GitHub**.

## Modify and maintain on GitHub

To work from Windows Command Prompt using Git:

```bat
git clone https://github.com/Ahmed-Soudi/linkedin-easy-apply-full-resume-filenames-aligned-buttons.git
cd linkedin-easy-apply-full-resume-filenames-aligned-buttons
```

Modify `content.js` or `manifest.json`, test in Chrome, and commit/push:

```bat
git add .
git commit -m "Describe your change"
git push
```

Git must be installed and GitHub authentication configured before pushing.

## Files

- `manifest.json`: Chrome Manifest V3; no extra permissions.
- `content.js`: CSS layout adjustments and a MutationObserver for new resume cards.
- `tests/fixture.html`: Local smoke-test page for Easy Apply.
- `tests/fixture-settings.html`: Local smoke-test page for the newer saved-resumes dialog, expansion, and uploads.
- `tests/fixture-legacy-settings.html`: Regression test for the older saved-resumes Artdeco markup provided by LinkedIn.
- `tests/fixture-shadow-settings.html`: Browser regression test for the actual open Shadow DOM boundary, dynamic uploads, modal width, and full filenames.
- `.gitignore`: Local files not meant for the repository.

## Privacy and permissions

The extension runs only on `https://www.linkedin.com/jobs/*`. It only reads the DOM to find resume filenames, radio buttons, and menu controls, and applies presentation-related attributes and CSS. It does not transmit data, fetch endpoints, access local files, or submit applications.

## Limitations

LinkedIn may change its HTML. Easy Apply uses relatively stable signals (`dialog[data-testid="dialog"]`, radio inputs, and PDF/DOC(X) filenames). Saved-resume settings is supported in two forms: a newer dialog identified by its heading, and a legacy dialog identified by its stable Artdeco resume-card classes. The legacy layout includes H3 filename elements inside an open Shadow DOM. The extension injects scoped styles into that shadow root. Both modes support newly added cards. Changes to these HTML structures may require maintenance.

You can open the two local fixture pages in Chrome to check the representative Easy Apply and saved-resume layouts. These are simulated pages, not a replacement for testing against LinkedIn itself.

No license has been assigned yet.
