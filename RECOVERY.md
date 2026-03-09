# Recover your items

Your items are stored in **localStorage** under the key `armadio-items`. They are not stored in a file, so they may still be in your browser.

## Check if your data is still there

1. Open **index.html** in the same browser you used before (same URL, e.g. `file:///...` or `http://localhost/...`).
2. Open **Developer Tools**: `F12` or `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows).
3. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox).
4. Under **Local Storage**, click your site’s URL.
5. Look for the key **`armadio-items`**.  
   - If you see it and the value looks like `[{...},{...}]`, your items are still there.  
   - You can copy that value and save it in a `.json` file as a backup.

If the key is missing or empty, the data was cleared (e.g. clearing site data, different browser/profile, or private window).

## Restored app.js

A new **app.js** has been added so the app can run again. After you open **index.html**, the list will load from localStorage. If `armadio-items` still has data, your items should appear again.
