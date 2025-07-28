
/**
 * Log to popup
 * @param {string} text Logging text
*/
function log(text) {
    const span = document.createElement("span")
    span.innerHTML = text + "<br>";
    document.getElementById("console").insertAdjacentElement("beforeend", span)
}

/**
 * Synonym for log function
 * @param {string} err Error text
*/
function onErr(err) {
    log(err);
}

/**
 * 
 * @param {string} elementId id name
 * @returns {Promise<Element | null>}
 */
const getElementById = async (elementId) => await waitForExistenceOfId(elementId);

/**
 * 
 * @param {string} elementId id name
 * @returns {Promise<Element | null>}
 */
const waitForExistenceOfId = (elementId) => new Promise(resolve => {
    if (document.getElementById(elementId)) return resolve(document.getElementById(elementId));
    const observer = new MutationObserver(() => {
        if (document.getElementById(elementId)) {
            observer.disconnect();
            resolve(document.getElementById(elementId));
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}) // https://stackoverflow.com/a/61511955/15055490

/**
 * @type {HTMLSelectElement}
*/
const overflowBehaviorEl = document.getElementById("overflowBehavior");
/**
 * @type {HTMLButtonElement}
 */
const toggleBtn = document.getElementById("toggle");

async function overrideLocalSettings({ toggle, overflowBehavior }) {
    await browser.storage.local.clear();
    await browser.storage.local.set({ toggle, overflowBehavior });
}

function setToggleState(state = true) {
    toggle.innerHTML = (state ?? true) ? "Disable Extension" : "Enable Extension";
    toggle.setAttribute("data-state", state ?? true);
}

function setOverflowBehavior(behavior = "unset") {
    overflowBehaviorEl.selectedIndex = behavior === "ellipses" ? 0 : 1;
}

async function getSynchronizedSettings() {
    await browser.storage.sync.get().then(async item => {
        // log("item: " + JSON.stringify(item));
        if (Object.keys(item).length !== 2) {
            if (Object.keys(item).length === 0) log("Synced settings is empty.")
            return;
        }
        setToggleState(item.toggle);
        setOverflowBehavior(item.overflowBehavior);
        await overrideLocalSettings(item);
    }, onErr)
}


async function deleteSynchronizedSettings() {
    await browser.storage.sync.clear().then(() => { }, onErr);
}

async function synchronizeSettings() {
    let toggle = null;
    await browser.storage.local.get("toggle").then(async (item) => toggle = item.toggle, onErr);
    browser.storage.sync.set({
        toggle: toggle ?? true,
        overflowBehavior: overflowBehaviorEl.value
    })
}

await browser.storage.local.get("toggle").then(async (item) => {
    setToggleState(item.toggle);
    item.toggle ?? await browser.storage.local.set({ toggle: true });
}, onErr)

await browser.storage.local.get("overflowBehavior").then((item) => {
    setOverflowBehavior(item.overflowBehavior);
}, onErr)

toggleBtn.addEventListener("click", () => {
    toggle.setAttribute("data-state", !(toggle.getAttribute("data-state") === "true"));
    toggle.innerHTML = toggle.getAttribute("data-state") == 'true' ? "Disable Extension" : "Enable Extension";
    browser.storage.local.set({ toggle: toggle.getAttribute("data-state") === "true" });
})

overflowBehaviorEl.addEventListener("change", () => {
    browser.storage.local.set({ overflowBehavior: overflowBehaviorEl.value });
})

document.getElementById("syncButton").addEventListener("click", synchronizeSettings);

document.getElementById("retrieveSyncButton").addEventListener("click", getSynchronizedSettings);

/**
 * id is setTimeout id and time is the start time in seconds
 * @type {{id: number, time: number}[]}
 */
let timeoutId = [];
document.getElementById("deleteSyncButton").addEventListener("click", async function () {
    if (timeoutId.length !== 0) {
        timeoutId.forEach(({ id: val }) => clearTimeout(val));
        timeoutId = [];
    }
    this.innerHTML = "Delete synced settings";
    if (this.getAttribute("data-really") === "false") {
        this.innerHTML = "";

        const revertCounter = document.createElement("span");
        revertCounter.id = "revertCounter";
        revertCounter.textContent = "5";

        const abbr = document.createElement("abbr");
        abbr.title = "seconds";
        abbr.textContent = "sec";

        this.append("Really delete? (", revertCounter, " ", abbr, " to cancel)");

        this.setAttribute("data-really", "true");
        timeoutId.push({
            id: setTimeout(() => {
                this.setAttribute("data-really", "false");
                this.textContent = "Delete synced settings"
            }, 5000), time: Date.now() / 1000
        })
        return;
    }
    this.setAttribute("data-really", "false");
    await deleteSynchronizedSettings();
    log("Deleted sync settings");
})

async function updateRevertCounter() {
    /**
     * @type {HTMLSpanElement | null}
     */
    const revertCounter = await getElementById("revertCounter");
    if (!(revertCounter === null || timeoutId.length === 0)) {
        const durationLeft = (Math.round((5 - (((Date.now() / 1000) - timeoutId[timeoutId.length - 1].time))) * 10) / 10).toFixed(1);
        revertCounter.textContent = durationLeft;
    }
    window.requestAnimationFrame(updateRevertCounter);
}
window.requestAnimationFrame(updateRevertCounter);
