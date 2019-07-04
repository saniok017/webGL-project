const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vShaderSource = `
attribute vec2 position;

void main() {
  gl_PointSize = 10.0;
  gl_Position = vec4(position, 0, 1);
}
`;

const fShaderSource = `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`

function compileShader(shader, source) {
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const log = gl.getShaderInfoLog(shader);

  if (log) {
    throw new Error(log);
  }
}


compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

gl.useProgram(program);

const positionPointer = gl.getAttribLocation(program, 'position');

const positionData = new Float32Array([
  -0.9,
  -0.9,

  -0.8,
  -0.75,

  -0.7,
  -0.5,

  -0.55,
  0.0,

  -0.4,
  0.5,

  -0.25,
  0.8,

  0.0,
  0.9,

  0.25,
  0.8,

  0.4,
  0.5,

  0.55,
  0.0,

  0.7,
  -0.5,

  0.8,
  -0.75,

  0.9,
  -0.9
]);

const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

const attributeSize = 2;
const type = gl.FLOAT;
const normalized = false;
const stride = 0;
const offset = 0;

gl.enableVertexAttribArray(positionPointer);
gl.vertexAttribPointer(positionPointer, attributeSize, type, normalized, stride, offset);

gl.drawArrays(gl.POINTS, 0, positionData.length / 2);