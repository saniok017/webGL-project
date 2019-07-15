export function createRect(top, left, width, height) {
  return [
    left, top, // x1 y1
    left + width, top, // x2 y2
    left, top + height, // x3 y3
    left + width, top + height, // x4 y4
  ];
}

export function createHexagon(centerX, centerY, radius, segmentsCount) {
  const vertexData = [];
  const segmentAngle = Math.PI * 2 / (segmentsCount - 1);

  for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
    const from = i;
    const to = i + segmentAngle;

    const color = rainbowColors[i / segmentAngle];

    vertexData.push(centerX, centerY);
    vertexData.push(...color);

    vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
    vertexData.push(...color);

    vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
    vertexData.push(...color);
  }

  return vertexData;
}

export function createCoordinates(top, left, width, height, limit) {
  const vertices = [];

  for (let i = 0; i < limit; i++) {
    vertices.push(Math.random() * width, Math.random() * height);
  }

  return vertices;
}

export function createshapes(trianglesCount) {
  const indexes = [];
  for (let i = 0; i < trianglesCount / 3; i++) {
    indexes.push(i, i + 1, i + 2);
  }

  return indexes;
}