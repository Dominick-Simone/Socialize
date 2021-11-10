const {User, Likes, Post, Follows} = require("../models/index.js");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
      users: async () => {
        const users = await User.findAll(
          {
          include: 
          [
            {model: Post, include: [User, Likes]},
            "followers", 
            "following"
          ]
        }
        )
        console.log(users)
        return users;
      },
      user: async (parent, { username }) => {
        const params = username ? { username } : {};
        const user = await User.findOne({ where: { username: params.username }, include: [{model: Post, include: [Likes]}, 'followers', 'following'] });
        return user;
      },
      homepage: async (parent, { user_id }) => {
        const users = await User.findOne(
          {
            include: 
            [
              {model: Post, include: [Likes]}, 
              "followers", 
              {model: User, as: "following", include: {model: Post, include: [User, Likes]}}
            ]
          },
          {where: {id: user_id}}
        )
        console.log(users)
        return users;
      },
      getLikes: async (parent, { post_id }) => {
        const likes = await Likes.findAndCountAll({ where: { post_id: post_id }})
        
        return likes.count;
      },
      posts: async () => {

        const posts = await Post.findAll(
        {
          include: [
          {
            model: User
          },
          {
            model: Likes
          }
        ]
        }
        )
        console.log(posts)
        return posts;
      },
      likes: async () => {
        const likes = await Likes.findAll(
          {
          include: [
              {
                  model: User,
              },
              {
                  model: Post,
              },
          ]
        }
        )
        console.log(likes)
        return likes;
      },
      follows: async () => {
        const follows = await Follows.findAll()
        console.log(follows)
        return follows;
      },
    },
    Mutation: {
      createUser: async (parent, {username, first_name, last_name, email, password}) => {
        const user = await User.create({username, first_name, last_name, email, password})
        const token = signToken(user)
        return {token, user}
      },
      createPost: async (parent, {post_text, user_id}) => {
        return await Post.create({user_id, post_text})
      },
      toggleLike: async (parent, {post_id, user_liked_by}) => {
        const checkLikes = await Likes.findAll({where: {post_id: post_id}})
        console.log(`CheckLikes Length: ${checkLikes.length}`)
        for (i = 0; i < checkLikes.length; i++) {
          if (checkLikes[i].user_liked_by == user_liked_by) {
            console.log(`deleting likes where id: ${checkLikes[i].id}`)
            await Likes.destroy({where: {id: checkLikes[i].id}})
            return -1;
          }
          console.log(`CheckLikes Look Post Id ${checkLikes[i].id} CheckLikes User ${checkLikes[i].user_liked_by}`)
        }
        console.log("creating like")
        await Likes.create({user_liked_by, post_id})
        return 1;
      },
      toggleFollow: async (parent, {followed, user_id}) => {
        const checkFollows = await Follows.findAll({where: {follower_id: user_id}})
        for (i = 0; i < checkFollows.length; i++) {
          if (checkFollows[i].followed_id == followed) {
            console.log(`deleting follow where id: ${checkFollows[i].id}`)
            await Follows.destroy({where: {id: checkFollows[i].id}})
            return false;
          }
          console.log(`checkFollows Look Post Id ${checkFollows[i].id} checkFollows User ${checkFollows[i].user_liked_by}`)
        }
        await Follows.create({followed_id: followed, follower_id: user_id})
        return true;
      },
      login: async (parent, { username, password }) => {
        const user = await User.findOne({where: { username: username }});
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
      }
    }
};

module.exports = resolvers;
