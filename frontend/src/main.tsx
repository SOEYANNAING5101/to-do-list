import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './index.css'
import App from './AddNewListPage.tsx'
import RootLayout from './App.tsx'
import ErrorPage from './ErrorPage.tsx'
import TaskListPage from './TaskListPage.tsx'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element : <RootLayout/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />
      },
      {
        path: '/tasks-list',
        element: <TaskListPage />
      }
    ]
  }

])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
