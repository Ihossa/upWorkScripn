
let timer = 0;
const ev = new Event('input');
const setStatus = (el) => {
}
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
       message.data.forEach((el) => {
         const setValue = (idInput) => {
            document.querySelector(`#${idInput}`).value = el[idInput]
            document.querySelector(`#${idInput}`).focus()
            document.querySelector(`#${idInput}`).dispatchEvent(ev)
          }
          const reg = /(?<=\~)([\s\S]+?)(?=\/)/
          if(el.jobId === reg.exec(window.location.href)[0]){
            const updateState = async() => { 
               timer += 1000
               const sendMessage = () => {
                  if (document.querySelector("#coverLetter") && document.querySelector("footer > a.btn.btn-primary.m-0.ng-scope")) {

                     setValue('coverLetter')
                     if(document.querySelector("#question0")){
                        setValue("question0")
                     }
                     if(document.querySelector("#question1")){
                        setValue("question1")
                     }
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
                     if(timer < 60000){
                        let promise = new Promise((res) => {
                           setTimeout(() => {
                                 res(sendMessage())
                              },
                           1000);
                        })
                        
                        return promise
                     }
                     return 'rej'
                  }
               }
               return await sendMessage()
            }
            updateState().then(data => {
               chrome.runtime.sendMessage({el:el.jobId, status: data})
            })
          }
         
       })
    });
 
    // setTimeout(document.querySelector("#main > div > div > div.cfe-ui-job-details-viewer > div.up-card.py-0.overflow-y-auto > div > div.col-12.job-details-sidebar.d-none.d-lg-flex > aside > div:nth-child(1) > div.cta-row > div.cta.save > div > button").click(), 12000) 