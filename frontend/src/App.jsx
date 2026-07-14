import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./stores/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
