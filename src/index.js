// Get A WebGL context
const canvas = document.querySelector("#c");
canvas.width = 1150;
canvas.height = 750;

const gl =
  canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

if (!gl) {
  throw new Error("Browser does not support web gl!");
}

const vertShader = createVertexShader();
const fragShader = createFragmentShader();
const shaderProgram = createShaderProgram(vertShader, fragShader);

// List object pada canvas
let objectAtCanvas = [];

function render() {
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.enable(gl.DEPTH_TEST);

  objectAtCanvas.reverse();

  objectAtCanvas.forEach((object) => {
    let vertices = [];

    object.vertices.forEach((pos) => {
      vertices.push(
        -1 + (2 * pos.x) / canvas.width, // sb x
        -1 + (2 * (canvas.height - pos.y)) / canvas.height // sb y
      );
    });

    let color = [];
    color.push(
      parseInt("0x" + object.color.slice(1, 3)) / 256,
      parseInt("0x" + object.color.slice(3, 5)) / 256,
      parseInt("0x" + object.color.slice(5, 7)) / 256
    );

    const vertex_buffer = createVertexBuffer(vertices);
    var index_buffer = createIndexBuffer(object.indices);

    associateShadertoObject(shaderProgram, vertex_buffer, index_buffer);

    const colorLoc = gl.getUniformLocation(shaderProgram, "color");
    gl.uniform3fv(colorLoc, color);

    gl.drawElements(object.glType, object.indices.length, gl.UNSIGNED_SHORT, 0);
  });
  objectAtCanvas.reverse();
}

let shape;
let drag = false;
let click = false;
let dragStartLoc;
let lastIdx;
let isOnEditing = false;
let idxEdit = null;
let nVertex;
let position = [];
let rect = false;
let square = false;
let garis = false;
let polygon = false;
let select = false;

function draw(glType, vertices, type, otherProperty = {}) {
  let indices = [];
  for (let i = 0; i < vertices.length; ++i) {
    indices.push(i);
  }

  objectAtCanvas[lastIdx] = Object.assign(
    {
      glType,
      vertices,
      color: getColor(),
      indices,
      type,
    },
    otherProperty
  );

  render();
}

function drawShape(pos1, pos2) {
  if (isOnEditing) {
    if (idxEdit !== null) {
      objectAtCanvas[idxEdit.objIdx].vertices[idxEdit.posIdx] = pos2;
      if (objectAtCanvas[idxEdit.objIdx].type === "square") {
        objectAtCanvas[idxEdit.objIdx].type = "polygon";
      }
      return render();
    }
    return;
  }

  if (shape === "line") {
    draw(gl.LINES, [pos1, pos2], shape);
  } else if (shape === "square") {
    let orientation; // kuadran
    const length = Math.min(
      Math.abs(pos2.x - pos1.x),
      Math.abs(pos2.y - pos1.y)
    );
    const sign = {
      x: Math.sign(pos2.x - pos1.x),
      y: Math.sign(pos2.y - pos1.y),
    };
    const pos = [
      { x: pos1.x, y: pos1.y },
      { x: pos1.x, y: pos1.y + sign.y * length },
      { x: pos1.x + sign.x * length, y: pos1.y + sign.y * length },
      { x: pos1.x + sign.x * length, y: pos1.y },
    ];
    if (pos2.x - pos1.x < 0) {
      if (pos2.y - pos1.y < 0) {
        orientation = 2;
      } else {
        orientation = 3;
      }
    } else {
      if (pos2.y - pos1.y < 0) {
        orientation = 1;
      } else {
        orientation = 4;
      }
    }
    draw(gl.TRIANGLE_FAN, pos, shape, { orientation });
  } else if (shape === "rectangle") {
    let orientation; // kuadran
    const length = Math.abs(pos2.x - pos1.x);
    const width = Math.abs(pos2.y - pos1.y);
    const sign = {
      x: Math.sign(pos2.x - pos1.x),
      y: Math.sign(pos2.y - pos1.y),
    };
    const pos = [
      { x: pos1.x, y: pos1.y },
      { x: pos1.x, y: pos1.y + sign.y * width },
      { x: pos1.x + sign.x * length, y: pos1.y + sign.y * width },
      { x: pos1.x + sign.x * length, y: pos1.y },
    ];
    if (pos2.x - pos1.x < 0) {
      if (pos2.y - pos1.y < 0) {
        orientation = 2;
      } else {
        orientation = 3;
      }
    } else {
      if (pos2.y - pos1.y < 0) {
        orientation = 1;
      } else {
        orientation = 4;
      }
    }
    draw(gl.TRIANGLE_FAN, pos, shape, { orientation });
  }
}

function dragStart(event) {
  click = true;
  dragStartLoc = getPosition(event);
  shape = getShape(rect, square, garis, polygon);
  lastIdx = objectAtCanvas.length;

  if (shape === "polygon" && !isOnEditing) {
    if (position.length === 0) {
      nVertex = Number(getNumVertex());
    }
    if (position.length < nVertex) {
      position.push(dragStartLoc);
    }
    if (position.length === nVertex) {
      draw(gl.TRIANGLE_FAN, position, shape);
      position = [];
    }
  }

  if (isOnEditing) {
    idxEdit = findPoint(dragStartLoc);
  }
}

function dragging(event) {
  if (click) {
    drag = true;
    const currPos = getPosition(event);
    drawShape(dragStartLoc, currPos);
  }
}

function dragStop(event) {
  click = false;
  if (drag) {
    const currPos = getPosition(event);
    drawShape(dragStartLoc, currPos);
    drag = false;
  }
}

function setRectangle() {
  document.getElementById("draw-polygon").style.visibility = "hidden";
  document.getElementById("action").style.marginTop = "-89px";
  rect = true;
  square = false;
  garis = false;
  polygon = false;
  select = false;
}

function setLine() {
  document.getElementById("draw-polygon").style.visibility = "hidden";
  document.getElementById("action").style.marginTop = "-89px";
  rect = false;
  square = false;
  garis = true;
  polygon = false;
  select = false;
}

function drawPolygon() {
  document.getElementById("draw-polygon").style.visibility = "visible";
  document.getElementById("action").style.marginTop = "0";
  rect = false;
  square = false;
  garis = false;
  polygon = true;
  select = false;
}

function setPolygon() {
  rect = false;
  square = false;
  garis = false;
  polygon = true;
  select = false;
}

function setSquare() {
  document.getElementById("draw-polygon").style.visibility = "hidden";
  document.getElementById("action").style.marginTop = "-89px";
  rect = false;
  square = true;
  garis = false;
  polygon = false;
  select = false;
}

function saveData() {
  const obj = {
    object: objectAtCanvas,
  };
  downloadObject(obj, `${getNameFile()}.json`);
}

function downloadObject(obj, filename) {
  var blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  var url = URL.createObjectURL(blob);
  var elem = document.createElement("a");
  elem.href = url;
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

function loadData() {
  const file = document.getElementById("load").files[0];
  console.log(file);
  if (file) {
    processFile(file);
  }
}

const processFile = async (file) => {
  const text = await file.text();
  const data = JSON.parse(text);

  clearCanvas();
  objectAtCanvas = data.object;
  render();
};

canvas.addEventListener("mousedown", dragStart, false);
canvas.addEventListener("mousemove", dragging, false);
canvas.addEventListener("mouseup", dragStop, false);

render();

// Select
function selectObject() {
  rect = false;
  square = false;
  garis = false;
  polygon = false;
  select = true;
}

function moveObject() {
  rect = false;
  square = false;
  garis = false;
  polygon = false;
}

function findObj(point, epsilon = 60) {
  for (const [objIdx, obj] of objectAtCanvas.entries()) {
    for (const [posIdx, pos] of obj.vertices.entries()) {
      if (Math.hypot(point.x - pos.x, point.y - pos.y) < epsilon) {
        return { objIdx, posIdx };
      }
    }
  }
  return null;
}

canvas.addEventListener("click", (event) => {
  if (select) {
    idxEdit = findObj(getPosition(event));
    if (idxEdit !== null) {
      if (objectAtCanvas[idxEdit.objIdx].type == "polygon") {
        objectAtCanvas[idxEdit.objIdx].color = getColor();
      }
      render();
    }
  }
});
