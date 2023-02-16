
const mongoose = require('mongoose');

const Portfolio = new mongoose.Schema({


        userID:String,
        currentPrice: Number,
        yearlyChart:[Number],
        monthlyChart:[Number],
        weeklyChart:[Number],
        dailyChart:[Number],
        minuteChart:[Number],
    
        stats:{
            deltaYear:Number,
            deltaWeek:Number,
            deltaDay:Number,
            deltaMonth:Number,
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model('userPortfolio', Portfolio)



