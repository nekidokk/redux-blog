import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { selectUserById } from "./usersSlice"
import { selectAllPosts } from "../posts/postsSlice"
import { Link } from "react-router-dom"

export default function UserPage(){

    const { userId } = useParams()

    const user = useSelector(state => selectUserById(state, Number(userId)) )

    const posts = useSelector(selectAllPosts)
    const postsOfUser = posts.filter(post=> post.userId === Number(userId))

    const postTitles = postsOfUser.map(post=>(
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
        </li>
    ))
 
    return(
        <section>
            <h2>{user?.name}</h2>
            <ol>{postTitles}</ol>
        </section>
    )
}