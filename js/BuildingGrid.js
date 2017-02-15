
var Array2D = function(width, height) {
    var arr = [];
    var innerArr;
    for(var i=0;i<width;i++) {
        (innerArr = []).length = height;
        arr.push(innerArr.fill(0));
    }
    return arr;
};

var BuildingGrid = function(width, height) {

    var colorSet = [
        0xffffff, // white
        0xeeffff, // azure
        0xffeeee, // reddish
        0xdddddd, // lightgray
    ];

    var Prism = function(height, color) {
        color = color || 0xffffff;
        var geom = new THREE.BoxGeometry(2, Math.abs(height), 2);
        var mat = new THREE.MeshLambertMaterial({
            color: color,
            transparent:true,
            opacity:Math.random()/3+0.5
        });

        return new THREE.Mesh(geom, mat);
    };

    // Creates a heightmap on input array
    var heightMap = function(arr) {

        for(var i=0;i<arr.length;i++) {
            for(var j=0;j<arr[i].length;j++) {
                arr[i][j] = (Math.random()*10)*1.5;
            }
        }

        return arr;
    }

    // Create central point
    var sphere = new THREE.Object3D();

    // Create pivot points
    var pivots = [];

    var xLen = width;
    var yLen = height;

    for(var i=0;i<xLen;i++) {

        var zRot = (Math.PI) / xLen * i;

        for(var j=0;j<yLen;j++) {
            var yRot = Math.PI*2 / yLen * j;

            var pivot = new THREE.Object3D();
            pivot.rotation.z = zRot;
            pivot.rotation.y = yRot;

            pivots.push(pivot);
            sphere.add(pivot);
        }
    }

    // Create blocks
    var grid = heightMap(Array2D(width,height));
    var blocks = [];

    xLen = grid.length;
    yLen = grid[0].length;

    var counter = 0;

    for(var i=0;i<xLen;i++) {
        for(var j=0;j<yLen;j++) {

            randomColor = colorSet[Math.floor(Math.random()*colorSet.length)];

            var mesh = Prism(grid[i][j], randomColor);
            mesh.position.y = grid[i][j]/2+15;

            pivots[counter++].add(mesh);
            blocks.push(mesh);
        }
    }

    return {
        sphere: sphere,
        pivots: pivots,
        blocks: blocks,
        grid: grid
    };

}
