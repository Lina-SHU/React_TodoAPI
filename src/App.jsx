import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import Auth from './views/Auth'
import Signup from './views/Signup'
import Signin from './views/Signin'
import Todo from './views/Todo'
import NotFound from './views/NotFound'
import './App.scss'

function App() {
  const style = ({isActive}) => {
    {/* 解構方式取出 isActive */}
    return {
      color: isActive ? 'red': null
    }
  }
  return (
    <>
      <Routes>
        {/* 路由表 */}
        <Route path='/' element={<Home />} />

        {/* /auth 共用版型 */}
        {/* /auth/signup */}
        {/* /auth/signin */}
        <Route path='/auth' element={<Auth/>}>
          <Route path="sign_up" element={<Signup/>} />
          <Route path="sign_in" element={<Signin/>} />
        </Route>

        <Route path='/todo' element={<Todo/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  )
}

export default App
