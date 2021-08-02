  const inputFile = document.getElementById('file');
  const contentBlock = document.getElementById("contentBlock")
  const errorMessage = document.getElementById("errorMessage")
  const toggle = document.getElementById('toggle');
  const preview = document.getElementById('preview')
  const btnStart = document.getElementById('btnStart')
  const idTable = document.getElementById('idTable')
  var url = "https://docs.google.com/spreadsheets/d/1s1KioVJpwUoAZEW8LwCO2QTRrt1UDXn_MOOzfE46qwo/edit?usp=sharing";

  const dataObj = {data:[]}
  let allItems = ''
  contentBlock.innerHTML = ''


  btnStart.addEventListener('click', () => {
    console.dir(idTable.value)
    try{
      fetch(`https://spreadsheets.google.com/feeds/cells/${idTable.value}/1/public/full?alt=json`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        console.log(data.feed.entry)
        let curentRow = 0
        data.feed.entry.forEach((el) => {
          if(el.gs$cell.row !== '1'){
            let index = el.gs$cell.row - 2;
            if(curentRow !== el.gs$cell.row){
              curentRow = el.gs$cell.row
              dataObj.data[index] = {jobId: '', coverLetter: '', question0: '', question1: ''}
            }
            switch(el.gs$cell.col){
              case '1': dataObj.data[index].jobId = el.content.$t; break;
              case '2': dataObj.data[index].coverLetter = el.content.$t; break;
              case '3': dataObj.data[index].question0 = el.content.$t; break;
              case '4': dataObj.data[index].question1 = el.content.$t; break;
            }
          }
        })
        console.log(dataObj)
        dataObj.checked = toggle.checked;
        let stringifyRes = JSON.stringify(dataObj)
        console.log(stringifyRes)
        chrome.runtime.sendMessage(stringifyRes);
        // chrome.runtime.sendMessage(stringifyRes);
        dataObj.data.forEach((el) => {
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
      })
    } catch{
      errorMessage.innerHTML = '<span>Incorrect table ID, Please enter correct</span>'
    }
  })





    // let text = data.slice(data.indexOf("question2")+9)
    // text = text.slice(0, text.indexOf("\">"))
    // const re = new RegExp('[a-zA-Z0-9]{18}', 'g');
    // const re1 = new RegExp('(,(?=\S)|:)', 'gi');
    // console.log(text)
    // let result = text.match(re)
    // text = text.replace(re1, "/")
    // console.log(text)
    // let nextIndexObxect = 0
    // result.forEach((el, index) => {
    //   if(index !== 0){
    //     let obj = {}
    //     console.log(text.slice(nextIndexObxect, text.indexOf(el))
    //     .split(', '))
    //     console.log(text.indexOf(el))
    //   }
    // })



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
          preview.innerHTML = reader.result
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



