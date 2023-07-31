const socket = io();
const message = document.querySelector("#messageToSend");
const btnSend = document.querySelector("#send");
const chat = document.querySelector("#chat");
const btnClip = document.querySelector("#btnClip");

function AgregarMensaje(){
    const hora = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const divMine = createMessage(message.value, hora, true);
    socket.emit("chat:message", {message: message.value, time: hora});
    chat.appendChild(divMine);
    message.value = "";
}

function AgregarDocumento(blob){
    const horaFile = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const divFile =  createImageMessage(createImage(blob), horaFile, true);
    socket.emit("chat:file", {file: blob, time: horaFile});
    chat.appendChild(divFile);
}

function createMessage(message, time, mine){
    const div = document.createElement("div");
    div.className = mine ? "message-mine" : "message-person";
    const lblContent = document.createElement("label");
    lblContent.className = "message-content";
    lblContent.innerHTML = message;
    const lblTime = document.createElement("label");
    lblTime.className = "message-time";
    lblTime.innerHTML = time;
    div.appendChild(lblContent);
    div.appendChild(lblTime);
    return div;
}

function createImage(blob){
    const imageUrl = URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.src = imageUrl;
    img.className = "message-image";
    return img;
}

function createImageMessage(img, time, mine){
    const divImg = document.createElement("div");
    divImg.className = mine ? "message-mine" : "message-person";
    const lblTimeImg = document.createElement("label");
    lblTimeImg.className = "message-time";
    lblTimeImg.innerHTML = time
    divImg.appendChild(img);
    divImg.appendChild(lblTimeImg);
    return divImg;
}

message.addEventListener("input", () => {
    btnSend.innerHTML = "";
    const iElement = document.createElement("i");
    iElement.className = message.value === "" ? "bx bxs-microphone bx-tada" : "bx bxs-send bx-tada";
    btnSend.appendChild(iElement); 
});

btnSend.addEventListener("click", () => {
    if(message.value !== ""){
        AgregarMensaje();
    }
});

message.addEventListener("keydown", e => {
    if(e.key === "Enter"){
        e.preventDefault();
        AgregarMensaje();
    }
});

btnClip.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();
    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async (event) => {
            const imageBlob = new Blob([event.target.result], {type: file.type});
            AgregarDocumento(imageBlob);
        };
    };
});

socket.on("chat:message", (data) => {
    chat.appendChild(createMessage(data.message, data.time, false));
});

socket.on("chat:file", (data) => {
    const blob = new Blob([data.file], { type: "image/*" });
    const divFile =  createImageMessage(createImage(blob), data.time, false);
    chat.appendChild(divFile);
});
  