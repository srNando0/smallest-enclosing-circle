export class Vector2D {
	public x: number;
	public y: number;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}



	/*
		Methods
	*/
	public clone(): Vector2D {
		return new Vector2D(this.x, this.y);
	}

	public length(): number {
		return Math.sqrt(this.sqrLength());
	}

	public sqrLength(): number {
		return Vector2D.dot(this, this);
	}



	/*
		Static Methods
	*/
	public static zero(): Vector2D {
		return new Vector2D(0, 0);
	}

	public static random(): Vector2D {
		return new Vector2D(Math.random(), Math.random());
	}

	public static add(u: Vector2D, v: Vector2D): Vector2D {
		return new Vector2D(u.x + v.x, u.y + v.y);
	}

	public static sub(u: Vector2D, v: Vector2D): Vector2D {
		return new Vector2D(u.x - v.x, u.y - v.y);
	}

	public static mul(k: number, u: Vector2D) {
		return new Vector2D(k*u.x, k*u.y);
	}

	public static div(u: Vector2D, k: number) {
		return Vector2D.mul(1/k, u);
	}

	public static dot(u: Vector2D, v: Vector2D): number {
		return u.x*v.x + u.y*v.y;
	}

	public static lerp(lambda: number, u: Vector2D, v: Vector2D): Vector2D {
		return Vector2D.add(
			Vector2D.mul((1 - lambda), u),
			Vector2D.mul(lambda, v)
		);
	}

	/*public static min(u: Vector2D, v: Vector2D): Vector2D {
		const minX = (u.x < v.x) ? u.x : v.x;
		const minY = (u.y < v.y) ? u.y : v.y;
		return new Vector2D(minX, minY);
	}

	public static max(u: Vector2D, v: Vector2D): Vector2D {
		const maxX = (u.x > v.x) ? u.x : v.x;
		const maxY = (u.y > v.y) ? u.y : v.y;
		return new Vector2D(maxX, maxY);
	}*/
}