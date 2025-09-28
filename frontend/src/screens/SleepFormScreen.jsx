import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateSleepScheduleMutation } from '../slices/sleepApiSlice'

const SleepFormScreen = () => {
	const [currentBedtime, setCurrentBedtime] = useState('')
	const [currentWaketime, setCurrentWaketime] = useState('')
	const [targetBedtime, setTargetBedtime] = useState('')
	const [targetWaketime, setTargetWaketime] = useState('')
	const [maxShiftPerDay, setMaxShiftPerDay] = useState('15')
	const [error, setError] = useState('')

	const navigate = useNavigate()
	const [createSleepSchedule] = useCreateSleepScheduleMutation()

	const handleSubmit = async e => {
		e.preventDefault()

		const formData = {
			currentBedtime: '23:00',
			currentWaketime: '07:00',
			targetBedtime: '21:00',
			targetWaketime: '05:00',
			maxShiftPerDay: 30
		}
		const schedule = sleepSchedule(
			formData.currentBedtime,
			formData.currentWaketime,
			formData.targetBedtime,
			formData.targetWaketime,
			formData.maxShiftPerDay
		)
		try {
			const result = await createSleepSchedule({
				formData,
				schedule
			}).unwrap()
			console.log('Schedule created:', result)
			setError('')
			navigate('/sleep-schedules')
		} catch (error) {
			console.error('Error creating schedule:', error)
			console.error('Full error object:', JSON.stringify(error, null, 2))
			setError('Schedule could not be created. Please try again.')
		}
	}

	return (
		<div>
			Sleep Form
			<form action='' method='POST' onSubmit={handleSubmit}>
				<div>
					<label htmlFor='currentBedtime'>Current Bedtime:</label>
					<input
						type='time'
						id='currentBedtime'
						name='currentBedtime'
						value={currentBedtime}
						onChange={e => setCurrentBedtime(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor='currentWaketime'>Current Wake Time:</label>
					<input
						type='time'
						id='currentWaketime'
						name='currentWaketime'
						value={currentWaketime}
						onChange={e => setCurrentWaketime(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor='targetBedtime'>Target Bedtime:</label>
					<input
						type='time'
						id='targetBedtime'
						name='targetBedtime'
						value={targetBedtime}
						onChange={e => setTargetBedtime(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor='targetWaketime'>Target Wake Time:</label>
					<input
						type='time'
						id='targetWaketime'
						name='targetWaketime'
						value={targetWaketime}
						onChange={e => setTargetWaketime(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor='maxShiftPerDay'>Max Shift Per Day:</label>
					<select
						id='maxShiftPerDay'
						name='maxShiftPerDay'
						value={maxShiftPerDay}
						onChange={e => setMaxShiftPerDay(e.target.value)}>
						<option value='15'>15 minutes</option>
						<option value='30'>30 minutes</option>
						<option value='60'>1 hour</option>
					</select>
				</div>
				<button type='submit'>Generate Schedule</button>
			</form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	)
}

function sleepSchedule(
	currentBedtime,
	currentWaketime,
	targetBedtime,
	targetWaketime,
	maxShiftPerDay
) {
	// convert times to minutes since midnight for easier calculations
	const timeToMins = time => {
		const [hours, minutes] = time.split(':').map(Number)
		return hours * 60 + minutes
	}
	const minsToTime = mins => {
		const hours = Math.floor(mins / 60) % 24
		const minutes = mins % 60
		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}`
	}
	const direction =
		timeToMins(targetBedtime) < timeToMins(currentBedtime)
			? 'advance'
			: 'delay'

	const currentBedMins = timeToMins(currentBedtime)
	const currentWakeMins = timeToMins(currentWaketime)
	const targetBedMins = timeToMins(targetBedtime)
	const targetWakeMins = timeToMins(targetWaketime)
	const maxShift = maxShiftPerDay

	const totalShiftMins = targetBedMins - currentBedMins
	const sign = direction === 'advance' ? -1 : 1
	const steps = Math.ceil(Math.abs(totalShiftMins) / maxShift)
	const dailyShiftMins = sign * Math.min(maxShift, Math.abs(totalShiftMins))

	const schedule = []

	for (let day = 1; day <= steps; day++) {
		const newBedtime = currentBedMins + day * dailyShiftMins
		const newWaketime = currentWakeMins + day * dailyShiftMins
		const caffeineCutoff = newBedtime - 8 * 60 // 8 hours before new bedtime

		let lightExposure = {}
		let exerciseWindow = ''
		if (direction === 'advance') {
			lightExposure = {
				morningBrightLight: {
					start: minsToTime(newWaketime + 30),
					duration: '20-60 mins'
				},
				eveningDimLight: {
					start: minsToTime(newBedtime - 120),
					duration: 'until bedtime'
				}
			}
			exerciseWindow = 'morning'
		} else if (direction === 'delay') {
			lightExposure = {
				eveningBrightLight: {
					start: minsToTime(newBedtime - 120),
					duration: '20-60 mins'
				},
				morningDimLight: {
					start: minsToTime(newWaketime),
					duration: '1 hour'
				}
			}
			exerciseWindow = 'lateAfternoon'
		}
		schedule.push({
			day,
			bedtime: minsToTime(newBedtime),
			waketime: minsToTime(newWaketime),
			lightExposure,
			exerciseWindow,
			caffeineCutoff: minsToTime(caffeineCutoff)
		})
	}
	return schedule
}

export default SleepFormScreen
