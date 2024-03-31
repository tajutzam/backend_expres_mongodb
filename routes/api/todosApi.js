const { Router } = require("express");
const router = Router();
const todoDb = require("../../models/todos");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4 function
const bcrypt = require("bcrypt");

router.get("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;

    // Find the todo item by ID using mongoose
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({
      email: todo.email,
      name: todo.name,
      todos: todo.todos,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/todos/:id", async (req, res) => {
  const todoId = req.params.id;

  const { title, subtitle, duedate, titleBg, urgent, description, dateColor } =
    req.body;

  try {
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    let todos = todo.todos;
    todos.push({
      id: uuidv4(),
      title: title,
      subtitle: subtitle,
      duedate: duedate,
      status: false,
      titleBg: titleBg,
      urgent: urgent,
      description: description,
      dateColor: dateColor,
    });
    await todo.save();
    res.json({ message: "success insert new todo" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/todos/:id/status", async (req, res) => {
  const userId = req.params.id;
  const { status, todoId } = req.body;
  console.log(todoId, status);

  try {
    const todo = await todoDb.findById(userId);

    if (!todo) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedTodos = todo.todos.map((todoItem) => {
      if (todoItem.id === todoId) {
        return {
          ...todoItem,
          status: status,
        };
      }
      return todoItem;
    });

    todo.todos = updatedTodos;
    await todo.save();
    res.json({ message: "Success updating todo status" });
  } catch (error) {
    console.error("Error updating todo status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/todos/:id/delete", async (req, res) => {
  const userId = req.params.id;
  const { todoId } = req.body;

  console.log(todoId);

  try {
    const todo = await todoDb.findById(userId);

    if (!todo) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedTodos = todo.todos.filter(
      (todoItem) => todoItem.id !== todoId
    );
    todo.todos = updatedTodos;
    await todo.save();
    res.json({ message: "Success remove todo" });
  } catch (error) {
    console.error("Error updating todo status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/todos/:id/update", async (req, res) => {
  const userId = req.params.id;
  const { todoId, title, subtitle, description } = req.body;

  try {
    const todo = await todoDb.findById(userId);

    if (!todo) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedTodos = todo.todos.map((todoItem) => {
      if (todoItem.id === todoId) {
        return {
          ...todoItem,
          title: title,
          subtitle: subtitle,
          description: description,
        };
      }
      return todoItem;
    });

    todo.todos = updatedTodos;
    await todo.save();
    res.json({ message: "Success updating todo" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/todos/:id/profile", async (req, res) => {
  const userId = req.params.id;
  const { fullname, password, confirmPassword } = req.body;
    console.log('update');
  if (password != confirmPassword) {
    return res.status(400).json({
      message: "password dan confirm password harus sama",
    });
  }

  try {
    const todo = await todoDb.findById(userId);
    if (!todo) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password != undefined) {
      let hashedPassword = await bcrypt.hash(password, 12);
      todo.password = hashedPassword;
    }
    todo.name = fullname;
    await todo.save();
    res.json({ message: "Success updating profile" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
