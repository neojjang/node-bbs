(function() {
  var Email, ObjId, ReplySchema, Schema, TagSchema, ThreadSchema, UserSchema, mongoose, mongooseTypes, useTimestamps;
  mongoose = require('mongoose');
  mongoose.connect('mongodb://jrdx:K0nv1cted@staff.mongohq.com:10029/database');
  mongooseTypes = require('mongoose-types');
  mongooseTypes.loadTypes(mongoose);
  Schema = mongoose.Schema;
  ObjId = Schema.ObjectId;
  Email = mongoose.SchemaTypes.Email;
  useTimestamps = mongooseTypes.useTimestamps;
  UserSchema = new Schema({
    name: {
      type: String,
      unique: true,
      min: 5,
      max: 32,
      lowercase: true
    },
    email: {
      type: Email,
      unique: true,
      lowercase: true
    },
    role: {
      type: String,
      "enum": ['admin', 'mod', 'user'],
      "default": 'user'
    },
    threads: {
      type: Number,
      "default": 0
    },
    replies: {
      type: Number,
      "default": 0
    },
    logins: {
      type: Number,
      "default": 0
    },
    lastLogin: {
      type: Date,
      "default": Date.now
    }
  });
  UserSchema.plugin(useTimestamps);
  ReplySchema = new Schema({
    id: {
      type: Number
    },
    uid: {
      type: ObjId,
      ref: 'User'
    },
    uname: {
      type: String,
      ref: 'User'
    },
    body: {
      type: String
    }
  });
  ReplySchema.plugin(useTimestamps);
  ThreadSchema = new Schema({
    title: {
      type: String,
      max: 70
    },
    uid: {
      type: ObjId,
      ref: 'User'
    },
    uname: {
      type: String,
      ref: 'User'
    },
    body: {
      type: String
    },
    tags: {
      type: Array
    },
    properties: {
      type: Array,
      "enum": ['sticky', 'modpost', 'locked', 'private', 'modprivate']
    },
    views: {
      type: Number,
      "default": 0
    },
    replies: [ReplySchema]
  });
  ThreadSchema.plugin(useTimestamps);
  TagSchema = new Schema({
    name: {
      type: String,
      max: 32,
      lowercase: true
    },
    uid: {
      type: ObjId,
      ref: 'User'
    }
  });
  TagSchema.plugin(useTimestamps);
  exports.Tag = mongoose.model('Tag', TagSchema);
  exports.User = mongoose.model('User', UserSchema);
  exports.Reply = mongoose.model('Reply', ReplySchema);
  exports.Thread = mongoose.model('Thread', ThreadSchema);
}).call(this);
