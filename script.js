const container = document.querySelector(".container");
const btninfo = document.getElementById("btn-info");
const btnsignup = document.getElementById("btn-sign-up");

btninfo.addEventListener("click",()=>{
    container.classList.remove("toggle");
});
btnsignup.addEventListener("click",()=>{
    container.classList.add("toggle");
});
document.getElementById("miboton").addEventListener("click", function() {
    window.location.href = "tarea2.html";
});