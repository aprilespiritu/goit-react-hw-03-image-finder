import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import css from './ImageGalleryItem.module.css';

class ImageGalleryItem extends Component {
    static propTypes = {
        image: PropTypes.shape({
            webformatURL: PropTypes.string.isRequired,
            largeImageURL: PropTypes.string.isRequired,
            tags: PropTypes.string,
        }).isRequired,
    };

    state = {
        showModal: false,
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.showModal !== this.state.showModal) {
            const gallery = document.querySelector('.js-gallery');
            if (!gallery) {
                return;
            }

            if (this.state.showModal) {
                console.log('Modal is now shown.');
                gallery.style.pointerEvents = 'none';
            } else {
                console.log('Modal is now hidden.');
                gallery.style.pointerEvents = 'auto';
            }
        }
    }

    toggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
        }));
    };

    render() {
        const { webformatURL, largeImageURL, tags } = this.props.image;
        const { showModal } = this.state;

        return (
            <li className={css.galleryItem} onClick={this.toggleModal}>
                <img src={webformatURL} alt={tags} />
                {showModal && (<Modal image={largeImageURL} tags={tags} onClose={this.toggleModal} />)}
            </li>
        );
    }
}

export default ImageGalleryItem;