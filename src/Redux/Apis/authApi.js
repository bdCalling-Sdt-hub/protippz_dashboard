import { baseApi } from "../BaseUrl";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // user login
        loginUser: builder.mutation({
            query: (data) => {
                return {
                    url: 'auth/login',
                    method: 'POST',
                    body: data
                }
            },
            invalidatesTags: ['auth', 'category']
        }),
        // send verify email
        forgetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: 'auth/forget-password',
                    method: 'POST',
                    body: data
                }
            },
            invalidatesTags: ['auth']
        }),
        // verify code 
        verifyCode: builder.mutation({
            query: (data) => {
                return {
                    url: 'auth/verify-reset-otp',
                    method: 'POST',
                    body: data
                }
            },
            invalidatesTags: ['auth']
        }),
        // reset password 
        resetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: 'auth/reset-password',
                    method: 'POST',
                    body: data,
                    headers: {
                        Authorization: `Bearer ${JSON.parse((localStorage.getItem('accessToken'))) || ""}`,
                    }
                }
            },
            invalidatesTags: ['auth']
        }),
        // change password 
        changePassword: builder.mutation({
            query: (data) => {
                return {
                    url: 'auth/change-password',
                    method: 'PATCH',
                    body: data
                }
            },
            invalidatesTags: ['auth']
        }),
        getProfile: builder.query({
            query: () => {
                const token = localStorage.getItem('token');
                if (token) {
                    return {
                        url: 'user/get-my-profile',
                        method: 'GET',
                    };
                } else {
                    console.log('No token found, API not called.');
                    return null;
                }
            },
            providesTags: ['auth'],
        })
    })
})
export const {
    //user login
    useLoginUserMutation,
    // send verify email
    useForgetPasswordMutation,
    // verify code
    useVerifyCodeMutation,
    //reset password 
    useResetPasswordMutation,
    //change password
    useChangePasswordMutation,
    // update user 
    useUpdateUserMutation,
    // update doctor
    useUpdateDoctorMutation,
    // get profile 
    useGetProfileQuery,
} = authApi