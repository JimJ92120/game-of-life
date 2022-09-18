import Shaders from "./Shader";
import Program from "./Program";
import Buffer from "./Buffer";

const OPTIONS = {
  pointSize: 50.0,
  pointColors: [
    [1, 0, 0, 1],
    [0, 0, 1, 1]
  ],
};
const U_DIMENSION = "u_dimension";
const U_RESOLUTION = "u_resolution";
const U_POINT_SIZE = "u_pointSize";
const U_COLOR_1 = "u_color1";
const U_COLOR_2 = "u_color2";
const A_STATE = "a_state";

const VERTEX_SHADER_SOURCE = `#version 300 es
  precision highp float;

  uniform vec2 ${U_DIMENSION};
  uniform vec2 ${U_RESOLUTION};
  uniform float ${U_POINT_SIZE};
  uniform vec4 ${U_COLOR_1};
  uniform vec4 ${U_COLOR_2};

  in float ${A_STATE};

  out float state;
  out vec4 color1;
  out vec4 color2;
    
  void main() {
    float index = float(gl_VertexID);
  
    vec2 position = vec2(
      mod(index, ${U_RESOLUTION}[0]), 
      floor(index / ${U_RESOLUTION}[0])
    ) * ${U_POINT_SIZE} + ${U_POINT_SIZE} / 2.0;

    vec2 zeroToOne = position / ${U_DIMENSION};
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
    gl_PointSize = ${U_POINT_SIZE};

    state = ${A_STATE};
    color1 = ${U_COLOR_1};
    color2 = ${U_COLOR_2};
  }
`;
const FRAGMENT_SHADER_SOURCE: string = `#version 300 es
  precision mediump float;
 
  in float state;
  in vec4 color1;
  in vec4 color2;

  out vec4 FragColor;

  void main() {
    FragColor = state == 1.0
      ? color1
      : color2;
  }
`;

export default class Engine {
  canvas: HTMLCanvasElement;
  resolution: [number, number] = [0, 0];
  dimension: [number, number] = [0, 0];
  verticesCount: number = 0;
  vertexSize: number = 1;
  context: WebGL2RenderingContext | null = null;
  shaders: [
    WebGLShader | null,
    WebGLShader | null
  ] = [null, null];
  program: WebGLProgram | null = null;

  constructor(canvasId: string) {
    this.setCanvas(canvasId);
    this.setContext();

    if (this.context) {
      this.setResolution();
      this.setDimension();
      this.setVerticesCount();

      this.resize();

      this.setShaders();
      this.setProgram();
      this.setUniforms();
    }
  }
  
  setCanvas(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  }

  setResolution() {
    const canvasClientRect: DOMRect = this.canvas.getBoundingClientRect();
    const { height, width } = canvasClientRect;

    this.resolution = [
      Math.ceil(width / OPTIONS.pointSize),
      Math.ceil(height / OPTIONS.pointSize),
    ];
  }

  setDimension() {
    this.dimension = [
      this.resolution[0] * OPTIONS.pointSize,
      this.resolution[1] * OPTIONS.pointSize,
    ]
  }

  setVerticesCount() {
    this.verticesCount = this.resolution[0] * this.resolution[1];
  }

  setContext() {
    this.context = this.canvas.getContext("webgl2");
  }

  resize() {
    this.canvas.width = this.dimension[0];
    this.canvas.height = this.dimension[1];
    this.context?.viewport(0, 0, this.dimension[0], this.dimension[1]);
  }

  setShaders() {
    if (this.context) {
      const { vertexShader, fragmentShader } = Shaders.getShaders(
        this.context,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE
      );

      this.shaders = [vertexShader, fragmentShader];
    }
  }

  setProgram() {
    if (this.context
      && this.shaders[0]
      && this.shaders[1]
    ) {
      this.program = Program.getProgram(
        this.context,
        this.shaders[0],
        this.shaders[1]  
      );
    }
  }

  setUniforms() {
    if (this.context
      && this.program
    ) {
      const u_dimensionLocation: WebGLUniformLocation | null =
        this.context.getUniformLocation(this.program, U_DIMENSION);
      const u_resolutionLocation: WebGLUniformLocation | null =
        this.context.getUniformLocation(this.program, U_RESOLUTION);
      const u_pointSizeLocation: WebGLUniformLocation | null =
        this.context.getUniformLocation(this.program, U_POINT_SIZE);
      const u_color1Locaton: WebGLUniformLocation | null =
        this.context.getUniformLocation(this.program, U_COLOR_1);
      const u_color2Locaton: WebGLUniformLocation | null =
        this.context.getUniformLocation(this.program, U_COLOR_2);

      this.context.useProgram(this.program);

      this.context.uniform2fv(u_dimensionLocation, this.dimension);
      this.context.uniform2fv(u_resolutionLocation, this.resolution);
      this.context.uniform1f(u_pointSizeLocation, OPTIONS.pointSize);
      this.context.uniform4fv(u_color1Locaton, OPTIONS.pointColors[0]);
      this.context.uniform4fv(u_color2Locaton, OPTIONS.pointColors[1]);
    }
  }

  draw(bufferData: Float32Array) {
    if (this.context
      && this.program
    ) {
      this.context.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT);

      const buffer: WebGLBuffer | null = Buffer.initBuffer(
        this.context,
        bufferData
      );
      const colorAttribute: number = this.context.getAttribLocation(
        this.program,
        A_STATE
      );
      this.context.enableVertexAttribArray(colorAttribute);
      this.context.vertexAttribPointer(
        colorAttribute,
        this.vertexSize,
        this.context.FLOAT,
        false,
        0,
        0
      );
      this.context.drawArrays(
        this.context.POINTS,
        0,
        this.verticesCount / this.vertexSize
      );
    }
  }
}
