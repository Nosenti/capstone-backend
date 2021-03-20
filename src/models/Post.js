  
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId
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
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId
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
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', PostSchema);

export default Post