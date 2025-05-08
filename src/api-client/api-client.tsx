// src/apiService.ts
import axios from 'axios';

const API_BASE_URL = 'http://172.22.31.151:3001'; // Adjust the base URL as needed

export interface DeclineCurveParams {
  selected_wells:any;
  forecast_days: number ;
  selected_models: string[];
}

export interface TypeWellParams {
  // excel_file: string;
  selected_wells: string[];
  selected_models: string[];
}
export interface TArima {
well_name: string
model: string
input_features?: string[]
}
export interface TArimaNew {
  well_name  :string,
  start_p:number,
  d:number,
  start_q:number,
  max_p:number,
  max_d:number,
  max_q:number,


}


export interface TArimaNewTWO {
  "well_name": string,
  "all_vars": string,
  "forecast_horizon":number,
 "train_ratio": number,
   "order":string

}

export interface TArimaNewXTWO {
  "well_name": string,
  "var_target_col": string,
  "var_lam_rate": number,
  "var_df": {},
 "train_ratio": number,
   "order":string,
   "var_exo_cols":string
     // "var_lam_rate":allData.var_lam_rate,
  // "var_exo_cols":allData.var_exo_cols

}
export interface TNewAutoArimaPosts {
  well_name  :string,
  start_p:number,
  d:number,
  start_q:number,
  max_p:number,
  max_d:number,
  max_q:number,
  train_ratio:number,
  

}
export interface TNewAutoArimaPostsX {
  well_name  :string,
  start_p:number,
  d:number,
  start_q:number,
  max_p:number,
  max_d:number,
  max_q:number,
  train_ratio:number,
  input_features: string[]
  forecast_horizon:number

}

// "well_name": "SPH-04",
// "start_p": 0,
// "d": 0,
// "start_q": 0,
// "max_p": 3,
// "max_d": 2,
// "max_1": 3,
// "train_ratio": 0.8,
// "order": "1,2,3"

export const declineCurveAnalysis = async (params: DeclineCurveParams) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/decline_curve_analysis`,  params );
    return response.data;
  } catch (error) {
    console.error('Error during decline curve analysis:', error);
    throw error;
  }
};

export const typeWellAnalysis = async (params: TypeWellParams) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/type_well_analysis`, params );
    return response.data;
  } catch (error) {
    console.error('Error during type well analysis:', error);
    throw error;
  }
};
export const ArimaPosts = async (params: TArima) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/arima_analysis`, params );
    return response.data;
  } catch (error) {
    console.error('Error during type well analysis:', error);
    throw error;
  }
};
export const NewArimaPosts = async (params: TArimaNew) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pre_arima_analysis`, params );
    return response.data;
  } catch (error) {
    console.error('Error during type well analysis:', error);
    throw error;
  }
};
export const NewArimaPostsStepTWO = async (params: TArimaNewTWO) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/arima_analysis`, params );
    return response.data;
  } catch (error) {
    console.error('Error during type well analysis:', error);
    throw error;
  }
};

export const NewArimaXPosts = async (params: TArimaNew) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pre_arimax_analysis`, params );
    return response.data;
  } catch (error) {
    console.error('Error during type well analysis:', error);
    throw error;
  }
};
export const NewArimaXPostsStepTWO = async (params: TArimaNewTWO) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/arimax_analysis`, params );
    return response.data;
  } catch (error) {
    console.error('Error during type well analysis:', error);
    throw error;
  }
};
export const NewAutoArimaPosts = async (params: TNewAutoArimaPosts) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auto_arima_analysis`, params );
    return response.data;
  } catch (error) {
    console.error('Error during type well analysis:', error);
    throw error;
  }
};
export const NewAutoArimaXPosts = async (params: TNewAutoArimaPostsX) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auto_arimax_analysis`, params );
    return response.data;
  } catch (error) {
    console.error('Error during type well analysis:', error);
    throw error;
  }
};

