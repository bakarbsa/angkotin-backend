export interface InstanceInterface {
  jalur: string,
  awal: number,
  akhir: number,
  kecepatan: number,
  cuaca: string,
  jam: string,
}

export interface PredictionInterface {
  instances: Array<InstanceInterface>
}


