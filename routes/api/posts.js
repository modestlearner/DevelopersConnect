const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');
const passport=require('passport')

const Post=require('../../models/Post')
const Profile=require('../../models/Profile')
//valiudation

const validatePostInput=require('../../validation/post')

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET  api/posts
// @desc    GET route
// @access  Prublic

router.get('/',(req,res)=>{

    Post.find()
        .sort({date:-1})
        .then(posts=>{
            res.json(posts)

        })
        .catch((err)=>{
             res.status(404).json({nopostfound:'No post found with this id'})
        })

})

// @route   GET  api/posts/:id
// @desc    GET psot by id
// @access  Prublic

router.get('/:id',(req,res)=>{

    Post.findById(req.params.id)
        .then(post=>{
            res.json(post)
        })
        .catch((err)=>{
            res.status(404).json({nopostfound:'No post found with this id'})
        })
})


// @route   POST  api/posts
// @desc    Create route
// @access  Provate

router.post('/',passport.authenticate('jwt',{session:false}),
    (req,res)=>{

    const {errors,isValid}=validatePostInput(req.body)

     //check valid

     if(!isValid){

        res.status(400).json(errors)
     }

    const newPost=new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id

    })
        newPost.save().then( post=>res.json(post))
    })

// @route   DELETE  api/posts/:id
// @desc    Delete Post
// @access  Private

router.post('/',passport.authenticate('jwt',{session:false}),
    (req,res)=> {

    Profile.findOne({user:req.user.id})
        .then((profile)=>{
            Post.findByID(req.params.id)
                .then((post)=>{
                    //check post owner
                    if(post.user.toString()!==req.user.id){
                        return res.status(401).json({notauthorized:'User not authorized'})

                    }

                    post.remove().then(()=>{
                        res.json({success:true})

                    })
                        .catch(err=>{
                            res.status(404).json({postnotfound:'No post found'})
                        })
                })
        })

    })
module.exports = router;
