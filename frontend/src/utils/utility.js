const formatCamelCase = str => {
	return str
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, str => str.toUpperCase())
		.trim()
}

const formatTo12Hour = timeStr => {
	const [hours, minutes] = timeStr.split(':').map(Number)
	const period = hours >= 12 ? 'PM' : 'AM'
	const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export { formatCamelCase, formatTo12Hour }
