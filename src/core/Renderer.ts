import { Point, Circle } from "./Geometry.ts";



/*
	Interfaces
*/
export interface Resolution {
	width: number,
	height: number
}



/*
	Error classes
*/
export class NullError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = "NullError";
	}
}



/*
	Main class
*/
export class Renderer {
	/*
		Attributes
	*/
	private resolution: Resolution;
	private ctx: CanvasRenderingContext2D;


	/*
		Drawing Methods
	*/
	public clear(): void {
		this.ctx.clearRect(0, 0, this.resolution.width, this.resolution.height);
	}



	public drawPoint(
		point: Point,
		color: string = "black",
		width: number = 1
	): void {
		const x: number = point.pos.x;
		const y: number = point.pos.y;

		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(x, y, width, 0, 2*Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}

	public drawPoints(
		points: Point[],
		color: string = "black",
		width: number = 1
	): void {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;

		for (let point of points) {
			const x: number = point.pos.x;
			const y: number = point.pos.y;

			this.ctx.moveTo(x, y);
			this.ctx.arc(x, y, width, 0, 2*Math.PI);
		}

		this.ctx.fill();
		this.ctx.closePath();
	}



	public drawCircle(
		circle: Circle,
		color: string = "black",
		width: number = 1
	): void {
		const x: number = circle.center.pos.x;
		const y: number = circle.center.pos.y;
		const r: number = circle.radius;

		this.ctx.beginPath();
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = width;
		this.ctx.arc(x, y, r, 0, 2*Math.PI);
		this.ctx.stroke();
		this.ctx.closePath();
	}



	/*
		Constructor
	*/
	public constructor(canvas: HTMLCanvasElement, resolution: Resolution) {
		this.resolution = resolution;

		const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
		if (!ctx)
			throw new NullError("Couldn't get context 2d");
		else
			this.ctx = ctx;

		//this.ctx.imageSmoothingEnabled = true;
		//this.ctx.imageSmoothingQuality = "high";
	}
}