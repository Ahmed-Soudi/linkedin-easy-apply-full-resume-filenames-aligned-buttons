# LinkedIn Easy Apply - Full Resume Filenames & Aligned Buttons

A lightweight Chrome/Chromium extension that expands resume filenames and aligns controls in both LinkedIn Easy Apply and the saved-resumes list under LinkedIn Jobs.

## Version 1.0.6

Adds **`easy-apply-fallback.css`**, a second, JavaScript-independent way to format LinkedIn Easy Apply's SDUI resume cards. It targets the inline `33.6rem` resume-card width found in captured LinkedIn markup (only within Easy Apply's resume radio group), expands each card to 100%, and keeps filenames on a single line with download icons and radio controls aligned to the right. It applies automatically as cards are loaded, even if the JavaScript resume-card detector misses a variant.

This is a preventive fallback; the CSS was checked in local Chromium against an isolated resume-picker subtree from earlier LinkedIn HTML. It has not yet been verified on the specific Nasoft.eg job page.

When troubleshooting, confirm that Chrome is loading **v1.0.6** from the intended unpacked directory under `chrome://extensions/`, reload the extension and refresh LinkedIn. If the issue persists, inspect whether the Easy Apply resume cards are still under `[data-sdui-screen*="EasyApply"] fieldset[role="radiogroup"]`.

## Version 1.0.5

Fixes Easy Apply resume cards that still show LinkedIn's narrow, truncated layout. Filename detection now accepts text directly in a paragraph, a nested span, or other filename-bearing elements. It also supports native radio inputs and custom `role="radio"` controls, expands fixed-width wrappers around cards, and checks supported dialogs inside LinkedIn's open `#interop-outlet` Shadow DOM as well as the main document.

Regression fixtures include the original Easy Apply layout and `tests/fixture-easy-apply-variants.html` for alternate markup, nested filename spans, custom radios, outer fixed-width wrappers, and Shadow DOM rendering. These are simulated fixtures, not confirmation from the live LinkedIn page.

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
- `content.js`: DOM-based layout adjustments and a MutationObserver for new resume cards.
- `easy-apply-fallback.css`: CSS-only layout fallback for Easy Apply radio-group cards.
- `tests/fixture.html`: Local smoke-test page for the original Easy Apply layout.
- `tests/fixture-easy-apply-variants.html`: Alternative Easy Apply markup regression fixture.
- `tests/fixture-css-fallback.html`: CSS-only regression for the narrow `33.6rem` cards, aligned download buttons and dynamically added resumes.
- `tests/fixture-settings.html`: Local smoke-test page for the newer saved-resumes dialog, expansion, and uploads.
- `tests/fixture-legacy-settings.html`: Regression test for the older saved-resumes Artdeco markup provided by LinkedIn.
- `tests/fixture-shadow-settings.html`: Browser regression test for the actual open Shadow DOM boundary, dynamic uploads, modal width, and full filenames.
- `.gitignore`: Local files not meant for the repository.

## Privacy and permissions

The extension runs only on `https://www.linkedin.com/jobs/*`. It only reads the DOM to find resume filenames, radio buttons, and menu controls, and applies presentation-related attributes and CSS. It does not transmit data, fetch endpoints, access local files, or submit applications.

## Limitations

LinkedIn may change its HTML. Easy Apply searches for resume filenames and native/custom radio controls within supported application dialogs, rather than requiring one particular `p > span` filename structure. Saved-resume settings is supported in two forms: a newer dialog identified by its heading, and a legacy dialog identified by its stable Artdeco resume-card classes. The legacy layout includes H3 filename elements inside an open Shadow DOM. The extension injects scoped styles into that shadow root. Both modes support newly added cards. Changes to these HTML structures may require maintenance.

You can open the two local fixture pages in Chrome to check the representative Easy Apply and saved-resume layouts. These are simulated pages, not a replacement for testing against LinkedIn itself.

No license has been assigned yet.
