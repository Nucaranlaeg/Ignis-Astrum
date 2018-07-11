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

// Abilities
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
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability4-template" class="ability">
	<circle cx="50" cy="50" r="45" fill="transparent" stroke="#000000" stroke-width="4px" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability5-template" class="ability">
	<circle cx="50" cy="50" r="45" fill="transparent" stroke="#000000" stroke-width="4px" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability6-template" class="ability">
	<circle cx="50" cy="50" r="45" fill="transparent" stroke="#000000" stroke-width="4px" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability7-template" class="ability">
	<circle cx="50" cy="50" r="45" fill="transparent" stroke="#000000" stroke-width="4px" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="40px" id="ability8-template" class="ability">
	<circle cx="50" cy="50" r="45" fill="transparent" stroke="#000000" stroke-width="4px" />
</svg>`;

// Bases
document.getElementById("templates").innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 115.565" width="40px" id="ship10-template" class="ship">
	<path
	   d="m 61.937095,62.654185 c 8.85908,15.31383 22.90558,21.29743 28.39113,27.12893 5.48556,5.8315 8.73922,7.864196 8.67071,7.982596 -0.0685,0.1184 -3.45914,-1.677496 -11.26221,-3.502896 -7.80308,-1.8255 -20.01856,-10.9743 -37.73673,-10.9743 -17.718157,10e-5 -29.933643,9.1488 -37.736715,10.9743 -7.8030668,1.8254 -11.1937198,3.621296 -11.2622198,3.502896 -0.06849,-0.1184 3.1851601,-2.151096 8.670715,-7.982596 5.4855538,-5.8315 19.5321548,-11.815 28.3912368,-27.12893 8.859083,-15.3139 7.027964,-30.44618 9.345483,-38.10312 2.31752,-7.65694 2.45451,-11.4854 2.59151,-11.48541 0.137,0 0.27399,3.82847 2.59151,11.48542 2.31751,7.65693 0.4865,22.78915 9.34558,38.10311 z"
	   id="bse-0" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 115.565" width="40px" id="ship11-template" class="ship">
	<g
	   id="bse-1"
	   transform="matrix(0.86470886,0,0,0.86470978,-129.57104,-804.13322)">
	  <path
		 id="path3782-1"
		 d="m 221.47122,994.06694 c 10.2452,17.71726 26.4894,24.63996 32.8332,31.38676 6.3438,6.7467 10.1065,9.0984 10.0273,9.2354 -0.079,0.137 -4.0003,-1.9407 -13.0243,-4.0526 -9.0239,-2.112 -23.1506,-12.6967 -43.6409,-12.6967 -20.4904,10e-5 -34.6171,10.5847 -43.641,12.6967 -9.0239,2.1119 -12.9451,4.1896 -13.0243,4.0526 -0.079,-0.137 3.6835,-2.4887 10.0273,-9.2354 6.3439,-6.7468 22.5882,-13.6694 32.8333,-31.38676 10.2452,-17.71744 8.1276,-35.22473 10.8077,-44.08342 2.6801,-8.85869 2.8385,-13.28803 2.997,-13.28804 0.1584,0 0.3168,4.42935 2.9969,13.28805 2.6802,8.85868 0.5627,26.36591 10.8078,44.08341 z" />
	  <circle r="45" fill="transparent" stroke-width="5px" cx="209" cy="1000"></circle>
	</g>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 115.565" width="40px" id="ship12-template" class="ship">
	<g
	   id="bse-2"
	   transform="matrix(0.86470972,0,0,0.86470972,-199.32436,-804.13318)">
	  <path
		 id="path3782-1-4"
		 d="m 302.13782,994.06694 c 10.2452,17.71726 26.4894,24.63996 32.8332,31.38676 6.3438,6.7467 10.1065,9.0984 10.0273,9.2354 -0.079,0.137 -4.0003,-1.9407 -13.0243,-4.0526 -9.0239,-2.112 -23.1506,-12.6967 -43.6409,-12.6967 -20.4904,10e-5 -34.6171,10.5847 -43.641,12.6967 -9.0239,2.1119 -12.9451,4.1896 -13.0243,4.0526 -0.079,-0.137 3.6835,-2.4887 10.0273,-9.2354 6.3439,-6.7468 22.5882,-13.6694 32.8333,-31.38676 10.2452,-17.71744 8.1276,-35.22473 10.8077,-44.08342 2.6801,-8.85869 2.8385,-13.28803 2.997,-13.28804 0.1584,0 0.3168,4.42935 2.9969,13.28805 2.6802,8.85868 0.5627,26.36591 10.8078,44.08341 z" />
	  <circle r="45" fill="transparent" stroke-width="5px" cx="288" cy="1000"></circle>
	  <circle fill="transparent" stroke-width="5px" cy="1000" cx="288" r="33"></circle>
	</g>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 115.565" width="40px" id="ship13-template" class="ship">
	<g
	   id="bse-3"
	   transform="matrix(0.86470978,0,0,0.86470978,-299.05429,-794.54931)">
	  <path
		 id="path3782-1-4-8"
		 d="m 417.47122,977.40092 c 10.2452,17.71726 26.4894,24.63998 32.8332,31.38678 6.3438,6.7467 10.1065,9.0984 10.0273,9.2354 -0.079,0.137 -4.0003,-1.9407 -13.0243,-4.0526 -9.0239,-2.112 -23.1506,-12.6967 -43.6409,-12.6967 -20.4904,10e-5 -34.6171,10.5847 -43.641,12.6967 -9.0239,2.1119 -12.9451,4.1896 -13.0243,4.0526 -0.079,-0.137 3.6835,-2.4887 10.0273,-9.2354 6.3439,-6.7468 22.5882,-13.66942 32.8333,-31.38678 10.2452,-17.71744 8.1276,-35.22473 10.8077,-44.08342 2.6801,-8.85869 2.8385,-13.28803 2.997,-13.28804 0.1584,0 0.3168,4.42935 2.9969,13.28805 2.6802,8.85868 0.5627,26.36591 10.8078,44.08341 z" />
	  <circle r="45" fill="transparent" stroke-width="5px" cx="404" cy="985"></circle>
	  <circle fill="transparent" stroke-width="5px" r="33" cx="404" cy="985"></circle>
	  <path
		 id="path3782-1-4-8-5"
		 d="m 417.47122,993.99078 c 10.2452,-17.7173 26.4894,-24.64 32.8332,-31.3868 6.3438,-6.7467 10.1065,-9.0984 10.0273,-9.2354 -0.079,-0.137 -4.0003,1.9407 -13.0243,4.0526 -9.0239,2.112 -23.1506,12.6967 -43.6409,12.6967 -20.4904,-10e-5 -34.6171,-10.5847 -43.641,-12.6967 -9.0239,-2.1119 -12.9451,-4.1896 -13.0243,-4.0526 -0.079,0.137 3.6835,2.4887 10.0273,9.2354 6.3439,6.7468 22.5882,13.6694 32.8333,31.3868 10.2452,17.71742 8.1276,35.22472 10.8077,44.08342 2.6801,8.8587 2.8385,13.288 2.997,13.288 0.1584,0 0.3168,-4.4293 2.9969,-13.288 2.6802,-8.8587 0.5627,-26.3659 10.8078,-44.08342 z" />
	</g>
</svg>`;