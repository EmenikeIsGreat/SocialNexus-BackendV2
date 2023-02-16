const mongoose = require('mongoose');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');



const AssetTracking = new mongoose.Schema({
        name:String,
        creator:String,
        initialized:Boolean,
        hasPic:Boolean,

    
        yearlyChart:[Number],
        monthlyChart:[Number],
        weeklyChart:[Number],
        dailyChart:[Number],
        minuteChart:[Number],

        stats:{
            dailyHigh: Number,
            dailyLow:Number,
            todaysVolume:Number,
            averageVolume:Number,
            highestPeakWeek:Number,
            lowestPeakWeek:Number,
            supply:Number,
            popularity:Number,
            marketCap:Number,
            deltaWeek:Object,
            deltaDay:Object,
            deltaMonth:Object,
            deltaYear:Object,
            volumeAcrossFiveDays:[Number],
            withinMinuteData:[Number]
        }

},
    
    { timestamps: true },
)


AssetTracking.plugin(mongoose_fuzzy_searching, { fields: ['name'] });


module.exports = mongoose.model('Assets', AssetTracking)

