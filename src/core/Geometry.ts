import { Vector2D } from "./LinearAlgebra";



export class Point {
	public pos: Vector2D;

	public constructor(pos: Vector2D) {
		this.pos = pos;
	}



	/*
		Static Methods
	*/
	public static distance(point1: Point, point2: Point): number {
		return Vector2D.sub(point1.pos, point2.pos).length();
	}

	public static lerp(lambda: number, point1: Point, point2: Point): Point {
		return new Point(Vector2D.lerp(lambda, point1.pos, point2.pos));
	}

	/*public static supportMapping(direction: Vector2D, points: Point[]): Point {
		if (points.length == 0)
			throw new Error("Empty list in Point.supportMapping");

		let supportPoint: Point = points[0];
		let maxDot: number = Vector2D.dot(direction, supportPoint.pos);

		for (let point of points) {
			const dot: number = Vector2D.dot(direction, point.pos);
			if (dot > maxDot) {
				supportPoint = point;
				maxDot = dot;
			}
		}

		return supportPoint;
	}*/
}



export class Circle {
	public center: Point;
	public radius: number;
	
	public constructor(center: Point, radius: number) {
		this.center = center;
		this.radius = radius;
	}



	/*
		Methods
	*/
	public isPointInside(point: Point): boolean {
		return (Point.distance(this.center, point) <= this.radius);
	}



	/*
		Static Methods
	*/
	public static heuristicEnclosingCircle(points: Point[]): Circle {
		// Special case
		if (points.length == 0) {
			return new Circle(new Point(Vector2D.zero()), 0);
		}

		// Getting points of minimum/maximum coordinates for each axis
		let minXPoint: Point = points[0];
		let maxXPoint: Point = points[0];
		let minYPoint: Point = points[0];
		let maxYPoint: Point = points[0];

		for (let point of points) {
			if (point.pos.x < minXPoint.pos.x)
				minXPoint = point;

			if (point.pos.x > maxXPoint.pos.x)
				maxXPoint = point;

			if (point.pos.y < minYPoint.pos.y)
				minYPoint = point;

			if (point.pos.y > maxYPoint.pos.y)
				maxYPoint = point;
		}

		// Computing distance between each pair of points
		const distanceX: number = Point.distance(minXPoint, maxXPoint);
		const distanceY: number = Point.distance(minYPoint, maxYPoint);

		let centerX: Point = Point.lerp(0.5, minXPoint, maxXPoint);
		let centerY: Point = Point.lerp(0.5, minYPoint, maxYPoint);

		// Setting a initial center point and radius
		let circle: Circle;

		if (distanceX > distanceY)
			circle = new Circle(Point.lerp(0.5, minXPoint, maxXPoint), distanceX/2);
		else
			circle = new Circle(Point.lerp(0.5, minYPoint, maxYPoint), distanceY/2);

		// Enlarging the circle
		for (let point of points) {
			const distance: number = Point.distance(circle.center, point);

			if (circle.radius < distance)
				circle.radius = distance;
		}

		return circle;
	}
}