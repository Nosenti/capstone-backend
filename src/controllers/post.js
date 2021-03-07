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
      
      const posts = await Post.find({user: req.user.id})

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
      const {title, text, postedAnonymously} = req.body;
      const post = await Post.create({
        user: req.user.id,
        title,
        text,
        postedAnonymously
      })

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
          message: 'Todo updated'
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
          message: 'Todo is deleted'
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

 }

export default new Post_();