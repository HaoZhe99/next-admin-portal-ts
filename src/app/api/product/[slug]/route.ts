const pool = require("../../../../../utils/db/db_connect");

interface Product {
  id: string;
  name: string;
  price: number;
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
): Promise<Response> {
  const { slug } = params;

  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      slug,
    ]);

    const product = result.rows[0] as Product | undefined;

    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error("Error getting product:", error);

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
