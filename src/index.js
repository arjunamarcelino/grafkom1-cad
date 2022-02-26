/*======= Membuat canvas =========*/

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("experimental-webgl");

this.vertices = [
  -0.7, -0.1, 0, -0.3, 0.6, 0, -0.3, -0.3, 0, 0.2, 0.6, 0, 0.3, -0.3, 0, 0.7,
  0.6, 0,
];
const vertexBuffer = createVertexBuffer(this.vertices);
const vertexShader = createVertexShader();
const fragmentShader = createFragmentShader();
const shaderProgram = createShaderProgram(vertexShader, fragmentShader);
associateShadertoObject(shaderProgram, vertexBuffer);
gl.drawArrays(gl.LINES, 0, 2);
