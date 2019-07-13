const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vShaderSource = `
attribute vec2 position;
uniform vec2 resolution;

#define M_PI 3.1415926535897932384626433832795

void main() {
  vec2 transformedPosition = position / resolution * 2.0 - 1.0;
  gl_PointSize = 2.0;
  gl_Position = vec4(transformedPosition, 0, 1);
}
`;

const fShaderSource = `
  precision mediump float;
  uniform vec4 color;

  void main() {
    gl_FragColor = color / 255.0;
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
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
const colorUniformLocation = gl.getUniformLocation(program, 'color');

gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);
gl.uniform4fv(colorUniformLocation, [255, 0, 0, 255])

const angles = []

const triangles = createcircle(canvas.width / 2, canvas.height / 2, canvas.height / 2, 360);

function createcircle(centerX, centerY, radius, segmentsCount) {
  const vertices = [];
  const segmentAngle = Math.PI * 2 / (segmentsCount - 1);
  for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
    const from = i;
    const to = i + segmentAngle;

    vertices.push(centerX, centerY);
    vertices.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
    vertices.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
  }
  return vertices;
}

const positionData = new Float32Array(triangles);

const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
gl.lineWidth(1);

const attributeSize = 2;
const type = gl.FLOAT;
const normalized = false;
const stride = 0;
const offset = 0;

gl.enableVertexAttribArray(positionPointer);
gl.vertexAttribPointer(positionPointer, attributeSize, type, normalized, stride, offset);

gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 2);