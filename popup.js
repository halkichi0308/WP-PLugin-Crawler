document.getElementById("btn_get").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { message: "text" }, (content) => {
            // if(!content){
            //     alert('Cannot Get! Try Reload First!');
            //     return;
            // }
            // document.getElementById("title").value = content;
        });
    });
});
