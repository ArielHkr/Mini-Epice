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