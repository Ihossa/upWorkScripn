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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.sendMessage(tabId, resourse, function(response) {
    console.log(`${response.farewell} is done`);
    completeMessage.push(response.farewell)
    chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
      chrome.runtime.sendMessage({
        msg: "something_completed", 
        data: {
            content: response.farewell
        }
      }); 
    });
  });
})


