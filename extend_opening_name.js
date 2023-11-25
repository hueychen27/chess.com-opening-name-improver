function onYes(item = undefined) {
    console.log(JSON.stringify(item));
}
function onErr(err) {
    console.error(err);
}

const querySelector = async (selector) => {
    await w(selector);
    return document.querySelector(selector);
}

const w = (selector) => new Promise(resolve => {
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

async function extendOpeningName() {
    const el = await querySelector(".eco-opening-opening");
    const e = document.querySelector(".eco-opening-name-extended");
    const n = await querySelector(".eco-opening-name");
    const s = document.createElement("span");
    const t = /\d/.test(el.href) ? el.href.replace(/^\D*(?=\d)/, "").replace(/-/g, " ").replace(/(\d)/, ": $1") : "";
    s.innerHTML = t;
    s.className = "eco-opening-name-extended";
    /* Failed attempt at reconstructing the opening name purely from the link
    //@ if (el.hasAttribute("href")) document.querySelector(".eco-opening-name").innerHTML = el.href.replace("https://www.chess.com/openings/", "").replace(/-(?!(Indian|Kann|Slav))/g, " ").replace(/(?<=Opening)\s|(?<=(?<!Petrovs Defense: Three Knights) Game)\s|(?<=Attack)\s|(?<=Queens Gambit (Accepted|Declined))\s|(?<=Kings Gambit (Accepted|Declined))\s|(?<=(French|Sicilian|Petrovs|Scandinavian|Alekhines|Caro-Kann|Dutch|Pirc|Old Benoni|Alapin Sicilian|Closed Sicilian|Slav|Kings Indian|Philidor|Old Indian|Bogo-Indian|Queens Indian|Nimzo-Indian|Grunfeld|Benoni|Semi-Slav) Defense)\s/, ": ").replace(/(?<=Variation)\s|(?<=Sacrifice(?! Variation))\s/, ", ").replace(/(?<=(King|Queen|Alekhine|Petrov))s/g, "'s").replace(/ (?=[\d])/, ": ").replace(/::|,:/g, ":").replace("Grunfeld", "Grünfeld");
    */
    if (e == null && s.innerHTML != "") n.insertAdjacentElement("beforeend", s); // Efficient aughhhhhhh (and also so that you can select the entire opening name)
}

console.log("Opening extender working...");
async function f() {
    if (await browser.storage.local.get("toggle").then(item => item.toggle, onErr) ?? true) {
        await extendOpeningName();
        const n = await querySelector(".eco-opening-name");
        await browser.storage.local.get("overflowBehavior").then(async item => {
            const p = await querySelector(".eco-opening-panel");
            n.style.overflow = p.style.overflow = item.overflowBehavior == "unset" ? "unset" : "";
            n.style.overflowX = p.style.overflowX = item.overflowBehavior == "unset" ? "scroll" : "";
            n.style.textOverflow = p.style.textOverflow = item.overflowBehavior == "unset" ? "unset" : "";
            n.style.msOverflowStyle = p.style.msOverflowStyle = n.style.scrollbarWidth = p.style.scrollbarWidth = item.overflowBehavior == "unset" ? "none" : "";
        }, onErr);
    } else {
        const n = await querySelector(".eco-opening-name");
        if (n.querySelector(".eco-opening-name-extended") != null) n.removeChild(n.querySelector(".eco-opening-name-extended"));
    }
    window.requestAnimationFrame(f)
}
window.requestAnimationFrame(f);