  const inputFile = document.getElementById('file');
  const contentBlock = document.getElementById("contentBlock")
  const errorMessage = document.getElementById("errorMessage")
  const toggle = document.getElementById('toggle');
  const preview = document.getElementById('preview')
  const btnStart = document.getElementById('btnStart')
  const idTable = document.getElementById('idTable')
  const sheetName = document.getElementById('sheetName')
  const select = document.getElementById('select')
  const blockInput = document.getElementById('blockInput')
  const regectReq = document.getElementById('regectReq')
  var url = "https://docs.google.com/spreadsheets/d/1s1KioVJpwUoAZEW8LwCO2QTRrt1UDXn_MOOzfE46qwo/edit?usp=sharing";
  const dataObj = {data:[]}
  let allItems = '<h2 class="subheader descr">Result Table</h2>'
  
  
  // fetch('http://localhost:3000/v1/jobs/?page=0&limit=12&sortBy=title:asc',{
  //   mode: "no-cors",
  //   headers: {
  //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiN2EzNjNkLWJiYTEtNDcwOC04ZjAzLWE3NzljYjJlNGRlOCIsInN0YXR1cyI6ImFjdGl2ZSIsImlhdCI6MTYyOTI5MjEwNywiZXhwIjoxNjI5Mjk1NzA3fQ.0Q-X0jhxaKNGu24YYArrctSlR8iesWUr0Rsv_bXO9Tc"
  //   }
  // })
  // .then((res) => res.json())
  // .then(data => {
  //   console.log(data)
  // })

  idTable.addEventListener('input', (el) => {
    errorMessage.innerHTML = ''
    regectReq.innerHTML = ''
    if(el.target.value.length === 44){
      fetch(`https://docs.google.com/spreadsheets/d/${el.target.value}/edit?usp=sharing`)
      // {
      //   headers: {
      //     Authorization: `Bearer ya29.a0ARrdaM_Kw-88TbJbvpZ_BnsMEyYFIPOQI2gDuBWTMh_BjA5BWGPlJodVG0m82CCenD8DxMiEGtdup_96qCXIUR2Ytg3t3NSGqStjpEbT6fV7Arpfqoy5sQEYaDKEiNt0slBsmmRYxS1voAr2NA2EPtgRNDD5`
      //   }
      // }
      
      .then((res) => res.text())
      .then(data => {
        console.log(data)
        let options = ''
        const re = /(?<=<div class="goog-inline-block docs-sheet-tab-caption">)[\s\S]*?(?=<\/div>)/g
        let result = data.match(re)
        result.forEach(el => {
          options += `<option value=${el}>${el}</option>`
        })
        select.innerHTML = options
        select.style.display="block"
        btnStart.style.display="block"
      }).catch((error) => {
        console.log(error)
        regectReq.innerHTML = 'Enter correct table ID'
      });
    }
  })
  

  btnStart.addEventListener('click', () => {
    contentBlock.innerHTML = ''
    fetch(`https://docs.google.com/spreadsheets/d/${idTable.value}/gviz/tq?sheet=${select.value}`)
    .then((res) => res.text())
    .then(data => {
      console.log(data)
      const reg = /\((.+?)\);/
      let objRes = {};
      let curentRow = -1
      objRes.data = reg.exec(data)[1];
      objRes = JSON.parse(objRes.data)
      if(objRes.table.rows[0].c[0].v === 'jobId'){
        objRes.table.rows.forEach((elRow, index) => {
          if(index !==0){
            let indexArr = index-1
            elRow.c.forEach((elCol, index) => {
              if(elCol && elCol.v){
                if(curentRow !== indexArr){
                  curentRow = indexArr
                  dataObj.data[indexArr] = {jobId: '', coverLetter: '', question0: '', question1: '', question2: ''}
                }
                switch(index){
                  case 0: dataObj.data[indexArr].jobId = elCol.v; break;
                  case 1: dataObj.data[indexArr].coverLetter = elCol.v; break;
                  case 2: dataObj.data[indexArr].question0 = elCol.v; break;
                  case 3: dataObj.data[indexArr].question1 = elCol.v; break;
                  case 4: dataObj.data[indexArr].question2 = elCol.v; break;
                }
              }
            })
          }
        })
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
      }else{
        regectReq.innerHTML = 'Your table is not valid. Please change the ID table'
      }
    }).catch((error) => {
      regectReq.innerHTML = 'OOps bad request'
    });
  })


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(request)
        if (request.msg === "something_completed") {
          
          contentBlock.childNodes.forEach((el) => {
              if(el.textContent === request.data.content.el){
                switch(request.data.content.status){
                  case 'done': el.style.background = "#bbffb9"; el.children[0].outerHTML = '<img class = "image done" src = "../../assets/icons/done.png"  />'; break;
                  case 'copy': el.style.background = "#abcdef"; el.children[0].outerHTML = '<img class = "image copy" src = "../../assets/icons/copy.png"  />'; break;
                  case 'rej': el.style.background = "#ce545441"; el.children[0].outerHTML = '<img class = "image err" src = "../../assets/icons/error.png"  />';break;
                }
              }
            })
        }
    }
  );
  
  inputFile.addEventListener("change", async(el) => {
    try {
    const reader = new FileReader();
    let allItems = '<h2 class="subheader descr">Result Table</h2>'
    contentBlock.innerHTML = ''
    reader.readAsText(el.target.files[0])
    reader.onload = function() {
      if(JSON.parse(reader.result).hasOwnProperty('data')){
        contentBlock.innerHTML = '<h2 class="subheader descr">Result Table</h2>'
          preview.innerHTML = reader.result
          localStorage.setItem('arr', reader.result)
          let result = JSON.parse(reader.result)
          result.checked = toggle.checked;
          let stringifyRes = JSON.stringify(result)
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



