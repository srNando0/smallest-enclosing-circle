import { ReactNode } from "react";



const App = ():ReactNode => {
	return (
		<>
		<h1>The quick brown fox jumps over the lazy dog</h1>
		<div className = 'p-2 rounded-xl flex justify-center'>
			<canvas className = "w-5/6" style = {{imageRendering: "pixelated"}}/>
		</div>
		</>
	);
}

export default App
