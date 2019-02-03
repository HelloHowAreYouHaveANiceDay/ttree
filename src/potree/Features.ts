import * as THREE from "three";

const Features = (function() {
  let ftCanvas = document.createElement("canvas");
  let gl =
    ftCanvas.getContext("webgl2") ||
    ftCanvas.getContext("webgl") ||
    ftCanvas.getContext("experimental-webgl");
  if (gl === null) {
    return null;
  }

  // -- code taken from THREE.WebGLRenderer --
  //@ts-ignore
  let _vertexShaderPrecisionHighpFloat = gl.getShaderPrecisionFormat(
    //@ts-ignore
    gl.VERTEX_SHADER,
    //@ts-ignore
    gl.HIGH_FLOAT
  );
  //@ts-ignore
  let _vertexShaderPrecisionMediumpFloat = gl.getShaderPrecisionFormat(
    //@ts-ignore
    gl.VERTEX_SHADER,
    //@ts-ignore
    gl.MEDIUM_FLOAT
  );
  // Unused: let _vertexShaderPrecisionLowpFloat = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT);

  //@ts-ignore
  let _fragmentShaderPrecisionHighpFloat = gl.getShaderPrecisionFormat(
    //@ts-ignore
    gl.FRAGMENT_SHADER,
    //@ts-ignore
    gl.HIGH_FLOAT
  );
  //@ts-ignore
  let _fragmentShaderPrecisionMediumpFloat = gl.getShaderPrecisionFormat(
    //@ts-ignore
    gl.FRAGMENT_SHADER,
    //@ts-ignore
    gl.MEDIUM_FLOAT
  );
  // Unused: let _fragmentShaderPrecisionLowpFloat = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT);

  let highpAvailable =
    _vertexShaderPrecisionHighpFloat.precision > 0 &&
    _fragmentShaderPrecisionHighpFloat.precision > 0;
  let mediumpAvailable =
    _vertexShaderPrecisionMediumpFloat.precision > 0 &&
    _fragmentShaderPrecisionMediumpFloat.precision > 0;
  // -----------------------------------------

  let precision;
  if (highpAvailable) {
    precision = "highp";
  } else if (mediumpAvailable) {
    precision = "mediump";
  } else {
    precision = "lowp";
  }

  return {
    SHADER_INTERPOLATION: {
      isSupported: function() {
        let supported = true;
        //@ts-ignore
        supported = supported && gl.getExtension("EXT_frag_depth");
        //@ts-ignore
        supported = supported && gl.getParameter(gl.MAX_VARYING_VECTORS) >= 8;

        return supported;
      }
    },
    SHADER_SPLATS: {
      isSupported: function() {
        let supported = true;

        //@ts-ignore
        supported = supported && gl.getExtension("EXT_frag_depth");
        //@ts-ignore
        supported = supported && gl.getExtension("OES_texture_float");
        //@ts-ignore
        supported = supported && gl.getParameter(gl.MAX_VARYING_VECTORS) >= 8;

        return supported;
      }
    },
    SHADER_EDL: {
      isSupported: function() {
        let supported = true;

        //supported = supported && gl.getExtension('EXT_frag_depth');

        //@ts-ignore
        supported = supported && gl.getExtension("OES_texture_float");
        //@ts-ignore
        supported = supported && gl.getParameter(gl.MAX_VARYING_VECTORS) >= 8;
        //@ts-ignore
        supported = supported || gl instanceof WebGL2RenderingContext;

        return supported;
      }
    },
    WEBGL2: {
      isSupported: function() {
        //@ts-ignore
        return gl instanceof WebGL2RenderingContext;
      }
    },
    precision: precision
  };
})();

//
export default Features;
