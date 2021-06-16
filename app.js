const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const sizeWindow = {
    width:window.innerWidth,
    height:window.innerHeight
}
const vec2mouse = new THREE.Vector2();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.x = 0;
camera.position.y = 10;
camera.position.z = 0;

camera.rotation.x = 0;
camera.rotation.y = 0;
camera.rotation.z = 0;


const light  = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);

const grid   = new THREE.GridHelper(1000, 100);
scene.add(grid);

const raycaster = new THREE.Raycaster();

// const controls = new THREE.FirstPersonControls(camera, renderer.domElement);
// const clock = new THREE.Clock();
// controls.lookSpeed = 0.01;
// controls.movementSpeed = 1.0;

let dRotateY = 0.00;
let dRotateX = 0.00;

let dFront = 0.0;
let dSide = 0.0;

let dv = -99;


function animate() {

//    controls.update(clock.getDelta());

    requestAnimationFrame( animate );

    camera.rotation.y += dRotateY;
    
    camera.position.x += dFront * Math.sin(camera.rotation.y);
    camera.position.z += dFront * Math.cos(camera.rotation.y);

    camera.position.x += dSide * Math.cos(camera.rotation.y);
    camera.position.z -= dSide * Math.sin(camera.rotation.y);

    if(dv > -99) {
        camera.position.y += dv;
        dv -= 0.5;

        if(camera.position.y <= 10) {
            camera.position.y = 10;
            dv = -99;
        }
    }
    raycaster.setFromCamera(vec2mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if(intersects.length > 0){
        //console.log(intersects);
        for(let item of intersects) {
            console.log(item.distance)
            if (item.object === grid) {
                // console.log("same");
            } else {
                // console.log("nosame");
            }
        }
    }

    renderer.render( scene, camera );
}
animate();

document.body.addEventListener('keydown', event => {
    if (event.key === 'w') {
        dFront = -1;
    } else if (event.key === 's') {
        dFront = 1;
    } else if (event.key === 'a') {
        dSide = -1;
    } else if (event.key === 'd') {
        dSide = +1;
    }else if (event.key === ' ') {
        dv = 8;
    }
});

document.body.addEventListener('keyup', event => {
    if (event.key === 'w') {
        dFront = 0;
    } else if (event.key === 's') {
        dFront = 0;
    } else if (event.key === 'a') {
        dSide = 0;
    } else if (event.key === 'd') {
        dSide = 0;
    }
});

document.body.addEventListener('mousemove', e => {
    if (sizeWindow.width/3 > e.pageX) {
        dRotateY = 0.02;
    } else if (sizeWindow.width/3*2 < e.pageX) {
        dRotateY = -0.02;
    } else {
        dRotateY = 0.0;
    }

    if (sizeWindow.height/3 > e.pageY) {
        dRotateX = 0.02;
    } else if (sizeWindow.height/3*2 < e.pageY) {
        dRotateX = -0.02;
    } else {
        dRotateX = 0.0;
    }

    vec2mouse.x = ( e.pageX / sizeWindow.width ) * 2 - 1;
    vec2mouse.y = -( e.pageY / sizeWindow.height ) * 2 + 1;
});

document.body.addEventListener('mouseout', e => {
    dRotateY = 0.0;
    dRotateX = 0.0;
});


document.body.addEventListener('click', e => {
    console.log("click");



});



