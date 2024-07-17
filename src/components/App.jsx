import React, { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { getAPI } from 'pixabay-api';
import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';

export class App extends Component {
  state = {
    images: [],
    page: 1,
    search: '',
    isLoading: false,
    isError: false,
    isEnd: false,
  };

  async componentDidUpdate(_prevProps, prevState) {
    const { search, page } = this.state;

    //Fetch new image when search or page changes 
    if (prevState.search !== search || prevState.page !== page) {
      await this.fetchImages(search, page);
    }
  };
  
  fetchImages = async (search, page) => {
    try {
      this.setState({ isLoading: true });
      //Fetch images from API
      const response = await getAPI(search, page);
      const { totalHits, hits } = response;
      console.log(hits, totalHits);

      //Checks if API returns images for the search query
      if (hits.length === 0) {
        toast.error('Sorry, there are no images found.Please try again.');
        return;
      }
      
      //Displays message when first page is loaded
      if (page === 1) {
        toast.success(`Hooray! We found ${totalHits} images!`);
      }

      //Checks if all found images have been shown
      if (page * 12 >= totalHits) {
        this.setState({ isEnd: true });
        toast("You have reached the end of your search results.", {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }

      this.setState(prevState => ({
        images: [...prevState.images, ...hits],
      }));
    } catch {
      //Handle errors 
      this.setState({ isError: true });
      toast.error('Oops, something went wrong! Reload this page!');
    } finally {
      //Resets loading state once API request is complete
      this.setState({ isLoading: false });
    }
  };

  handleSearchSubmit = e => {
    e.preventDefault();

    const { search } = this.state;
    const newSearch = e.target.search.value.trim().toLowerCase();

    //Check if new search
    if (newSearch !== search) {
      this.setState({
        search: newSearch,
        page: 1,
        images: []
      });
    } 
  };

  handleLoadMore = () => {
    //Load more images
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { images, isLoading, isError, isEnd } = this.state;
    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleSearchSubmit} />
        {/*Render ImageGallery*/}
        {images.length >= 1 && <ImageGallery images={images} />}
        {/*Render Load More Button*/}
        {images.length >= 1 && !isEnd && <Button onClick={this.handleLoadMore} />}
        {isLoading && <Loader />}
        {isError && toast.error('Oops, something went wrong! Reload this page!')}
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    );
  }
}

