import './index.css';
import './js/frame-controls.js'
import * as THREE from 'three';
import AsciiEffect from './js/three/AsciiEffect.js';

window.windowControls.onReaderConnected((data) => {
  console.log('data!', data)
})

let camera, scene, renderer, effect;

let sphere;

const start = Date.now();

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 0;
  camera.position.z = 500;

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 15, 15, 15 );

  const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
  pointLight1.position.set( 500, 500, 500 );
  scene.add( pointLight1 );

  const pointLight2 = new THREE.PointLight( 0xffffff, 1, 0, 0 );
  pointLight2.position.set( - 500, - 500, - 500 );
  scene.add( pointLight2 );

  sphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 0, 4 ), new THREE.MeshPhongMaterial( { flatShading: true } ) );
  scene.add( sphere );

  // Plane

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  effect = new AsciiEffect( renderer, '` .,-+|08', { invert: false } );
  effect.setSize( window.innerWidth, window.innerHeight );
  effect.domElement.style.color = 'white';
  effect.domElement.style.backgroundColor = 'black';
  effect.domElement.style.fontSize = '16px';

  // Special case: append effect.domElement, instead of renderer.domElement.
  // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

  document.body.appendChild( effect.domElement );

  //

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  effect.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

  requestAnimationFrame( animate );

  render();

}

function render() {

  const timer = Date.now() - start;

  sphere.position.y =  0;
  sphere.rotation.x = timer * 0.0002;
  sphere.rotation.z = timer * 0.0001;

  effect.render( scene, camera );

}