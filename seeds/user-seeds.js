const { User} = require('../models');

const userdata = [
  {
    username: 'Raul',
    email: 'raul@example.com',
    password: 'password'
  },
  {
    username: 'Demo',
    email: 'demo@example.com',
    password: 'password'
  }
];

const seedUsers = () => User.bulkCreate(userdata, {individualHooks: true});

module.exports = seedUsers;