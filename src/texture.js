import vShaderSource from './shaders/texture.v.glsl';
import fShaderSource from './shaders/texture.f.glsl';
import {
  createRect
} from './shape-helpers';
import {
  compileShader,
  loadImage
} from './gl-helpers';


const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const vShader = gl.createShader(gl.VERTEX_SHADER);
const fShader = gl.createShader(gl.FRAGMENT_SHADER);

compileShader(gl, vShader, vShaderSource);
compileShader(gl, fShader, fShaderSource);

const program = gl.createProgram();

gl.attachShader(program, vShader);
gl.attachShader(program, fShader);

gl.linkProgram(program);
gl.useProgram(program);

const vertexPosition = new Float32Array(createRect(-1, -1, 2, 2));
const vertexPositionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexPosition, gl.STATIC_DRAW);

const attributeLocations = {
  position: gl.getAttribLocation(program, 'position'),
}

gl.enableVertexAttribArray(attributeLocations.position);
gl.vertexAttribPointer(attributeLocations.position, 2, gl.FLOAT, false, 0, 0);

const vertexIndices = new Uint8Array([0, 1, 2, 1, 2, 3]);
const indexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);

gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);

loadImage(textureImageSrc).then((textureImg) => {
  const texture = gl.createTexture();

  gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
});