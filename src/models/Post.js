  
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const commentSchema = new Schema(
   {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      tags:[String],
      date: {
        type: Date,
        default: Date.now
      }
    }
)

const PostSchema = new Schema({
  user: {
        type: Schema.Types.ObjectId, 
  },
  name: {
    type: String
  },
  title: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  numAgree:{
    type: Number
  },
  agree: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ],
  numDisagree:{
    type: Number
  },
  numComments:{
    type: Number
  },
  disagree: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ],
  postedAnonymously:{
    type: Boolean,
    default: false
  },
  approved:{
    type: Boolean,
    default: true
  },
  declined:{
    type: Boolean,
    default: false
  },
  comments: [ commentSchema ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', PostSchema);

export default Post