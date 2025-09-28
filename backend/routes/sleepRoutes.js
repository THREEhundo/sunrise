import express from 'express'
import {
	createSleepSchedule,
	getSleepSchedules,
	getSleepScheduleById,
	updateSleepSchedule,
	deleteSleepSchedule
} from '../controllers/sleepScheduleController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
	.route('/')
	.post(protect, createSleepSchedule)
	.get(protect, getSleepSchedules)

router
	.route('/:id')
	.get(protect, getSleepScheduleById)
	.put(protect, updateSleepSchedule)
	.delete(protect, deleteSleepSchedule)
export default router
