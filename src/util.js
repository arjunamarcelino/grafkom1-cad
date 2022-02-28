function createVertexBuffer(vertices) {
  const vertex_buffer = gl.createBuffer(); // Create an empty buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return vertex_buffer;
}

function createIndexBuffer(indices) {
  var index_buffer = gl.createBuffer(); // Create an empty buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer); // Bind appropriate array buffer to it
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  ); // Pass the vertex data to the buffer
  return index_buffer;
}

function createVertexShader() {
  const vertCode = [
    "attribute vec2 coordinate;",
    "void main(void) {",
    "   gl_Position = vec4(coordinate, 0.0, 1.0);",
    "}",
  ].join("\n");
  const vertShader = gl.createShader(gl.VERTEX_SHADER); // Create a vertex shader object
  gl.shaderSource(vertShader, vertCode); // Attach vertex shader source code
  gl.compileShader(vertShader); // Compile the vertex shader
  return vertShader;
}

function createFragmentShader() {
  const fragCode = [
    // Fragment shader source code
    "precision mediump float;",
    "uniform vec3 color;",
    "void main(void) {",
    "   gl_FragColor = vec4(color, 1.0);",
    "}",
  ].join("\n");
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER); // Create fragment shader object
  gl.shaderSource(fragShader, fragCode); // Attach fragment shader source code
  gl.compileShader(fragShader); // Compile the fragmentt shader
  return fragShader;
}

function createShaderProgram(vertShader, fragShader) {
  const shaderProgram = gl.createProgram(); // the combined shader program
  gl.attachShader(shaderProgram, vertShader); // Attach a vertex shader
  gl.attachShader(shaderProgram, fragShader); // Attach a fragment shader
  gl.linkProgram(shaderProgram); // Link both the programs
  gl.useProgram(shaderProgram); // Use the combined shader program object
  return shaderProgram;
}

function associateShadertoObject(shaderProgram, vertex_buffer, index_buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer); // Bind vertex buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  const coord = gl.getAttribLocation(shaderProgram, "coordinate");
  gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0); // Point an attribute to the currently bound VBO
  gl.enableVertexAttribArray(coord); // Enable the attribute
}

// Get color and convert to vector
function getColor() {
  return document.getElementById("colorPicker").value;
  //   const colorRGB = document.getElementById("colorPicker").value;
  //   return colorRGB
  //     .replace(
  //       /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
  //       (m, r, g, b) => "#" + r + r + g + g + b + b
  //     )
  //     .substring(1)
  //     .match(/.{2}/g)
  //     .map((x) => parseInt(x, 16) / 255);
}

// Clear canvas
function clearCanvas() {
  objectAtCanvas = [];
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.DEPTH_BUFFER_BIT);
}

// Get vertex number
function getNumVertex() {
  return document.getElementById("numVertex").value;
}

// Get name to save file
function getNameFile() {
  return document.getElementById("save").value;
}

// Get position mouse
function getPosition(event) {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;
  return { x, y };
}

// Get shape to draw
function getShape(rectangle, square, garis, polygon) {
  if (rectangle) {
    return "rectangle";
  }
  if (square) {
    return "square";
  }
  if (garis) {
    return "line";
  }
  if (polygon) {
    return "polygon";
  }
  return "";
}
