const { SchemaTypes, Schema, model } = require('mongoose');

const appointmentSchema = new Schema({
    roomNum: {
        type: SchemaTypes.Number,
        required: true
    },
    date: {
        type: SchemaTypes.String,
        required: true
    },
    seatNum: {
        type: SchemaTypes.Number,
        required: true
    },
    timeStart: {
        type: SchemaTypes.String,
        required: true
    },
    timeEnd: {
        type: SchemaTypes.String,
        required: true
    },
    name: {
        type: SchemaTypes.String,
        required: true
    },
    anon: {
        type: SchemaTypes.Boolean,
        required: true
    }
});

const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;
