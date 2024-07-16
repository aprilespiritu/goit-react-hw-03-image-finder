import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

class ImageGallery extends Component {
    static propTypes = {
        images: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
            })
        ).isRequired,
    };

    render() {
        const { images } = this.props;
        return (
            <ul className={`${css.gallery} js-gallery`}>
                {images.map(image => (
                    <ImageGalleryItem key={image.id} image={image} />
                ))}
            </ul>
        );
    }
}

export default ImageGallery;