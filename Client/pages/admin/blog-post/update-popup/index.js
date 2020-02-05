import React, { Fragment } from 'react';
import { RComponent } from '../../../../common/r-component'
import Select from '../../../../common/form-controls/my-select'

import { PopupContext } from '../../../../services/popupService';
import { addAlert } from '../../../../services/alertService'
import { getState } from '../../../../services/userService'
import getApiInstance from '../../../../ajax/generic-api'

import ImagePopup from '../../../../common/image-popup'
import { addPopup } from '../../../../services/popupService'

import Quill from 'quill'
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

import 'modules/quill/dist/quill.core.css'
import 'modules/quill/dist/quill.snow.css'
import './updatePopup.scss'
class UpdatePopup extends RComponent {
    editor = null
    static contextType = PopupContext;
    constructor(props) {
        super(props);
        const { item } = props
        this.state = {
            title: item && item.title || '',
            tag: item && item.tag || '',
            isValidateName: ''
        }

        this.onMount(() => {
            this.editor = new Quill(this.refEditor, {
                modules: {
                    toolbar: '#toolbar',
                    imageResize: {}
                },
                placeholder: 'Nhập nội dung...',
                theme: 'snow'  // or 'bubble'
            });
            const that = this
            // quill editor add image handler
            this.editor.getModule('toolbar').addHandler('image', () => {
                const range = this.editor.getSelection();
                addPopup({
                    title: 'CHỌN ẢNH',
                    children: <ImagePopup item={null} callback={(src) => {
                        // push image url to rich editor.
                        that.editor.insertEmbed(range && range.index || 0, 'image', src);
                    }} />,
                    fullScreen: true
                })
            });
        })
    }

    handleChange = data => {
        this.setState(data)
    }

    submit = () => {
        const html = this.editor.root.innerHTML
        const { title, tag, isValidateName } = this.state
        const { onClose } = this.context
        const { callback, item } = this.props
        const user = getState()
        if (isValidateName) {
            addAlert({ type: 'warning', message: 'Lỗi Validate. ' + isValidateName })
            return;
        }
        let data = {
            title: title,
            avatar: "",
            content: html,
            tag: tag
        }
        if (item && item.id) {
            data = { ...item, ...data }
        } else {
            data = {
                ...data,
                avatar: "string",
                postTime: new Date(),
                isDelete: false,
                userId: user.id,
                categoryId: null //Thêm category
            }
        }
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] != 'boolean' && !data[key]) {
                    delete data[key]
                }
            }
        }
        getApiInstance().postWithFormAuth({
            url: '/Post/InsertOrUpdate',
            data
        }).then(res => {
            if (res.successful) {
                addAlert({ message: 'Thành công!!!', duration: 5000 })
                onClose()
                callback()
            } else {
                addAlert({ type: 'warning', message: 'Đã xảy ra lỗi: ' + (res.errorMessage || 'Không xác định') })
            }
        }).catch(err => {
            console.error('Lỗi', err)
        })
    }

    render() {
        const { item } = this.props
        const { title, tag, isValidateName } = this.state
        return (
            <PopupContext.Consumer>
                {
                    ({ onClose }) =>
                        <div className="blog-post-wrapper">
                            <div className="form-filter">
                                <div className="filter-item margin-right">
                                    <label className="title">Tiêu đề:</label>
                                    <div className="input-container">
                                        <input type="text"
                                            className={isValidateName ? 'error' : ''}
                                            placeholder="nhập tiêu đề ..."
                                            value={title || ''}
                                            onChange={e => {
                                                const title = e.target.value
                                                this.handleChange({ title, isValidateName: title ? '' : 'Tiêu đề trống.' })
                                            }} />
                                        {isValidateName && <label className="validate-error">{isValidateName}</label>}
                                    </div>
                                </div>
                                <div className="filter-item">
                                    <label className="title">Tag:</label>
                                    <div className="input-container">
                                        <input type="text"
                                            className={''}
                                            placeholder="nhập tag ..."
                                            value={tag || ''}
                                            onChange={e => { this.handleChange({ tag: e.target.value }) }} />
                                    </div>
                                </div>
                            </div>
                            <div className="editor-wrapper">
                                <div id="toolbar">
                                    <select className="ql-size" defaultValue="small">
                                        <option value="small"></option>
                                        <option value="large"></option>
                                        <option value="huge"></option>
                                    </select>
                                    <button className="ql-bold"></button>
                                    <button className="ql-italic"></button>
                                    <button className="ql-underline"></button>
                                    <span className="ql-formats">
                                        <select className="ql-color"></select>
                                        <select className="ql-background"></select>
                                    </span>
                                    <button className="ql-align" value="justify"></button>
                                    <button className="ql-align" value="center"></button>
                                    <button className="ql-align" value="right"></button>
                                    <span className="ql-formats">
                                        <button className="ql-list" value="ordered" />
                                        <button className="ql-list" value="bullet" />
                                        <button className="ql-indent" value="-1" />
                                        <button className="ql-indent" value="+1" />
                                    </span>
                                    <button className="ql-script" value="sub"></button>
                                    <button className="ql-script" value="super"></button>
                                    <button className="ql-link"></button>
                                    <button className="ql-image"></button>
                                    <span className="ql-formats">
                                        <button className="ql-blockquote"></button>
                                        <button className="ql-code-block"></button>
                                    </span>
                                </div>
                                <div ref={instance => this.refEditor = instance}
                                    dangerouslySetInnerHTML={{ __html: item && item.content || '' }}>
                                </div>
                            </div>
                            <div className="filter-item flex-end">
                                <button className="btnPrimary margin-16px" onClick={this.submit}>Cập nhật</button>
                                <button className="btnDefault" onClick={onClose}>Đóng</button>
                            </div>
                        </div>
                }
            </PopupContext.Consumer>
        );
    }
}
export default UpdatePopup;