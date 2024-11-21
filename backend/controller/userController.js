const User = require('../models/User');

const addPeriodDate = async (req, res) => {
    const { periodDate, height, weight } = req.body;
    console.log('Calendar backend Session:', req.session.user);
    console.log('request sent from frontend:', req.body);
    const userId = req.session.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateFields = {};

        // Update periodDates array if the new periodDate is not a duplicate of the last date
        const newPeriodDate = new Date(periodDate);
        if (
            user.periodDates.length === 0 ||
            user.periodDates[user.periodDates.length - 1].toISOString().substring(0, 10) !== periodDate
        ) {
            user.periodDates.push(newPeriodDate);
            if (user.periodDates.length > 10) {
                user.periodDates.shift(); // Keep only the 10 most recent dates
            }
            updateFields.periodDates = user.periodDates;
        }

        // Update height if it has changed
        if (user.height !== parseFloat(height)) {
            updateFields.height = parseFloat(height);
        }

        // Update weight if it has changed
        if (user.weight !== parseFloat(weight)) {
            updateFields.weight = parseFloat(weight);
        }

        // Only perform the update if there are fields to update
        if (Object.keys(updateFields).length > 0) {
            await User.updateOne({ _id: userId }, { $set: updateFields });
        }

        return res.status(200).json({
            message: 'User information updated successfully'
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Error updating user information' });
    }
};



const getTrackerData = async (req, res) => {
    
    console.log('Tracker backend Session:', req.session.user);
    const userId = req.session.user.id;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate period delay (cycle length)
        let cycleLength = 0;
        const lastPeriod=user.periodDates[user.periodDates.length - 1];
        if (user.periodDates.length >= 2) {
            const secondLastPeriod = user.periodDates[user.periodDates.length - 2];
            cycleLength = Math.floor((lastPeriod - secondLastPeriod) / (1000 * 60 * 60 * 24));
        }
        else
        {
            cycleLength = 'Not enough data to calculate cycle length'; 
        }

        // Calculate BMI
        const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);

        return res.status(200).json({ cycleLength, bmi, lastPeriod});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Error fetching tracker data' });
    }
};



module.exports = {
    addPeriodDate,
    getTrackerData
};






































// Function to add period date, update height, weight, and calculate period delay and BMI

// const addPeriodDate = async (req, res) => {
//     const { userId, periodDate } = req.body;

//     try {
//         // Add the new period date to the user's periodDates array using findByIdAndUpdate
//         const user = await User.findByIdAndUpdate(
//             userId,
//             {
//                 $push: { periodDates: new Date(periodDate) },
//                 $slice: { periodDates: -10 } // Keeps only the most recent 10 period dates
//             },
//             { new: true } // Returns the updated document
//         );

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Calculate the cycle length (days between the last two periods)
//         let cycleLength = 0;
//         if (user.periodDates.length >= 2) {
//             const lastPeriod = user.periodDates[user.periodDates.length - 1];
//             const secondLastPeriod = user.periodDates[user.periodDates.length - 2];
//             cycleLength = Math.floor((lastPeriod - secondLastPeriod) / (1000 * 60 * 60 * 24)); // Difference in days
//         }

//         return res.status(200).json({ cycleLength });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Error updating period date' });
//     }
// };


// const addPeriodDateAndUpdateBMI = async (req, res) => {
//     const { userId, periodDate, height, weight } = req.body;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Add the new period date to the user's periodDates array
//         user.periodDates.push(new Date(periodDate));

//         // Keep only the most recent 10 period dates
//         if (user.periodDates.length > 10) {
//             user.periodDates.shift();
//         }

//         // Update height and weight
//         user.height = height;
//         user.weight = weight;

//         await user.save();

//         // Calculate the cycle length (days between the last two periods)
//         let cycleLength = 0;
//         if (user.periodDates.length >= 2) {
//             const lastPeriod = user.periodDates[user.periodDates.length - 1];
//             const secondLastPeriod = user.periodDates[user.periodDates.length - 2];
//             cycleLength = Math.floor((lastPeriod - secondLastPeriod) / (1000 * 60 * 60 * 24));
//         }

//         // Calculate BMI
//         const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);

//         return res.status(200).json({ cycleLength, bmi });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Error updating user data' });
//     }
// };

// Function to get tracker data (cycle length and BMI) for the user




// const User = require('../models/User');

// // Function to add period date and calculate cycle length and BMI
// const addPeriodAndCalculate = async (req, res) => {
//     const { userId, periodDate, height, weight } = req.body;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update the user's height and weight if provided
//         if (height && weight) {
//             user.height = height;
//             user.weight = weight;
//         }

//         // Add the new period date to the user's periodDates array
//         if (periodDate) {
//             user.periodDates.push(new Date(periodDate));

//             // Keep only the most recent 10 period dates
//             if (user.periodDates.length > 10) {
//                 user.periodDates.shift();
//             }
//         }

//         await user.save();

//         // Recalculate cycle length and BMI
//         const { cycleLength, bmi } = calculateCycleAndBMI(user);

//         return res.status(200).json({ cycleLength, bmi });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Error updating period date' });
//     }
// };

// // Function to calculate cycle length and BMI based on user details
// const calculateCycleAndBMI = (user) => {
//     let cycleLength = 0;

//     // Calculate the cycle length (days between the last two periods)
//     if (user.periodDates.length >= 2) {
//         const lastPeriod = user.periodDates[user.periodDates.length - 1];
//         const secondLastPeriod = user.periodDates[user.periodDates.length - 2];
//         cycleLength = Math.floor((lastPeriod - secondLastPeriod) / (1000 * 60 * 60 * 24)); // Difference in days
//     }

//     // Calculate BMI
//     let bmi = 0;
//     if (user.height && user.weight) {
//         const heightInMeters = user.height / 100; // Assuming height is in centimeters
//         bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(2);
//     }

//     return { cycleLength, bmi };
// };

// // Function to fetch user data and calculate cycle length and BMI (for skip)
// const getTrackerData = async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Recalculate cycle length and BMI
//         const { cycleLength, bmi } = calculateCycleAndBMI(user);

//         return res.status(200).json({ cycleLength, bmi });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Error fetching tracker data' });
//     }
// };

// module.exports = { addPeriodAndCalculate, getTrackerData };






// const User = require('../models/User'); // Assuming User schema is in models/User.js

// // Add a new period date for the user
// const addPeriodDate = async (req, res) => {
//     const { userId, periodDate } = req.body;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Add the new period date to the user's periodDates array
//         user.periodDates.push(new Date(periodDate));

//         // Keep only the most recent 10 period dates
//         if (user.periodDates.length > 10) {
//             user.periodDates.shift();
//         }

//         await user.save();

//         // Calculate the cycle length (days between the last two periods)
//         let cycleLength = 0;
//         if (user.periodDates.length >= 2) {
//             const lastPeriod = user.periodDates[user.periodDates.length - 1];
//             const secondLastPeriod = user.periodDates[user.periodDates.length - 2];
//             cycleLength = Math.ceil((lastPeriod - secondLastPeriod) / (1000 * 60 * 60 * 24)); // Difference in days
//         }

//         return res.status(200).json({ cycleLength });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Error updating period date' });
//     }
// };

// // Calculate BMI based on height and weight
// const calculateBMI = async (req, res) => {
//     const { height, weight } = req.body;

//     if (!height || !weight) {
//         return res.status(400).json({ message: 'Height and weight are required' });
//     }

//     try {
//         // BMI Formula: weight (kg) / height (m)^2
//         const heightInMeters = height / 100; // Convert height to meters
//         const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

//         return res.status(200).json({ bmi });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Error calculating BMI' });
//     }
// };

// module.exports = {
//     addPeriodDate,
//     calculateBMI,
// };



// const User = require('../models/User');

// // Add new period date and calculate cycle
// exports.addPeriodDate = async (req, res) => {
//     const { userId, periodDate } = req.body;
//     try {
//         let user = await User.findById(userId);
//         if (user.periodDates.length >= 10) user.periodDates.shift();  // Maintain last 10 entries
//         user.periodDates.push(periodDate);

//         // Calculate cycle length based on last 2 dates
//         let cycleLength = 0;
//         if (user.periodDates.length >= 2) {
//             const lastTwoPeriods = user.periodDates.slice(-2);
//             cycleLength = (lastTwoPeriods[1] - lastTwoPeriods[0]) / (1000 * 60 * 60 * 24);
//         }

//         await user.save();
//         res.status(200).json({ cycleLength });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating period date' });
//     }
// };

// // Calculate BMI
// exports.calculateBMI = (req, res) => {
//     const { height, weight } = req.body;
//     const bmi = weight / ((height / 100) ** 2);
//     res.status(200).json({ bmi });
// };
