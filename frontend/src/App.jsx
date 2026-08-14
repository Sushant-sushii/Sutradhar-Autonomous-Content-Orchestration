<<<<<<< HEAD
import { useState ,useEffect} from 'react'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);
  const [array,setArray]=useState([]);

  const fetchAPI=async()=>{

    const response=await axios.get("http://127.0.0.1:5000/");
    // console.log(response.data.users);
    setArray(response.data.users);

  }
useEffect(()=>{
  fetchAPI();
},[])
  return (
    <>
      
    </>
  )
=======
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import Pipeline from './components/Pipeline';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
      </Routes>
    </BrowserRouter>
  );
>>>>>>> b2c7bc78fa835a14141f5271ec089dc9c6a74759
}

export default App;
