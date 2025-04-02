import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CHARACTER_NAME_REGEX } from '../../constants';

const initialState = {
  selectedCharacter: null,
  characterName: null,
}

export const setCharacterName = createAsyncThunk(
  'onboarding/setCharacterName',
  async (characterName,  { getState, rejectWithValue }) => {
    try {
      
      if(CHARACTER_NAME_REGEX.test(characterName)) {
        return characterName;
      }
      else{
        return rejectWithValue({
          message: 'Invalid character name',
        })
      }
      
    } catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  }
);

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setSelectedCharacter: (state, action) => ({
      ...state,
      selectedCharacter: {
        ...state.selectedCharacter,
        id: action.payload.id,
        imageUrl: action.payload.imageUrl,
      }
    }),
    resetOnboarding: (state, action) => (initialState)
  },
  extraReducers: (builder) => {
    builder
    .addCase(setCharacterName.fulfilled, (state, action) => {
      return {
        ...state,
        characterName: action.payload
      }
    })
    .addCase(setCharacterName.rejected, (state, action) => {
      return state;
    })
  }
})

// Action creators are generated for each case reducer function
export const { setSelectedCharacter, resetOnboarding } = onboardingSlice.actions

export default onboardingSlice.reducer