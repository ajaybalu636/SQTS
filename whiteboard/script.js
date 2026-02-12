const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");

let drawing = false;
let erasing = false;

let undoStack = [];
let redoStack = [];

// Responsive canvas
function resizeCanvas() {
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector(".toolbar").offsetHeight;
  ctx.putImageData(img, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Save state for undo
function saveState() {
  undoStack.push(canvas.toDataURL());
  redoStack = [];
}

function startDraw(e) {
  drawing = true;
  saveState();
  draw(e);
}

function endDraw() {
  drawing = false;
  ctx.beginPath();
}

function getPos(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }
  return { x: e.clientX, y: e.clientY };
}

function draw(e) {
  if (!drawing) return;

  const pos = getPos(e);

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = erasing ? "#ffffff" : colorPicker.value;

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// Mouse
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endDraw);

// Touch
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", endDraw);

// Tools
document.getElementById("penBtn").onclick = () => erasing = false;
document.getElementById("eraserBtn").onclick = () => erasing = true;

document.getElementById("clearBtn").onclick = () => {
  saveState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

document.getElementById("saveBtn").onclick = () => {
  const link = document.createElement("a");
  link.download = "whiteboard.png";
  link.href = canvas.toDataURL();
  link.click();
};

// Undo
document.getElementById("undoBtn").onclick = () => {
  if (undoStack.length === 0) return;
  redoStack.push(canvas.toDataURL());
  const img = new Image();
  img.src = undoStack.pop();
  img.onload = () => ctx.drawImage(img, 0, 0);
};

// Redo
document.getElementById("redoBtn").onclick = () => {
  if (redoStack.length === 0) return;
  undoStack.push(canvas.toDataURL());
  const img = new Image();
  img.src = redoStack.pop();
  img.onload = () => ctx.drawImage(img, 0, 0);
};