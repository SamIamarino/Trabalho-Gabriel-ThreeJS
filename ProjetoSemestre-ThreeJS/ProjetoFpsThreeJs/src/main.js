import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

let container, stats;
let camera, controls, scene, renderer;
const clock = new THREE.Clock();

init();

function init() {
  container = document.getElementById('container');

  // Configura a câmera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  // Configura a cena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xefd1b8);

  // Adiciona luzes
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 0).normalize();
  scene.add(directionalLight);

  // // Adiciona um auxiliar para depuração
  // const axesHelper = new THREE.AxesHelper(500);
  // scene.add(axesHelper);

  // Carrega o arquivo .mtl (material)
  const mtlLoader = new MTLLoader();
  mtlLoader.load('public/testeCor.mtl', function (materials) {
    materials.preload(); // Prepara os materiais
    console.log('Materiais carregados com sucesso.');

    // Carrega o arquivo .obj com os materiais aplicados
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials); // Associa os materiais ao carregador
    objLoader.load(
      'public/testeCor.obj',
      function (obj) {
        obj.traverse(function (child) {
          if (child.isMesh) {
            child.material.needsUpdate = true; // Garante que o material seja atualizado
          }
        });
        obj.scale.set(0.1, 0.1, 0.1); // Ajusta a escala
        scene.add(obj);
        console.log('Modelo carregado com sucesso.');
      },
      undefined,
      function (error) {
        console.error('Erro ao carregar o arquivo OBJ:', error);
      }
    );
  }, 
  function (error) {
    console.error('Erro ao carregar o arquivo MTL:', error);
  });

  // Configura o renderizador
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  container.appendChild(renderer.domElement);

  // Configura os controles da câmera
  controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 3;
  controls.lookSpeed = 0.1;

  // Adiciona estatísticas de performance
  stats = new Stats();
  container.appendChild(stats.dom);

  // Adiciona listener para redimensionar a janela
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
}

function animate() {
  render();
  stats.update();
}

function render() {
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}
