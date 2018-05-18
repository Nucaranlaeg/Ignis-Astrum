// Ships
document.getElementById("templates").innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship0-template" class="ship">
	<polygon id="shp-0" points="25,100 50,0 75,100 25,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship1-template" class="ship">
	<polygon id="shp-1" points="35,100 40,80 20,80 50,0 80,80 60,80 65,100 35,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship2-template" class="ship">
	<polygon id="shp-2" points="25,100 35,60 20,40 40,40 50,0 60,40 80,40 65,60 75,100 25,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship3-template" class="ship">
	<polygon id="shp-3" points="15,100 40,0 50,60 60,0 85,100 15,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship4-template" class="ship">
	<polygon id="shp-4" points="0,100 20,20 30,70 50,0 70,70 80,20 100,100 60,100 63,88 37,88 40,100 0,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship5-template" class="ship">
	<polygon id="shp-5" points="25,100 5,65 35,60 45,20 40,10 50,0 60,10 55,20 65,60 95,65 75,100 25,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship6-template" class="ship">
	<polygon id="shp-6" points="25,100 5,45 35,60 45,20 40,10 50,0 60,10 55,20 65,60 95,45 75,100 25,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship7-template" class="ship">
	<polygon id="shp-7" points="25,100 0,65 5,40 35,60 45,20 40,10 50,0 60,10 55,20 65,60 95,40 100,65 75,100 25,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship8-template" class="ship">
	<polygon id="shp-8" points="25,100 0,75 5,45 35,50 45,25 35,10 50,0 65,10 55,25 65,50 95,45 100,75 75,100 25,100 " />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ship9-template" class="ship">
	<polygon id="shp-9" points="25,100 5,65 0,100 0,40 10,55 35,60 45,25 35,10 50,0 65,10 55,25 65,60 90,55 100,40 100,100 95,65 75,100 25,100 " />
</svg>`;

// abilities
document.getElementById("templates").innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability0-template" class="ability">
	<circle cx="50" cy="50" r="45" fill="transparent" stroke="#000000" stroke-width="2px" />
	<circle cx="50" cy="50" r="30" fill="transparent" stroke="#000000" />
	<circle cx="50" cy="50" r="15" fill="transparent" stroke="#000000" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability1-template" class="ability">
	<ellipse cx="50" cy="50" rx="45" ry="30" fill="transparent" stroke="#000000" stroke-width="2px" />
	<polygon points="35,35 85,50 35,65 35,55 25,60 25,40 35,45 35,35" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability2-template" class="ability">
	<ellipse cx="35" cy="60" rx="20" ry="10" stroke="#000000" stroke-width="2px" fill="transparent" />
	<ellipse cx="35" cy="40" rx="20" ry="10" stroke="#000000" stroke-width="2px" fill="transparent" />
	<polygon points="35,35 85,50 35,65 35,55 25,60 25,40 35,45 35,35" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability3-template" class="ability">
	<ellipse cx="50" cy="50" rx="45" ry="30" stroke="#000000" stroke-width="2px" fill="transparent" />
	<ellipse cx="30" cy="50" rx="10" ry="40" stroke="#0000007f" stroke-width="2px" fill="transparent" />
	<ellipse cx="50" cy="50" rx="10" ry="40" stroke="#0000007f" stroke-width="2px" fill="transparent" />
	<ellipse cx="70" cy="50" rx="10" ry="40" stroke="#0000007f" stroke-width="2px" fill="transparent" />
	<polygon points="35,35 85,50 35,65 35,55 25,60 25,40 35,45 35,35" />
</svg>`;