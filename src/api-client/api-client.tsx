// src/apiService.ts
import axios from 'axios';

const API_BASE_URL = 'http://172.22.31.155:3001'; // Adjust the base URL as needed

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

export const declineCurveAnalysis = async (params: DeclineCurveParams) => {
  try {
    console.log(params,"params")
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