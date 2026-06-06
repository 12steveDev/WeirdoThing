const $ = (elem, parent=document) => parent.getElementById(elem);
const E = (elem) => document.createElement(elem);
const ws = new WebSocket("ws://localhost:3000");
$("msg").addEventListener("keydown",(e)=>{
    if (e.key === "Enter"){
        sendMessage();
    }
})
ws.onopen = ()=>{
    const username = prompt("Your Nickname:\n(only letters, numbers and '_', '-') (max 20 chars)");
    ws.send(JSON.stringify({
        type: "join",
        data: username
    }));
}
function scrollDown(){
    $("chatBox").scrollTop = $("chatBox").scrollHeight;
}
ws.onmessage = (e)=>{
    const msg = JSON.parse(e.data);
    if (msg.type === "conn"){
        $("connected").textContent = `Connected: ${msg.data}`;
    }
    if (msg.type === "msg"){
        const div = E("div");
        const span = E("span");
        const p = E("p");
        span.textContent = `${msg.own}: `;
        p.textContent = msg.data;
        div.appendChild(span);
        div.appendChild(p);
        $("chatBox").appendChild(div);
        scrollDown();
    }
}
function sendMessage(){
    const msg = $("msg").value.trim();
    if (!msg) return;
    ws.send(JSON.stringify({
        type: "msg",
        data: msg
    }));
    $("msg").value = "";
    scrollDown();
}