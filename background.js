
let resourse = {};
let resourseData = [];
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  resourse = JSON.parse(message); 
  resourseData = resourse.data;
  resourseData.forEach(element => {
    chrome.tabs.create({url: `https://www.upwork.com/ab/proposals/job/~${element.jobId}/apply/#/`});
  });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.hasOwnProperty('el')){
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


