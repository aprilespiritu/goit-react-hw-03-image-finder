import React, { Component } from 'react';
import { getAPI } from 'pixabay-api';

class App extends Component {
  state = {
    images: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    isError: false,
    isEnd: false,
  };

  
}