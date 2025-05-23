import { BrowserRouter } from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from "./context/AuthContext.tsx";



createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  </AuthProvider>

)
