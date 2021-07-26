
changeColor.addEventListener("click", async () => {
    chrome.tabs.create({
      url: './components/inputWindow/inputWindow.html'
    });
  });