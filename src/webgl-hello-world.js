const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vShaderSource = `
attribute vec2 position;
attribute vec4 color;
uniform vec2 resolution;

varying vec4 vColor;

#define M_PI 3.1415926535897932384626433832795

void main() {
  vec2 transformedPosition = position / resolution * 2.0 - 1.0;
  gl_PointSize = 2.0;
  gl_Position = vec4(transformedPosition, 0, 1);

  vColor = color;
}
`;

const fShaderSource = `
  precision mediump float;
  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor / 255.0;
    gl_FragColor.a = 1.0;
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

const positionLocation = gl.getAttribLocation(program, 'position');
const colorLocation = gl.getAttribLocation(program, 'color');

const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');

gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);

const rainbowColors = [
  [255, 0.0, 0.0, 255], // red
  [255, 165, 0.0, 255], // orange
  [255, 255, 0.0, 255], // yellow
  [0.0, 255, 0.0, 255], // green
  [0.0, 101, 255, 255], // skyblue
  [0.0, 0.0, 255, 255], // blue,
  [128, 0.0, 128, 255], // purple
];
const triangles = createRect(0, 0, canvas.height, canvas.height);

function createRect(top, left, width, height) {
  return [
    left, top, // x1 y1
    left + width, top, // x2 y2
    left, top + height, // x3 y3
    left + width, top + height, // x4 y4
  ];
}

function fillWithColors(segmentsCount) {
  const colors = [];

  for (let i = 0; i < segmentsCount; i++) {
    for (let j = 0; j < 3; j++) {
      colors.push(...rainbowColors[i]);
    }
  }

  return colors;
}

const vertexData = new Float32Array(triangles);
const vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

const indexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

const indexData = new Uint8Array([
  0, 1, 2,
  1, 2, 3,
]);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
gl.lineWidth(1);

const attributeSize = 2;
const type = gl.FLOAT;
const normalized = false;
const stride = 0;
const offset = 0;

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, attributeSize, type, normalized, stride, offset);

// gl.enableVertexAttribArray(colorLocation);
// gl.vertexAttribPointer(colorLocation, 4, type, normalized, stride, 8);

gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0);