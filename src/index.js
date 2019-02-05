import Viewer from './ntree/tViewer';

const element = document.getElementById('potree_render_area');

window.viewer = new Viewer(element);

// console.log('element', element)
// window.viewer = new Potree.Viewer(
// 	element
// );

// viewer.setEDLEnabled(true);
// viewer.setFOV(60);
// viewer.setPointBudget(1 * 1000 * 1000);
// viewer.setMinNodeSize(0);
// viewer.loadSettingsFromURL();
// viewer.setBackground('black');
// viewer.setDescription("");

// viewer.loadGUI(() => {
//   viewer.setLanguage("en");
// //   $("#menu_tools")
// //     .next()
// //     .show();
// //   $("#menu_clipping")
// //     .next()
// //     .show();
// //   viewer.toggleSidebar();
// });

// // Load and add point cloud to scene
// Potree.loadPointCloud("/static/pointclouds/lion_takanawa/cloud.js", "foundry", e => {
//   let scene = viewer.scene;
// 	let pointcloud = e.pointcloud;
// 	let material = pointcloud.material;

//   scene.addPointCloud(pointcloud);
//   material.size = 1;
//   material.pointSizeType = PointSizeType.ADAPTIVE;
//   material.shape = PointShape.SQUARE;
// 	console.log('pointcloud loaded', e)

//   // scene.view.position.set(589974.341, 231698.397, 986.146);
//   // scene.view.lookAt(new THREE.Vector3(589851.587, 231428.213, 715.634));
//   viewer.fitToScreen();
// });
