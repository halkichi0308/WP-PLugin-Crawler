chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let pluginElement = document.querySelectorAll("#the-list > .active");
    let activePlugins = extractActivePlugin(pluginElement);
    let rawCSVContent = "Plugin,Version";
    activePlugins.forEach((plugin) => {
        rawCSVContent += "\n";
        rawCSVContent += plugin["name"] + "," + plugin["version"];
    });
    sendResponse(pluginElement);

    (function () {
        "use strict";
        document.body.insertAdjacentHTML(
            "afterEnd",
            `
        <a id="myDownload" href="#" download="test.csv">ダウンロード</a>
        `
        );
        document
            .getElementById("myDownload")
            .addEventListener("click", handleDownload(rawCSVContent));
        document.getElementById("myDownload").click();
        document.getElementById("myDownload").remove();
    })();
});

function extractActivePlugin(nodes) {
    //nodes: html childNodes

    let pluginNodes = [];
    nodes.forEach((node) => {
        let pluginObj = {};
        pluginObj["name"] = node.childNodes[1].children[0].innerText;
        pluginObj["version"] = node.childNodes[2].childNodes[3].innerText;
        pluginObj["version"] = pluginObj["version"].replace(
            /Version\s(.*?)\s.*?$/,
            "$1"
        );

        pluginNodes.push(pluginObj);
    });
    return pluginNodes;
}

function handleDownload(rawCSVContent) {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, rawCSVContent], { type: "text/csv" });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, "test.csv");
        window.navigator.msSaveOrOpenBlob(blob, "test.csv");
    } else {
        const url = window.URL.createObjectURL(blob);
        document.getElementById("myDownload").href = url;
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }
}
