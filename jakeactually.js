// https://www.tutorialspoint.com/webgl/webgl_drawing_a_triangle.htm

/*============== Creating a canvas ====================*/

canvas.width = innerWidth;
canvas.height = innerHeight;
gl = canvas.getContext('experimental-webgl');

/*======== Defining and storing the geometry ===========*/

var vertices = [
  -1.0,1.0,0.0,
  -1.0,-1.0,0.0,
  1.0,-1.0,0.0,
  1.0,1.0,0.0, 
];

indices = [0,1,2,0,2,3];

// Create an empty buffer object to store vertex buffer
var vertex_buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Create an empty buffer object to store Index buffer
var Index_Buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

/*================ Shaders ====================*/

// Vertex shader source code
var vertCode = vertex.innerText;

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

//fragment shader source code
var fragCode = fragment.innerText;

// Create fragment shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);

// Compile the fragment shader
gl.compileShader(fragShader);

if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragShader));
}

// Create a shader program object to store
// the combined shader program
var shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader);

// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both the programs
gl.linkProgram(shaderProgram);

// Use the combined shader program object
gl.useProgram(shaderProgram);

/*======= Associating shaders to buffer objects =======*/

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Bind index buffer object
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

// Get the attribute location
var coord = gl.getAttribLocation(shaderProgram, "coordinates");

// Point an attribute to the currently bound VBO
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 

// Enable the attribute
gl.enableVertexAttribArray(coord);

/*=========Drawing the triangle===========*/

// Clear the canvas
gl.clearColor(1, 1, 1, 1);

// Enable the depth test
gl.enable(gl.DEPTH_TEST);

// Clear the color buffer bit
gl.clear(gl.COLOR_BUFFER_BIT);

// Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

// Draw the triangle
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);

let circles = Array(20).fill().map((_, i) => {
  const x = Math.random() - 0.50;
  const y = Math.random();
  const radius = Math.random() / 5;
  const speed = Math.random() / 60;
  return { x, y, radius, speed };
});

const loop = () => {
  gl.viewport(innerWidth / 2 - 200, 0,
    innerHeight, innerHeight);
  
  for (const [i, c] of Object.entries(circles)) { 
    const ball = gl.getUniformLocation(shaderProgram, `ball${i}`);
    gl.uniform3f(ball, c.x, c.y, c.radius); 
  }
  
  circles = circles.map(c => {
    const y = c.y > 2 ? -2 : c.y + c.speed;
    return { ...c, y };
  });
  
  // Draw the triangle
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
  requestAnimationFrame(loop);
};

loop();

onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
};
