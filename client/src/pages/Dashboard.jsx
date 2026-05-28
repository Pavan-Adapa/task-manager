import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../utils/api";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/tasks");

      setTasks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!title) return;

    try {
      await API.post("/tasks", {
        title,
      });

      setTitle("");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      await API.put(`/tasks/${task._id}`, {
        status: newStatus,
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Task Dashboard</h1>

            <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <form onSubmit={createTask} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Enter task..."
            className="flex-1 border p-3 rounded-lg bg-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className="bg-black text-white px-6 rounded-lg">Add</button>
        </form>

        {loading ? (
          <div className="text-center text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow">
            <h2 className="text-2xl font-semibold mb-2">No tasks yet</h2>

            <p className="text-gray-500">Create your first task above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h2
                    className={`text-xl font-semibold ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {task.title}
                  </h2>

                  <p
                    className={`mt-1 ${
                      task.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {task.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(task)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
