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

export async function updateItem(id, { name, quantity, unitPrice }) {
  const { rows } = await db.query(
    `UPDATE items
     SET name = $1,
         quantity = $2,
         unit_price = $3
     WHERE id = $4
     RETURNING id, name, quantity, unit_price AS "unitPrice"`,
    [name, quantity, unitPrice, id]
  );

  return rows[0] ?? null;
}
export async function deleteItem(id) {
  const { rows } = await db.query(
    `DELETE FROM items
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return rows[0] ?? null;
}
