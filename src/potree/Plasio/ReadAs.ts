export default function readAs(buf: ArrayBuffer, Type, offset: number, count: number) {
  count = (count === 0) ? 1 : count;
  var sub = buf.slice(offset, offset + Type.BYTES_PER_ELEMENT * count);

  var r = new Type(sub);
  if (count === undefined || count === 1) return r[0];

  var ret = [];
  for (var i = 0; i < count; i++) {
    ret.push(r[i]);
  }

  return ret;
}
