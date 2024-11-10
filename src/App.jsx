import React, { useEffect, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ id: null, name: '', description: '', isFinished: false });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/tasks");
      if (!response.ok) {
        throw new Error("Erro ao buscar as tarefas.");
      }
      const tasks = await response.json();
      setTasks(tasks.sort((a, b) => a.id - b.id)); // Ordena as tarefas por ID
    } catch (error) {
      console.error(error.message);
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const addTask = async () => {
    if (!task.name || !task.description) return;
  
    try {
      const response = await fetch("http://localhost:3000/tasks/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao adicionar a tarefa.");
      }
  
      await response.json();
      reloadPage();
    } catch (error) {
      console.error(error.message);
    }
  };
  

  const saveTask = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${task.id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar a tarefa.");
      }

      await response.json();
      reloadPage();
    } catch (error) {
      console.error(error.message);
    }
  };

  const startEditing = (task) => {
    setTask(task);
    setIsEditing(true);
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar a tarefa.");
      }

      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id).sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-5 text-gray-700">Lista de Tarefas</h2>

      <div className="mb-5 p-4 bg-white rounded-md shadow">
        <input
          type="text"
          placeholder="Nome"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Descrição"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            checked={task.isFinished}
            onChange={(e) => setTask({ ...task, isFinished: e.target.checked })}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-gray-700">Concluída</span>
        </label>
        
        {isEditing ? (
          <button
            onClick={saveTask}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Salvar
          </button>
        ) : (
          <button
            onClick={addTask}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Adicionar
          </button>
        )}
      </div>

      <ul className="space-y-4">
        {tasks.map((t) => (
          <li key={t.id} className="p-4 bg-white rounded-md shadow flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{t.name}</h3>
              <p className="text-gray-600">{t.description}</p>
              <p className="mt-2 text-gray-700">
                Status: {t.isFinished ? "Concluída" : "Pendente"}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEditing(t)}
                className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => deleteTask(t.id)}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
