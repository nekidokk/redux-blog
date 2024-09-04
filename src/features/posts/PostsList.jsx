import { useSelector } from "react-redux"
import { selectAllPosts, getPostsError, getPostsStatus, selectPostIds} from "./postsSlice"
import PostsExcerpt from "./PostsExcerpt"


export default function PostsList(){
    
    const orderedPostIds = useSelector(selectPostIds)
    const status = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    let content
    if(status == 'loading'){
        content = <span>Loading...</span>
    }   else if(status === 'succeeded'){

        content = orderedPostIds.map(id=>
           <PostsExcerpt key={id} postId={id}></PostsExcerpt>
        )
    } else if(status ==='failed'){
        content = <p>{error}</p>
       
    }


    return(
        <section>
            {content}
        </section>
    )
}