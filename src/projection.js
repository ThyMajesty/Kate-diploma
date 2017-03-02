function Project(coords) {
    //orthogonal projection
    const projectionMatrix = $M([
      [1,0,0],
      [0,1,0],
      [0,0,0]
    ]);

    let coordsVector = Vector.create([coords.x,coords.y,coords.z]);
    return projectionMatrix.multiply(coordsVector);
}