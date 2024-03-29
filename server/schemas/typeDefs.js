const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    first_name: String!
    last_name: String!
    email: String!
    createdAt: String!
    posts: [Post]
    followers: [User]
    following: [User]
  }
  type Post {
    id: ID!
    user_id: String!
    post_text: String!
    createdAt: String!
    likes: [Likes]
    user: User
    comments: [Comments]
  }
  type Comments {
    id: ID
    author_id: ID!
    post_id: ID!
    comment_text: String
    createdAt: String
    user: User
    post: Post
  }
  type Likes {
    id: ID!
    user_liked_by: ID!
    post_id: ID!
    user: User
    post: Post
  }
  type Follows {
    id: ID!
    followed_id: ID!
    follower_id: ID!
  }
  type Auth {
    token: ID
    user: User
  }
  type Query {
    comments: [Comments]
    users: [User]!
    getLikes(post_id: ID!): Int
    user(username: String!): User!
    posts: [Post]!
    likes: [Likes]!
    follows: [Follows]!
    homepage(user_id: ID!): User
    dashboard: User
  }
  type Mutation {
    createUser(username: String!, first_name: String!, last_name: String!, email: String!, password: String!): Auth
    createPost(user_id: ID!, post_text: String!): Post
    createComment(post_id: ID!, comment_text: String!): Comments
    toggleLike(post_id: ID!): Int
    toggleFollow(followed: ID!): Int
    deletePost(post_id: ID!): Int
    login(username: String!, password: String!): Auth
    checkLike(post_id: ID!): Int
    checkFollow(user_id: ID!): Int
  }
`;

module.exports = typeDefs;
