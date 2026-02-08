<script>
const chat = document.getElementById("chat");
const header = document.getElementById("chat-header");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

header.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - chat.offsetLeft;
  offsetY = e.clientY - chat.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  chat.style.left = (e.clientX - offsetX) + "px";
  chat.style.top = (e.clientY - offsetY) + "px";
  chat.style.bottom = "auto";
  chat.style.right = "auto";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
</script>
