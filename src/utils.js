function createVertexBuffer(vertices) {
  var vertex_buffer = gl.createBuffer(); // Create an empty buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer); // Bind appropriate array buffer to it
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // Pass the vertex data to the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer
  return vertex_buffer;
}

function createVertexShader() {
  var vertCode = // Vertex shader source code
    "attribute vec3 coordinates;" +
    "void main(void) {" +
    " gl_Position = vec4(coordinates, 1.0);" +
    "}";
  var vertShader = gl.createShader(gl.VERTEX_SHADER); // Create a vertex shader object
  gl.shaderSource(vertShader, vertCode); // Attach vertex shader source code
  gl.compileShader(vertShader); // Compile the vertex shader
  return vertShader;
}

function createFragmentShader() {
  var fragCode = // Fragment shader source code
    "void main(void) {" + "gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);" + "}";
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER); // Create fragment shader object
  gl.shaderSource(fragShader, fragCode); // Attach fragment shader source code
  gl.compileShader(fragShader); // Compile the fragmentt shader
  return fragShader;
}

function createShaderProgram(vertShader, fragShader) {
  var shaderProgram = gl.createProgram(); // the combined shader program
  gl.attachShader(shaderProgram, vertShader); // Attach a vertex shader
  gl.attachShader(shaderProgram, fragShader); // Attach a fragment shader
  gl.linkProgram(shaderProgram); // Link both the programs
  gl.useProgram(shaderProgram); // Use the combined shader program object
  return shaderProgram;
}

function associateShadertoObject(shaderProgram, vertex_buffer, indexBuffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer); // Bind vertex buffer object
  if (indexBuffer) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); // Bind index buffer object
  var coord = gl.getAttribLocation(shaderProgram, "coordinates"); // Get the attribute location
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); // Point an attribute to the currently bound VBO
  gl.enableVertexAttribArray(coord); // Enable the attribute
}

function clearCanvas() {
  gl.clearColor(0.5, 0.5, 0.5, 0.9); // Clear the canvas
  gl.enable(gl.DEPTH_TEST); // Enable the depth test
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color and depth buffer
}
