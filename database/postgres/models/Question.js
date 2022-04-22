const Sequelize = require ("sequelize");
const postgres = require('../index');
const { DataTypes } = Sequelize;

const Question = postgres.define('Question', {
    _id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    question_body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    
    question_date: {
        type: DataTypes.BIGINT,
        defaultValue: () => new Date(),
    },
    
    asker_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    asker_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    reported : {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    
    question_helpfulness : {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    

    
    // answers: [{ 
    //     type: DataTypes.ARRAY(DataTypes.INTEGER)
    // }],
  
  },
  {
    timestamps: false,
  }
  );

//   const Question = postgres.define('Question', {
//     id: {
//       type: DataTypes.INTEGER,
//       unique: true,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     product_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     body: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
    
//     date_written: {
//         type: DataTypes.BIGINT,
//         defaultValue: () => new Date().getTime(),
//     },
    
//     asker_name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },

//     asker_email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
    
//     helpful : {
//         type: DataTypes.INTEGER,
//         defaultValue: 0,
//     },
    
//     reported : {
//         type: DataTypes.INTEGER,
//         defaultValue: 0,
//     },
    
//     // answers: [{ 
//     //     type: DataTypes.ARRAY(DataTypes.INTEGER)
//     // }],
  
//   },
//   {
//     timestamps: false,
//   }
//   );
  
  
  module.exports = Question;