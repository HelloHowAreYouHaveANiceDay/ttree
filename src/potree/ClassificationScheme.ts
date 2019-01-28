import * as THREE from "three";
// -------------------------------------------
// to get a ready to use gradient array from a chroma.js gradient:
// http://gka.github.io/chroma.js/
// -------------------------------------------
//
// let stops = [];
// for(let i = 0; i <= 10; i++){
//	let range = chroma.scale(['yellow', 'navy']).mode('lch').domain([10,0])(i)._rgb
//		.slice(0, 3)
//		.map(v => (v / 255).toFixed(4))
//		.join(", ");
//
//	let line = `[${i / 10}, new THREE.Color(${range})],`;
//
//	stops.push(line);
// }
// stops.join("\n");
//
//
//
// -------------------------------------------
// to get a ready to use gradient array from matplotlib:
// -------------------------------------------
// import matplotlib.pyplot as plt
// import matplotlib.colors as colors
//
// norm = colors.Normalize(vmin=0,vmax=1)
// cmap = plt.cm.viridis
//
// for i in range(0,11):
//	u = i / 10
//	rgb = cmap(norm(u))[0:3]
//	rgb = ["{0:.3f}".format(v) for v in rgb]
//	rgb = "[" + str(u) + ", new THREE.Color(" +  ", ".join(rgb) + ")],"
//	print(rgb)

const ClassificationScheme = {
  DEFAULT: {
    // never classified
    0: new THREE.Vector4(0.5, 0.5, 0.5, 1.0),

    // unclassified
    1: new THREE.Vector4(0.5, 0.5, 0.5, 1.0),

    // ground
    2: new THREE.Vector4(0.63, 0.32, 0.18, 1.0),

    // low vegetation
    3: new THREE.Vector4(0.0, 1.0, 0.0, 1.0),

    // med vegetation
    4: new THREE.Vector4(0.0, 0.8, 0.0, 1.0),

    // high vegetation
    5: new THREE.Vector4(0.0, 0.6, 0.0, 1.0),

    // building
    6: new THREE.Vector4(1.0, 0.66, 0.0, 1.0),

    // noise
    7: new THREE.Vector4(1.0, 0, 1.0, 1.0),

    // key point
    8: new THREE.Vector4(1.0, 0, 0.0, 1.0),

    // water
    9: new THREE.Vector4(0.0, 0.0, 1.0, 1.0),

    // overlap
    12: new THREE.Vector4(1.0, 1.0, 0.0, 1.0),

    // everything else
    DEFAULT: new THREE.Vector4(0.3, 0.6, 0.6, 0.5)
  },
  RANDOM: {
    get() {
      let scheme = {};

      for (let i = 0; i <= 255; i++) {
        scheme[i] = new THREE.Vector4(
          Math.random(),
          Math.random(),
          Math.random()
        );
      }

      scheme["DEFAULT"] = new THREE.Vector4(
        Math.random(),
        Math.random(),
        Math.random()
      );

      return scheme;
    }
  }
};

// move to inside classification scheme
// Object.defineProperty(ClassificationScheme, "RANDOM", {
//   get: function() {
//     let scheme = {};

//     for (let i = 0; i <= 255; i++) {
//       scheme[i] = new THREE.Vector4(
//         Math.random(),
//         Math.random(),
//         Math.random()
//       );
//     }

//     scheme["DEFAULT"] = new THREE.Vector4(
//       Math.random(),
//       Math.random(),
//       Math.random()
//     );

//     return scheme;
//   }
// });

export default ClassificationScheme;
