import db from "../config/db.mjs";

export async function findAllItems() {
     const { rows } = await db.query(`
      SELECT id, name, quantity, unit_price AS "unitPrice"
      FROM items
      ORDER BY id
    `);

    return rows;
  }

export async function findById(id) {
  const { rows } = await db.query(
    `SELECT id, name, quantity, unit_price AS "unitPrice"
     FROM items
     WHERE id = $1`,
    [id]
  );

  return rows[0] ?? null;
}
export async function createItem({ name, quantity, unitPrice }) {
  const { rows } = await db.query(
    `INSERT INTO items (name, quantity, unit_price)
     VALUES ($1, $2, $3)
     RETURNING id, name, quantity, unit_price AS "unitPrice"`,
    [name, quantity, unitPrice]
  );

  return rows[0];
}