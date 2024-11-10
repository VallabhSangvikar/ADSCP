const canvas = document.getElementById('trafficCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
let intersections = [
  { id: 1, x: 100, y: 100, name: "Intersection 1", hasTrafficLight: true, lightGreen: true },
  { id: 2, x: 300, y: 100, name: "Intersection 2", hasTrafficLight: true, lightGreen: true },
  { id: 3, x: 500, y: 100, name: "Intersection 3", hasTrafficLight: true, lightGreen: true },
  { id: 4, x: 200, y: 300, name: "Intersection 4", hasTrafficLight: true, lightGreen: true },
  { id: 5, x: 400, y: 300, name: "Intersection 5", hasTrafficLight: true, lightGreen: true },
  { id: 6, x: 600, y: 300, name: "Intersection 6", hasTrafficLight: true, lightGreen: true },
  { id: 7, x: 100, y: 500, name: "Intersection 7", hasTrafficLight: true, lightGreen: true },
  { id: 8, x: 300, y: 500, name: "Intersection 8", hasTrafficLight: true, lightGreen: true },
  { id: 9, x: 500, y: 500, name: "Intersection 9", hasTrafficLight: true, lightGreen: true },
  { id: 10, x: 700, y: 500, name: "Intersection 10", hasTrafficLight: true, lightGreen: true },
  { id: 11, x: 200, y: 700, name: "Intersection 11", hasTrafficLight: true, lightGreen: true },
  { id: 12, x: 400, y: 700, name: "Intersection 12", hasTrafficLight: true, lightGreen: true },
  { id: 13, x: 600, y: 700, name: "Intersection 13", hasTrafficLight: true, lightGreen: true }
];

let roads = [
  { start: 1, end: 2, time: 5, isOpen: true, id: "1-2" },
  { start: 2, end: 3, time: 4, isOpen: true, id: "2-3" },
  { start: 1, end: 4, time: 7, isOpen: true, id: "1-4" },
  { start: 4, end: 2, time: 6, isOpen: true, id: "4-2" },
  { start: 4, end: 5, time: 8, isOpen: true, id: "4-5" },
  { start: 5, end: 3, time: 7, isOpen: true, id: "5-3" },
  { start: 3, end: 6, time: 6, isOpen: true, id: "3-6" },
  { start: 6, end: 5, time: 6, isOpen: true, id: "6-5" },
  { start: 4, end: 7, time: 9, isOpen: true, id: "4-7" },
  { start: 7, end: 8, time: 4, isOpen: true, id: "7-8" },
  { start: 8, end: 5, time: 5, isOpen: true, id: "8-5" },
  { start: 5, end: 9, time: 7, isOpen: true, id: "5-9" },
  { start: 6, end: 9, time: 5, isOpen: true, id: "6-9" },
  { start: 9, end: 10, time: 6, isOpen: true, id: "9-10" },
  { start: 7, end: 11, time: 7, isOpen: true, id: "7-11" },
  { start: 8, end: 12, time: 6, isOpen: true, id: "8-12" },
  { start: 9, end: 13, time: 6, isOpen: true, id: "9-13" },
  { start: 11, end: 12, time: 8, isOpen: true, id: "11-12" },
  { start: 12, end: 13, time: 5, isOpen: true, id: "12-13" },
  { start: 10, end: 13, time: 7, isOpen: true, id: "10-13" }
];


let trafficLightDuration = 5000; // Default duration for traffic lights (in milliseconds)
let lightToggleInterval; // Variable to hold the interval timer

// Dynamic UI generation for settings
function generateSettingsUI() { //Vallabh
    const intersectionSettings = document.getElementById('intersectionSettings');
    const roadSettings = document.getElementById('roadSettings');
    const roadClosure = document.getElementById('roadClosure');
  
    intersectionSettings.innerHTML = '';
    roadSettings.innerHTML = '';
    roadClosure.innerHTML = '';
  
intersectionSettings.innerHTML = `
<div class="setting-item">
  <label>
    Select Intersection:
    <select id="intersectionSelect" onchange="updateRadioButtons(this.value)">
      <option value="">Choose an intersection...</option>
      ${intersections.map((intersection) =>{
            return `<option value="${intersection.id}">${intersection.name}</option>`
      }).join('')}
        
    </select>
  </label>
  
  <div id="lightControls" class="radio-group">
    <h3>Traffic Light Status:</h3>
    <label>
      <input type="radio" name="trafficLight" value="true"> Green
    </label>
    <label>
      <input type="radio" name="trafficLight" value="false"> Red
    </label>
  </div>
</div>
`;

// Function to update radio buttons when intersection is selected
  
    roadSettings.innerHTML += `
      <div class="setting-item">
        <label>
          Traffic Light Duration:
          <select onchange="updateRoadInput(this.value)" id="roadSelect" >
            <option value="">Choose road..</option>
            ${roads.map(road => 
              `<option value="${road.id}">${road.start}-${road.end}</option>`
            ).join('')}
          </select>
        </label>
        <div id="lightControls" class="radio-group">
            <h3>Current Duration :</h3>
            <label>
              <input type="number" id="roadTimeInput" value="000" name="inputValue" >
            </label>
            <button id="setButton" class="hero">Set</button>
      </div>
    `;
    document.getElementById('setButton').addEventListener('click', () => {
      if (selectedRoadId) {
        const newTime = document.getElementById('roadTimeInput').value;
        const road = roads.find(r => r.id == selectedRoadId);
        if (road) {
          road.time = parseInt(newTime); // Update the road time
          alert(`Time for road ${road.start}-${road.end} updated to ${newTime}`);
          drawMap();
        }
     }
    });
    roadClosure.innerHTML += `
      <div class="setting-item">
        <label>
          Select Road to close:
          <select id="roadSelect2" >
            <option value="">Choose road..</option>
            ${roads.map(road => 
              `<option value="${road.start}-${road.end}">${road.start}-${road.end}</option>`
            ).join('')}
          </select>
           <div id="lightControls" class="radio-group">
            <h3>Toggle status : </h3>
              <button id="helloButton">Road status Toggle</button>
            </div>
        </label>
      </div>
          `;
          document.getElementById('helloButton').addEventListener('click', () => {
            console.log(document.getElementById('roadSelect2'));
            const selectedRoadIdx = document.getElementById('roadSelect2').value;
            const road = roads.find(r => r.id == selectedRoadIdx);
            if (road) {
              console.log(road);
              road.isOpen = !road.isOpen;
              drawMap();
            }
            });
          }
 
  let selectedRoadId = null;
  function updateRoadInput(roadId) { //Vallabh
    if (!roadId) return;
    selectedRoadId = roadId;
    const inputs=document.getElementsByName('inputValue');
    const road= roads.find(r => r.id == roadId);
    inputs.forEach(input =>{
      input.value=road.time;
    })
  };
 
 
  function updateRadioButtons(intersectionId) { //Vallabh
    if (!intersectionId) return;
    const intersection = intersections.find(i => i.id == intersectionId);
    const radioButtons = document.getElementsByName('trafficLight');
    // Set the correct radio button based on intersection's light status
    radioButtons.forEach(radio => {
      radio.checked = (radio.value === String(intersection.lightGreen));
    });
    
    // Add change event listener to radio buttons
    radioButtons.forEach(radio => {
      radio.onchange = () => setTrafficLight(intersectionId, radio.value);
    });
    }

// Start the traffic light toggle process

function setTrafficLight(intersectionId, value) { //Vallabh
  const intersection = intersections.find(i => i.id == intersectionId);
  intersection.lightGreen = value === 'true';
  drawMap();
  if(value==='false'){
  setTimeout(() => {
    console.log(`Changing light for intersection ${intersectionId}`);
    intersection.lightGreen = !intersection.lightGreen;
    drawMap();
  }, 5000);
}
}

// Draw the map with updated settings
function drawMap() { //varun
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw roads with congestion
  roads.forEach(road => {   
    const start = intersections.find(i => i.id === road.start);
    const end = intersections.find(i => i.id === road.end);
    if (start && end) {
      // Draw base road
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);  
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = road.isOpen ? '#4a90e2' : '#A62D2D';
      ctx.stroke();

      // Draw congestion overlay
      const congestion = trafficSystem.getRoadCongestion(road.id);
      if (congestion > 0) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y); 
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = `rgba(231, 76, 60, ${congestion * 0.7})`;
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      // Draw road travel time
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(road.time+" min", midX, midY);
    }
  });

  // Draw intersections
  intersections.forEach(intersection => {
    ctx.beginPath();
    ctx.arc(intersection.x, intersection.y, 12, 0, Math.PI * 2);
    ctx.fillStyle =
      (intersection.lightGreen ? '#2ecc71' : '#e74c3c') ;
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(intersection.name, intersection.x - 20, intersection.y - 20);
  });
}

function findShortestPath(startId, endId) { 
  const distances = {};
  const previousNodes = {};
  const unvisitedNodes = new Set(intersections.map(i => i.id));

  intersections.forEach(intersection => {
    distances[intersection.id] = Infinity;
    previousNodes[intersection.id] = null;
  });
  distances[startId] = 0;

  while (unvisitedNodes.size > 0) {
    let currentId = null;
    unvisitedNodes.forEach(nodeId => {
      if (currentId === null || distances[nodeId] < distances[currentId]) {
        currentId = nodeId;
      }
    });

    if (distances[currentId] === Infinity) break;

    unvisitedNodes.delete(currentId);

    const connectedRoads = roads.filter(road => 
      (road.start === currentId || road.end === currentId) && road.isOpen
    );

    connectedRoads.forEach(road => {
      if (!road.isOpen) return;
      const neighborId = road.start === currentId ? road.end : road.start;

      // Get the current congestion level for this road
      const congestion = trafficSystem.getRoadCongestion(road.id) || 0;
      
      // Calculate dynamic travel time based on congestion
      // As congestion approaches 1, travel time increases significantly
      const congestionMultiplier = 1 + (congestion * 2); // Adjust multiplier as needed
      const dynamicTime = road.time * congestionMultiplier;

      // Check traffic light status
      const nextIntersection = intersections.find(i => i.id === neighborId);
      const trafficLightDelay = (nextIntersection.hasTrafficLight && !nextIntersection.lightGreen) ? 5 : 0;

      // Calculate total path cost including congestion and traffic lights
      const altPath = distances[currentId] + dynamicTime + trafficLightDelay;
      
      if (altPath < distances[neighborId]) {
        distances[neighborId] = altPath;
        previousNodes[neighborId] = currentId;
      }
    });
  }

  const path = [];
  let currentNode = endId;
  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }

  return path[0] === startId ? path : [];
}

// Optional: Add a function to suggest alternative routes
function findAlternativeRoutes(startId, endId, maxRoutes = 3) {
  const routes = [];
  let mainPath = findShortestPath(startId, endId);
  
  if (mainPath.length > 0) {
    routes.push(mainPath);
    
    // Find alternative routes by temporarily increasing the "cost" of used roads
    for (let i = 1; i < maxRoutes; i++) {
      const usedRoads = new Set();
      
      // Mark roads used in previous routes
      routes.forEach(route => {
        for (let j = 0; j < route.length - 1; j++) {
          const roadId = `${Math.min(route[j], route[j+1])}-${Math.max(route[j], route[j+1])}`;
          usedRoads.add(roadId);
        }
      });
      
      // Temporarily modify road times to encourage different paths
      const originalTimes = roads.map(road => road.time);
      roads.forEach(road => {
        if (usedRoads.has(road.id)) {
          road.time *= 1.5; // Make used roads more "expensive"
        }
      });
      
      // Find alternative path
      const altPath = findShortestPath(startId, endId);
      
      // Restore original road times
      roads.forEach((road, index) => {
        road.time = originalTimes[index];
      });
      
      if (altPath.length > 0 && !routes.some(route => 
        route.join(',') === altPath.join(',')
      )) {
        routes.push(altPath);
      }
    }
  }
  
  return routes;
}
  
// Update simulation function
// Modify the existing updateSimulation function
function updateSimulation() { //samruddhi
  const startId = parseInt(document.getElementById('startPoint').value);
  const endId = parseInt(document.getElementById('endPoint').value);
  
  // Get alternative routes
  const routes = findAlternativeRoutes(startId, endId);
  
  // Choose a route based on current congestion
  const selectedRoute = routes.reduce((best, current) => {
    const avgCongestion = calculateRouteCongestion(current);
    const bestCongestion = calculateRouteCongestion(best);
    return avgCongestion < bestCongestion ? current : best;
  });
  
  trafficSystem.addVehicle(startId, endId, selectedRoute);
  animate();
}

function calculateRouteCongestion(route) { //samruddhi
  let totalCongestion = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const roadId = `${Math.min(route[i], route[i+1])}-${Math.max(route[i], route[i+1])}`;
    totalCongestion += trafficSystem.getRoadCongestion(roadId) || 0;
  }
  return totalCongestion / (route.length - 1);
}

document.getElementById('findPath').addEventListener('click', updateSimulation);
class Vehicle { //samruddhi
  constructor(id, startId, endId, path) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.startId = startId;
    this.endId = endId;
    this.currentPathIndex = 0;
    this.currentPath = path;
    this.isMoving = true;
    this.isWaitingAtLight = false;
    this.speed = 2; // Base speed
    this.waitingTime = 0;
  }

  getCurrentSpeed() {
    if (this.currentPathIndex >= this.currentPath.length - 1) return 0;
    
    const currentIntersection = this.currentPath[this.currentPathIndex];
    const nextIntersection = this.currentPath[this.currentPathIndex + 1];
    
    const currentRoad = roads.find(road => 
      (road.start === currentIntersection && road.end === nextIntersection) ||
      (road.end === currentIntersection && road.start === nextIntersection)
    );
    
    const roadCongestion = trafficSystem.getRoadCongestion(currentRoad?.id);
    return currentRoad ? (this.speed / currentRoad.time) * (1 - roadCongestion) * 2 : 0;
  }
}

const trafficSystem = { //samruddhi
  vehicles: new Map(),
  roadCongestion: new Map(),
  stats: {
    totalVehicles: 0,
    completedTrips: 0,
    averageWaitTime: 0,
    totalWaitTime: 0,
    congestionPoints: new Set()
  },

  addVehicle(startId, endId) {
    const path = findShortestPath(startId, endId);
    if (!path || path.length === 0) return null;
    
    const vehicle = new Vehicle(
      this.stats.totalVehicles++,
      startId,
      endId,
      path
    );
    
    const startIntersection = intersections.find(i => i.id === path[0]);
    vehicle.x = startIntersection.x;
    vehicle.y = startIntersection.y;
    
    this.vehicles.set(vehicle.id, vehicle);
    return vehicle;
  },

  getRoadCongestion(roadId) {
    return this.roadCongestion.get(roadId) || 0;
  },

  updateRoadCongestion(roadId) {
    const road = roads.find(r => r.id === roadId);
    if (!road) return 0;
    
    let vehicleCount = 0;
    this.vehicles.forEach(vehicle => {
      if (vehicle.currentPathIndex >= vehicle.currentPath.length - 1) return;
      
      const currentRoadId = this.getRoadId(
        vehicle.currentPath[vehicle.currentPathIndex],
        vehicle.currentPath[vehicle.currentPathIndex + 1]
      );
      
      if (currentRoadId === roadId) vehicleCount++;
    });
    
    const congestion = Math.min(vehicleCount / 5, 1);
    this.roadCongestion.set(roadId, congestion);
    
    if (congestion > 0.8) {
      this.stats.congestionPoints.add(roadId);
    } else {
      this.stats.congestionPoints.delete(roadId);
    }
    
    return congestion;
  },

  getRoadId(startId, endId) {
    return `${Math.min(startId, endId)}-${Math.max(startId, endId)}`;
  }
};

function moveVehicles() { //varun
  trafficSystem.vehicles.forEach(vehicle => {
    if (!vehicle.isMoving || vehicle.currentPathIndex >= vehicle.currentPath.length - 1) return;

    const currentIntersection = intersections.find(i => i.id === vehicle.currentPath[vehicle.currentPathIndex]);
    const nextIntersection = intersections.find(i => i.id === vehicle.currentPath[vehicle.currentPathIndex + 1]);
    
    if (!currentIntersection || !nextIntersection) return;

    if (!currentIntersection.lightGreen && 
        Math.abs(vehicle.x - currentIntersection.x) < 5 && 
        Math.abs(vehicle.y - currentIntersection.y) < 5) {
      vehicle.isWaitingAtLight = true;
      vehicle.waitingTime += 1/60;
      return;
    }

    if (vehicle.isWaitingAtLight && currentIntersection.lightGreen) {
      vehicle.isWaitingAtLight = false;
    }
    const dx = nextIntersection.x - vehicle.x;
    const dy = nextIntersection.y - vehicle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < vehicle.getCurrentSpeed()) {
      vehicle.x = nextIntersection.x;
      vehicle.y = nextIntersection.y;
      vehicle.currentPathIndex++;
      
      if (vehicle.currentPathIndex >= vehicle.currentPath.length - 1) {
        trafficSystem.stats.completedTrips++;
      }
    } else {
      const speed = vehicle.getCurrentSpeed();
      const ratio = speed / distance;
      vehicle.x += dx * ratio;
      vehicle.y += dy * ratio;
    }
  });
}


function drawVehicles() {
  trafficSystem.vehicles.forEach(vehicle => {
    ctx.beginPath();
    ctx.arc(vehicle.x, vehicle.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = vehicle.isWaitingAtLight ? '#e74c3c' : '#e67e22';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (vehicle.isWaitingAtLight) {
      ctx.fillStyle = '#2c3e50';
      ctx.font = '18px Arial';
      ctx.fillText('Waiting', vehicle.x - 20, vehicle.y - 15);
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();

  // Update congestion for all roads
  roads.forEach(road => {
    trafficSystem.updateRoadCongestion(road.id);
  });

  moveVehicles();
  drawVehicles();

  requestAnimationFrame(animate);
}

document.getElementById('startAccidents').addEventListener('click', randomaccident);
document.getElementById('stopAccidents').addEventListener('click',()=>{
  roads.forEach(road => {
    road.isOpen = true;
  }
  );
  drawMap();
} );
function randomaccident() {
  const road = roads[Math.floor(Math.random() * roads.length)];
  road.isOpen = false;
  setTimeout(() => {
    road.isOpen = true;
    drawMap();
  }, 15000);
  drawMap();
}

generateSettingsUI();
drawMap();