let form = document.getElementById("form");
form.addEventListener("submit", function(event) {
    event.preventDefault(); 
    let msg = document.getElementById("msgInput").value;
    console.log("发送消息:", msg);
});

let searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function(e) {
    e.preventDefault();
    console.log("正在搜索...:", e.target.value);
});

let changeSelect = document.getElementById("change");
changeSelect.addEventListener("change", function(e) {
    e.preventDefault();
    console.log("选项改变了:", e.target.value);
});

let userDocs = document.getElementById("username");
// 失去焦点时 (Blur)
userDocs.addEventListener("blur", function() {
    if (this.value.length < 3) {
        alert("用户名太短了！"); // 简单的校验
    }
});