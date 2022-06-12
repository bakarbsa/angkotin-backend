import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/Response';
import axios from 'axios';
import { InstanceInterface, PredictionInterface } from '../interfaces/PredictionInterface';

const PREDICT_API = 'http://34.66.224.150:8501/v1/models/angkotin_model:predict';

const getWeatherAPI = (latitude: number, longitude: number) => {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=cdab90849378b2a17b22fdca0f6b1d4e`
}

const getWeather = (latitude: number, longitude: number) => {
  return axios.get(getWeatherAPI(latitude, longitude)).then((value) => value);
}

export async function getPrediction(req: Request, res: Response) {
  const { jalur, awal, akhir, kecepatan, latitude, longitude } = req.body;
  const jam = new Date().getHours();
  let formattedHours = '';
  let cuaca = '';

  if (!jalur || !awal || !akhir || !kecepatan || !latitude || !longitude) {
    res.status(404).json(<APIResponse> {
      success: false,
      message: 'Body data cant be null',
    })
    return;
  }

  const weatherId = await getWeather(latitude, longitude)
    .then((value) => value.data.weather[0].id)
    .catch((err) => err);
    
  if (jam >= 6 && jam <= 8) {
    formattedHours = '06.00 - 09.00';
  } else if (jam >= 9 && jam <= 11) {
    formattedHours = '09.00 - 12.00';
  } else if (jam >= 12 && jam <= 15) {
    formattedHours = '12.00 - 16.00';
  } else if (jam >= 16 && jam <= 17) {
    formattedHours = '16.00 - 18.00';
  } else if (jam >= 18 && jam <= 20) {
    formattedHours ='18.00 - 21.00';
  } else {
    formattedHours = '21.00 - 06.00';
  }

  if (weatherId >= 800) {
    cuaca = "CERAH";
  } else {
    cuaca = "HUJAN";
  }

  const instance: InstanceInterface = {
    jalur: jalur,
    awal: awal,
    akhir: akhir,
    kecepatan: kecepatan,
    cuaca: cuaca,
    jam: formattedHours,
  } as InstanceInterface;

  const data = JSON.stringify(<PredictionInterface>{
    instances: [
      instance,
    ]
  });
  
  const config = {
    method: 'post',
    url: PREDICT_API,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
    .then((value) => {
      res.status(200).json(<APIResponse<Object>>{
        success: true,
        data: value.data,
      });
      return;
    })
    .catch((err) => {
      res.status(500).json(<APIResponse> {
        success: false,
        err: err,
      });
      return;
    });
    return;
}