import React, { useState, useEffect } from 'react'
import Post from "../components/Post"
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_DASHBOARD } from '../utils/queries';
import getMonthDay from '../utils/dateFormatter';
import { TOGGLE_FOLLOW } from '../utils/mutations';
import Auth from '../utils/auth';
import CreatePost from '../components/CreatePost';

const Dashboard = () => {
    const { loading, data } = useQuery(QUERY_DASHBOARD);
    const user = data?.dashboard || [];
    const [following, setFollowing] = useState(0)
    const [followers, setFollowers] = useState(0)
    useEffect(() => {
        if (data) {
            setFollowers(user.followers.length)
            setFollowing(user.following.length)
        }
    }, [data])
    if (loading) {
        return <h1></h1>;
    }

    let allPosts = [];

    user.posts.forEach((post) => {
        allPosts.push(post)
    })
    
    const sortByPostDate = (a, b) => {
        return b.createdAt - a.createdAt;
    }
    allPosts.sort(sortByPostDate)

    const accountCreated = getMonthDay(parseInt(user.createdAt))

    return (
        <>
            <div className="profileOuterDiv">
                <div className="profileHeaderDiv">
                    <h3 className="marginOne">{user.first_name}  @{user.username}</h3>
                </div>
                <div className="profileTextDiv">
                    <h4 className="marginOne">Followers: {followers} Following: {following}</h4>
                    <p>Joined {accountCreated}</p>
                </div>

            </div>
            <CreatePost />
            <div className={allPosts.length > 0 ? "postContainer" : ""}>
                {allPosts.length > 0 ? allPosts.map((post, index) => {
                    return <Post key={post.id} index={index} comments={post.comments} createdAt={post.createdAt} postId={post.id} username={user.username} likes={post.likes.length} firstName={user.first_name} postText={post.post_text} />
                }) : <h1 className="alignCenter">Create posts for them to appear here!</h1>}
            </div>
        </>
    )
}

export default Dashboard
