const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require('../models/like');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
  
    //to check if req is ajax request
    if (req.xhr) {
      // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
      post = await post.populate('user', 'name');

      return res.status(200).json({
         data: {
           post: post
         },
         message: "Post Created!"
      });
    }

    req.flash('success','Post Published!');
    return res.redirect('back');

  } catch (err) {
    // console.log("Error in creating a post",err);
    req.flash('error',err);
    return res.redirect('back');
  }
}

//to delete a post
module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {

      // delete the associated likes for the post and all the comments' likes too
      await Like.deleteMany({likeable: post, onModel: 'Post'});
      await Like.deleteMany({_id: {$in: post.comments}});

      post.remove();

      await Comment.deleteMany({ post: req.params.id });
      
      if (req.xhr) {

        return res.status(200).json({
          data: {
            post_id: req.params.id
          },
          message: "Post deleted!"
        })
      }
      req.flash('success','Post & associated comments deleted');
      return res.redirect('back');

    } else { 
      req.flash('error','You cannot delete this post');
      return res.redirect('back');
    }

  } catch (err) {
    // console.log("Error in deleting a post",err);
    req.flash('error',err);
    return res.redirect('back');
  }

}
