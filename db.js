const pg = require('pg')
const {Client} = pg

const client = new Client('https://localhost/acme_bakery')

client.connect()

const sync = async() => {
  const sql = `
    DROP TABLE IF EXISTS chefs cascade;
    DROP TABLE IF EXISTS recipes; 
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    CREATE TABLE chefs(
      id UUID PRIMARY KEY UNIQUE default uuid_generate_v4(),
      name VARCHAR UNIQUE NOT NULL,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE recipes(
      id UUID PRIMARY KEY UNIQUE default uuid_generate_v4(),
      name VARCHAR UNIQUE NOT NULL,
      steps json,
      ingrediants json,
      chef_id UUID REFERENCES chefs(id) NOT NULL,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    

  `
  await client.query(sql)
}

const getChefs = async() => {
  const sql = `SELECT * FROM chefs`
  const response = await client.query(sql)
  return response.rows
}

const getRecipes = async() => {
  const sql = `SELECT * FROM recipes`
  const response = await client.query(sql)
  return response.rows
}

const createChefs = async(name, id) => {
  const sql = `INSERT INTO chefs(name) VALUES($1) returning *`
  const response = await client.query(sql, [name])
  return response.rows[0]
} 

const createRecipes = async(name, id) => {
  const sql = `INSERT INTO recipes(name, chef_id) VALUES($1, $2) returning *`
  const response = await client.query(sql, [name, id])
  return response.rows[0]
}

const deleteChefs = async(id) => {
  const sql = `DELETE FROM chefs WHERE id = $1`
  await client.query(sql, [id])
}

const deleteRecipes = async(id) => {
  const sql = `DELETE FROM recipes WHERE id = $1`
  await client.query(sql, [id])
}

const updateChef = async(name, id) => {
  const sql = `UPDATE chefs SET name = $1 WHERE id = $2 returning *`
  const response = await client.query(sql, [name, id])
  return response.rows[0]
}

const updateRecipes = async(name, id) => {
  const sql = `UPDATE recipes SET name = $1 WHERE id = $2 returning *`
  const response = await client.query(sql, [name, id]) 
  return response.rows[0]
}

module.exports = {
  sync,
  getChefs,
  getRecipes,
  createChefs,
  createRecipes,
  deleteChefs,
  deleteRecipes,
  updateChef,
  updateRecipes
}