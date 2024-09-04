import PostsList from "./features/posts/PostsList"
import AddPostForm from "./features/posts/AddPostForm"
import Layout from "./components/Layout"
import SinglePost from "./features/posts/SinglePost"
import { Navigate, Route, Routes } from "react-router-dom"
import EditPostForm from "./features/posts/EditPostForm"
import UserPage from "./features/users/UserPage"
import UsersList from "./features/users/UsersList"
function App() {
 
  return (
    
      <Routes>
          <Route path="/" element={<Layout/>}>
              
              <Route index element={<PostsList/>} />

              <Route path="/post">
                  <Route index element={<AddPostForm/>}/>

                  <Route path="/post/:postId" element={<SinglePost/>} />
                  <Route path="/post/edit/:postId" element={<EditPostForm/>}/>
              </Route>

              <Route path="/user">
                    <Route index element={<UsersList/>}></Route>

                    <Route path="/user/:userId" element={<UserPage/>}></Route>
              </Route>

               <Route path="*" element={<Navigate to='/' replace/>}></Route> 
          </Route>
      </Routes>
     
      
    
  )
}

export default App
