// store/slices/movieSlice.ts

import { Movie } from "@/types/movie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;



export interface MovieState {
  trending: Movie[];
  fetchedTrending: boolean;
  movies: Movie[];
  selectedMovie: Movie | null;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  trending: [],
    fetchedTrending: false,
  movies: [],
  selectedMovie: null,
  totalPages: 0,
  loading: false,
  error: null,
};

// 1. Fetch Trending Movies
export const fetchTrendingMovies = createAsyncThunk(
  "movies/fetchTrending",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/movies?page=1`);
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// 2. Fetch Movies by Mood + Pagination
export const fetchMoviesByMood = createAsyncThunk(
  "movies/fetchByMood",
  async ({ mood, page }: { mood?: string; page?: number }, thunkAPI) => {
    try {
      const query = mood ? `?mood=${mood}&page=${page}` : `?page=${page}`;
      const res = await axios.get(`${API_URL}/movies${query}`);
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// 3. Fetch Movie by ID
export const fetchMovieById = createAsyncThunk(
  "movies/fetchById",
  async (id: string, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/movies/${id}`);
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrendingMovies.pending, (state) => {
        if (state.trending.length === 0) {
          state.loading = true;
        }
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending = action.payload.results;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
        state.fetchedTrending = true;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Movies by mood
      .addCase(fetchMoviesByMood.pending, (state) => {
        if (state.movies.length === 0) {
          state.loading = true;
        }
      })
      .addCase(fetchMoviesByMood.fulfilled, (state, action) => {
        state.movies = action.payload.results;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchMoviesByMood.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Movie by ID
      .addCase(fetchMovieById.pending, (state) => {
        // Always show loading state and clear previous selection
        // to avoid briefly rendering the previous movie while the new one loads.
        state.loading = true;
        state.selectedMovie = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.selectedMovie = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default movieSlice.reducer;
