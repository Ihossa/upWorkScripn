getStartBtn.addEventListener("click", async() => {
  const reg = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
  const resEmail = reg.exec(email.value);
  if(!resEmail){errorEmail.style.visibility = 'visible'}

  const resPass = password.value.length > 5
  if(!resPass){errorPassword.style.visibility = 'visible'}

  if(resEmail && resPass){
    chrome.tabs.create({
      url: './components/inputWindow/inputWindow.html'
    });
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