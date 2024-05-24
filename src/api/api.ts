import axios from 'axios';

import { saveToLocalStorage } from './tokenStorage';
const url = `http://localhost:8080/`;
export const loginAPI = async (username: string, password: string) => {
  try {
    const response = await axios.post(url + 'login', {
      username,
      password,
    });
    if (response.data) {
      saveToLocalStorage('TOKEN', response.data);
      window.location.href='/';
    } else {
      alert('Invalid username or password.');
    }
    return response.data;
  } catch (error) {
    alert('Invalid username or password.');
  }
};

export const registerAPI = async (
  username: string,
  password: string,
) => {
  try {
    const response = await axios.post(url + 'register', {
      username,
      password,
    });
    if (response.data) {
      saveToLocalStorage('TOKEN', response.data);
      window.location.href='/';
    } else {
      alert('Username already registered.');
    }
    return response.data.status_code;
  } catch (error) {
    alert('Invalid username or password.');
  }
};
