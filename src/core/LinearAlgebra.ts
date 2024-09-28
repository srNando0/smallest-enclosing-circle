export class Vector2 {
	public x: number;
	public y: number;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}



	/*
		Methods
	*/
	public clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	public norm(): number {
		return Math.sqrt(this.sqrNorm());
	}

	public sqrNorm(): number {
		return Vector2.dot(this, this);
	}



	/*
		Static Methods
	*/
	public static zero(): Vector2 {
		return new Vector2(0, 0);
	}

	public static random(): Vector2 {
		return new Vector2(Math.random(), Math.random());
	}

	public static add(u: Vector2, v: Vector2): Vector2 {
		return new Vector2(u.x + v.x, u.y + v.y);
	}

	public static sub(u: Vector2, v: Vector2): Vector2 {
		return new Vector2(u.x - v.x, u.y - v.y);
	}

	public static mul(k: number, u: Vector2) {
		return new Vector2(k*u.x, k*u.y);
	}

	public static matmul(m: Matrix2, u: Vector2) {
		return new Vector2(
			m.a[0][0]*u.x + m.a[0][1]*u.y,
			m.a[1][0]*u.x + m.a[1][1]*u.y);
	}

	public static div(u: Vector2, k: number) {
		return Vector2.mul(1/k, u);
	}

	public static dot(u: Vector2, v: Vector2): number {
		return u.x*v.x + u.y*v.y;
	}

	public static lerp(lambda: number, u: Vector2, v: Vector2): Vector2 {
		return Vector2.add(
			Vector2.mul((1 - lambda), u),
			Vector2.mul(lambda, v)
		);
	}

	/*public static min(u: Vector2, v: Vector2): Vector2 {
		const minX = (u.x < v.x) ? u.x : v.x;
		const minY = (u.y < v.y) ? u.y : v.y;
		return new Vector2(minX, minY);
	}

	public static max(u: Vector2, v: Vector2): Vector2 {
		const maxX = (u.x > v.x) ? u.x : v.x;
		const maxY = (u.y > v.y) ? u.y : v.y;
		return new Vector2(maxX, maxY);
	}*/
}



export class Matrix2 {
	public a: number[][];

	public constructor(array: number[][]) {
		this.a = array;
	}


	/*
		Methods
	*/
	public inverse(): Matrix2 {
		const a = this.a[0][0];
		const b = this.a[0][1];
		const c = this.a[1][0];
		const d = this.a[1][1];

		const det: number = a*d - b*c;
		const array: number[][] = [
			[d/det, -b/det],
			[-c/det, a/det]
		];

		return new Matrix2(array);
	}
}