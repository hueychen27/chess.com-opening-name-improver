function onYes(item = undefined) {
    console.log(JSON.stringify(item));
}
function onErr(err) {
    console.error(err);
}

/**
 * 
 * @param {string} selector CSS-style selector
 * @returns {Promise<Element>}
 */
const querySelector = async (selector) => await waitForExistenceOf(selector);

/**
 * 
 * @param {string} selector CSS-style selector
 * @returns {Promise<Element>}
 */
const waitForExistenceOf = (selector) => new Promise(resolve => {
    if (document.querySelector(selector)) return resolve(document.querySelector(selector));
    const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
            observer.disconnect();
            resolve(document.querySelector(selector));
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}) // https://stackoverflow.com/a/61511955/15055490

const isDaily = () => {
    return window.location.href.includes("game/daily");
}

let prev = "";

async function extendOpeningName() {
    // Daily game link uses different element attributes?!?!
    const openingLinkEl = await querySelector(isDaily() ? "a[aria-label=Openings][href]" : ".eco-opening-opening");
    const openingNameExtendEl = document.querySelector(".eco-opening-name-extended");
    const openingNameEl = await querySelector(".eco-opening-name");
    const span = document.createElement("span");
    const extendedOpeningNameText = /\d/.test(openingLinkEl.href) ? openingLinkEl.href.replace(/^\D*(?=\d)/, "").replace(/(?<!O-)O-O-(?!O)/g, " O-O ").replace(/(?<!O)-(?!O)/g, " ").replace(/(\d)/, ": $1").replace(/O-O-O-O/g, "O-O O-O") : "";
    span.innerHTML = extendedOpeningNameText;
    span.className = "eco-opening-name-extended";
    span.style.userSelect = "text";
    /* Failed attempt at reconstructing the opening name purely from the link
    //@ if (el.hasAttribute("href")) document.querySelector(".eco-opening-name").innerHTML = el.href.replace("https://www.chess.com/openings/", "").replace(/-(?!(Indian|Kann|Slav))/g, " ").replace(/(?<=Opening)\s|(?<=(?<!Petrovs Defense: Three Knights) Game)\s|(?<=Attack)\s|(?<=Queens Gambit (Accepted|Declined))\s|(?<=Kings Gambit (Accepted|Declined))\s|(?<=(French|Sicilian|Petrovs|Scandinavian|Alekhines|Caro-Kann|Dutch|Pirc|Old Benoni|Alapin Sicilian|Closed Sicilian|Slav|Kings Indian|Philidor|Old Indian|Bogo-Indian|Queens Indian|Nimzo-Indian|Grunfeld|Benoni|Semi-Slav) Defense)\s/, ": ").replace(/(?<=Variation)\s|(?<=Sacrifice(?! Variation))\s/, ", ").replace(/(?<=(King|Queen|Alekhine|Petrov))s/g, "'s").replace(/ (?=[\d])/, ": ").replace(/::|,:/g, ":").replace("Grunfeld", "Grünfeld");
    */
    if (openingNameExtendEl == null && span.innerHTML != "") openingNameEl.insertAdjacentElement("beforeend", span); // Efficient aughhhhhhh (and also so that you can select the entire opening name)
    else if (span.innerHTML !== prev && openingNameExtendEl != null) openingNameExtendEl.innerHTML = extendedOpeningNameText;
    prev = openingNameExtendEl?.innerHTML ?? "";
}

console.log("Opening extender working...");
async function main() {
    if (await browser.storage.local.get("toggle").then(item => item.toggle, onErr) ?? true) {
        await extendOpeningName();

        /**
         * @type {HTMLSpanElement}
         */
        const openingNameEl = await querySelector(".eco-opening-name");
        // Want to make it selectable always
        openingNameEl.style.userSelect = "text";

        await browser.storage.local.get("overflowBehavior").then(async item => {
            /**
             * @type {HTMLDivElement}
             */
            const openingNameContainerEl = await querySelector(isDaily() ? ".eco-opening-component" : ".eco-opening-panel");
            openingNameEl.style.overflow = openingNameContainerEl.style.overflow = item.overflowBehavior == "unset" ? "unset" : "";
            openingNameEl.style.overflowX = openingNameContainerEl.style.overflowX = item.overflowBehavior == "unset" ? "scroll" : "";
            openingNameEl.style.textOverflow = openingNameContainerEl.style.textOverflow = item.overflowBehavior == "unset" ? "unset" : "";
            openingNameEl.style.msOverflowStyle = openingNameContainerEl.style.msOverflowStyle = openingNameEl.style.scrollbarWidth = openingNameContainerEl.style.scrollbarWidth = item.overflowBehavior == "unset" ? "none" : "";
        }, onErr);
    } else {
        const openingNameEl = await querySelector(".eco-opening-name");
        if (openingNameEl.querySelector(".eco-opening-name-extended") != null) openingNameEl.removeChild(openingNameEl.querySelector(".eco-opening-name-extended"));
    }
    window.requestAnimationFrame(main);
}

window.requestAnimationFrame(main);