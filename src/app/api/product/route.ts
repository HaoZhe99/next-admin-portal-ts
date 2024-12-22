const { isEmpty } = require("lodash");
const pool = require("../../../../utils/db/db_connect");

interface Product {
  id?: number;
  name: string;
  price: number;
  status: string;
  image: string;
}

export async function GET(): Promise<Response> {
  try {
    const result = await pool.query("SELECT * FROM products");
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error get product:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { name, price, status, image }: Product = await req.json();

    if (!name || !status || !price || !image) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 },
      );
    }

    const result = await pool.query(
      "INSERT INTO products (name, price, status, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price, status, image],
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request): Promise<Response> {
  try {
    const { id, name, price, status, image }: Product = await req.json();

    if (!id || !name || !status || !price || !image) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 },
      );
    }

    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, status = $3, image = $4 WHERE id = $5 RETURNING *",
      [name, price, status, image, id],
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id") || "", 10);

    if (isNaN(id) || id <= 0) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
      });
    }

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
