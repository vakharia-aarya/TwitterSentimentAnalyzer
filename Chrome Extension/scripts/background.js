//When the tab bar icon is clicked this code runs. It sets the state of the extension.
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get("state", function (data) {
    if (data.state == "on") {
      //Save the state of the extension.
      chrome.storage.local.set({ state: "off" });
      console.log("The tab bar button was clicked for on...");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleExtOn,
      });
    } else {
      //Save the state of the extension.
      chrome.storage.local.set({ state: "on" });
      console.log("The tab bar button was clicked for off...");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleExtOff,
      });
    }
  });
});
