const timeSpan = document.getElementById('time'); 
const button = document.getElementById('return');
let timeLeft=5; // 倒计时的秒数
const targetUrl = 'https://www.baidu.com'; // 目标 URL
let timer = setInterval(function() {
        timeLeft--; // 时间减 1
        timeSpan.innerText = timeLeft; // 更新页面上的数字 (DOM 核心)

        // 4. 判断是否到 0 了
        if (timeLeft <= 0) {
            clearInterval(timer); //拔掉定时器的电源！(非常重要，防止内存泄漏)
            location.href = targetUrl; // 执行跳转 (BOM 核心)
        }
    }, 1000);

button.addEventListener('click', function() {
    clearInterval(timer); //拔掉定时器的电源！(非常重要，防止内存泄漏 )
    location.href = targetUrl; // 执行跳转 (BOM 核心)
});
