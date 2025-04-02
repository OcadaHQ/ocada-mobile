import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

const initialState = {
  isDisplayed: false,
  message: null,
  detail: null,
}


export const setError = createAsyncThunk(
  'error/setError',
  async ( { message, detail }) => {
    Alert.alert(
      title='Oops, it\'s an error',
      message=message
    )
    return params;
  }
);

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    clearError: (state, action) => initialState
  },
  extraReducers: (builder) => {
  //   [setError.fulfilled]: (state, action) => {
  //     return {
  //       ...state,
  //       isDisplayed: true,
  //       message: action.payload.message,
  //       detail: action.payload.detail,
  //     }
  // },
  // [setError.rejected]: (state, action) => state
  }
})

export const { clearError } = errorSlice.actions

export default errorSlice.reducer