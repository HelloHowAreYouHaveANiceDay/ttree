import readAs from './ReadAs';

import LASHeader from './LASHeader';

function parseLASHeader(arraybuffer: ArrayBuffer) {
  var o: LASHeader = {};

  o.pointsOffset = readAs(arraybuffer, Uint32Array, 32 * 3, 0);
  o.pointsFormatId = readAs(arraybuffer, Uint8Array, 32 * 3 + 8, 0);
  o.pointsStructSize = readAs(arraybuffer, Uint16Array, 32 * 3 + 8 + 1, 0);
  o.pointsCount = readAs(arraybuffer, Uint32Array, 32 * 3 + 11, 0);

  var start = 32 * 3 + 35;
  o.scale = readAs(arraybuffer, Float64Array, start, 3);
  start += 24; // 8*3
  o.offset = readAs(arraybuffer, Float64Array, start, 3);
  start += 24;

  var bounds = readAs(arraybuffer, Float64Array, start, 6);
  start += 48; // 8*6;
  o.maxs = [bounds[0], bounds[2], bounds[4]];
  o.mins = [bounds[1], bounds[3], bounds[5]];

  return o;
}

interface LASLoader {
  arraybuffer: ArrayBuffer;
  header?: any;
  readOffset?: number;
}

class LASLoader {
  constructor(arraybuffer: ArrayBuffer) {
    this.arraybuffer = arraybuffer;
  }

  open() {
    // nothing needs to be done to open this file
    //
    this.readOffset = 0;
    return new Promise(function(res, rej) {
      setTimeout(res, 0);
    });
  }

  getHeader() {
    var o = this;

    return new Promise(function(res, rej) {
      setTimeout(function() {
        o.header = parseLASHeader(o.arraybuffer);
        res(o.header);
      }, 0);
    });
  }

  readData(count, offset, skip) {
    var o = this;

    return new Promise(function(res, rej) {
      setTimeout(function() {
        if (!o.header)
          return rej(
            new Error(
              "Cannot start reading data till a header request is issued"
            )
          );

        var start;
        if (skip <= 1) {
          count = Math.min(count, o.header.pointsCount - o.readOffset);
          start =
            o.header.pointsOffset + o.readOffset * o.header.pointsStructSize;
          var end = start + count * o.header.pointsStructSize;
          res({
            buffer: o.arraybuffer.slice(start, end),
            count: count,
            hasMoreData: o.readOffset + count < o.header.pointsCount
          });
          o.readOffset += count;
        } else {
          var pointsToRead = Math.min(
            count * skip,
            o.header.pointsCount - o.readOffset
          );
          var bufferSize = Math.ceil(pointsToRead / skip);
          var pointsRead = 0;

          var buf = new Uint8Array(bufferSize * o.header.pointsStructSize);
          for (var i = 0; i < pointsToRead; i++) {
            if (i % skip === 0) {
              start =
                o.header.pointsOffset +
                o.readOffset * o.header.pointsStructSize;
              var src = new Uint8Array(
                o.arraybuffer,
                start,
                o.header.pointsStructSize
              );

              buf.set(src, pointsRead * o.header.pointsStructSize);
              pointsRead++;
            }

            o.readOffset++;
          }

          res({
            buffer: buf.buffer,
            count: pointsRead,
            hasMoreData: o.readOffset < o.header.pointsCount
          });
        }
      }, 0);
    });
  }

  close() {
    var o = this;
    return new Promise(function(res, rej) {
      o.arraybuffer = null;
      setTimeout(res, 0);
    });
  }
}

export default LASLoader;
