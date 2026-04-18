import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// rendered 
// camera 
// scene

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true }); // makes it look better
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement); // canvas 

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true
});

const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001); // makes the wire less flickery
mesh.add(wireMesh);

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0x39ff14);
scene.add(hemiLight);

function animate(t = 0) {
    requestAnimationFrame(animate);
    //mesh.rotation.y = t * 0.0001; // this will rotate object 
    renderer.render(scene, camera);
    controls.update();
}

animate();
