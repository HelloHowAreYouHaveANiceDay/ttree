import * as THREE from 'three';

interface Shader {
  gl: any;
  name: string;
  vsSource: any;
  fsSource: any;
  cache: Map<any, any>;
  vs: any;
  fs: any;
  program: any;
  uniformLocations: object;
  attributeLocations: object;
  uniformBlockIndices: object;
  uniformBlocks: object;
  uniforms: object;
}

class Shader {
  constructor(gl, name, vsSource, fsSource) {
    this.gl = gl;
    this.name = name;
    this.vsSource = vsSource;
    this.fsSource = fsSource;

    this.cache = new Map();

    this.vs = null;
    this.fs = null;
    this.program = null;

    this.uniformLocations = {};
    this.attributeLocations = {};
    this.uniformBlockIndices = {};
    this.uniformBlocks = {};
    this.uniforms = {};

    this.update(vsSource, fsSource);
  }

  update(vsSource, fsSource) {
    this.vsSource = vsSource;
    this.fsSource = fsSource;

    this.linkProgram();
  }

  compileShader(shader, source) {
    let gl = this.gl;

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      let info = gl.getShaderInfoLog(shader);
      let numberedSource = source
        .split("\n")
        .map((a, i) => `${i + 1}`.padEnd(5) + a)
        .join("\n");
      throw `could not compile shader ${
        this.name
      }: ${info}, \n${numberedSource}`;
    }
  }

  linkProgram() {
    let gl = this.gl;

    this.uniformLocations = {};
    this.attributeLocations = {};
    this.uniforms = {};

    gl.useProgram(null);

    let cached = this.cache.get(`${this.vsSource}, ${this.fsSource}`);
    if (cached) {
      this.program = cached.program;
      this.vs = cached.vs;
      this.fs = cached.fs;
      this.attributeLocations = cached.attributeLocations;
      this.uniformLocations = cached.uniformLocations;
      this.uniformBlocks = cached.uniformBlocks;
      this.uniforms = cached.uniforms;

      return;
    } else {
      this.vs = gl.createShader(gl.VERTEX_SHADER);
      this.fs = gl.createShader(gl.FRAGMENT_SHADER);
      this.program = gl.createProgram();

      for (let name of Object.keys(this.attributeLocations)) {
        let location = this.attributeLocations[name];
        gl.bindAttribLocation(this.program, location, name);
      }

      this.compileShader(this.vs, this.vsSource);
      this.compileShader(this.fs, this.fsSource);

      let program = this.program;

      gl.attachShader(program, this.vs);
      gl.attachShader(program, this.fs);

      gl.linkProgram(program);

      gl.detachShader(program, this.vs);
      gl.detachShader(program, this.fs);

      let success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!success) {
        let info = gl.getProgramInfoLog(program);
        throw `could not link program ${this.name}: ${info}`;
      }

      {
        // attribute locations
        let numAttributes = gl.getProgramParameter(
          program,
          gl.ACTIVE_ATTRIBUTES
        );

        for (let i = 0; i < numAttributes; i++) {
          let attribute = gl.getActiveAttrib(program, i);

          let location = gl.getAttribLocation(program, attribute.name);

          this.attributeLocations[attribute.name] = location;
        }
      }

      {
        // uniform locations
        let numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let i = 0; i < numUniforms; i++) {
          let uniform = gl.getActiveUniform(program, i);

          let location = gl.getUniformLocation(program, uniform.name);

          this.uniformLocations[uniform.name] = location;
          this.uniforms[uniform.name] = {
            location: location,
            value: null
          };
        }
      }

      // uniform blocks
      // @ts-ignore
      if (gl instanceof WebGL2RenderingContext) {
        let numBlocks = gl.getProgramParameter(
          program,
          gl.ACTIVE_UNIFORM_BLOCKS
        );

        for (let i = 0; i < numBlocks; i++) {
          let blockName = gl.getActiveUniformBlockName(program, i);

          let blockIndex = gl.getUniformBlockIndex(program, blockName);

          this.uniformBlockIndices[blockName] = blockIndex;

          gl.uniformBlockBinding(program, blockIndex, blockIndex);
          let dataSize = gl.getActiveUniformBlockParameter(
            program,
            blockIndex,
            gl.UNIFORM_BLOCK_DATA_SIZE
          );

          let uBuffer = gl.createBuffer();
          gl.bindBuffer(gl.UNIFORM_BUFFER, uBuffer);
          gl.bufferData(gl.UNIFORM_BUFFER, dataSize, gl.DYNAMIC_READ);

          gl.bindBufferBase(gl.UNIFORM_BUFFER, blockIndex, uBuffer);

          gl.bindBuffer(gl.UNIFORM_BUFFER, null);

          this.uniformBlocks[blockName] = {
            name: blockName,
            index: blockIndex,
            dataSize: dataSize,
            buffer: uBuffer
          };
        }
      }

      let cached = {
        program: this.program,
        vs: this.vs,
        fs: this.fs,
        attributeLocations: this.attributeLocations,
        uniformLocations: this.uniformLocations,
        uniforms: this.uniforms,
        uniformBlocks: this.uniformBlocks
      };

      this.cache.set(`${this.vsSource}, ${this.fsSource}`, cached);
    }
  }

  setUniformMatrix4(name, value) {
    const gl = this.gl;
    const location = this.uniformLocations[name];

    if (location == null) {
      return;
    }

    let tmp = new Float32Array(value.elements);
    gl.uniformMatrix4fv(location, false, tmp);
  }

  setUniform1f(name, value) {
    const gl = this.gl;
    const uniform = this.uniforms[name];

    if (uniform === undefined) {
      return;
    }

    if (uniform.value === value) {
      return;
    }

    uniform.value = value;

    gl.uniform1f(uniform.location, value);

    //const location = this.uniformLocations[name];

    //if (location == null) {
    //	return;
    //}

    //gl.uniform1f(location, value);
  }

  setUniformBoolean(name, value) {
    const gl = this.gl;
    const uniform = this.uniforms[name];

    if (uniform === undefined) {
      return;
    }

    if (uniform.value === value) {
      return;
    }

    uniform.value = value;

    gl.uniform1i(uniform.location, value);
  }

  setUniformTexture(name, value) {
    const gl = this.gl;
    const location = this.uniformLocations[name];

    if (location == null) {
      return;
    }

    gl.uniform1i(location, value);
  }

  setUniform2f(name, value) {
    const gl = this.gl;
    const location = this.uniformLocations[name];

    if (location == null) {
      return;
    }

    gl.uniform2f(location, value[0], value[1]);
  }

  setUniform3f(name, value) {
    const gl = this.gl;
    const location = this.uniformLocations[name];

    if (location == null) {
      return;
    }

    gl.uniform3f(location, value[0], value[1], value[2]);
  }

  setUniform(name, value) {
    if (value.constructor === THREE.Matrix4) {
      this.setUniformMatrix4(name, value);
    } else if (typeof value === "number") {
      this.setUniform1f(name, value);
    } else if (typeof value === "boolean") {
      this.setUniformBoolean(name, value);
    } else if (value instanceof WebGLTexture) {
      this.setUniformTexture(name, value);
    } else if (value instanceof Array) {
      if (value.length === 2) {
        this.setUniform2f(name, value);
      } else if (value.length === 3) {
        this.setUniform3f(name, value);
      }
    } else {
      console.error("unhandled uniform type: ", name, value);
    }
  }

  setUniform1i(name, value) {
    let gl = this.gl;
    let location = this.uniformLocations[name];

    if (location == null) {
      return;
    }

    gl.uniform1i(location, value);
  }
}

export default Shader;
