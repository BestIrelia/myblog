const marked =require('marked')
const Post = require('../lib/mongo').Post

//将post的content从markdown转为html
Post.plugin('contentToHtml',{
    afterFind:function (posts) {
        return posts.map(function (post) {
            post.content=marked(post.content)
            return post
        })
    },
    afterFindOne:function (post) {
        if(post){
            post,content=marked(post.content)
        }
        return post
    }
})

module.exports = {
    // 创建一篇文章
    create: function create (post) {
        return Post.create(post).exec()
    },

    //通过文章id获取一篇文章
    getPostById:function getPostById(postId) {
        return Post
            .findOne({_id:postId})
            .populate({path:'author',model:'User'})
            .addCreatedAt()
            .contentToHtml()
            .exec()
    }
}