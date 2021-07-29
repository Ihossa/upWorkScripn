  const inputFile = document.getElementById('file');
  const contentBlock = document.getElementById("contentBlock")
  const errorMessage = document.getElementById("errorMessage")
  const toggle = document.getElementById('toggle');

  console.dir(toggle.checked)

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "something_completed") {
          console.log(request.data.content)
          contentBlock.childNodes.forEach((el) => {
                if(el.textContent === request.data.content.el){
                  if(request.data.content.status === 'done' && el.lastElementChild.classList[1] !== 'done'){
                    el.style.background = "#bbffb9"
                    el.children[0].style.display = 'none'
                    el.innerHTML += '<img class = "image done" src = "../../assets/icons/done.png"  />'
                  }else{
                    el.style.background = "#ce545441"
                    el.children[0].style.display = 'none'
                    el.innerHTML += '<img class = "image err" src = "../../assets/icons/error.png"  />'
                  }
                }
            })
        }
    }
  );
  
  inputFile.addEventListener("change", async(el) => {
    try {
    const reader = new FileReader();
    let allItems = ''
    contentBlock.innerHTML = ''
    reader.readAsText(el.target.files[0])
    reader.onload = function() {
      if(JSON.parse(reader.result).hasOwnProperty('data')){
          errorMessage.innerHTML = ''
          localStorage.setItem('arr', reader.result)
          let result = JSON.parse(reader.result)
          result.checked = toggle.checked;
          let stringifyRes = JSON.stringify(result)
          console.log(stringifyRes)
          chrome.runtime.sendMessage(stringifyRes);
          JSON.parse(reader.result).data.forEach((el) => {
          allItems += `<div class = "link" >${el.jobId}<img class = "image wait" src = "../../assets/icons/wait.png"></div>`
          })
          contentBlock.innerHTML = allItems;
          setTimeout(() => {
            document.querySelectorAll('.link').forEach((el) => {
              if(el.lastElementChild.classList[1] === 'wait'){
                el.style.background = "#ce545441"
                el.children[0].style.display = 'none'
                el.innerHTML += '<img class = "image err" src = "../../assets/icons/error.png"  />'
              }
            })
          }, 20000)
      } else {
          errorMessage.innerHTML = '<span>download the correct JSON file</span>'
      }
    };
   }
    catch(err){
      console.error(err.message)
    }
  });



