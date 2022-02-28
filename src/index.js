// List object pada canvas
let objectAtCanvas = [];

function render() {
  clearCanvas();

  objectAtCanvas
    .reverse()
    .forEach((object) => {
      let vertices = [];

      object.vertices.forEach((pos) => {
        vertices.push(
          -1 + (2 * pos.x) / canvas.width, // x
          -1 + (2 * (canvas.height - pos.y)) / canvas.height // y
        );
      });

      let color = [];
      color.push(
        getColor();
      );

      var vertexBuffer = createVertexBuffer(vertices);
      var index_buffer = createIndexBuffer(indices);

      associateShadertoObject(shaderProgram, vertex_buffer, index_buffer);
      
      const colorLoc = gl.getUniformLocation(shaderProgram, "color");
      gl.uniform3fv(colorLoc, color);

      gl.drawElements(
        object.glType,
        object.indices.length,
        gl.UNSIGNED_SHORT,
        0
      );
    })
    .reverse();
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
