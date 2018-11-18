/*
 * This file should not be included in a production deploy.
 * Each test should be callable individually and also be included in AllTests().
 * Tests can be destructive of the current game state and should not expect any prior state.
 * For clarity, all tests should be in the Test object and setup function should be in the TestSetup object.
 */

"use strict";

var Test = {};
(function() {
	this.allTests = function() {
		let testData = [];
		let tests = [
			this.battleLineTest
		];
		let successful = 0;
		console.log("Running tests...");
		
		tests.forEach(test => {
			try {
				let results = test();
				testData = testData.concat(results);
				successful++;
			} catch (e) {
				testData.push(e);
			}
		});
		
		console.log("All tests complete.");
		console.log(successful + "/" + tests.length + " tests successful");
		console.log(testData);
	};
	
	this.battleLineTest = function() {
		let maxLength = 6;
		// These ships should potentially be adjusted so that they're more similar so
		// the test is more likely to fail if the function is broken
		// Also don't make this list longer without only getting a portion of the permutations - there are n! possible.
		let ships = [
			TestSetup.buildShip(3,3,3,1,3,5,true,true,null,null,null,null,null,null,null,1,[]),
			TestSetup.buildShip(6,6,6,2,6,5,true,true,null,null,null,null,null,null,null,2,[]),
			TestSetup.buildShip(3,3,3,1,3,5,true,false,null,null,null,null,null,null,null,3,[]),
			TestSetup.buildShip(5,5,5,0,1,5,true,false,null,null,null,null,null,null,null,4,[]),
			TestSetup.buildShip(8,8,8,1,1,12,true,false,null,null,null,null,null,null,null,5,[]),
			TestSetup.buildShip(10,10,10,1,1,16,true,false,null,null,null,null,null,null,null,6,[]),
			TestSetup.buildShip(15,15,15,2,1,24,true,false,null,null,null,null,null,null,null,7,[]),
			TestSetup.buildShip(8,6,6,2,0,12,true,false,null,null,null,null,null,null,null,8,[])
		];
		let output = Wasm.getBattleLine(ships).map(s => s.id);
		if (output.length > maxLength) throw "Battle Line Test: Test battle line too long.";
		let shipOrders = TestSetup.permutator(ships);
		
		shipOrders.forEach((o, index) => {
			let testOutput = Wasm.getBattleLine(o).map(s => s.id);
			if (testOutput.length !== maxLength) throw "Battle Line Test: Permutation #" + index + " too long.";
			for (var i = 0; i < output.length; i++){
				if (output[i] !== testOutput[i]) throw "Battle Line Test: Permutation #" + index + " differs from the first result at index " + i + ".";
			}
		});
		
		return ["Battle Line Test successful"];
	};
}).apply(Test);

var TestSetup = {};
(function() {
	this.buildShip = function (power, maxHull, currentHull, shield, repair, cost, allied, isBase, assault, range, centralDisplay, upgradeable, upgradeTo, shipClass, hullClass, id, abilities) {
		return {
			power: power,
			maxHull: maxHull,
			currentHull: currentHull,
			shield: shield,
			repair: repair,
			cost: cost,
			allied: allied,
			isBase: isBase,
			assault: assault,
			range: range,
			centralDisplay: centralDisplay,
			upgradeable: upgradeable,
			upgradeTo: upgradeTo,
			shipClass: shipClass,
			hullClass: hullClass,
			id: id,
			abilities: abilities
		};
	};
	
	this.permutator = function (inputArr) {
		let result = [];

		function permute(arr, m = []) {
			if (arr.length === 0) {
				result.push(m)
			} else {
				for (let i = 0; i < arr.length; i++) {
					let curr = arr.slice();
					let next = curr.splice(i, 1);
					permute(curr.slice(), m.concat(next))
				}
			}
		}

		permute(inputArr)

		return result;
	};
}).apply(TestSetup);