import { useState, useEffect, useRef } from "react";
import { ReactNode, RefObject } from "react";

import { Resolution, NullError, Renderer } from "./core/Renderer";
import { Point, Circle } from "./core/Geometry";
import { Vector2 } from "./core/LinearAlgebra";



/*
	Interfaces
*/
interface RadiusInfo {
	heuristic: number,
	smallest: number
}

interface TestInfo {
	generatePoints: {
		numberOfPoints: number,
		time: number
	},
	heuristic: {
		time: number,
		radius: number
	},
	smallest: {
		time: number,
		radius: number
	}
}



/*
	Auxiliary Functions
*/
/*function generateRandomPointSquare(
	min: Vector2,
	max: Vector2,
): Point {
	const rand: Vector2 = Vector2.random();

	return new Point(new Vector2(
		(1 - rand.x)*min.x + rand.x*max.x,
		(1 - rand.y)*min.y + rand.y*max.y,
	));
}*/

function generateRandomPointNormal(
	center: Point,
	std: number,
): Point {
	const rand: Vector2 = Vector2.random();

	// Box–Muller transform
	const phi: number = 2*Math.PI*rand.x;
	const r: number = std*Math.sqrt(-2*Math.log(rand.y));

	return Point.add(
		center,
		new Vector2(r*Math.cos(phi), r*Math.sin(phi))
	);
}



/*
	Functions
*/
function generatePointsAndCircle(
	renderer: Renderer,
	resolution: Resolution,
	numberOfPoints: number
): RadiusInfo {
	const points: Point[] = [];

	// Generate points
	const center: Point = new Point(new Vector2(resolution.width/2, resolution.height/2));
	const maxResolution: number = (resolution.height < resolution.width) ? resolution.height : resolution.width;
	//const min: Vector2 = Vector2.sub(center, new Vector2(maxResolution/4, maxResolution/4));
	//const max: Vector2 = Vector2.add(center, new Vector2(maxResolution/4, maxResolution/4));

	for (let i = 0; i < numberOfPoints; i++) {
		const point: Point = generateRandomPointNormal(
			center,
			maxResolution/8
		);

		points.push(point);
	}

	renderer.clear();

	// Generate an enclosing circle
	const enclosingCircle: Circle = Circle.heuristicEnclosingCircle(points);
	renderer.drawCircle(enclosingCircle, "blue", 2);

	// Generate the smallest enclosing circle
	const sec: Circle = Circle.smallestEnclosingCircle(points);
	renderer.drawCircle(sec, "yellow", 2);

	// Draw points
	renderer.drawPoints(points, "white", 4);



	return {
		heuristic: enclosingCircle.radius,
		smallest: sec.radius
	};
}



function testAlgorithms(numberOfPoints: number): TestInfo {
	const points: Point[] = [];

	let timestampStart: DOMHighResTimeStamp;
	let timestampFinish: DOMHighResTimeStamp;

	let testInfo: TestInfo = {
		generatePoints: {
			numberOfPoints: 0,
			time: 0
		},
		heuristic: {
			time: 0,
			radius: 0
		},
		smallest: {
			time: 0,
			radius: 0
		}
	};



	// Generate points
	const center: Point = new Point(Vector2.zero());
	
	timestampStart = performance.now();
	for (let i = 0; i < numberOfPoints; i++) {
		const point: Point = generateRandomPointNormal(
			center,
			1
		);

		points.push(point);
	}
	timestampFinish = performance.now();

	testInfo.generatePoints = {
		numberOfPoints: numberOfPoints,
		time: timestampFinish - timestampStart
	};



	// Generate an enclosing circle
	timestampStart = performance.now();
	const enclosingCircle: Circle = Circle.heuristicEnclosingCircle(points);
	timestampFinish = performance.now();

	testInfo.heuristic = {
		time: timestampFinish - timestampStart,
		radius: enclosingCircle.radius
	};



	// Generate the smallest enclosing circle
	timestampStart = performance.now();
	const sec: Circle = Circle.smallestEnclosingCircle(points);
	timestampFinish = performance.now();

	testInfo.smallest = {
		time: timestampFinish - timestampStart,
		radius: enclosingCircle.radius
	};



	return testInfo;
}



/*
	Main ReactNode
*/
const App = ():ReactNode => {
	/*
		Variables
	*/
	const canvasResolution: Resolution = {
		width: 10*192,
		height: 10*108
	};



	/*
		Functions
	*/
	const clickGenerate = (): void => {
		if (renderer.current == null)
			throw new NullError("renderer is null");

		setRadiusInfo(generatePointsAndCircle(renderer.current, canvasResolution, numberOfPoints));
	}

	const clickTest = (): void => {
		const numberOfTests = 100;
		const numberOfSamples = 100;
		const numbersOfPoints: number[] = [];
		const heuristics: number[] = [];
		const smallests: number[] = [];

		for (let i = 1; i <= numberOfTests; i++) {
			const numberOfPoints: number = (1000/numberOfTests)*i;
			numbersOfPoints.push(numberOfPoints);

			let heristic: number = 0;
			let smallest: number = 0;
			for (let j = 0; j < numberOfSamples; j++) {
				const testInfo: TestInfo = testAlgorithms(numberOfPoints);

				heristic += testInfo.heuristic.time;
				smallest += testInfo.smallest.time;
			}
			heristic /= numberOfSamples;
			smallest /= numberOfSamples;

			heuristics.push(heristic);
			smallests.push(smallest);

			console.log(`points: ${numberOfPoints}, heuristic: ${heristic}, smallest: ${smallest}`);
		}

		console.log(numbersOfPoints);
		console.log(heuristics);
		console.log(smallests);
	}



	/*
		Hooks
	*/
	const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
	const renderer = useRef<Renderer | null>(null);

	const [radiusInfo, setRadiusInfo] = useState<{heuristic: number, smallest: number}>({
		heuristic: 0,
		smallest: 0
	});
	const [numberOfPoints, setNumberOfPoints] = useState<number>(100);

	useEffect(() => {
		// Exit if the canvas is not loaded yet
		if (canvasRef.current == null)
			return;
		const current = canvasRef.current;

		// resize canvas
		current.width = canvasResolution.width;
		current.height = canvasResolution.height;

		// Create a Renderer and call the main function
		try {
			renderer.current = new Renderer(current, canvasResolution);

			setRadiusInfo(generatePointsAndCircle(renderer.current, canvasResolution, numberOfPoints));
		} catch (e: unknown) {
			if (e instanceof Error) {
				console.error(e.name);
				console.log(e.message);
			}
		}
	}, [canvasRef]);



	return (
		<>
		<div className='p-2 rounded-xl flex flex-col text-center text-xl'>
			<div className="flex flex-1 justify-center items-center">
				<h1 className="flex-1 text-blue-600">Heuristic: {radiusInfo.heuristic}</h1>
				<button
					className="p-2 text-base border-2 border-slate-700 rounded-2xl"
					onClick={clickTest}
				>
					Do test
				</button>
				<h1 className="flex-1 text-yellow-500">Smallest: {radiusInfo.smallest}</h1>
			</div>
			<canvas ref={canvasRef} className="w-3/4 self-center bg-black rounded-xl" style={{imageRendering: "crisp-edges"}}/>
			<button
				className="p-2 w-1/2 self-center bg-lime-600 rounded-2xl"
				onClick={clickGenerate}
			>
				Generate points!
			</button>
			<div className="flex justify-center">
				<input
					className="w-1/4"
					type="range"
					min="2"
					max="1000"
					value={numberOfPoints}
					onChange={(e) => setNumberOfPoints(Number(e.target.value))}
				/>
				<input
					className="m-2 p-1 w-14
					bg-gray-500 border-0 rounded-2xl
					focus:outline-none focus:ring-lime-600 focus:border-lime-600 focus:ring-2
					[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					style={{WebkitAppearance: "none"}}
					type="number"
					min="2"
					max="1000"
					value={numberOfPoints}
					onChange={(e) => setNumberOfPoints(Number(e.target.value))}
				/>
			</div>
		</div>
		</>
	);
}

export default App