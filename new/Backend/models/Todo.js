
import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: String,
  },
}, { timestamps: true });

const Todo = mongoose.model('Todo', TodoSchema);

export default Todo;