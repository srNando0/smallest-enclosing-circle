import { useState, useEffect, useRef } from "react";
import { ReactNode, RefObject } from "react";

import { Resolution, NullError, Renderer } from "./core/Renderer";
import { Point, Circle } from "./core/Geometry";
import { Vector2D } from "./core/LinearAlgebra";



/*
	Auxiliary Functions
*/
function generateRandomPoint(
	min: Vector2D,
	max: Vector2D,
): Point {
	const rand: Vector2D = Vector2D.random();

	return new Point(new Vector2D(
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
	const center: Vector2D = new Vector2D(resolution.width/2, resolution.height/2);
	const maxResolution = (resolution.height < resolution.width) ? resolution.height : resolution.width;
	const min: Vector2D = Vector2D.sub(center, new Vector2D(maxResolution/4, maxResolution/4));
	const max: Vector2D = Vector2D.add(center, new Vector2D(maxResolution/4, maxResolution/4));

	const numOfPoints: number = 100;
	for (let i = 0; i < numOfPoints; i++) {
		const point: Point = generateRandomPoint(
			min,
			max
		);

		points.push(point);
	}

	renderer.clear();

	// Draw points
	renderer.drawPoints(points, "white", 4);

	// Generate an enclosing circles
	const enclosingCircle = Circle.heuristicEnclosingCircle(points);
	renderer.drawCircle(enclosingCircle, "red", 2);
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
			throw new NullError("pathTracer is null");

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