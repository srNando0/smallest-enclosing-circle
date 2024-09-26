export class Vector2D {
	public readonly x: number;
	public readonly y: number;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}



	/*
		Static Methods
	*/
	public static zero(): Vector2D {
		return new Vector2D(0, 0);
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

	public static dot(u: Vector2D, v: Vector2D): Vector2D {
		return new Vector2D(u.x*v.x, u.y*v.y);
	}
}