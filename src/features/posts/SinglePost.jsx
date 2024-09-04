import PostAuthor from "./PostAuthor"
import TimeAgo from "./TimeAgo"
import ReactionButtons from "./ReactionButtons"

import { selectPostById } from "./postsSlice"
import { useSelector } from "react-redux"

import { useParams, Link } from "react-router-dom"


export default function SinglePost(){
    
    
    const { postId } = useParams()
    
    const post = useSelector(state => selectPostById(state, Number(postId)))
    
    

    if(!post){
        return <p>ERROR: post not found</p>
    } 

    return(
        <article>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
        <p className="postCredit">
            <Link to={`/post/edit/${post.id}`}>Edit post</Link>
            <PostAuthor userId={post.userId}/>
            <TimeAgo timestamp={post.date}></TimeAgo>
        </p>
        <ReactionButtons post={post}></ReactionButtons>
        </article>
    )
}