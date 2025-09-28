import asyncHandler from 'express-async-handler'
import SleepSchedule from '../models/sleepScheduleModel.js'

// create sleep schedule
// get all sleep schedules for user
// get single sleep schedule by id
// update sleep schedule
// delete sleep schedule

// @desc	Create a new sleep schedule
// @route	POST /api/sleep-schedules
// @access	Private
const createSleepSchedule = asyncHandler(async (req, res) => {
	const { formData, schedule } = req.body
	const {
		currentBedtime,
		currentWaketime,
		targetBedtime,
		targetWaketime,
		maxShiftPerDay
	} = formData

	const sleepSchedule = new SleepSchedule({
		user: req.user._id,
		currentBedtime,
		currentWaketime,
		targetBedtime,
		targetWaketime,
		maxShiftPerDay: Number(maxShiftPerDay),
		schedule
	})

	const createdSchedule = await sleepSchedule.save()
	res.status(201).json(createdSchedule)
})

// @desc	Get all sleep schedules for a user
// @route	GET /api/sleep-schedules
// @access	Private
const getSleepSchedules = asyncHandler(async (req, res) => {
	try {
		const schedules = await SleepSchedule.find({ user: req.user._id })
		res.json(schedules)
	} catch (error) {
		res.status(500)
		throw new Error('Server error: ' + error.message)
	}
})

// @desc	Get a single sleep schedule by ID
// @route	GET /api/sleep-schedules/:id
// @access	Private
const getSleepScheduleById = asyncHandler(async (req, res) => {
	try {
		const schedule = await SleepSchedule.findById(req.params.id)
		if (schedule) {
			// Ensure the schedule belongs to the authenticated user
			if (schedule.user.toString() !== req.user._id.toString()) {
				res.status(403)
				throw new Error('Not authorized to access this schedule')
			}
			res.json(schedule)
		} else {
			res.status(404)
			throw new Error('Schedule not found')
		}
	} catch (error) {
		res.status(500)
		throw new Error('Server error: ' + error.message)
	}
})

// @desc	Update a sleep schedule
// @route	PUT /api/sleep-schedules/:id
// @access	Private
const updateSleepSchedule = asyncHandler(async (req, res) => {
	try {
		const schedule = await SleepSchedule.findById(req.params.id)
		if (schedule) {
			// Ensure the schedule belongs to the authenticated user
			if (schedule.user.toString() !== req.user._id.toString()) {
				res.status(403)
				throw new Error('Not authorized to update this schedule')
			}
			const {
				currentBedtime,
				currentWaketime,
				targetBedtime,
				targetWaketime,
				maxShiftPerDay,
				newSchedule
			} = req.body
			schedule.currentBedtime = currentBedtime || schedule.currentBedtime
			schedule.currentWaketime =
				currentWaketime || schedule.currentWaketime
			schedule.targetBedtime = targetBedtime || schedule.targetBedtime
			schedule.targetWaketime = targetWaketime || schedule.targetWaketime
			schedule.maxShiftPerDay = maxShiftPerDay || schedule.maxShiftPerDay
			schedule.schedule = newSchedule || schedule.schedule
			const updatedSchedule = await schedule.save()
			res.json(updatedSchedule)
		} else {
			res.status(404)
			throw new Error('Schedule not found')
		}
	} catch (error) {
		res.status(500)
		throw new Error('Server error: ' + error.message)
	}
})

// @desc	Delete a sleep schedule
// @route	DELETE /api/sleep-schedules/:id
// @access	Private
const deleteSleepSchedule = asyncHandler(async (req, res) => {
	try {
		const schedule = await SleepSchedule.findById(req.params.id)
		if (schedule) {
			// Ensure the schedule belongs to the authenticated user
			if (schedule.user.toString() !== req.user._id.toString()) {
				res.status(403)
				throw new Error('Not authorized to delete this schedule')
			}
			await SleepSchedule.findByIdAndDelete(req.params.id)
			res.json({ message: 'Schedule removed' })
		} else {
			res.status(404)
			throw new Error('Schedule not found')
		}
	} catch (error) {
		res.status(500)
		throw new Error('Server error: ' + error.message)
	}
})

export {
	createSleepSchedule,
	getSleepSchedules,
	getSleepScheduleById,
	updateSleepSchedule,
	deleteSleepSchedule
}
