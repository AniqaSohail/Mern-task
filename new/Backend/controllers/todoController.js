import Todo from "../models/Todo.js";

export const addTodo = async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const newTodo = new Todo({ title, description, completed });
    await newTodo.save();
    res.status(201).json({ success: true, message: 'Todo added successfully', data: newTodo });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const editTodo = async (req, res) => {
  const { title, description, completed } = req.body;
  const { id } = req.params; // ✅ id from params
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.json({ success: true, message: 'Todo updated successfully', data: updatedTodo });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params; // ✅ id from params
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
