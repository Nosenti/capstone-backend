import express from 'express'
import Post from '../models/Post.js'
import User from '../models/User.js'

class Post_ {

  /**
   * @property {Function} getPosts Getting all todos
   * @returns {posts}
   */
  async getPosts(req, res) {
    try {
      
      const posts = await Post.find()

      if(! posts){
        res.status(404).send({
          status: 404,
          message: ' No posts found'
        })
      }
      
      return res.status(200).send({
        posts
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error);
    }
  }
  /**
   * @property {Function} getOnePost Getting one post item
   * @returns {post}
   */

  async getOnePost(req,res){
    try {
      const post = await Post.findById(req.params.id)
      if(post){
        if(post.user.toString() === req.user.id){
          return res.status(200).send(post);
        }else{
          return res.status(403).send({
            status: 403,
            message: 'unauthorized access'
          })
        }
        
      }else{
        return res.status(404).send({
          message: 'Post not found'
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        message: 'server error'
      })
    }
  }

  /**
   * @property {Function} createPost creating one todo item
   * @returns {post}
   */

  async createPost(req, res) {
    try {
      let post;
      const {title, text, postedAnonymously} = req.body;
      if(postedAnonymously === true){
        post = await Post.create({
          user: req.user.id,
          title,
          text,
          postedAnonymously,
          approved: false
        })
      }else{
        post = await Post.create({
          user: req.user.id,
          title,
          text,
          postedAnonymously
        })
      }
      

      return res.status(201).send({
        post,
        message:'Post created'
      })   
        
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  /**
   * @property {Function} updatePost updating one todo item
   * @returns {post}
   */
  async updatePost(req,res){
    try {
      const post = await Post.findById(req.params.id);
      if(!post){
        return res.status(404).send({
          status: 404,
          message: 'The resource you want to update does not exist'
        })
      }

      if(req.user.id === post.user.toString()){
        Object.assign(post, req.body);
        post.save();
        res.status(200).send({
          status: 200,
          message: 'Post updated'
        })
      }else{
        res.status(403).send({
          error: 'User not authorized'
        })
      }
      
      
    } catch (error) {
      res.status(500).send({
        status: 500,
        message:'server error'
      })
    }
  }

  /**
   * @property {Function} deletePost Deleting one post
   * @returns {message}
   */
  async deletePost(req,res){
    try {
      const post = await Post.findById(req.params.id);
      if(!post){
        return res.status(404).send({
          status: 404,
          message: 'The ressource you want to delete does not exist'
        })
      } 
      
      if(req.user.id === post.user.toString()){
        await post.remove();
         return res.status(200).send({
          status: 200,
          message: 'Post is deleted'
        })
      }else{
        res.status(403).send({
          status: 403,
          message: 'Not authorized'
        })
      }
      
     
    } catch (error) {
      res.status(500).send(error)
    }
  }

  async createComment(req,res){
    try {
      const {text} = req.body;

      const post = await Post.findById(req.params.id);

      if(post){

        const comment = {
          name: req.user.name,
          text,
          user: req.user.id
        }

        post.comments.push(comment)

        await post.save()

        res.status(201).send({
          status: 201,
          message: 'Comment added'
        })


      }else{
        res.status(404).send({
          status: 404,
          error: 'Post not found'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

  async deleteComment(req,res){

  }

  async agree(req,res){
    try {
      const post = await Post.findById(req.params.id);

      if(post){

        /**
         * Toggle between like and dislike
         */
        const alreadyAgreed = post.agree.find(
          (r) => r.user.toString() === req.user.id.toString()
        )
        if(alreadyAgreed){
          return res.status(400).send({
            status: 400,
            error: 'You already liked this this post'
          })
        }

        const oneAgree = {
          user: req.user.id
        }

        post.agree.push(oneAgree)
        post.numAgree = post.agree.length
        await post.save()

        res.status(201).send({
          status: 201,
          message: 'agree added'
        })


      }else{
        res.status(404).send({
          status: 404,
          error: 'Post not found'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

  async disagree(req,res){
    try {
      const post = await Post.findById(req.params.id);

      if(post){

        /**
         * Toggle between disagree and disdisagree (if makes sense)
         */
        const alreadyDisAgreed = post.disagree.find(
          (r) => r.user.toString() === req.user.id.toString()
        )
        if(alreadyDisAgreed){
          return res.status(400).send({
            status: 400,
            error: 'You already disagreed with this this post'
          })
        }

        const oneDisAgree = {
          user: req.user.id
        }

        post.disagree.push(oneDisAgree)
        post.numDisagree = post.disagree.length
        await post.save()

        res.status(201).send({
          status: 201,
          message: 'Disagree added'
        })


      }else{
        res.status(404).send({
          status: 404,
          error: 'Post not found'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

  async moderatePost(req,res){
    try {
      const post = await Post.findById(req.params.id);
      if(!post){
        return res.status(404).send({
          status: 404,
          message: 'post does not exist'
        })
      }
      const {status} = req.body;
      
      if(req.user.role === 'moderator'){
          if(status === 'approve'){
          post.approved = true;
          await post.save();
        }
        if(status === 'decline'){
          post.declined = true;
          await post.save();
        }
        return res.status(200).send({
          status: 200,
          message: 'action succeeded'
        })
      }else{
        return res.status(403).send({
          status: 403,
          message: 'User not authorized'
        })
      }
      
      
    } catch (error) {
      return res.status(500).send({
        status: 500,
        message: 'Server error'
      })
    }
  }

 }

 

export default new Post_();