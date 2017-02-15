
var camera, scene, renderer, geometry, material, mesh, texture, plane, light;
var canvas = document.getElementById("background");

var buildings = [];
var reflections = [];

var init = function() {

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog( 0xffffff, 160, 210);

    // Set bg to white
    scene.background = new THREE.Color( 0xffffff );

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);

    renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.shadowMapEnabled = true;
    // renderer.shadowMapType = THREE.PCFSoftShadowMap;

    // geometry = new THREE.PlaneGeometry( 200, 20 );
    // material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    // plane = new THREE.Mesh( geometry, material );

    // plane.receiveShadow = true;
    //plane.rotateX(-Math.PI/4);
    // scene.add(plane);

    buildings = buildBuildings();
    buildings.forEach(function(building) {
        if(building.sections) {
            building.sections.forEach(function(section) {
                scene.add(section.mesh);
            })
        }
    });

    camera.position.z = 180;
    camera.position.y = 20;

    // Cast light
    // light = new THREE.DirectionalLight( 0xffffff, 1 );
    // light.position.set( 0, 1, 1 );
    // light.castShadow = true;
    // light.shadowCameraVisible = true;
    // scene.add(light);
}

var render = function() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

/**
 * Generating buildings
 */

var MIN_BUILDING_WIDTH = 3;
var MAX_BUILDING_WIDTH = 6;
var POINTY_CUTOFF = 20;

var buildBuildings = function() {

    var buildings = [];

    // Generate middle buildings
    var x = -100;
    while(x < 100) {

        var width = Math.random()*4-2+10+Math.abs(x/15)*Math.random();
        var height = Math.random()*8-4+(45-Math.abs(x/5));

        var building = Building(width, height, "color");
        building.translate(x, 0, 0);

        buildings.push(building);

        // Spacing
        x+=width;
        x+=Math.random()*3+1;
    }

    // Backline
    x = -125;
    while(x < 125) {

        var width = Math.random()*4-2+10+Math.abs(x/15)*Math.random();
        var height = Math.random()*8-4+(50-Math.abs(x/5));

        var building = Building(width, height, "color");
        building.translate(x, 0, -width-10);

        buildings.push(building);

        // Spacing
        x+=width;
        x+=Math.random()*3+1;
    }

    // Frontline
    x = -65;
    while(x < 65) {

        var width = Math.random()*4-2+10+Math.abs(x/15)*Math.random();
        var height = Math.random()*8-4+(35-Math.abs(x/5));

        var building = Building(width, height);
        building.translate(x, 0, width+10);

        buildings.push(building);

        // Spacing
        x+=width;
        x+=Math.random()*3+1;
    }

    return buildings;
}

init();
render();
