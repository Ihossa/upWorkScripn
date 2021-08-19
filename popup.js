getStartBtn.addEventListener("click", async() => {
  const reg = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
  const resEmail = reg.exec(email.value);
  if(!resEmail || email.value.length === 0){errorEmail.style.visibility = 'visible'}

  const resPass = password.value.length > 5
  if(!resPass){errorPassword.style.visibility = 'visible'}

  if(resEmail && resPass){
  
    fetch('http://localhost:3000/v1/auth/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // your expected POST request payload goes here
        email: email.value,
        password: password.value
      })
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.hasOwnProperty('token')){
        console.log(data)
      }else{
        resError.style.display = 'flex'
      }
     
    })

    // chrome.tabs.create({
    //   url: './components/inputWindow/inputWindow.html'
    // });
  }
})

email.addEventListener("input", () => {
  errorEmail.style.visibility = 'hidden'
  resError.style.display = "none"
})
password.addEventListener("input", () => {
  errorPassword.style.visibility = 'hidden'
  resError.style.display = "none"
})


changeColor.addEventListener("click", async () => {
    chrome.tabs.create({
      url: './components/inputWindow/inputWindow.html'
    });
  });