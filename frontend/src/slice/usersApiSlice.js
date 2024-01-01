import { apiSlice } from './apiSlice'
const USERS_URL = '/api/users'

//** Create endpoints here & injects into apiSlice.endpoint
export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation({
			query: data => ({
				url: `${USERS_URL}/auth`,
				method: 'POST',
				body: data
			})
		})
	})
})

export const { useLoginMutation } = usersApiSlice
