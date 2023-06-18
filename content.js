chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let pluginElement = document.querySelectorAll("#the-list > .active");
    let activePlugins = extractActivePlugin(pluginElement);
    let rawCSVContent = "Plugin,Version";
    activePlugins.forEach((plugin) => {
        rawCSVContent += "\n";
        rawCSVContent +=
            plugin["name"] + "," + plugin["version"] + "," + plugin["url"];
    });
    sendResponse(pluginElement);

    (function () {
        document.body.insertAdjacentHTML(
            "afterEnd",
            `
        <a id="_downloadTarget" href="#" download="plugin.csv">ダウンロード用一時リンク</a>
        `
        );
        document
            .getElementById("_downloadTarget")
            .addEventListener("click", handleDownload(rawCSVContent));
        document.getElementById("_downloadTarget").click();
        document.getElementById("_downloadTarget").remove();
    })();
});

function extractActivePlugin(nodes) {
    //nodes: html childNodes

    let pluginNodes = [];
    nodes.forEach((node) => {
        let pluginObj = {};
        // console.log(
        //     node.childNodes[2].childNodes[3].childNodes[3].href.match(
        //         "(?<=plugin=).*?(?=&TB_iframe)"
        //     )
        // );
        pluginObj["name"] = node.childNodes[1].children[0].innerText;
        pluginObj["version"] = node.childNodes[2].childNodes[3].innerText;
        pluginObj["version"] = pluginObj["version"].replace(
            /Version\s(.*?)\s.*?$/,
            "$1"
        );
        pluginObj["url"] =
            "https://ja.wordpress.org/plugins/" +
            node.childNodes[2].childNodes[3].childNodes[3].href.match(
                "(?<=plugin=).*?(?=&TB_iframe)"
            )[0];

        pluginNodes.push(pluginObj);
    });
    return pluginNodes;
}

function handleDownload(rawCSVContent) {
    const navigatorFilename = "plugins.csv";
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, rawCSVContent], { type: "text/csv" });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, navigatorFilename);
        window.navigator.msSaveOrOpenBlob(blob, navigatorFilename);
    } else {
        const url = window.URL.createObjectURL(blob);
        document.getElementById("_downloadTarget").href = url;
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }
}
