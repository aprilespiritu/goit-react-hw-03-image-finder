import React, { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { getAPI } from 'pixabay-api';
import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

class App extends Component {
  state = {
    images: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    isError: false,
    isEnd: false,
  };

  async componentDidUpdate(_prevProps, prevState) {
    const { searchQuery, currentPage } = this.state;

    //Fetch new image when search query or page changes 
    if (prevState.searchQuery !== searchQuery || prevState.currentPage !== currentPage) {
      await this.fetchImages();
    }
  }
  
  fetchImages = async () => {
    const { searchQuery, currentPage } = this.state;

    this.setState({ isLoading: true });

    try {
      const response = await getAPI(searchQuery, currentPage);

      console.log(response);

      const { totalHits, hits } = response;

      //Checks if API returns images for the search query
      if (hits.length === 0) {
        toast.error('Sorry, there are no images found.Please try again.');
        this.setState({ isLoading: false });
        return;
      }
      
      //Displays message when first page is loaded
      if (currentPage === 1) {
        toast.success(`Hooray! We found ${totalHits} images!`);
      }

      //Checks if all found images have been shown
      if (currentPage * 12 >= totalHits) {
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
        images: currentPage === 1 ? hits : [...prevState.images, ...hits],
        isEnd: prevState.images.length + hits.length >= totalHits,
      }));
    } catch (error) {
      //Handle errors 
      this.setState({ isError: true });
      toast.error('Oops, something went wrong! Reload this page!');
    } finally {
      //Resets loading state once API request is complete
      this.setState({ isLoading: false });
    }
  };

  handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = this.state.searchQuery.toLowerCase();

    //Check if searchbar is empty
    if (normalizedQuery === '') {
      Notify.failure(`Invalid search. Please try again.`);
      return;
    }

    //Prevent duplicate search
    if (normalizedQuery === normalizedCurrentQuery) {
      Notify.failure(`Search query is the same. Please try again.`);
      return;
    }

    //New search
    if (normalizedQuery !== normalizedCurrentQuery) {
      this.setState({
        searchQuery: normalizedQuery,
        currentPage: 1,
        images: [],
        isEnd: false,
      });
    }
  };

  handleLoadMore = () => {
    //Load more images
    if (!this.state.isEnd) {
      this.setState(prevState => ({ currenPage: prevState.currenPage + 1 }));
    } else {
      Notify.warning("You've reached the end of the search results.");
    }
  };

  render() {
    const { images, isLoading, isError, isEnd } = this.state;
    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleSearchSubmit} />
        <ImageGallery images={images} />
        {isLoading && <Loader />}
        {!isLoading && isError && images.length > 0 && !isEnd && (
          <Button onClick={this.handleLoadMore} />
        )}
        {isError && <p>Something went wrong. Please try again.</p>}
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    );
  }
}

//export default App;