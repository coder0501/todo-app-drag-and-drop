import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, TextField, Paper } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiTrash2 } from 'react-icons/fi';

interface Task {
  _id: string;
  title: string;
  status: 'toDo' | 'completed';
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // Fetch tasks from the backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5000/tasks').then((res) => setTasks(res.data));
  };

  const handleAddTask = () => {
    if (!newTask) return;
    axios
      .post('http://localhost:5000/tasks', { title: newTask, status: 'toDo' })
      .then((res) => setTasks((prev) => [...prev, res.data]));
    setNewTask('');
  };

  const handleDeleteTask = (taskId: string) => {
    axios.delete(`http://localhost:5000/tasks/${taskId}`).then(() => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });
  };

  const handleDragStart = (start: any) => {
    console.log("Drag Start Triggered", start);
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    // Exit if no destination or dropped in the same place
    if (!destination || source.droppableId === destination.droppableId) return;

    const draggedTaskId = result.draggableId;

    // Update the task's status in the state
    const updatedTasks = tasks.map((task) =>
      task._id === draggedTaskId ? { ...task, status: destination.droppableId } : task
    );
    setTasks(updatedTasks);

    // Update the task's status in the database
    axios.put(`http://localhost:5000/tasks/${draggedTaskId}`, {
      status: destination.droppableId,
    });
  };

  return (
    // <div className="bg-blue-500 text-white p-4 rounded">
    //   If this is blue, Tailwind is working!
    // </div>

    <Box className="max-w-4xl mx-auto p-4" >
      <Typography variant="h4" align="center" gutterBottom>
        To-Do List
      </Typography>

      <Box className="mb-4 flex flex-col items-center justify-center" >
        <TextField
          fullWidth
          label="Add a new task"
          variant="outlined"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button
          variant="contained"
          className="mt-2 block mx-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Box>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Box className="flex gap-4 justify-between">
          {/* To-Do List */}
          <Droppable droppableId="toDo">
            {(provided) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 p-4 min-h-[300px]"
              >
                <Typography variant="h6">To-Do</Typography>
                {tasks
                  .filter((task) => task.status === 'toDo')
                  .map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 p-2 rounded flex justify-between items-center shadow ${snapshot.isDragging ? 'bg-gray-200' : 'bg-white'
                            }`}

                        >
                          <Typography>{task.title}</Typography>
                          <Button onClick={() => handleDeleteTask(task._id)}>
                            <FiTrash2 />
                          </Button>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>

          {/* Completed List */}
          <Droppable droppableId="completed">
            {(provided) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 p-4 min-h-[300px]"
              >
                <Typography variant="h6">Completed</Typography>
                {tasks
                  .filter((task) => task.status === 'completed')
                  .map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            backgroundColor: snapshot.isDragging ? '#e0e0e0' : 'white',
                            marginBottom: '8px',
                            padding: '8px',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: 1,
                          }}
                        >
                          <Typography>{task.title}</Typography>
                          <Button onClick={() => handleDeleteTask(task._id)}>
                            <FiTrash2 />
                          </Button>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default App;












// import React, { useEffect, useState } from 'react';
// import { DragDropContext } from 'react-beautiful-dnd';
// import { fetchTasks, createTask, updateTask, deleteTask } from './services/api';
// import TaskList from './components/TaskList';

// const App = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState('');

//   useEffect(() => {
//     fetchTasks().then(setTasks);
//   }, []);

//   const handleAddTask = () => {
//     if (!newTask) return;
//     createTask({ title: newTask, status: 'toDo' }).then((task) => {
//       setTasks((prev) => [...prev, task]);
//       setNewTask('');
//     });
//   };

//   const handleDeleteTask = (id: string) => {
//     deleteTask(id).then(() => {
//       setTasks((prev) => prev.filter((task) => task._id !== id));
//     });
//   };

//   const handleDragEnd = (result: any) => {
//     const { source, destination } = result;
//     if (!destination || source.droppableId === destination.droppableId) return;

//     const updatedTasks = tasks.map((task) =>
//       task._id === result.draggableId ? { ...task, status: destination.droppableId } : task
//     );
//     setTasks(updatedTasks);

//     updateTask(result.draggableId, { status: destination.droppableId });
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-4">To-Do List</h1>

//       <div className="mb-4">
//         <input
//           type="text"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           placeholder="Add a new task"
//           className="w-full p-2 border rounded"
//         />
//         <button
//           onClick={handleAddTask}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded w-full"
//         >
//           Add Task
//         </button>
//       </div>

//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="flex gap-4">
//           <TaskList
//             droppableId="toDo"
//             tasks={tasks.filter((task) => task.status === 'toDo')}
//             onDelete={handleDeleteTask}
//           />
//           <TaskList
//             droppableId="completed"
//             tasks={tasks.filter((task) => task.status === 'completed')}
//             onDelete={handleDeleteTask}
//           />
//         </div>
//       </DragDropContext>
//     </div>
//   );
// };

// export default App;
