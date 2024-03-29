import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);

const earthGeometry = new THREE.SphereGeometry(20, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: true });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Coordinates of the countries (latitude and longitude)
const countries = [
    { name: "Netherlands", lat: 52.3676, lon: 4.9041 },
    { name: "Belgium", lat: 50.8503, lon: 4.3517 },
    { name: "Germany", lat: 51.1657, lon: 10.4515 },
    { name: "Austria", lat: 47.5162, lon: 14.5501 },
    { name: "Sweden", lat: 60.1282, lon: 18.6435 },
    { name: "Finland", lat: 61.9241, lon: 25.7482 },
    { name: "Norway", lat: 60.472, lon: 8.4689 },
    { name: "Denmark", lat: 56.2639, lon: 9.5018 },
    { name: "United Kingdom", lat: 51.509865, lon: -0.118092 }
];

//convert latitude and longitude to 3D coordinates
function latLongToVector3(lat, lon, radius) {
    const phi = (lat * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    const x = -radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

//markers
const countryMarkers = [];
const countryLabels = [];
countries.forEach(country => {
    const position = latLongToVector3(country.lat, country.lon, 20);
    const markerGeometry = new THREE.CircleGeometry(0.5, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    //set marrker
    marker.position.copy(position);

    //camera
    marker.lookAt(camera.position);
    
    earthMesh.add(marker);
    countryMarkers.push(marker);

    // Create label element
    const label = document.createElement('div');
    label.className = 'country-label';
    label.textContent = country.name;
    label.style.position = 'absolute';
    label.style.top = '10px'; 
    label.style.left = '50%'; 
    label.style.transform = 'translateX(-50%)'; 
    label.style.display = 'none';
    document.body.appendChild(label);
    countryLabels.push(label);
});

//Function to update camera position and show label for the focused country
function updateCameraPosition(country) {
    const position = latLongToVector3(country.lat, country.lon, 30);
    camera.position.copy(position);
    camera.lookAt(scene.position); //Make camera look at the center of the scene
    
    // Show label for the focused country and hide others
    countryLabels.forEach((label, index) => {
        if (countries[index].name === country.name) {
            label.style.display = 'block';
        } else {
            label.style.display = 'none';
        }
    });
}

// Initial camera position
updateCameraPosition(countries[0]);

// Animation loop
let currentIndex = 0;
function animate() {
    requestAnimationFrame(animate);
    // earthMesh.rotation.x += 0.01;
    // earthMesh.rotation.y += 0.005;
    // earthMesh.rotation.z += 0.01;
    
    countryMarkers.forEach(marker => {
        // Orient the markers to face the camera
        marker.lookAt(camera.position);
    });
    
    renderer.render(scene, camera);
    
    // Change camera position every 1 second
    const nextIndex = (currentIndex + 1) % countries.length;
    setTimeout(() => {
        updateCameraPosition(countries[nextIndex]);
        currentIndex = nextIndex;
    }, 1000);
}

animate();
