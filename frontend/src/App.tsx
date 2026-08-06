import { Link, Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white">
        <nav className="bg-slate-800 p-4 text-white flex gap-4">
            <div>To-do list</div>
            <Link to='/'>Add Task</Link>
            <Link to='/tasks-list'>Task List</Link>
        </nav>
        <main className="p-4">
            <Outlet />
        </main>
    </div>
  );
}
