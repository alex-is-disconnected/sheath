import * as THREE from 'three';
import AsciiEffect from './three/AsciiEffect.js';
import initMetaballs from "metaballs-js";
import TypeShuffle from './util/shuffle.js';
import './create-tooltip.js';

const options = {
  numMetaballs: 35,
  minRadius: 9,
  maxRadius: 15,
  speed: 1.0,
  color: '#000000',
  backgroundColor: '#ffffff',
  useDevicePixelRatio: true,
  interactive: 'window'
}

const cssSelector = '#metaballs'
initMetaballs(cssSelector, options)

let camera, scene, renderer, effect;

let sphere;

let canvas, texture;

let material, geometry, mesh;

canvas = document.getElementById('metaballs');

let rectMat, rectGeo, rect;

const start = Date.now();

init();
fadeInMaterial(material,3000, 6000);
animate();

function fadeInMaterial(material, duration = 2000, delay = 0) {
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    if (elapsed > delay) { // Check if delay has elapsed
      const progress = elapsed - delay;
      const opacity = Math.min(progress / duration, 1);
      material.opacity = opacity;
    }

    if (elapsed < duration + delay) { // Continue animation until duration + delay is reached
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function init() {

  camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 30;
  camera.position.z = 500;

  texture = new THREE.Texture(canvas);
  texture.needsUpdate = true; 

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 15, 15, 15 );

  material = new THREE.MeshBasicMaterial({ 
    map: texture, 
    transparent: true,
    opacity: 0
  });

  geometry = new THREE.PlaneGeometry(1090, 700);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const depth = 1;
  rectGeo = new THREE.BoxGeometry(205, window.innerHeight * 0.3, depth);
  rectMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  rect = new THREE.Mesh(rectGeo, rectMat);
  scene.add(rect);





  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  const asciiGradient = ' `^",:;Il!i><~+_-?][}{1)(|/XYUJCLQ0OZ#MW&8%B@$0';
  const og = ' .,`ASDEFGJHGEJ-+|%890';
  effect = new AsciiEffect( renderer, asciiGradient , { invert: false } );
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

  // setTimeout(() => {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();
  //   // location.reload();
  //   renderer.setSize( window.innerWidth, window.innerHeight );
  
  // }, 300);
  
  const oAsciiEl = document.getElementById('oAscii');
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize( window.innerWidth, window.innerHeight );
    oAsciiEl.innerHTML
    // Update camera aspect ratio and projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Additional logic here to handle texture resizing, updating, or other adjustments
    
  
}

//

function animate() {

  requestAnimationFrame( animate );
  texture.needsUpdate = true
  render();

}

function render() {
  texture.needsUpdate = true

  effect.render( scene, camera );

}


const title = document.getElementById('cicada');
const titleTS = new TypeShuffle(title);
const asciiWrapper = document.getElementById('ascii-wrapper');
const homepageWrapper = document.getElementById('homepage-wrapper');
const button1 = document.getElementById('button1')
const button2 = document.getElementById('button2')

const fastSetting = false;
function loadHomepage () {
  if (fastSetting === false) {
    titleTS.trigger('fx6')

  setTimeout(() => {    
    homepageWrapper.style.opacity = '1';
    setTimeout(() => {
      asciiWrapper.style.opacity = '1';
      setTimeout(() => {
        button1.style.borderWidth = '3px';
        button2.style.borderWidth = '3px';
        setTimeout(() => {   
  
          button1.style.width = '110px';
          button2.style.width = '110px';
          // button1.style.padding = '0.5em 0';
          // button2.style.padding = '0.5em 0';
          setTimeout(() => {
            button1.style.height = '43px';
            button2.style.height = '43px';
            button1.style.padding = '0.5em 1em';
            button2.style.padding = '0.5em 1em';  
          }, 400);
        
      }, 750);
      }, 3000);
    }, 2000);
  }, 2000);
  } else {
  titleTS.trigger('fx6')
  setTimeout(() => {    
    homepageWrapper.style.opacity = '1';
    setTimeout(() => {
      asciiWrapper.style.opacity = '1';
      setTimeout(() => {
        button1.style.borderWidth = '3px';
        button2.style.borderWidth = '3px';
        setTimeout(() => {   
  
          button1.style.width = '110px';
          button2.style.width = '110px';
          // button1.style.padding = '0.5em 0';
          // button2.style.padding = '0.5em 0';
          setTimeout(() => {
            button1.style.height = '43px';
            button2.style.height = '43px';
            button1.style.padding = '0.5em 1em';
            button2.style.padding = '0.5em 1em';  
          }, 1);
        
      }, 1);
      }, 1);
    }, 1);
  }, 1);
}
}

loadHomepage();