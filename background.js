let color = 'blue';
let resourse = [];
let completeMessage = []
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  resourse = JSON.parse(message).data; 
  console.log(resourse)
  resourse.forEach(element => {
    chrome.tabs.create({url: element.url});
  });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.hasOwnProperty('el')){
    console.log(message)
    chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
      chrome.runtime.sendMessage({
        msg: "something_completed", 
        data: {
            content: message
        }
      }); 
    });
  }
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.sendMessage(tabId, resourse);
})


