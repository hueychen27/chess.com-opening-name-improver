const toggle = document.getElementById("toggle");
function log(text) {
    const s = document.createElement("span")
    s.innerHTML = text;
    document.getElementById("console").insertAdjacentElement("beforeend", s)
}
function onYes(item = "") {
    log(`${JSON.stringify(item)}
`);
}
function onErr(err) {
    log(err);
}
(async () => {
    await browser.storage.local.get("toggle").then(async (item) => {
        toggle.innerHTML = (item.toggle ?? true) ? "Disable Extending Opening Name" : "Enable Extending Opening Name";
        if (item.toggle === undefined) await browser.storage.local.set({ toggle: true, overflowBehavior: "ellipses" });
        toggle.setAttribute("data-state", item.toggle);
    }, onErr)
    await browser.storage.local.get("overflowBehavior").then((item) => {
        document.getElementById("overflowBehavior").selectedIndex = item.overflowBehavior == "ellipses" ? 0 : 1;
    }, onErr)
    document.getElementById("toggle").addEventListener("click", () => {
        toggle.setAttribute("data-state", !(toggle.getAttribute("data-state") == 'true'));
        toggle.innerHTML = toggle.getAttribute("data-state") == 'true' ? "Disable Extending Opening Name" : "Enable Extending Opening Name";
        browser.storage.local.set({ toggle: toggle.getAttribute("data-state") == 'true' }).then(onYes, onErr);
    })
    document.getElementById("overflowBehavior").addEventListener("change", () => {
        browser.storage.local.set({ overflowBehavior: document.getElementById("overflowBehavior").value }).then(onYes, onErr);
    })
})()