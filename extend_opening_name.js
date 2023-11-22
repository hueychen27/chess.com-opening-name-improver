function onYes(item = undefined) {
    console.log(JSON.stringify(item));
}
function onErr(err) {
    console.error(err);
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


console.log("Opening extender working...");
w(".eco-opening-opening").then(() => {
    async function f() {
        const n = document.querySelector(".eco-opening-name");
        if (await browser.storage.local.get("toggle").then(item => item.toggle, onErr) ?? true) {
            const el = document.querySelector(".eco-opening-opening");
            if (n.querySelector(".eco-opening-name-extended") != null) n.removeChild(n.querySelector(".eco-opening-name-extended"));
            const s = document.createElement("span");
            const t = /\d/.test(el.href) ? el.href.replace(/^\D*(?=\d)/, "").replace(/-/g, " ").replace(/(\d)/, ": $1") : "";
            s.innerHTML = t;
            s.className = "eco-opening-name-extended";
            /*
            //@ if (el.hasAttribute("href")) document.querySelector(".eco-opening-name").innerHTML = el.href.replace("https://www.chess.com/openings/", "").replace(/-(?!(Indian|Kann|Slav))/g, " ").replace(/(?<=Opening)\s|(?<=(?<!Petrovs Defense: Three Knights) Game)\s|(?<=Attack)\s|(?<=Queens Gambit (Accepted|Declined))\s|(?<=Kings Gambit (Accepted|Declined))\s|(?<=(French|Sicilian|Petrovs|Scandinavian|Alekhines|Caro-Kann|Dutch|Pirc|Old Benoni|Alapin Sicilian|Closed Sicilian|Slav|Kings Indian|Philidor|Old Indian|Bogo-Indian|Queens Indian|Nimzo-Indian|Grunfeld|Benoni|Semi-Slav) Defense)\s/, ": ").replace(/(?<=Variation)\s|(?<=Sacrifice(?! Variation))\s/, ", ").replace(/(?<=(King|Queen|Alekhine|Petrov))s/g, "'s").replace(/ (?=[\d])/, ": ").replace(/::|,:/g, ":").replace("Grunfeld", "Grünfeld");
            */
            n.insertAdjacentElement("beforeend", s);
            await browser.storage.local.get("overflowBehavior").then(item => {
                const p = document.querySelector(".eco-opening-panel");
                n.style.overflow = p.style.overflow = item.overflowBehavior == "unset" ? "unset" : "";
                n.style.overflowX = p.style.overflowX = item.overflowBehavior == "unset" ? "scroll" : "";
                n.style.textOverflow = p.style.textOverflow = item.overflowBehavior == "unset" ? "unset" : "";
                n.style.msOverflowStyle = p.style.msOverflowStyle = n.style.scrollbarWidth = p.style.scrollbarWidth = item.overflowBehavior == "unset" ? "none" : "";
            }, onErr);
        } else {
            if (n.querySelector(".eco-opening-name-extended") != null) n.removeChild(n.querySelector(".eco-opening-name-extended"));
        }
        window.requestAnimationFrame(f)
    }
    window.requestAnimationFrame(f);
})
