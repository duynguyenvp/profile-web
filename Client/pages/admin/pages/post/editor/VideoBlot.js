import Quill from 'quill'
let BlockEmbed = Quill.import('blots/block/embed');

function getYoutubeEmbedId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
        ? `//www.youtube.com/embed/${match[2]}`
        : null;
}

function createChildElement(isYoutubeVideo, url) {
    if (isYoutubeVideo) {
        let node = document.createElement('iframe');
        node.setAttribute('src', url);
        node.setAttribute('frameborder', '0');
        node.setAttribute('allowfullscreen', true);
        node.className = 'editor-iframe'
        return node;
    }
    let video = document.createElement('video');
    video.setAttribute('src', url);
    video.setAttribute('allowfullscreen', true);
    video.setAttribute('controls', true)
    video.className = 'editor-iframe'
    return video;
}

class VideoBlot extends BlockEmbed {
    static create(url) {
        let node = super.create();
        node.className = 'editor-iframe-container'
        const isYoutubeVideo = getYoutubeEmbedId(url)
        let child = createChildElement(!!isYoutubeVideo, isYoutubeVideo || url)
        node.appendChild(child)
        return node
    }

    static formats(node) {
        let format = {};
        if (node.hasAttribute('height')) {
            format.height = node.getAttribute('height');
        }
        if (node.hasAttribute('width')) {
            format.width = node.getAttribute('width');
        }
        if (node.hasAttribute('class')) {
            format.class = node.getAttribute('class');
        }
        return format;
    }

    static value(node) {
        return node.firstChild.getAttribute('src');
    }

    format(name, value) {
        if (name === 'height' || name === 'width' || name === 'class') {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name, value);
            }
        } else {
            super.format(name, value);
        }
    }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'div';
export default VideoBlot