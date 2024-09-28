import { useState, useEffect, useRef } from "react";
import { ReactNode, RefObject } from "react";

import { Resolution, NullError, Renderer } from "./core/Renderer";
import { Point, Circle } from "./core/Geometry";
import { Matrix2, Vector2 } from "./core/LinearAlgebra";



/*
	Auxiliary Functions
*/
function generateRandomPoint(
	min: Vector2,
	max: Vector2,
): Point {
	const rand: Vector2 = Vector2.random();

	return new Point(new Vector2(
		(1 - rand.x)*min.x + rand.x*max.x,
		(1 - rand.y)*min.y + rand.y*max.y,
	));
}



/*
	Functions
*/
function generatePointsAndCircle(
	renderer: Renderer,
	resolution: Resolution
) {
	const points: Point[] = [];

	// Generate points
	const center: Vector2 = new Vector2(resolution.width/2, resolution.height/2);
	const maxResolution: number = (resolution.height < resolution.width) ? resolution.height : resolution.width;
	const min: Vector2 = Vector2.sub(center, new Vector2(maxResolution/4, maxResolution/4));
	const max: Vector2 = Vector2.add(center, new Vector2(maxResolution/4, maxResolution/4));

	const numOfPoints: number = 1000;
	for (let i = 0; i < numOfPoints; i++) {
		const point: Point = generateRandomPoint(
			min,
			max
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



	// Test
	/*const pointsTest: Point[] = [];
	for (let i = 0; i < 3; i++) {
		const point: Point = generateRandomPoint(
			min,
			max
		);

		pointsTest.push(point);
	}
	renderer.clear();
	renderer.drawPoints(pointsTest, "white", 4);
	const circleTest = Circle.circleWith3Points(pointsTest);
	renderer.drawCircle(circleTest, "red", 2);

	const A: Matrix2 = new Matrix2([
		[5, -4],
		[3, 7]
	])
	const b: Vector2 = new Vector2(9, 2);
	const x: Vector2 = Vector2.matmul(A.inverse(), b);
	console.log(A.inverse().a);
	console.log(`x: ${x.x}, y: ${x.y}`);*/
}



/*
	Main ReactNode
*/
const App = ():ReactNode => {
	const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
	const canvasResolution: Resolution = {
		width: 10*192,
		height: 10*108
	};

	let renderer: Renderer | null;



	const clickGenerate = (): void => {
		if (renderer == null)
			throw new NullError("renderer is null");

		generatePointsAndCircle(renderer, canvasResolution);
	}



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
			renderer = new Renderer(current, canvasResolution);

			generatePointsAndCircle(renderer, canvasResolution);
		} catch (e: unknown) {
			if (e instanceof Error) {
				console.error(e.name);
				console.log(e.message);
			}
		}
	}, [canvasRef]);



	return (
		<>
		<div className='p-2 rounded-xl flex flex-col'>
			<canvas ref={canvasRef} className="w-5/6 self-center bg-black rounded-xl" style = {{imageRendering: "crisp-edges"}}/>
			<button className="p-2 w-1/2 self-center bg-lime-600 rounded-2xl" onClick={clickGenerate}>Generate points!</button>
		</div>
		</>
	);
}

export default App