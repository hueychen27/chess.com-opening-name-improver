import { getAndSyncSynchronizedSettings, SyncError } from "./common/getSyncState.js"

browser.runtime.onInstalled.addListener(async () => {
    const settings = await getAndSyncSynchronizedSettings();
    if (settings instanceof SyncError) {
        console.error("A SyncError occured:", settings);
        return false;
    }
    console.log("Synced settings retrieved:", settings);
    console.log("Successfully synced settings.");
})
