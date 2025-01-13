import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem.js';

interface TaskListProps {
  droppableId: string;
  tasks: { _id: string; title: string }[];
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ droppableId, tasks, onDelete }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-100 p-4 rounded min-h-[300px] flex-1"
        >
          {tasks.map((task, index) => (
            <TaskItem key={task._id} task={task} index={index} onDelete={onDelete} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
