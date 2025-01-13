import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FiTrash2 } from 'react-icons/fi';

interface TaskItemProps {
  task: { _id: string; title: string };
  index: number;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, onDelete }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded shadow mb-2 flex justify-between items-center ${
            snapshot.isDragging ? 'bg-gray-200' : ''
          }`}
        >
          <span>{task.title}</span>
          <button onClick={() => onDelete(task._id)} className="text-red-500 hover:text-red-700">
            <FiTrash2 />
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
