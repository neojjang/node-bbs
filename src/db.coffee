mongoose = require 'mongoose'

mongoose.connect 'mongodb://jrdx:K0nv1cted@staff.mongohq.com:10029/database'

Schema	= mongoose.Schema
ObjId = Schema.ObjectId


UserSchema = new Schema
	created:
		type: Date
		default: Date.now
		
	name:
		type: String
		unique: true
		min: 5
		max: 32
		
	email:
		type: String
		unique: true
		
	role:
		type: String
		enum: [
			'admin'
			'mod'
			'user'
		]
		default: 'user'
		
	threads:
		type: Number
		default: 0
		
	replies:
		type: Number
		default: 0


ReplySchema = new Schema
	id:
		type: Number
		
	created:
		type: Date
		default: Date.now
		
	uid:
		type: ObjId
		ref: 'User'
		
	uname:
		type: String
		ref: 'User'
		
	body:
		type: String


ThreadSchema = new Schema
	created:
		type: Date
		default: Date.now
		
	title:
		type: String
		max: 70
		
	uid:
		type: ObjId
		ref: 'User'
		
	uname:
		type: String
		ref: 'User'
		
	body:
		type: String
		
	tags:
		type: Array
		
	properties:
		type: Array
		enum: [
			'sticky'
			'modpost'
			'locked'
			'private'
			'modprivate'
		]
		
	bump:
		type: Date
		default: Date.now
		
	views:
		type: Number
		default: 0
		
	repliesnum:
		type: Number
		default: 0
		
	replies:
		[ReplySchema]


TagSchema = new Schema
	created:
		type: Date
		default: Date.now
		
	name:
		type: String
		max: 32
		
	uid:
		type: ObjId
		ref: 'User'



exports.Tag = mongoose.model 'Tag', TagSchema
exports.User = mongoose.model 'User', UserSchema
exports.Reply = mongoose.model 'Reply', ReplySchema
exports.Thread = mongoose.model 'Thread', ThreadSchema





