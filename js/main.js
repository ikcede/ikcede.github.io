
var camera, scene, renderer, geometry, material, mesh, texture, light, light2;
var canvas = document.getElementById("background");

var spike = null;

var init = function() {

    scene = new THREE.Scene();

    // Set bg to white
    scene.background = new THREE.Color( 0xffffff );

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);

    renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Zoom out
    camera.position.z = 120;

    // Build the spike
    spike = BuildingGrid(40,40);
    scene.add(spike.sphere);

    // Cast light
    light = new THREE.PointLight( 0xffffff, 1.8, 90);
    light.position.set(0,0,20);

    light2 = new THREE.PointLight( 0xffffff, 1.8, 90);
    light2.position.set(0,0,20);

    scene.add(light);
    scene.add(light2);
}

// Controls
var pause = false;
var invertSwitch = false;
var invert = false;
var spin = false;

var render = function() {
	requestAnimationFrame( render );

    if(!pause) {
        var time = Date.now() * 0.001;
        light.position.x = Math.sin( time * 0.5 ) * 50;
        light.position.y = Math.cos( time * 0.5 ) * 50;

        light2.position.x = -light.position.x;
        light2.position.y = -light.position.y;

        if(spin) {
            spike.sphere.rotation.x += 0.01;
            spike.sphere.rotation.y += 0.01;
        }

        if(invertSwitch) {
            if(invert) {
                spike.blocks.forEach(function(mesh) {
                    mesh.position.y -= 0.4;
                });
                if(spike.blocks[0].position.y < -25) {
                    invert = false;
                }
            } else {
                spike.blocks.forEach(function(mesh) {
                    mesh.position.y += 0.4;
                });
                if(spike.blocks[0].position.y > 22) {
                    invert = true;
                }
            }
        }
    }

	renderer.render( scene, camera );
}

init();
render();

// Set up listeners
$(document).ready(function() {
    $("#pauseCheck").change(function() {
        if(this.checked) {
            pause = true;
        } else {
            pause = false;
        }
    });

    $("#invertCheck").change(function() {
        if(this.checked) {
            invertSwitch = true;
        } else {
            invertSwitch = false;
        }
    });

    $("#spinCheck").change(function() {
        if(this.checked) {
            spin = true;
        } else {
            spin = false;
        }
    });
});
