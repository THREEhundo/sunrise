import { useGetSleepSchedulesQuery } from '../slices/sleepApiSlice'
import { formatTo12Hour, formatCamelCase } from '../utils/utility'

const SleepSchedulesScreen = () => {
	const { data: schedules, error, isLoading } = useGetSleepSchedulesQuery()

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error loading schedules</div>

	return (
		<div>
			<h1>Sleep Schedules</h1>
			{schedules && schedules.length > 0 ? (
				schedules.map(schedule => (
					<div
						key={schedule._id}
						style={{
							marginBottom: '20px',
							border: '1px solid #ccc',
							padding: '10px'
						}}>
						<h3>
							Schedule created:{' '}
							{new Date(schedule.createdAt).toLocaleDateString()}
						</h3>
						<p>
							<strong>Current:</strong>{' '}
							{formatTo12Hour(schedule.currentBedtime)} -{' '}
							{formatTo12Hour(schedule.currentWaketime)}
						</p>
						<p>
							<strong>Target:</strong>{' '}
							{formatTo12Hour(schedule.targetBedtime)} -{' '}
							{formatTo12Hour(schedule.targetWaketime)}
						</p>
						<p>
							<strong>Max shift per day:</strong>{' '}
							{schedule.maxShiftPerDay} minutes
						</p>
						<div>
							<h4>Daily Schedule:</h4>
							{schedule.schedule.map((day, index) => (
								<div key={index} style={{ marginLeft: '20px' }}>
									<p>
										<strong>Day {day.day}:</strong>{' '}
										{formatTo12Hour(day.bedtime)} -{' '}
										{formatTo12Hour(day.wakeTime)}
									</p>
									<p>Light Exposure</p>
									<p>
										{Object.keys(day.lightExposure).map(
											(key, index) => {
												const exposure =
													day.lightExposure[key]
												console.log(
													'Exposure:',
													exposure
												)
												return (
													<span key={index}>
														{formatCamelCase(key)}:{' '}
														{formatTo12Hour(
															exposure.start
														)}{' '}
														({exposure.duration}){' '}
													</span>
												)
											}
										)}
									</p>
									<p>Exercise Window: {day.exerciseWindow}</p>
									<p>Caffeine Cutoff: {day.caffeineCutoff}</p>
								</div>
							))}
						</div>
					</div>
				))
			) : (
				<p>No sleep schedules found</p>
			)}
		</div>
	)
}

export default SleepSchedulesScreen
