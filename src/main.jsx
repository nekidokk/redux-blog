import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { fetchUsers } from './features/users/usersSlice.js'
import { BrowserRouter } from 'react-router-dom'
import { fetchPosts } from './features/posts/postsSlice.js'


store.dispatch(fetchPosts())
store.dispatch(fetchUsers())

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </Provider>
  
)
