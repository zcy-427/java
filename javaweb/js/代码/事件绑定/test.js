let keydownHandler =document.getElementById("msgInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        let msg = document.getElementById("msgInput").value;
        console.log("发送消息:", msg);
    }       
});

let clickHandler = document.getElementById("sendBtn").addEventListener("click", function() {
    let msg = document.getElementById("msgInput").value;
    console.log("发送消息:", msg);
});