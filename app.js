const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

let db = null;
const dbPath = path.join(__dirname, "todoApplication.db");
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1

app.get("/todos/", async (request, response) => {
  const { status = "", priority = "HIGH", search_q = "" } = request.query;
  const getTodoQuery = `
    SELECT 
        *
    FROM
        todo
    WHERE
        status LIKE '${status}' AND todo LIKE '%${search_q}%' AND priority = '${priority}'; 
        
    
  `;
  const getTodo = await db.all(getTodoQuery);
  response.send(getTodo);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoQuery = `
        SELECT * FROM todo WHERE id = ${todoId};
    `;
  const todoItems = await db.get(todoQuery);
  response.send(todoItems);
});

//API 3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const todoPostQuery = `
    INSERT INTO
        todo(id,todo,priority,status)
    VALUES (
        ${id},
        '${todo}',
        '${priority}',
        '${status}'
    );
  `;
  const todoPost = await db.run(todoPostQuery);
  response.send("Todo Successfully Added");
});

//API 4
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.body;
  const putQuery = `
        UPDATE
            todo
        SET
            status = '${status}'
        WHERE 
            id = ${todoId};
    `;
  const updateTodo = await db.run(putQuery);
  response.send("Status Updated");
});

//API 5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `
        DELETE FROM todo WHERE id = ${todoId};
    `;
  const deleteTodo = await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
