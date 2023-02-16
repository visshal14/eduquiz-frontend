
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import CourseSelection from './Components/CourseSelection/CourseSelection';
import QuizPage from './Components/QuizPage/QuizPage';
import Quiz from './Components/Quiz/Quiz';
import VideoPage from './Components/VideoPage/VideoPage';
import Login from "./Components/ Login & Register/Login";
import Register from './Components/ Login & Register/Register';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import PasswordReset from './Components/ForgetPassword/PasswordReset';
import RoomSelection from './Components/RoomSelection/RoomSelection';
import VideoConference from './Components/VideoConference/VideoConference';
import { DataLayer } from "./Components/VideoConference/DataLayer"
import Whiteboard from './Components/Whiteboard/Whiteboard';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
//navbar
//frontpage
//courseselect
//login
//quizpage
//quiz
//videopage
//register
//forget-password


//room page
//video conference


function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/courseSelection" element={<CourseSelection />} />
          <Route path="/quizpage/:course" element={<QuizPage />} />
          <Route path="/quiz/:course" element={<Quiz />} />
          <Route path="/videopage/:course/:id" element={<VideoPage />} />
          <Route path="/login/:navigateNo" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/password-reset/:id" element={<PasswordReset />} />
          <Route path="/room-selection/:id/:status" element={<RoomSelection />} />
          <Route path="/conference/:id/:status" element={
            <DataLayer >
              <VideoConference />
            </DataLayer>

          } />
          <Route exact path="/whiteboard" element={<WhiteBoardUniqueId />} />
          <Route exact path="/whiteboard/:id" element={<Whiteboard />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

const WhiteBoardUniqueId = () => {
  const { id } = useParams()
  console.log(id)
  if (!id) {
    console.log("if")
    const unique_id = uuid();
    const small_id = unique_id.slice(0, 8)
    console.log(small_id)
    window.location.href = `/whiteboard/${small_id}`
    // Navigate(`/whiteboard/${small_id}`)
  }
  // return (<></>)
}


export default App;
