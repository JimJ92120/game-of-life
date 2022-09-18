function initBuffer(
  context: WebGL2RenderingContext,
  vertices: Float32Array
): WebGLBuffer | null {
  const buffer: WebGLBuffer | null = context.createBuffer();

  if (buffer) {
    context.bindBuffer(
      WebGL2RenderingContext.ARRAY_BUFFER,
      buffer
    );
    context.bufferData(
      WebGL2RenderingContext.ARRAY_BUFFER,
      vertices,
      WebGL2RenderingContext.STATIC_DRAW
    );

    return buffer;
  }

  return null;
}

export default {
  initBuffer,
};
