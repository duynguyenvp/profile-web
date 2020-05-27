import React from 'react'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
const imageDefault = require('../../../assets/images/imageDefault.jpg')

import './style.scss';

const getPreviewElement = () => {
    let previewContainer = document.getElementById('preview-container');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.setAttribute('id', 'preview-container');
        previewContainer.setAttribute('class', 'preview-container');

        previewContainer.innerHTML = `<span class="close">&times;</span><img class="preview-container-content" id="img01"><div id="caption"></div>`

        document.body.appendChild(previewContainer);
    }
    const span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    const closePreview = () => {
        previewContainer.style.display = "none";
    }
    span.addEventListener('click', closePreview)
    previewContainer.addEventListener('click', closePreview)
    return previewContainer;
}

const ImageItem = ({ isSelected, callback, remove, image }) => {

    const handleSelect = e => {
        e.stopPropagation();
        callback(image)
    }
    const handlePreview = e => {
        e.stopPropagation();
        const modal = getPreviewElement()
        const modalImg = modal.querySelector("#img01");
        // const captionText = document.getElementById("caption");

        modal.style.display = "block";
        modalImg.src = (image && image.path || imageDefault);
        // captionText.innerHTML = this.alt;
    }
    const handleRemove = e => {
        e.stopPropagation();
        remove(image)
    }

    let avatarStyle = {
        backgroundImage: `url("${image && image.path || imageDefault}")`
    }

    return <div className={`img-manager-item-wrapper ${isSelected ? "selected" : ""}`} onClick={handleSelect}>
        <div className="image-item" style={avatarStyle}></div>
        <div className="image-item-overlay">
            <span style={{ marginRight: 6 }} onClick={handlePreview}>
                <EyeOutlined />
            </span>
            <span style={{ marginLeft: 6 }} onClick={handleRemove}>
                <DeleteOutlined />
            </span>
        </div>
    </div>
}

ImageItem.propTypes = {
    value: PropTypes.string,
    preview: PropTypes.func,
    remove: PropTypes.func,
}
ImageItem.defaultProps = {
    value: '',
    preview: () => { },
    remove: () => { },
}

export default ImageItem