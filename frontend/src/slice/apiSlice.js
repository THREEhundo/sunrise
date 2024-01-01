import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

//**  Basic structure for an API Slice

const baseQuery = fetchBaseQuery({ baseUrl: '' })

export const apiSlice = createApi({
	baseQuery,
	tagTypes: ['User'],
	endpoints: builder => ({})
})
