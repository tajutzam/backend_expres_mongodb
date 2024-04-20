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


router.get("/expense/:id", async (req, res) => {
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
      expense: todo.expense,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/expense/:id/:expenseId", async (req, res) => {
  try {
    const todoId = req.params.id;
    const expenseId = req.params.expenseId;

    // Ambil data expense baru dari body permintaan
    const { name, amount } = req.body;

    // Cari todo berdasarkan ID menggunakan mongoose
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Temukan expense yang ingin diperbarui
    const expenseToUpdateIndex = todo.expense.findIndex((expenseItem) => expenseItem._id.toString() === expenseId);

    if (expenseToUpdateIndex === -1) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Perbarui data expense
    todo.expense[expenseToUpdateIndex].name = name;
    todo.expense[expenseToUpdateIndex].amount = amount;

    // Simpan perubahan pada todo
    await todo.save();

    // Kirim expense yang diperbarui sebagai respons
    res.json(todo.expense[expenseToUpdateIndex]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



router.put("/income/:id/:incomeId", async (req, res) => {
  try {
    const todoId = req.params.id;
    const incomeId = req.params.incomeId;

    // Ambil data income baru dari body permintaan
    const { name, amount } = req.body;

    // Cari todo berdasarkan ID menggunakan mongoose
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Temukan income yang ingin diperbarui
    const incomeToUpdateIndex = todo.income.findIndex((incomeItem) => incomeItem._id.toString() === incomeId);

    if (incomeToUpdateIndex === -1) {
      return res.status(404).json({ message: "income not found" });
    }

    // Perbarui data income
    todo.income[incomeToUpdateIndex].name = name;
    todo.income[incomeToUpdateIndex].amount = amount;

    // Simpan perubahan pada todo
    await todo.save();

    // Kirim income yang diperbarui sebagai respons
    res.json(todo.income[incomeToUpdateIndex]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/expense/:id/:expenseId", async (req, res) => {
  try {
    const todoId = req.params.id;
    const expenseId = req.params.expenseId;

    // Find the todo item by ID using mongoose
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Find the expense by ID within the todo item
    let foundExpense = null;

    // Lakukan iterasi pada array expense
    todo.expense.forEach((expenseItem) => {
      // Periksa apakah _id dari expenseItem sama dengan expenseId
      if (expenseItem._id.toString() === expenseId) {
        // Jika sama, temukan expense
        foundExpense = expenseItem;
      }
    });

    // Jika expense tidak ditemukan, kirim respons dengan status 404
    if (!foundExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Kirim expense yang ditemukan sebagai respons
    res.json(foundExpense);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/Income/:id/:IncomeId", async (req, res) => {
  try {
    const todoId = req.params.id;
    const IncomeId = req.params.IncomeId;

    // Find the todo item by ID using mongoose
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Find the Income by ID within the todo item
    let foundIncome = null;

    // Lakukan iterasi pada array Income
    todo.income.forEach((IncomeItem) => {
      // Periksa apakah _id dari IncomeItem sama dengan IncomeId
      if (IncomeItem._id.toString() === IncomeId) {
        // Jika sama, temukan Income
        foundIncome = IncomeItem;
      }
    });

    // Jika Income tidak ditemukan, kirim respons dengan status 404
    if (!foundIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    // Kirim Income yang ditemukan sebagai respons
    res.json(foundIncome);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/income/:id", async (req, res) => {
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
      income: todo.income,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/expense/:id", async (req, res) => {
  const todoId = req.params.id;
  const { name, amount } =
    req.body;
  try {
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Expense not found" });
    }
    let expense = todo.expense;
    expense.push({
      name: name, amount: amount
    });
    await todo.save();
    res.json({ message: "success insert new expense" });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/expense/:id", async (req, res) => {
  const todoId = req.params.id;
  const { expenseId } =
    req.body;
  try {
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Expense not found" });
    }


    // Lakukan iterasi pada array expense
    todo.expense.forEach((expenseItem, index) => {
      // Periksa apakah _id dari expenseItem sama dengan requestId
      if (expenseItem._id.toString() === expenseId) {
        // Jika sama, hapus item dari array
        console.log("sama")
        todo.expense.splice(index, 1);
      }
    });

    // Simpan perubahan pada todo
    await todo.save();
    res.json({ message: "success delete expense" });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.delete("/income/:id", async (req, res) => {
  const todoId = req.params.id;
  const { incomeId } =
    req.body;
  try {
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "income not found" });
    }

    // Lakukan iterasi pada array income
    todo.income.forEach((incomeItem, index) => {
      // Periksa apakah _id dari incomeItem sama dengan requestId
      if (incomeItem._id.toString() === incomeId) {
        // Jika sama, hapus item dari array
        console.log("sama")
        todo.income.splice(index, 1);
      }
    });

    // Simpan perubahan pada todo
    await todo.save();
    res.json({ message: "success delete income" });
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/income/:id", async (req, res) => {
  const todoId = req.params.id;
  const { name, amount } =
    req.body;
  try {
    const todo = await todoDb.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "income not found" });
    }
    let income = todo.income;
    income.push({
      name: name, amount: amount
    });
    await todo.save();
    res.json({ message: "success insert new income" });
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.put("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  const { title, subtitle, duedate, titleBg, urgent, description, dateColor, category } =
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
      category: category
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
