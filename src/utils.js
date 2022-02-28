/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function rectangle(positions) {
  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // code above this line is initialization code.
  // code below this line is rendering code.

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 200;
  gl.drawArrays(primitiveType, offset, count);
}

function line(positions) {
  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // code above this line is initialization code.
  // code below this line is rendering code.

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // draw
  var primitiveType = gl.LINES;
  var offset = 0;
  var count = 200;
  gl.drawArrays(primitiveType, offset, count);
}

var rectangleVerts = [],
  lineVerts = [];

let inc = 0;

function rectanglePos(event, positions) {
  var canvas = document.querySelector("#c");
  inc++;
  console.log(
    "x: " +
      (2 * (event.x / canvas.width) - 1) +
      " y: " +
      (1 - 2 * (event.y / canvas.height))
  );

  const x = event.x - canvas.getBoundingClientRect().left;
  const y = event.y - canvas.getBoundingClientRect().top;

  if (inc % 2 == 1) {
    positions.push(2 * (x / canvas.width) - 1, 1 - 2 * (y / canvas.height));
  } else {
    const x1 = positions[positions.length - 2];
    const y1 = positions[positions.length - 1];
    positions.push(x1, 1 - 2 * (y / canvas.height));
    positions.push(2 * (x / canvas.width) - 1, y1);
    positions.push(2 * (x / canvas.width) - 1, 1 - 2 * (y / canvas.height));
    positions.push(x1, 1 - 2 * (y / canvas.height));
    positions.push(2 * (x / canvas.width) - 1, y1);
    rectangle(positions);
  }
}

function linePos(event, positions) {
  var canvas = document.querySelector("#c");
  inc++;
  console.log(
    "x: " +
      (2 * (event.x / canvas.width) - 1) +
      " y: " +
      (1 - 2 * (event.y / canvas.height))
  );

  const x = event.x - canvas.getBoundingClientRect().left;
  const y = event.y - canvas.getBoundingClientRect().top;
  positions.push(2 * (x / canvas.width) - 1, 1 - 2 * (y / canvas.height));

  if (inc % 2 == 1) {
    linePos(positions);
  }
}

function clearCanvas() {
  rectangleVerts = [];
  lineVerts = [];
  gl.clear(gl.DEPTH_BUFFER_BIT);
}

var status;

function setRectangle() {
  document.getElementById("draw-polygon").style.visibility = "hidden";
  document.getElementById("action").style.marginTop = "-89px";
  status = "rectangle";
  console.log(status);
}

function setLine() {
  document.getElementById("draw-polygon").style.visibility = "hidden";
  document.getElementById("action").style.marginTop = "-89px";
  status = "line";
  console.log(status);
}

function drawPolygon() {
  document.getElementById("draw-polygon").style.visibility = "visible";
  document.getElementById("action").style.marginTop = "0";

  // status = "line";
  console.log(status);
}

function setPolygon() {}

function setSquare() {
  document.getElementById("draw-polygon").style.visibility = "hidden";
  document.getElementById("action").style.marginTop = "-89px";
}

// Get A WebGL context
var canvas = document.querySelector("#c");
var gl = canvas.getContext("webgl");
if (!gl) {
  throw new Error("Browser does not support web gl!");
}

canvas.addEventListener("click", (e) => rectanglePos(e, lineVerts));
