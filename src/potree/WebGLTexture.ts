import * as THREE from 'three';

interface WebGLTexture {
  gl: any;
  texture: any;
  id: any;
  target: any;
  version: number;
}

// Copied from three.js: WebGLRenderer.js
function paramThreeToGL(_gl, p) {
  let extension;

  if (p === THREE.RepeatWrapping) return _gl.REPEAT;
  if (p === THREE.ClampToEdgeWrapping) return _gl.CLAMP_TO_EDGE;
  if (p === THREE.MirroredRepeatWrapping) return _gl.MIRRORED_REPEAT;

  if (p === THREE.NearestFilter) return _gl.NEAREST;
  if (p === THREE.NearestMipMapNearestFilter) return _gl.NEAREST_MIPMAP_NEAREST;
  if (p === THREE.NearestMipMapLinearFilter) return _gl.NEAREST_MIPMAP_LINEAR;

  if (p === THREE.LinearFilter) return _gl.LINEAR;
  if (p === THREE.LinearMipMapNearestFilter) return _gl.LINEAR_MIPMAP_NEAREST;
  if (p === THREE.LinearMipMapLinearFilter) return _gl.LINEAR_MIPMAP_LINEAR;

  if (p === THREE.UnsignedByteType) return _gl.UNSIGNED_BYTE;
  if (p === THREE.UnsignedShort4444Type) return _gl.UNSIGNED_SHORT_4_4_4_4;
  if (p === THREE.UnsignedShort5551Type) return _gl.UNSIGNED_SHORT_5_5_5_1;
  if (p === THREE.UnsignedShort565Type) return _gl.UNSIGNED_SHORT_5_6_5;

  if (p === THREE.ByteType) return _gl.BYTE;
  if (p === THREE.ShortType) return _gl.SHORT;
  if (p === THREE.UnsignedShortType) return _gl.UNSIGNED_SHORT;
  if (p === THREE.IntType) return _gl.INT;
  if (p === THREE.UnsignedIntType) return _gl.UNSIGNED_INT;
  if (p === THREE.FloatType) return _gl.FLOAT;

  if (p === THREE.HalfFloatType) {
    // TODO: extensions doesn't exist
    // extension = extensions.get("OES_texture_half_float");
    // if (extension !== null) return extension.HALF_FLOAT_OES;
    return extension.HALF_FLOAT_OES;
  }

  if (p === THREE.AlphaFormat) return _gl.ALPHA;
  if (p === THREE.RGBFormat) return _gl.RGB;
  if (p === THREE.RGBAFormat) return _gl.RGBA;
  if (p === THREE.LuminanceFormat) return _gl.LUMINANCE;
  if (p === THREE.LuminanceAlphaFormat) return _gl.LUMINANCE_ALPHA;
  if (p === THREE.DepthFormat) return _gl.DEPTH_COMPONENT;
  if (p === THREE.DepthStencilFormat) return _gl.DEPTH_STENCIL;

  if (p === THREE.AddEquation) return _gl.FUNC_ADD;
  if (p === THREE.SubtractEquation) return _gl.FUNC_SUBTRACT;
  if (p === THREE.ReverseSubtractEquation) return _gl.FUNC_REVERSE_SUBTRACT;

  if (p === THREE.ZeroFactor) return _gl.ZERO;
  if (p === THREE.OneFactor) return _gl.ONE;
  if (p === THREE.SrcColorFactor) return _gl.SRC_COLOR;
  if (p === THREE.OneMinusSrcColorFactor) return _gl.ONE_MINUS_SRC_COLOR;
  if (p === THREE.SrcAlphaFactor) return _gl.SRC_ALPHA;
  if (p === THREE.OneMinusSrcAlphaFactor) return _gl.ONE_MINUS_SRC_ALPHA;
  if (p === THREE.DstAlphaFactor) return _gl.DST_ALPHA;
  if (p === THREE.OneMinusDstAlphaFactor) return _gl.ONE_MINUS_DST_ALPHA;

  if (p === THREE.DstColorFactor) return _gl.DST_COLOR;
  if (p === THREE.OneMinusDstColorFactor) return _gl.ONE_MINUS_DST_COLOR;
  if (p === THREE.SrcAlphaSaturateFactor) return _gl.SRC_ALPHA_SATURATE;

  if (
    p === THREE.RGB_S3TC_DXT1_Format ||
    // p === RGBA_S3TC_DXT1_Format ||
    p === THREE.RGBA_S3TC_DXT3_Format 
    // p === RGBA_S3TC_DXT5_Format
  ) {
    // TODO: extensions doesn't exist
    // extension = extensions.get("WEBGL_compressed_texture_s3tc");

    // if (extension !== null) {
    //   if (p === THREE.RGB_S3TC_DXT1_Format)
    //     return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
    //   if (p === THREE.RGBA_S3TC_DXT1_Format)
    //     return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
    //   if (p === THREE.RGBA_S3TC_DXT3_Format)
    //     return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
    //   if (p === THREE.RGBA_S3TC_DXT5_Format)
    //     return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
    // }
    return undefined;
  }

  if (
    p === THREE.RGB_PVRTC_4BPPV1_Format ||
    p === THREE.RGB_PVRTC_2BPPV1_Format ||
    p === THREE.RGBA_PVRTC_4BPPV1_Format ||
    p === THREE.RGBA_PVRTC_2BPPV1_Format
  ) {
    // TODO: extensions is undefined;
    // extension = extensions.get("WEBGL_compressed_texture_pvrtc");

    // if (extension !== null) {
    //   if (p === THREE.RGB_PVRTC_4BPPV1_Format)
    //     return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
    //   if (p === THREE.RGB_PVRTC_2BPPV1_Format)
    //     return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
    //   if (p === THREE.RGBA_PVRTC_4BPPV1_Format)
    //     return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
    //   if (p === THREE.RGBA_PVRTC_2BPPV1_Format)
    //     return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
    // }
    return undefined
  }

  if (p === THREE.RGB_ETC1_Format) {
    // TODO: extensions is undefined
    // extension = extensions.get("WEBGL_compressed_texture_etc1");

    // if (extension !== null) return extension.COMPRESSED_RGB_ETC1_WEBGL;
    return undefined;
  }

  if (p === THREE.MinEquation || p === THREE.MaxEquation) {
    //TODO: extensions is undefined
    // extension = extensions.get("EXT_blend_minmax");

    // if (extension !== null) {
    //   if (p === THREE.MinEquation) return extension.MIN_EXT;
    //   if (p === THREE.MaxEquation) return extension.MAX_EXT;
    // }
    return undefined;
  }
  // TODO: UnsignedInt248Type is undefined
  // TODO: extensions is undefined
  // if (p === UnsignedInt248Type) {
  //   extension = extensions.get("WEBGL_depth_texture");

  //   if (extension !== null) return extension.UNSIGNED_INT_24_8_WEBGL;
  // }

  return 0;
}
class WebGLTexture {
  constructor(gl, texture) {
    this.gl = gl;

    this.texture = texture;
    this.id = gl.createTexture();

    this.target = gl.TEXTURE_2D;
    this.version = -1;

    // this.update(texture);
    this.update();
  }

  update() {
    if (!this.texture.image) {
      this.version = this.texture.version;

      return;
    }

    let gl = this.gl;
    let texture = this.texture;

    if (this.version === texture.version) {
      return;
    }

    this.target = gl.TEXTURE_2D;

    gl.bindTexture(this.target, this.id);

    let level = 0;
    let internalFormat = paramThreeToGL(gl, texture.format);
    let width = texture.image.width;
    let height = texture.image.height;
    let border = 0;
    let srcFormat = internalFormat;
    let srcType = paramThreeToGL(gl, texture.type);
    let data;

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, texture.unpackAlignment);

    if (texture instanceof THREE.DataTexture) {
      data = texture.image.data;

      gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texParameteri(
        this.target,
        gl.TEXTURE_MAG_FILTER,
        paramThreeToGL(gl, texture.magFilter)
      );
      gl.texParameteri(
        this.target,
        gl.TEXTURE_MIN_FILTER,
        paramThreeToGL(gl, texture.minFilter)
      );

      gl.texImage2D(
        this.target,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        data
      );
    } else if (texture instanceof THREE.CanvasTexture) {
      data = texture.image;

      gl.texParameteri(
        this.target,
        gl.TEXTURE_WRAP_S,
        paramThreeToGL(gl, texture.wrapS)
      );
      gl.texParameteri(
        this.target,
        gl.TEXTURE_WRAP_T,
        paramThreeToGL(gl, texture.wrapT)
      );

      gl.texParameteri(
        this.target,
        gl.TEXTURE_MAG_FILTER,
        paramThreeToGL(gl, texture.magFilter)
      );
      gl.texParameteri(
        this.target,
        gl.TEXTURE_MIN_FILTER,
        paramThreeToGL(gl, texture.minFilter)
      );

      gl.texImage2D(
        this.target,
        level,
        internalFormat,
        internalFormat,
        srcType,
        data
      );
    }

    gl.bindTexture(this.target, null);

    this.version = texture.version;
  }
}

export default WebGLTexture;
