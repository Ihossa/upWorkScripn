
changeColor.addEventListener("click", async () => {
    chrome.tabs.create({
      url: 'inputWindow.html'
    });
  });