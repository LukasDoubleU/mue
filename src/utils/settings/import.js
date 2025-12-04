import { toast } from 'react-toastify';
import variables from 'config/variables';

/**
 * It takes a JSON file of Mue settings, parses it, and then sets the localStorage values to the values in the
 * file.
 * @param e - The JSON settings string to import
 */
export function importSettings(e, initial = false) {
  let content;

  try {
    content = JSON.parse(e);
  } catch (parseError) {
    console.error('[Mue Import] Failed to parse settings JSON:', parseError);
    toast(variables.getMessage('toasts.error'));
    return;
  }

  const keys = Object.keys(content);
  let successCount = 0;
  let failCount = 0;
  const failedKeys = [];

  keys.forEach((key) => {
    try {
      const value = content[key];
      const valueSize = typeof value === 'string' ? value.length : JSON.stringify(value).length;

      // Log large values that might cause quota issues
      if (valueSize > 100000) {
        console.warn(`[Mue Import] Large value for "${key}": ${(valueSize / 1024).toFixed(1)} KB`);
      }

      localStorage.setItem(key, value);
      successCount++;
    } catch (setError) {
      failCount++;
      failedKeys.push(key);
      console.error(`[Mue Import] Failed to set "${key}":`, setError.name, setError.message);
    }
  });

  if (failCount > 0) {
    console.error(`[Mue Import] Import completed with errors. Success: ${successCount}, Failed: ${failCount}`);
    console.error('[Mue Import] Failed keys:', failedKeys);
    toast(`Import partially failed (${failCount} setting(s) could not be imported)`);
  } else {
    toast(variables.getMessage('toasts.imported'));
  }

  // don't show achievements on welcome
  if (!initial) {
    variables.stats.postEvent('tab', 'Settings imported');
  }
}
