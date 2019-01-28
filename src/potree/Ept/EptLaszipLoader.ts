import LASFile from '../Plasio/LASFile';

import XHRFactory from '../XHRFactory';

import EptLazBatcher from './EptLazBatcher';

import LASDecoder from '../Plasio/LASDecoder';
import LASDecoderParams from '../Plasio/LASDecoderParams';

import LASHeader from '../Plasio/LASHeader';

class EptLaszipLoader {
  load(node) {
    if (node.loaded) return;

    let url = node.url() + ".laz";

    let xhr = XHRFactory.createXMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let buffer = xhr.response;
          this.parse(node, buffer);
        } else {
          console.log("Failed " + url + ": " + xhr.status);
        }
      }
    };

    xhr.send(null);
  }

  parse(node, buffer) {
    let lf = new LASFile(buffer);
    let handler = new EptLazBatcher(node);

    lf.open()
      .then(() => {
        lf.isOpen = true;
        return lf.getHeader();
      })
      .then((header: LASHeader) => {
        let i = 0;
        let np = header.pointsCount;

        let toArray = v => [v.x, v.y, v.z];
        let mins = toArray(node.key.b.min);
        let maxs = toArray(node.key.b.max);

        let read = () => {
          let p = lf.readData(1000000, 0, 1);
          return p.then(function(data: LASDecoderParams) {
            let d = new LASDecoder(
              data.buffer,
              header.pointsFormatId,
              header.pointsStructSize,
              data.count,
              header.scale,
              header.offset,
              mins,
              maxs
            );
            d.extraBytes = header.extraBytes;
            d.pointsFormatId = header.pointsFormatId;
            handler.push(d);

            i += data.count;

            if (data.hasMoreData) {
              return read();
            } else {
              header.totalRead = i;
              header.versionAsString = lf.versionAsString;
              header.isCompressed = lf.isCompressed;
              return null;
            }
          });
        };

        return read();
      })
      .then(() => lf.close())
      .then(() => (lf.isOpen = false))
      .catch(err => {
        console.log("Error reading LAZ:", err);
        if (lf.isOpen) {
          lf.close().then(() => {
            lf.isOpen = false;
            throw err;
          });
        } else throw err;
      });
  }
}

export default EptLaszipLoader;
