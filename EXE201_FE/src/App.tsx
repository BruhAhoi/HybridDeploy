import {routes} from "./routes"
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import { useTokenWatcher } from "./components/hooks/useTokenWatcher ";


function App() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken)
  const isAuthenticated = !!accessToken;
  useTokenWatcher();

  return (
    <>
    <GoogleOAuthProvider clientId="625215731823-40khf1hvn3ola95ud9qcpkt5hpraq4eg.apps.googleusercontent.com">
      <ToastContainer/>
      <Router>
        <Routes>
          {routes.public.map(({path, element})=>(
            <Route key={path} path={path} element={element}/>
          ))}

          {routes.private.map(({path, element}) => (
            <Route key={path} path={path} element={isAuthenticated ? element : <Navigate to= "/login" replace/>}/>
          ))}

          {routes.admin.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element} 
              >
                {route.children.map((child, idx) => (
                  <Route
                    key={idx}
                    index={child.index}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            ))}
          {/* Add more routes for other templates here */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
    </>
  );
};

export default App
