import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com';

export const fetchPhotos = (searchQuery, page) => {
  const axiosOption = {
    params: {
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 15,
      key: '45516244-7009a6d8a44aa98a2987db7ac',
    },
  };

  return axios.get(`/api/`, axiosOption);
};