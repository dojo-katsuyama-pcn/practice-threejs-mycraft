
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


const camera_base = new THREE.Object3D();
scene.add( camera_base );


for(let i=0; i<100; i++){
    const geometry = new THREE.BoxGeometry(10,10,10);
    const material = new THREE.MeshBasicMaterial( { color: 0x005500 } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = 5 + (i-50)*10;
    cube.position.y = -5;
    cube.position.z = 5;
    scene.add( cube );
}


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

let aim = undefined;

function animate() {

//    controls.update(clock.getDelta());

    requestAnimationFrame( animate );

    //// ver1 ->
    //camera.rotation.y += dRotateY;
    //// <- ver1
    
    //console.log(camera.rotation.toVector3().y, camera.rotation.y);

    // let vec = new THREE.Vector3(1, 0, 0);
    // vec.applyQuaternion( camera.quaternion );


    // TODO totation.yでみるとQuaternionがうまく計算して値が前後方向同じになる
//    console.log(camera.rotation.y);
    //////console.log(camera.quaternion.angleTo(new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), 0)));

    // camera.position.x += dFront * vec.x;
    // camera.position.z += dFront * vec.x;

//    console.log(camera.rotation.toVector3().z);

    //console.log(camera.rotation.x + "," + camera.rotation.y +"," + Math.cos(camera.rotation.y));

    // const vecy = new THREE.Vector3(0,1,0);
    // const vecn = new THREE.Vector3(camera.rotation.toVector3().x,camera.rotation.toVector3().y,0);
    // console.log(vecn.angleTo(vecy));
    
    camera.position.x += dFront * Math.sin(dRotateY);
    camera.position.z += dFront * Math.cos(dRotateY);

    camera.position.x += dSide * Math.cos(dRotateY);
    camera.position.z -= dSide * Math.sin(dRotateY);

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

    let near = undefined;
    if(intersects.length > 0){
        for(let item of intersects) {
            if(item.object === grid) continue;

            if(!near) {
                near = item;
            } else if(near.distance < item.distance) {
                near = item;
            }            
            //console.log(item.distance)
            // if (item.object === grid) {
            //     // console.log("same");
            // } else {
            //     // console.log("nosame");
            // }
        }
    }

    if(near) {
        aim = new THREE.Vector3(near.point.x, near.point.y, near.point.z);
        //console.log(near);
    } else {
        aim = undefined;
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
    } else if (event.key === "Escape") {
        document.exitPointerLock();
    }
});

document.body.addEventListener('mousemove', e => {

    dRotateY -= e.movementX * (Math.PI / 180.0) / 10;
    dRotateX -= e.movementY * (Math.PI / 180.0) / 10;
    console.log(Math.PI / 2 + "," + dRotateY + "," + camera.rotation.y);
    if(-0.6 > dRotateX) dRotateX = -0.6;
    if(0.6 < dRotateX) dRotateX = 0.6;

    const dq = new THREE.Quaternion()
        .multiply(new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), dRotateY))
        .multiply(new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), dRotateX));
    camera.rotation.setFromQuaternion(dq);

    ///// ver2 ->
    //camera.rotation.y -= e.movementX/200.0;
    //camera.rotation.x -= e.movementY/200.0;
    ///// <- ver2

    ///// ver1 ->
    // if (sizeWindow.width/3 > e.pageX) {
    //     dRotateY = 0.02;
    // } else if (sizeWindow.width/3*2 < e.pageX) {
    //     dRotateY = -0.02;
    // } else {
    //     dRotateY = 0.0;
    // }
    // if (sizeWindow.height/3 > e.pageY) {
    //     dRotateX = 0.02;
    // } else if (sizeWindow.height/3*2 < e.pageY) {
    //     dRotateX = -0.02;
    // } else {
    //     dRotateX = 0.0;
    // }
    ///// <- ver1

    vec2mouse.x = ( e.pageX / sizeWindow.width ) * 2 - 1;
    vec2mouse.y = -( e.pageY / sizeWindow.height ) * 2 + 1;
});

document.body.addEventListener('mouseout', e => {
    ///// ver1 ->
    // dRotateY = 0.0;
    // dRotateX = 0.0;
    ///// <- ver1
});


document.body.addEventListener('click', e => {
    console.log("click");
    canvas.requestPointerLock();
});



