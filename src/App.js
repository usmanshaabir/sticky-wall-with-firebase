import './App.scss';
import Routing from './pages/Routing';
import AuthContextProvider from "./contexts/AuthContext"


function App() {
  return (
    <>
      <AuthContextProvider>
        <Routing />
      </AuthContextProvider>
    </>
  );
}

export default App;
