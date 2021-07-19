let changeColor = document.getElementById("changeColor");




chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});



changeColor.addEventListener("click", async () => {
  chrome.windows.create({
    url:"inputWindow.html",
    type:"panel",
    width:600,
    height:200
  });
  });

  function setPageBackgroundColor(el) {
   console.log(el);
  }