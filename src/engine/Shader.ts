function isShaderCompiled(
  context: WebGL2RenderingContext,
  shader: WebGLShader
): boolean {
  return context.getShaderParameter(shader, WebGL2RenderingContext.COMPILE_STATUS);
}

function initShader(
  context: WebGL2RenderingContext,
  shaderType: number,
  shaderSource: string
): WebGLShader | null {
  const shader: WebGLShader | null = context.createShader(shaderType);

  if (shader) {
    context.shaderSource(shader, shaderSource);
    context.compileShader(shader);

    if (!isShaderCompiled(context, shader)) {
      // eslint-disable-next-line
      console.error(context.getShaderInfoLog(shader));

      context.deleteShader(shader);

      return null;
    }

    return shader;
  }

  return null
}

// add return struct definition: { vertexShader, fragmentShader }
function getShaders(
  context: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): any {
  return {
    vertexShader: initShader(
      context,
      WebGL2RenderingContext.VERTEX_SHADER,
      vertexShaderSource
    ),
    fragmentShader: initShader(
      context,
      WebGL2RenderingContext.FRAGMENT_SHADER,
      fragmentShaderSource
    )
  };
}

export default {
  getShaders,
};
