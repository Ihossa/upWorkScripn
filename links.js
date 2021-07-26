
window.onload = function(){

   chrome.runtime.onMessage.addListener( async function(data) {
      console.log(data);
      data.forEach((el) => {
         if(el.jobId === window.location.href){
            console.log(el.text, document.querySelector("#submit-proposal-button-3"))
            await document.querySelector("#submit-proposal-button-3").click()
         }
      })
   });

   // setTimeout(document.querySelector("#main > div > div > div.cfe-ui-job-details-viewer > div.up-card.py-0.overflow-y-auto > div > div.col-12.job-details-sidebar.d-none.d-lg-flex > aside > div:nth-child(1) > div.cta-row > div.cta.save > div > button").click(), 12000) 
}