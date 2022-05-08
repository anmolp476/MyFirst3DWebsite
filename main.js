import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

/*container that holds all of your objects,
cameras, and lights*/
const scene = new THREE.Scene();

/*Many different types of cameras, but this one
will mimc what the user or the human eye would see.
PerspectiveCamera(field of view, aspect ratio, view frustum, view frustum)
*/
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer(
  {
    canvas: document.querySelector('#bg'),
  }
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);//To make it into a fullscreen canvas
camera.position.setZ(30);//Because, before it was set to the middle of the scene

renderer.render(scene, camera);//The renderer is what makes the magic happen, its the one that DRAWS

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial(
  {
    color: 0xFF6347
  }
);//This is what will wrap around the Torus shape; react to light will bounce off of it

const torus = new THREE.Mesh(geometry, material);//Combination of the shape and the material

torus.position.set(0,0,-10)

scene.add(torus);//Add this shape to the scene

/*Since the object requires light to bounce off of it, you won't be able to see it if 
  there's no light source in the first place! So now let's create a light source*/
const pointLight = new THREE.PointLight(0xffffff)// The "0x" will let the compiler know that this is a hexadecimal
pointLight.position.set(5,5,5)

//Add an ambient light to light up all objects in the scene
const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambientLight)//Don't forget to add the lights to the scene as well!! 

//Sometimes you wanna see where your lights are in the scene, so use a helper!!
//const pointLightHelper = new THREE.PointLightHelper(pointLight)

//Creating a grid is also helpful in some situation
//(this will create a grid that is perfectly level with our current perspective)
//Hence the reason for a single horizontal line
//const gridHelper = new THREE.GridHelper(200,50)
//scene.add(pointLightHelper)

const controls = new OrbitControls(camera, renderer.domElement)

//Start filling up the scene with a lot of staaaaaaaaaaarsss!!
function addStars()
{
  const sphere = new THREE.SphereGeometry(0.25)
  const starMat = new THREE.MeshStandardMaterial(
    {
      color: 0xffffff
    }
  )
  const star = new THREE.Mesh(sphere, starMat)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z)
  scene.add(star)
}

//Pass in the addStars() function to create 200 randomly generated stars
Array(200).fill().forEach(addStars)

//Now create a space backgrounddddddd!!
const spaceBG = new THREE.TextureLoader().load('betterSpace.jpg')
scene.background = spaceBG


//Time to add a picture of me!!
const meTexture = new THREE.TextureLoader().load('me.jpg');

const me = new THREE.Mesh(new THREE.BoxGeometry(6,6,6), new THREE.MeshBasicMaterial({map: meTexture}));

me.position.set(0, 0, -10)

scene.add(me);

//Time to add the moon!!!
const moonTexture = new THREE.TextureLoader().load('moon.jpg')
const normalMoonTexture = new THREE.TextureLoader().load('normal.jpg')//To give the moon some more "depth"!!!!

const moon = new THREE.Mesh(new THREE.SphereGeometry(3,32,32), new THREE.MeshStandardMaterial(
  {
    map: moonTexture,
    normalMap: normalMoonTexture
  })
)

moon.position.z = 30//Can also do moon.position.z = 30;
moon.position.x = -10//Same for x positionnnn

function moveCamera()
{
  //Now calculate where the user is currently scrolled tooo!!!
  //getBoundingClientRect() will return the dimensions of the
  //view port, and .top returns how far it is from the top of the page
  const scrolledTo = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.0;
  moon.rotation.y += 0.05;
  moon.rotation.z += 0.0;

  me.rotation.x += 0.01; 
  me.rotation.z += 0.01;

  camera.position.x = scrolledTo*-0.0002;
  camera.position.y = scrolledTo*-0.0002;
  camera.position.z = scrolledTo*-0.01;

}

document.body.onscroll = moveCamera

scene.add(moon)

/*Instead of calling the render function over and over again after every change, create a recursive
  render automatically*/
  function animate() 
  {
    torus.rotation.x += 0.01;//Use the rotation.x property of the geometrical shape to rotate it on the x-axis
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    requestAnimationFrame(animate);

    controls.update()

    renderer.render(scene, camera);
  }
  
  animate()
