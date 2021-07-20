

document.addEventListener("load", function () {
    var els = document.querySelector('[name="coverLetter"]');
    console.log(els);
  });
window.onload = function(){
   let ev = new Event('input');
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
       console.log(message);
       message.forEach((el) => {
          const reg = /(?<=\~)([\s\S]+?)(?=\/)/
          if(reg.exec(el.url)[0] === reg.exec(window.location.href)[0]){
            setTimeout(() => console.dir(document.querySelector("#coverLetter")), 10000) 
            setTimeout(() => document.querySelector("#main > div.ng-scope > div > div > form > div > div:nth-child(4) > section > div > div:nth-child(1) > div:nth-child(3)>textarea").value = el.text, 10000)
            setTimeout(() => document.querySelector("#coverLetter").focus(), 10000)
            setTimeout(() => document.querySelector("#coverLetter").dispatchEvent(ev), 10000);
            setTimeout(() => document.querySelector("#main > div.ng-scope > div > div > form > div > div:nth-child(4) > footer > a.btn.btn-primary.m-0.ng-scope").click(), 10000);
            // setTimeout(() => document.querySelector("body > up-c-modal > div.ng-scope > div > label > input").click(), 15000);
            // setTimeout(() => document.querySelector("body > up-c-modal > div:nth-child(3) > div > button.btn.btn-primary.m-0").click(), 15000);
            
            sendResponse({farewell: el.url})
          }
         
       })
    });
 
    // setTimeout(document.querySelector("#main > div > div > div.cfe-ui-job-details-viewer > div.up-card.py-0.overflow-y-auto > div > div.col-12.job-details-sidebar.d-none.d-lg-flex > aside > div:nth-child(1) > div.cta-row > div.cta.save > div > button").click(), 12000) 
 }