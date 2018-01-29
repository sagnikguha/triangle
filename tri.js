var canvas,
    context,
    dragging = true,
    dragStartLocation,
    snapshot;


function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}
function drawPolygon(position, sides, angle) {
    var coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
        index = 0;

    for (index = 0; index < sides; index++) {
        coordinates.push({x: dragStartLocation.x + radius * Math.cos(angle), y: dragStartLocation.y - radius * Math.sin(angle)});
        angle += (2 * Math.PI) / sides;
    }

    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < sides; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }

    context.closePath();
}

function draw(position) {
     drawPolygon(position, 3, 90 * (Math.PI / 180));
        context.fillStyle =getRandomColor();
        context.fill();
       // context.stroke();
}

function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
}

function drag(event) {
    var position;
    if (dragging === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        draw(position, "polygon");
    }
}

function dragStop(event) {
    dragging = false;
    restoreSnapshot();
    var position = getCanvasCoordinates(event);
    draw(position, "polygon");
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function clearCanvas()
{
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    //dragging = false; // Testing for clear | or call dragstop
    
}
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = event.target;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:event.pageX - document.getElementById('canvas').getBoundingClientRect().x, y:eventY - document.getElementById('canvas').getBoundingClientRect().y};
}


function deleteTriangle(event) {
    var coordinates = relMouseCoords(event);

    var xPos = coordinates.x;
    var yPos = coordinates.y;

    var imageData = getImageData(xPos, yPos);

    for(var i = xPos; i > 0; i--) {
        for(var j = yPos; j> 0; j--) {
            var currentImageData = getImageData(i, j);
            if(currentImageData == imageData) {
                context.clearRect(i, j, 1, 1);
            }
        }

        for(var k = yPos + 1; k < context.canvas.height; k++) {
            var currentImageData = getImageData(i, k);
            if(currentImageData == imageData) {
                context.clearRect(i, k, 1, 1);
            }
        }
    }

    for(i = xPos + 1; i < context.canvas.width; i++) {
        for(var j = yPos; j> 0; j--) {
            var currentImageData = getImageData(i, j);
            if(currentImageData == imageData) {
                context.clearRect(i, j, 1, 1);
            }
        }

        for(var k = yPos + 1; k < context.canvas.height; k++) {
            var currentImageData = getImageData(i, k);
            if(currentImageData == imageData) {
                context.clearRect(i, k, 1, 1);
            }
        }
    }
}


function getImageData(x, y) {
    return context.getImageData(x, y, 1, 1).data;
}
function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
   // context.strokeStyle = 'black';
     // context.fillStyle = 'red';
  //  context.lineWidth = 4;
    context.lineCap = 'round';


    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    canvas.addEventListener('dblclick', deleteTriangle);
}

window.addEventListener('load', init, false);


