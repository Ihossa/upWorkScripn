getStartBtn.addEventListener("click", async() => {
  const reg = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
  const resEmail = reg.exec(email.value);
  if(!resEmail){errorEmail.style.visibility = 'visible'}

  const resPass = password.value.length > 5
  if(!resPass){errorPassword.style.visibility = 'visible'}

  if(resEmail && resPass){
  
    var data = new FormData();
    fetch('http://localhost:3000/v1/auth/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // your expected POST request payload goes here
        email: "ihor.shymkov@gmail.com",
        password: "Admin123Ihor"
          })
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })

    // chrome.tabs.create({
    //   url: './components/inputWindow/inputWindow.html'
    // });
  }
})

email.addEventListener("input", () => {
  errorEmail.style.visibility = 'hidden'
})
password.addEventListener("input", () => {
  errorPassword.style.visibility = 'hidden'
})


changeColor.addEventListener("click", async () => {
    chrome.tabs.create({
      url: './components/inputWindow/inputWindow.html'
    });
  });