import { apiSlice } from './apiSlice'
const SLEEP_URL = '/api/sleep-schedules'

//** Create endpoints here & injects into apiSlice.endpoint
export const sleepApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		createSleepSchedule: builder.mutation({
			query: data => ({
				url: `${SLEEP_URL}`,
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['Sleep']
		}),
		getSleepSchedules: builder.query({
			query: () => ({
				url: `${SLEEP_URL}`,
				method: 'GET'
			}),
			providesTags: ['Sleep']
		}),
		getSleepSchedule: builder.query({
			query: id => ({
				url: `${SLEEP_URL}/${id}`,
				method: 'GET'
			}),
			providesTags: ['Sleep']
		}),
		deleteSleepSchedule: builder.mutation({
			query: id => ({
				url: `${SLEEP_URL}/${id}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['Sleep']
		}),
		updateSleepSchedule: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `${SLEEP_URL}/${id}`,
				method: 'PUT',
				body: data
			}),
			invalidatesTags: ['Sleep']
		})
	})
})

export const {
	useCreateSleepScheduleMutation,
	useGetSleepSchedulesQuery,
	useDeleteSleepScheduleMutation,
	useUpdateSleepScheduleMutation
} = sleepApiSlice
