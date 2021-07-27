
let counter = 0;
let setStatus = (el) => {
   console.log(el)
}
document.addEventListener("load", function () {
    var els = document.querySelector('[name="coverLetter"]');
    console.log(els);
  });
   let ev = new Event('input');
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
       console.log(message);
      
       message.forEach((el) => {
          const reg = /(?<=\~)([\s\S]+?)(?=\/)/
          if(el.jobId === reg.exec(window.location.href)[0]){
            let result = 'pand'
            let myFunc = async() => { 
               counter += 1000
               let func = () => {
                  if (document.querySelector("#coverLetter") && document.querySelector("footer > a.btn.btn-primary.m-0.ng-scope")) {
                     console.dir(document.querySelector("#coverLetter"))
                     document.querySelector("#coverLetter").value = el.text
                     document.querySelector("#coverLetter").focus()
                     document.querySelector("#coverLetter").dispatchEvent(ev)
                     if(document.querySelector("#question0")){
                        document.querySelector("#question0").value = el.question0
                        document.querySelector("#question0").focus()
                        document.querySelector("#question0").dispatchEvent(ev)
                     }
                     if(document.querySelector("#question1")){
                        document.querySelector("#question1").value = el.question1
                        document.querySelector("#question1").focus()
                        document.querySelector("#question1").dispatchEvent(ev)
                     }
                     document.querySelector("footer > a.btn.btn-primary.m-0.ng-scope").click()
                     // document.querySelector("body > up-c-modal > div.ng-scope > div > label > input").click()
                     // document.querySelector("body > up-c-modal > div:nth-child(3) > div > button.btn.btn-primary.m-0").click()
                     // res("done")
                     return 'done'
                  }else{
                     if(counter < 60000){
                        console.log(counter)
                        let promise = new Promise((res) => {
                           setTimeout(() => {
                                 res(func())
                              },
                           1000);
                        })
                        
                        return promise
                     }else{
                        console.log(counter)
                        let promise = new Promise((res) => res("rej"))
                        return 'rej'
                     }
                  }
               }
               let arr = await func()
               return arr
            }
            myFunc().then(data => {
               console.log(data)
               chrome.runtime.sendMessage({el:el.jobId, status: data})
            })
            
            
          }
         
       })
    });
 
    // setTimeout(document.querySelector("#main > div > div > div.cfe-ui-job-details-viewer > div.up-card.py-0.overflow-y-auto > div > div.col-12.job-details-sidebar.d-none.d-lg-flex > aside > div:nth-child(1) > div.cta-row > div.cta.save > div > button").click(), 12000) 