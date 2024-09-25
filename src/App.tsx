import { useState, useEffect, useRef } from "react";
import { ReactNode, RefObject } from "react";



const App = ():ReactNode => {
	const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

	return (
		<>
		<div className = 'p-2 rounded-xl flex justify-center'>
			<canvas ref = {canvasRef} className = "w-5/6" style = {{imageRendering: "pixelated"}}/>
		</div>
		</>
	);
}

export default App
