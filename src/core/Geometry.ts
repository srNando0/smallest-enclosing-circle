import { Vector2, Matrix2 } from "./LinearAlgebra";



export class Point {
	public pos: Vector2;

	public constructor(pos: Vector2) {
		this.pos = pos;
	}



	/*
		Static Methods
	*/
	public static add(p: Point, u: Vector2): Point {
		return new Point(Vector2.add(p.pos, u));
	}

	public static sub(p1: Point, p2: Point): Vector2 {
		return Vector2.sub(p1.pos, p2.pos);
	}

	public static distance(p1: Point, p2: Point): number {
		return Vector2.sub(p1.pos, p2.pos).length();
	}

	public static sqrDistance(p1: Point, p2: Point): number {
		return Vector2.sub(p1.pos, p2.pos).sqrLength();
	}

	public static lerp(lambda: number, p1: Point, p2: Point): Point {
		return new Point(Vector2.lerp(lambda, p1.pos, p2.pos));
	}

	/*public static supportMapping(direction: Vector2, points: Point[]): Point {
		if (points.length == 0)
			throw new Error("Empty list in Point.supportMapping");

		let supportPoint: Point = points[0];
		let maxDot: number = Vector2.dot(direction, supportPoint.pos);

		for (let point of points) {
			const dot: number = Vector2.dot(direction, point.pos);
			if (dot > maxDot) {
				supportPoint = point;
				maxDot = dot;
			}
		}

		return supportPoint;
	}*/
}



export class Circle {
	private static readonly EPSILON = 0.0001;

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
		return (Point.sqrDistance(this.center, point) <= this.radius*this.radius + Circle.EPSILON);
	}



	/*
		Static Methods
	*/
	public static circleWith2Points(points: Point[]): Circle {
		if (points.length != 2)
			throw new Error("Number of points different than 2 in Circle.circleWith2Points");

		return new Circle(
			Point.lerp(0.5, points[0], points[1]),
			Point.distance(points[0], points[1])/2
		);
	}



	public static circleWith3Points(points: Point[]): Circle {
		if (points.length != 3)
			throw new Error("Number of points different than 2 in Circle.circleWith2Points");

		const p1_p0: Vector2 = Point.sub(points[1], points[0]);
		const p2_p0: Vector2 = Point.sub(points[2], points[0]);

		const A: Matrix2 = new Matrix2([
			[2*p1_p0.x, 2*p1_p0.y],
			[2*p2_p0.x, 2*p2_p0.y]
		]);
		const b: Vector2 = new Vector2(
			Vector2.dot(p1_p0, p1_p0),
			Vector2.dot(p2_p0, p2_p0)
		);

		const center: Point = Point.add(
			points[0],
			Vector2.matmul(A.inverse(), b)
		);
		const radius: number = Math.max(
			Point.distance(center, points[0]),
			Point.distance(center, points[1]),
			Point.distance(center, points[2])
		)

		return new Circle(center, radius);
	}



	public static heuristicEnclosingCircle(points: Point[]): Circle {
		// Special case
		if (points.length == 0) {
			return new Circle(new Point(Vector2.zero()), 0);
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



	public static welzl(P: Point[], R: Point[]): Circle {
		// Base cases
		if (P.length == 0) {
			if (R.length == 0)
				return new Circle(new Point(Vector2.zero()), 0);

			if (R.length == 1)
				return new Circle(R[0], 0);

			if (R.length == 2)
				return Circle.circleWith2Points(R);
		}

		if (R.length == 3)
			return Circle.circleWith3Points(R);



		// Recursion
		const P_: Point[] = [...P];

		const p: Point = P_.pop()!;
		const D: Circle = Circle.welzl(P_, R);

		if (D.isPointInside(p))
			return D;

		const R_: Point[] = [...R, p];
		return Circle.welzl(P_, R_);
	}



	public static smallestEnclosingCircle(points: Point[]): Circle {
		// Fisher–Yates shuffle
		const P: Point[] = [...points];

		for (let size = P.length; size > 0; size--) {
			const i: number = size - 1;
			const j: number = Math.floor(Math.random()*size);

			const temp: Point = P[i];
			P[i] = P[j];
			P[j] = temp;
		}

		return Circle.welzl(P, []);
	}
}