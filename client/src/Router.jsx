import {Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import AuthPage from './pages/Auth/AuthPage'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import AskQuestion from './pages/AskQuestion/AskQuestion'
import Answer from './pages/Answer/Answer.jsx'
import Howitwork from './pages/Howitwork/Howitwork'
import Protected from './Components/Protected'
import Profile from './pages/Profile/Profile'
import EditQuestion from "./pages/EditQuestion/EditQuestion";
import { Spinner } from 'react-bootstrap';
import { useContext } from 'react'
import { Context } from './Components/Context'



function Router() {

  const [{loading}] = useContext(Context);

  //So Here We Used loading spinner while checking auto-login
  if (loading) {
    return (
          <div className= 'loadingContainer'>
            <Spinner animation="border" variant="warning"  size="lg" />
          </div>
        );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <HomePage />
            </Protected>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/answer/:qid"
          element={
            <Protected>
              <Answer />
            </Protected>
          }
        />
        <Route
          path="/askquestion"
          element={
            <Protected>
              <AskQuestion />
            </Protected>
          }
        />
        <Route path="/howitwork" element={<Howitwork />} />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="/editquestion/:question_id" element={<EditQuestion />} />
      </Routes>
      <Footer />
    </>
  );
}

export default Router
