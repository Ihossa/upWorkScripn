
let counter = 0;
const ev = new Event('input');
const setStatus = (el) => {
   console.log(el)
}
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
       console.log(message);
       message.data.forEach((el) => {
         const setValue = (idInput) => {
            document.querySelector(`#${idInput}`).value = el[idInput]
            document.querySelector(`#${idInput}`).focus()
            document.querySelector(`#${idInput}`).dispatchEvent(ev)
          }
          const reg = /(?<=\~)([\s\S]+?)(?=\/)/
          if(el.jobId === reg.exec(window.location.href)[0]){
            let myFunc = async() => { 
               counter += 1000
               let func = () => {
                  if (document.querySelector("#coverLetter") && document.querySelector("footer > a.btn.btn-primary.m-0.ng-scope")) {

                     setValue('coverLetter')
                     if(document.querySelector("#question0")){
                        setValue("question0")
                     }
                     if(document.querySelector("#question1")){
                        setValue("question1")
                     }

                     console.dir(document.querySelector('.air-icon-exclamation'))
                     // document.querySelector("#main > div.ng-scope > div > div > form > div > div:nth-child(5) > section > div > up-c-dropdown > div > up-c-on-media-change > up-c-on-click-outside > up-c-transition > div > up-c-dropdown-toggle > button").click()
                     console.dir(document.querySelectorAll("up-c-dropdown")[0])

                     if(message.checked){
                        console.log('is Test version')
                     }else{
                        document.querySelector("footer > a.btn.btn-primary.m-0.ng-scope").click()
                     }

                     // document.querySelector("footer > a.btn.btn-primary.m-0.ng-scope").click()
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