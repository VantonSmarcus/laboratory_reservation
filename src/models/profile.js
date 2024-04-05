const { SchemaTypes, Schema, model } = require('mongoose');

const profileSchema = new Schema({
    username: {
        type: SchemaTypes.String,
        required: true,
        trim: true,
        unique: true
    },
    desc: {
        type: SchemaTypes.String,
        default: 'default'
    },
    pfp_link: {
        type: SchemaTypes.String
    },
    user_type: {
        type: SchemaTypes.String,
        required: true,
        enum: ['S', 'F'],
        default: 'S'
    },
    email: {
        type: SchemaTypes.String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    remember: {
        type: SchemaTypes.Number,
        required: true,
        enum: [0, 1],
        default: 0
    },
    session: {
        type: SchemaTypes.String
    }
});

const profile = model('profile', profileSchema,'profile');

module.exports = profile;
