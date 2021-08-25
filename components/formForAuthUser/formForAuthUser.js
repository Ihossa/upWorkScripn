  const inputFile = document.getElementById('file');
  const contentBlock = document.getElementById("contentBlock")
  const wrapTable = document.getElementById("wrapTable")
  const toggle = document.getElementById('toggle');
  const sheetName = document.getElementById('sheetName')
  const blockInput = document.getElementById('blockInput')

 
  let token = {}
  let selectOptions = ""
  let curentPage = 0
  const dataObj = {data:[]}

 const findCoverLetterByID = (arr, id) => {
   let coverLetter = ""
   arr.forEach((el) => {
     if(el.jobId === id){
       console.log(el.coverLetter)
       coverLetter = el.coverLetter
     }
   })
   return coverLetter
 }

 

 const createTable = () => {
    fetch(`http://localhost:3000/v1/jobs/?page=${curentPage}&limit=12&sortBy=title:asc`,{
      headers: {
        "Authorization": `Bearer ${token.token}`
      }
    })
    .then((res) => res.json())
    .then(data => {
      console.log(data)
      let countPages = Math.ceil(data.pagination.total/12)
      let listJob = ""
      for(let i = 0; i < countPages; i++){
        selectOptions += `<option value = ${i+1} >${i+1}</option>`
      }
      data.data.forEach((element, index) => {
        console.log(element)
        listJob += `<tr class = "row">
          <td class = "col">${index}</td>
          <td class = "col">${element.id}</td>
          <td class = "col">${element.sendStatus}</td>
        </tr>`
      });
      wrapTable.innerHTML = `
      <table class = "tableJob">
        <tr class = "rowHeader">
          <th class = "colHeader">#</th>
          <th class = "colHeader">Id Job</th>
          <th class = "colHeader">Status Job</th>
        </tr>
        ${listJob}
      </table>
      <div id="total">
        <span>count job: ${data.pagination.total}</span>
        <button id = "btnStart">GO</button>
        <div>
          <span>Curent page</span>
          <select id = "selectPage">
            ${selectOptions}
          </select>
        </div>
      </div>
      `
      selectPage.addEventListener("change", () => {
        curentPage = selectPage.value -1;
        createTable()
      })
      btnStart.addEventListener("click", () => {
        contentBlock.outherHTML = ''
        let allItems = '<h2 class="subheader descr">Result Table</h2>'
        data.data.forEach((el) => {
          if(el.sendStatus !== "Done"){
            let idElement = el.id.slice(1)
            dataObj.data.push({jobId: idElement, coverLetter: el.coverLetter, question0: '', question1: '', question2: ''})
          }
        })
        console.log(allItems)
        dataObj.checked = toggle.checked;
        let stringifyRes = JSON.stringify(dataObj)
        chrome.runtime.sendMessage(stringifyRes);
        dataObj.data.forEach((el) => {
          allItems += `<div class = "link" >${el.jobId}<img class = "image wait" src = "../../assets/icons/wait.png"></div>`
        })
        contentBlock.innerHTML = allItems;
        setTimeout(() => {
          document.querySelectorAll('.link').forEach((el) => {
            if(el.lastElementChild.classList[1] === 'wait'){
              el.style.background = "#ce545441"
              el.children[0].outerHTML = '<img class = "image err" src = "../../assets/icons/error.png"  />'
            }
          })
        }, 20000)
      })
    }).catch((error) => {
      console.log(error)
    });
}
// const refreshTocken = () => {
//   console.log(token)
//   fetch(`http://localhost:3000/v1/auth/refresh?refreshToken=${localStorage.getItem("RefreshToken")}`)
//   .then(res => res.json())
//   .then(data => {
//     token = data;
//   })
//   .catch(err => {
//     console.log(err)
//   })
//   createTable()
  
// }

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(request)
      if(request.msg === 'token'){
        // localStorage.setItem('authToken', request.data.content.token)
        token = request.data.content
        localStorage.setItem("RefreshToken", token.refreshToken)
        console.log(token)
        createTable()
      }
    }
  );
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(Object.keys(request).length === 0){
        refreshTocken()
      }
    })
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(request)
        if (request.msg === "something_completed") {
          contentBlock.childNodes.forEach((el) => {
              if(el.textContent === request.data.content.el){
                switch(request.data.content.status){
                  case 'done':
                  let coverLetter = findCoverLetterByID(dataObj.data, request.data.content.el);
                  console.log(coverLetter)
                  fetch('http://localhost:3000/v1/jobs/', {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token.token}`
                    },
                    body: JSON.stringify({
                    // your expected POST request payload goes here
                      id: `~${request.data.content.el}`,
                      coverLetter: coverLetter,
                      sendStatus: "Done"
                    })
                 })
                  .then((res) => res.json())
                  .then(data => {
                     console.log(data)
                  }); el.style.background = "#bbffb9"; el.children[0].outerHTML = '<img class = "image done" src = "../../assets/icons/done.png"  />'; createTable(); break;
                  case 'copy': el.style.background = "#abcdef"; el.children[0].outerHTML = '<img class = "image copy" src = "../../assets/icons/copy.png"  />'; break;
                  case 'rej': el.style.background = "#ce545441"; el.children[0].outerHTML = '<img class = "image err" src = "../../assets/icons/error.png"  />';break;
                }
              }
            })
        }
    }
  );


  