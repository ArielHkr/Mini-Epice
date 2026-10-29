import db from "../config/db.mjs";

export async function createUser({ name, email, passwordHash }) {
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role`,
    [name.trim(), email.trim().toLowerCase(), passwordHash]
  );

  return rows[0];
}

export async function findByEmail(email) {
  const { rows } = await db.query(
    `SELECT id, name, email, password_hash AS "passwordHash", role
     FROM users
     WHERE email = $1`,
    [email.trim().toLowerCase()]
  );

  return rows[0] ?? null;
}

export async function findById(id) {
  const { rows } = await db.query(
    `SELECT id, name, email, role
     FROM users
     WHERE id = $1`,
    [id]
  );

  return rows[0] ?? null;
}