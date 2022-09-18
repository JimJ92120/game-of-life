function isProgramLinked(
  context: WebGL2RenderingContext,
  program: WebGLProgram
): boolean {
  return context.getProgramParameter(program, WebGL2RenderingContext.LINK_STATUS);
}

function getProgram(
  context: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program: WebGLProgram | null = context.createProgram();

  if (program) {
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);

    if (!isProgramLinked(context, program)) {
      // eslint-disable-next-line
      console.error(context.getProgramInfoLog(program));

      context.deleteProgram(program);

      return null;
    }

    return program;
  }

  return null;
}

export default {
  getProgram,
};
