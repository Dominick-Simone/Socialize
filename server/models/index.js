const User = require("./User")
const Post = require("./Post")
const Likes = require("./Likes")
const Follows = require("./Follows")
const Comments = require("./Comments")

User.hasMany(Post, {
    foreignKey: "user_id"
})
Post.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
})

User.hasMany(Likes, {
    foreignKey: "user_liked_by",
    onDelete: "CASCADE"
})
Likes.belongsTo(User, {
    foreignKey: "user_liked_by"
})

Post.hasMany(Likes, {
    foreignKey: "post_id",
    onDelete: "CASCADE"
})
Likes.belongsTo(Post, {
    foreignKey: "post_id",
})

Post.hasMany(Comments, {
    foreignKey: "post_id",
    onDelete: "CASCADE"
})
Comments.belongsTo(Post, {
    foreignKey: "post_id"
})
User.hasMany(Comments, {
    foreignKey: "author_id",
    onDelete: "CASCADE"
})
Comments.belongsTo(User, {
    foreignKey: "author_id"
})

User.belongsToMany(User, {through: "follows", foreignKey: "follower_id", otherKey: "followed_id", as:"following"})
User.belongsToMany(User, {through: "follows", foreignKey: "followed_id", otherKey: "follower_id", as:"followers"})



module.exports = {Post, User, Likes, Follows, Comments}