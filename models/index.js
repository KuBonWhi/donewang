'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    //모든 파일 불러들임
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);//관계정의
  }
});

db.get_remainTime = function get_remainTime(data) {
  let now = new Date();
  
  if(data.length == undefined) {
    let expire_time = new Date(data.createdAt);
    expire_time.setHours(data.createdAt.getHours() + data.duration)

    // console.log("올린 시간 : ", data.createdAt.toString(), "/duration : ", data.duration);
    // console.log("마감 시간 : ", expire_time.toString());
    // console.log("현재 시간 : ", now.toString());

    let diff = expire_time - now;
    var hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var sec = Math.floor((diff % (1000 * 60)) / 1000);

    data.remain_time = hour+'시간'+min+'분 남음!!'

    //console.log("남은 시간 : ", hour, '시', min, '분', sec, '초')
    //console.log("\n");
  } else {
    for(let index in data) {
      let expire_time = new Date(data[index].createdAt);
      expire_time.setHours(data[index].createdAt.getHours() + data[index].duration)

      // console.log("index = ", index)
      // console.log("올린 시간 : ", data[index].createdAt.toString(), "/duration : ", data[index].duration);
      // console.log("마감 시간 : ", expire_time.toString());
      // console.log("현재 시간 : ", now.toString());

      let diff = expire_time - now;
      var hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var sec = Math.floor((diff % (1000 * 60)) / 1000);

      data[index].remain_time = hour+'시간'+min+'분 남음!!'
      data[index].int_remain_time = hour*60 + min;
      // console.log("남은 시간 : ", hour, '시', min, '분', sec, '초')
      // console.log("\n");
    }
  }
  
  return data;
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
