let time = document.getElementById("body");
time = setInterval(() => {
    console.log("减少1秒");
   setTimeout(() => {
    location.href = "https://www.baidu.com";      
   }, 5000);
}, 1000);
