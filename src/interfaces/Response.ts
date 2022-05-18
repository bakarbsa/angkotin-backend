export interface APIResponse<T = string> {
  success: boolean,
  data?: T,
  message: string,
  error?: any,
};