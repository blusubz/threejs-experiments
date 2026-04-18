import * as THREE from "three";
import { getFresnelMat } from "./src/getFresnelMat.js";
import getStarfield from "./src/getStarfield.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// 1. Scene (the world)
const scene = new THREE.Scene();

// 2. Camera (your eyes)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Move camera back so we can see stuff
camera.position.z = 3;

// 3. Renderer (draws everything)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Add canvas to page
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

// 4. Geometry (the shape) 
const loader = new THREE.TextureLoader();
const geometry = new THREE.SphereGeometry(1, 32, 32);

// 5. Material (the appearance)
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  specular: new THREE.Color('grey'),
});

// 6. Mesh (combine shape + material)
const earthGroup = new THREE.Group();
scene.add(earthGroup);

const earth = new THREE.Mesh(geometry, material);

// city lights at night / dark side of globe
// might remove
const lightsMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});

const lightsMesh = new THREE.Mesh(geometry, lightsMaterial);
lightsMesh.scale.set(1.001, 1.001, 1.001);
// might remove

// lighting - "Sun"
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
// Ambient Lighting 
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

// Add clouds which is a second sphere
const cloudsMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
});

const cloudsMesh = new THREE.Mesh(geometry, cloudsMaterial);

// Make it slightly bigger than Earth
cloudsMesh.scale.set(1.01, 1.01, 1.01);

const fresnelMat = getFresnelMat();

const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.renderOrder = 1;

// Make it slightly bigger than clouds
glowMesh.scale.set(1.02, 1.02, 1.02);

earthGroup.add(earth);
earthGroup.add(lightsMesh);
earthGroup.add(cloudsMesh);
earthGroup.add(glowMesh);

// tilt Earth
earthGroup.rotation.z = -23.4 * Math.PI / 100;

// Add (import) Stars
const stars = getStarfield({ numStars: 3000 });
scene.add(stars);

// Move camera - Like a Satellite
let angle = 0;

// render scene
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube
  earth.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0025;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  

  renderer.render(scene, camera);
}

animate();