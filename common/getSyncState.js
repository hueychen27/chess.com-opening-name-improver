/**
 * Override local browser settings, clearing beforehand
 * @param {Promise<{toggle: boolean, overflowBehavior: "ellipses" | "unset"}>} param0 
 */
async function overrideLocalSettings({ toggle, overflowBehavior }) {
    await browser.storage.local.clear();
    await browser.storage.local.set({ toggle, overflowBehavior });
}

export class SyncError extends Error {
    constructor () {
        super();
    }
}

/**
 * Get synchronized settings and synchronize them with local ones
 * @returns {Promise<{toggle: boolean, overflowBehavior: "ellipses" | "unset"} | SyncError>}
 */
export async function getAndSyncSynchronizedSettings() {
    try {
        let settings;
        await browser.storage.sync.get().then(async item => {
            if (Object.keys(item).length !== 2) throw new SyncError();
            settings = item;
            await overrideLocalSettings(item);
        }, onErr)
        return settings;
    } catch (e) {
        if (!(e instanceof SyncError)) throw e;
        return e;
    }
}
