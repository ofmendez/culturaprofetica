import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.querySelector("#liquidCanvas");
const section = document.querySelector(".hero-liquid");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const loader = new THREE.TextureLoader();

const isMobile = window.matchMedia("(max-width: 768px)").matches;

const imageConfig = isMobile
  ? {
      path: "img/bg-mobile.webp",
      width: 1280,
      height: 1920
    }
  : {
      path: "img/bg-desktop.webp",
      width: 1920,
      height: 850
    };

const imagePath = imageConfig.path;
const imageResolution = new THREE.Vector2(imageConfig.width, imageConfig.height);

section.style.setProperty(
  "--hero-ratio",
  `${imageConfig.width} / ${imageConfig.height}`
);

const texture = loader.load(imagePath, () => {
  uniforms.uImageResolution.value.copy(imageResolution);
  resize();
});

texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;

const mouse = new THREE.Vector2(0.5, 0.5);
const smoothMouse = new THREE.Vector2(0.5, 0.5);
const prevMouse = new THREE.Vector2(0.5, 0.5);

const uniforms = {
  uTexture: { value: texture },
  uMouse: { value: smoothMouse },
  uPrevMouse: { value: prevMouse },
  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uImageResolution: { value: imageResolution },
  uTime: { value: 0 },
  uStrength: { value: 0.18 },
  uRadius: { value: 0.22 },
uSpeed: { value: 0.0 }
};

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform vec2 uPrevMouse;
    uniform vec2 uResolution;
    uniform vec2 uImageResolution;
    uniform float uTime;
    uniform float uStrength;
    uniform float uRadius;
    uniform float uSpeed;

    varying vec2 vUv;

    vec2 coverUv(vec2 uv, vec2 screenSize, vec2 imageSize) {
      float screenRatio = screenSize.x / screenSize.y;
      float imageRatio = imageSize.x / imageSize.y;

      vec2 newSize = vec2(1.0);

      if (screenRatio > imageRatio) {
        newSize.y = imageRatio / screenRatio;
      } else {
        newSize.x = screenRatio / imageRatio;
      }

      return (uv - 0.5) * newSize + 0.5;
    }

    void main() {
      vec2 uv = vUv;

      vec2 mouse = uMouse;
      mouse.y = 1.0 - mouse.y;

      vec2 prevMouse = uPrevMouse;
      prevMouse.y = 1.0 - prevMouse.y;

      vec2 velocity = mouse - prevMouse;
float speed = uSpeed;

float dist = distance(uv, mouse);
float influence = smoothstep(uRadius, 0.0, dist);

vec2 direction = normalize(uv - mouse);

vec2 pull = velocity * influence * uStrength * 8.0;

/* La onda solo existe si el mouse se está moviendo */
float wave = sin(dist * 45.0) * influence * speed * 0.35;

vec2 distortedUv = uv - pull + direction * wave;

      vec2 finalUv = distortedUv;

      vec4 color = texture2D(uTexture, finalUv);

      gl_FragColor = color;
    }
  `
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

section.addEventListener("mousemove", (event) => {
  const rect = section.getBoundingClientRect();

  mouse.x = (event.clientX - rect.left) / rect.width;
  mouse.y = (event.clientY - rect.top) / rect.height;
});

section.addEventListener("mouseleave", () => {
  mouse.x = 0.5;
  mouse.y = 0.5;
});

function resize() {
  const width = section.clientWidth;
  const height = section.clientHeight;

  renderer.setSize(width, height, false);
  uniforms.uResolution.value.set(width, height);
}

window.addEventListener("resize", resize);

function animate(time) {
  uniforms.uTime.value = time * 0.001;

  const beforeX = smoothMouse.x;
const beforeY = smoothMouse.y;

smoothMouse.x += (mouse.x - smoothMouse.x) * 0.08;
smoothMouse.y += (mouse.y - smoothMouse.y) * 0.08;

const dx = smoothMouse.x - beforeX;
const dy = smoothMouse.y - beforeY;

const speed = Math.sqrt(dx * dx + dy * dy);

uniforms.uSpeed.value += (speed - uniforms.uSpeed.value) * 0.2;

prevMouse.set(beforeX, beforeY);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

resize();
animate(0);