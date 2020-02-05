import './style.scss'
import React, { Component } from 'react';
import PropTypes from 'prop-types'

import Quill from 'quill'
import 'modules/quill/dist/quill.core.css'
import 'modules/quill/dist/quill.snow.css'

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];
class EditorComponent extends Component {
    editor = null
    static propTypes = {
        html: PropTypes.string,
        callback: PropTypes.func
    }
    static defaultProps = {
        html: '',
        callback: html => { console.log(html) }
    }

    constructor(props) {
        super(props);

        this.state = {
            html: props.html
        }
    }

    initEditor = () => {
        const { callback } = this.props
        const { html } = this.state
        const self = this
        self.editor = new Quill(this.refEditor, {
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: 'Nhập nội dung...',
            theme: 'snow'  // or 'bubble'
        });
        self.editor.on('text-change', function (delta, oldDelta, source) {
            if (source == 'user') {
                self.setState({ html: self.editor.root.innerHTML, delta: oldDelta.concat(delta) }, () => {
                    callback(self.editor.root.innerHTML)
                })
            }
        });

        // self.editor.clipboard.dangerouslyPasteHTML(0, html);
        self.editor.setContents(self.editor.clipboard.convert(html));
        self.editor.blur();
    }

    componentDidMount() {
        this.initEditor()
    }

    render() {
        return (
            <div className="quill-editor" ref={instance => this.refEditor = instance} />
        );
    }
}

export default EditorComponent;