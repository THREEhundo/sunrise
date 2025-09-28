import mongoose from 'mongoose'

const sleepScheduleSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		currentBedtime: { type: String, required: true },
		currentWaketime: { type: String, required: true },
		targetBedtime: { type: String, required: true },
		targetWaketime: { type: String, required: true },
		maxShiftPerDay: { type: Number, required: true },
		schedule: [
			{
				day: { type: String, required: true },
				bedtime: { type: String, required: true },
				wakeTime: { type: String, required: true },
				lightExposure: { type: Object, required: true },
				exerciseWindow: { type: String, required: true },
				caffeineCutoff: { type: String, required: true }
			}
		]
	},
	{
		timestamps: true
	}
)

const SleepSchedule = mongoose.model('SleepSchedule', sleepScheduleSchema)

export default SleepSchedule
