import { lazy, Suspense, useState } from 'react';

import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import { DataLayer } from "./Components/VideoConference/DataLayer"
import AdminPanel from './Components/AdminPanel/AdminPanel';
import StudentPanel from './Components/StudentPanel/StudentPanel';
import TakingQuiz from './Components/StudentPanel/TakingQuiz';
import AdminLogin from "./Components/AdminPanel/components/Login/AdminLogin"
import TeacherPanel from './Components/TeacherPanel/TeacherPanel';
import TeacherLogin from './Components/TeacherPanel/TeacherLogin';
import ThankYou from './Components/StudentPanel/ThankYou';
import TempLogin from "./Components/ Login & Register/TempLogin"

const VideoConference = lazy(() => import("./Components/VideoConference/VideoConference"))


function App() {

  const [isSmallSidebar, setIsSmallSidebar] = useState(false)

  const sideBarClose = () => {

    setIsSmallSidebar(!isSmallSidebar)
  }


  return (
    <div className="App">
      <Navbar sidebarFunc={sideBarClose} />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/student/login/:navigateNo" element={<TempLogin />} />

          <Route path="/conference/:id/:status" element={
            <Suspense fallback={<LoadingComponent />}>
              <DataLayer >
                <VideoConference />
              </DataLayer>
            </Suspense>
          } />


          <Route path="/admin/:id" element={<AdminPanel isSidebar={isSmallSidebar} sidebarFunc={sideBarClose} />} />
          <Route path="/admin/login/0" element={<AdminLogin />} />
          <Route path="/student" element={<StudentPanel />}>
            <Route path=":id" element={<StudentPanel />} />
          </Route>
          <Route path="/takingQuiz/:id" element={<TakingQuiz />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/teacher" element={<TeacherPanel isSidebar={isSmallSidebar} sidebarFunc={sideBarClose} />} >
            <Route path=":teacherId/:id" element={<TeacherPanel isSidebar={isSmallSidebar} sidebarFunc={sideBarClose} />} />
          </Route>
          <Route path="/teacher/login/0" element={<TeacherLogin />} />
        </Routes>




      </BrowserRouter>
    </div>
  );
}

const LoadingComponent = () => {
  return (
    <p>Loading....</p>
  )
}



export default App;
