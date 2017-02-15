
/**
 * A building is an object with a set of meshes as sections
 */
var Building = function(width, height, type) {

    var sections = [];
    var COLORS = [
        0x000000, // Black
        0x111111, // Dark Grey
        0x222222, // Lighter Dark Grey
        0x444444, // Grey
        0x6d5b5b, // Reddish
    ];

    // Buildings must be at least this height to get a pointy top
    var POINTY_CUTOFF = 35;

    // Chance of a pointy top
    var POINTY_CHANCE = 0.25; // 25%

    // Buildings above this height and greater than this width might have a foundation
    var FOUNDATION_CUTOFF_HEIGHT = 25;
    var FOUNDATION_CUTOFF_WIDTH = 10;

    // Chance of a foundation level
    var FOUNDATION_CHANCE = 0.35; // 35%;

    var hasFoundation = false;
    var hasTop = false;

    // Creates a rectangular prism
    var createBox = function(x, y, z, color) {
        var geom = new THREE.BoxGeometry(x, y, z);
        var mat = new THREE.MeshBasicMaterial({ color: color });
        return new THREE.Mesh(geom, mat);
    };

    // Creates a pyramid
    var createPyramid = function(width, height, color) {
        var radius = Math.sqrt(2)/2*width;
        var geom = new THREE.ConeGeometry(radius, height, 4);
        var mat = new THREE.MeshBasicMaterial({ color: color });
        var mesh = new THREE.Mesh(geom, mat);

        // Rotate by pi/4 to display nicely
        mesh.rotation.y = Math.PI/4;
        return mesh;
    };

    // Moves the building by x,y,z
    var translate = function(x,y,z) {
        if(this.sections.length > 0) {
            this.sections.forEach(function(section) {
                var mesh = section.mesh;
                mesh.position.x += x;
                mesh.position.y += y;
                mesh.position.z += z;
            });
        }
    };

    // Initialize building
    // Default type is black building
    // type = color generates random building color
    // type = empire makes a special building
    // type = wide makes a very fat building

    if(!type || type == "color") {
        var color = 0x000000;

        // Randomly select a color
        if(type=="color") {
            color = COLORS[Math.floor(Math.random()*COLORS.length)];
        }

        // Determine special characteristics
        if(height >= POINTY_CUTOFF) {
            hasTop = Math.random()<POINTY_CHANCE;
        }

        if(height >= FOUNDATION_CUTOFF_HEIGHT && width >= FOUNDATION_CUTOFF_WIDTH) {
            hasFoundation = Math.random()<FOUNDATION_CHANCE;
        }

        var currentHeight = 0;
        var currentWidth = width;

        // Start building
        if(hasFoundation) {
            var foundationHeight = (height/2) - Math.random()*5;
            currentHeight = foundationHeight;
            currentWidth -= 1 + Math.random()*3;

            var mesh = createBox(width, foundationHeight, width, color);
            mesh.position.y = foundationHeight/2;

            sections.push({
                mesh: mesh,
                height: foundationHeight
            });
        }

        if(hasTop) {
            // Determine pointy height
            var pointyHeight = (height-currentHeight)/2 - Math.random()*2;
            var sectionHeight = height - pointyHeight - currentHeight;

            // Shift mesh height above foundation
            var mesh = createBox(currentWidth, sectionHeight, width, color);
            mesh.position.y += currentHeight + sectionHeight/2;

            sections.push({
                mesh: mesh,
                height: sectionHeight
            });

            currentHeight += sectionHeight;

            // Create pointy at top
            mesh = createPyramid(currentWidth, pointyHeight, color);
            mesh.position.y += currentHeight + pointyHeight/2;

            sections.push({
                mesh: mesh,
                height: pointyHeight
            });
        } else {
            var mesh = createBox(currentWidth, height - currentHeight, width, color);
            mesh.position.y += currentHeight + (height-currentHeight)/2;

            sections.push({
                mesh: mesh,
                height: height - currentHeight
            });
        }
    }

    return {
        width: width,
        height: height,
        sections: sections,
        hasFoundation: hasFoundation,
        hasTop: hasTop,
        translate: translate
    };
};

/*
var randomBuilding = function(height) {

    var width = 0;
    var building = {
        base:null,
        top:null,
        width:0,
        topHeight:0
    };

    var geom;
    var mat = new THREE.MeshLambertMaterial( { color: 0x000000 } );

    if(height < POINTY_CUTOFF) {
        width = Math.random()+MIN_BUILDING_WIDTH;
        geom = new THREE.BoxGeometry(width, height, width);
        building.base = new THREE.Mesh(geom, mat);
    } else {
        width = Math.random()*2+4;

        // Randomly decide with 50% chance if pointy roof
        if(Math.floor(Math.random()*2)==0) {
            geom = new THREE.BoxGeometry(width, height, width);
            building.base = new THREE.Mesh(geom, mat);
        } else {
            var topHeight = Math.random()*3+5;
            geom = new THREE.BoxGeometry(width, height-topHeight, 4);
            building.base = new THREE.Mesh(geom, mat);

            var coneRad = Math.sqrt(width*width/2);
            geom = new THREE.ConeGeometry(coneRad, topHeight, 4);
            building.top = new THREE.Mesh(geom, mat);
            building.top.position.y = height-topHeight;
            building.top.rotation.y = Math.PI/4;
            building.topHeight = topHeight;
        }

    }

    building.width = width;
    return building;
}
*/
