
let resourse = {};
let resourseData = [];

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   console.log(message)
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
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.hasOwnProperty('token')){
      chrome.tabs.create({
        url: './components/formForAuthUser/formForAuthUser.html'
      });
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        chrome.tabs.sendMessage(tabId, {
          msg: "token", 
          data: {
              content: request
          }
        });
      })
    }
  }
);
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.sendMessage(tabId, resourse);
})


