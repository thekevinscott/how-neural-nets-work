export const mgrid = ({ minX, maxX, minY, maxY, granX, granY }) => {
  const points = [];
  for (let i = 0; i < granX; i++) {
    const x = minX + ((i / granX) * (maxX - minX));
    for (let j = 0; j < granY; j++) {
      const y = minY + ((j / granY) * (maxY - minY));
      points.push([x, y]);
    }
  }

  return points;
};
