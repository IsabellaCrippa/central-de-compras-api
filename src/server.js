import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/central')
.then(() =>console.log('Conectado ao MongoDB'))
.catch(err => console.log(err));

