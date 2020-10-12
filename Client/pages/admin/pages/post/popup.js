import React, { useRef, useState, Fragment, useLayoutEffect, useCallback } from 'react'
import { Form, Drawer, Button, Input, notification, Layout } from 'antd'
const { Header, Footer, Sider, Content } = Layout
import ImageManager from '../../components/image-manager'
import getApiInstance from '../../api/generic-api'

import Quill from 'quill'
import VideoBlot from './VideoBlot'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)
Quill.register(VideoBlot)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { getAuthentication } from '../../store/authStore'
import './quill.scss'

const openNotificationWithIcon = (type, content) => {
    notification[type]({
        message: 'Thông báo',
        description: content,
    })
}
const PostForm = ({ onClose, callback, post, content, delta }) => {
    const onFinish = values => {
        let data = { ...values }
        const user = getAuthentication()
        data = { ...data, avatar: "", delta: JSON.stringify(delta), content }

        if (post && post.id) {
            data = { ...post, ...data }
        } else {
            data = {
                ...data,
                avatar: "string",
                postTime: new Date(),
                isDelete: false,
                userName: user.userName,
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
                openNotificationWithIcon('success', 'Thành công!!!')
                onClose()
                callback()
            } else {
                openNotificationWithIcon('error', 'Đã xảy ra lỗi: ' + (res.errorMessage || 'Không xác định'))
            }
        }).catch(error => {
            console.error(error)
            openNotificationWithIcon('error', error)
        })
    }

    const { id, tag, title } = post || {}

    return (
        <Form
            layout="vertical"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}>
            <Form.Item
                name="title"
                label="Tiêu đề"
                labelCol={24}
                initialValue={title}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập đề!',
                    },
                ]}
            >
                <Input placeholder="Nhập tiêu đề ..." />
            </Form.Item>
            <Form.Item
                name="tag"
                label="Tags"
                labelCol={24}
                initialValue={tag}
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập tags!',
                    },
                ]}
            >
                <Input placeholder="Nhập họ tags ..." />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 12 }}>
                <Button type="primary" htmlType="submit">Lưu</Button>
            </Form.Item>
        </Form>
    )
}

const EditorContent = ({ post, callback }) => {
    const [flagOpenImageManager, setFlagOpenImageManager] = useState(() => false)
    const [emojiPicker, setEmojiPicker] = useState(() => null)
    const [emojiPickerState, setEmojiPickerState] = useState(() => false)
    const [range, setRange] = useState(() => null)
    const [editor, setEditor] = useState(() => null)
    const refEditor = useRef()
    const getEditorMaxWidth = useCallback(() => {
        const editorDOM = document.querySelector('.ql-editor')
        const computedStyle = window.getComputedStyle(editorDOM)
        const padding = parseInt((computedStyle && computedStyle.paddingLeft) || '0px', 10) + parseInt((computedStyle && computedStyle.paddingRight) || '0px', 10)
        const editorClientWidth = (editorDOM && editorDOM.clientWidth) || 0
        window.EDITOR_CLIENT_WIDTH = editorClientWidth == 0 ? 0 : editorClientWidth - padding
    }, [])
    const closeImageManager = () => {
        setFlagOpenImageManager(false)
    }
    useLayoutEffect(() => {
        window.QuillEditor = new Quill(refEditor.current, {
            modules: {
                toolbar: '#toolbar',
                imageResize: {}
            },
            placeholder: 'Nhập nội dung...',
            theme: 'snow'  // or 'bubble'
        })
        if (post && post.delta) {
            try {
                const delta = JSON.parse(post.delta)
                if (delta) {
                    window.QuillEditor.setContents(delta)
                }
            } catch (error) {
                console.error(error)
            }
        }
        setEditor(window.QuillEditor)
    }, [])
    useLayoutEffect(() => {
        if (!editor) return
        // quill editor add image handler
        editor.getModule('toolbar').addHandler('image', () => {
            const range = editor.getSelection()
            setRange(range)
            setFlagOpenImageManager(true)
        })
        editor.on('text-change', function (range, oldRange, source) {
            callback({
                content: editor.root.innerHTML,
                delta: editor.getContents()
            })
        })
        getEditorMaxWidth()
    }, [editor])
    const handleClickEmojiButton = e => {
        e.stopPropagation();
        setEmojiPickerState(!emojiPickerState)
    }
    const initEmojiBox = async () => {
        await import("emoji-mart/css/emoji-mart.css");
        const { Picker } = await import("emoji-mart")
        setEmojiPicker(<div className="input-emojibox">
            <Picker
                title="Pick your emoji…"
                emoji="point_up"
                set="facebook"
                native={true}
                showPreview={false}
                onSelect={emoji => insertEmoji(emoji.native)}
            />
        </div>)
    }
    useLayoutEffect(() => {
        initEmojiBox()
    }, [])

    const renderEmojiPicker = () => {
        if (emojiPickerState) return <Fragment>{emojiPicker}</Fragment>
        return null
    }

    const insertEmoji = emoji => {
        setEmojiPickerState(false)
        const currentRange = window.QuillEditor && window.QuillEditor.getSelection()
        window.QuillEditor && window.QuillEditor.insertText(currentRange && currentRange.index || 0, emoji);
    }
    return <Layout>
        <Header className="editor-main-header">
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
                <button className="ql-video"></button>
                <span className="ql-formats">
                    <button className="ql-blockquote"></button>
                    <button className="ql-code-block"></button>
                </span>
                <button className={emojiPickerState ? 'ql-active' : ''}
                    onClick={handleClickEmojiButton}>
                    <i className="material-icons" style={{ fontSize: 18, float: "left" }}>mood</i>
                </button>
                {renderEmojiPicker()}
            </div>
        </Header>
        <Content className="editor-main-content">
            <ImageManager visible={flagOpenImageManager}
                close={closeImageManager}
                callback={(src) => {
                    const Delta = Quill.import('delta');
                    window.QuillEditor && window.QuillEditor.updateContents(
                        new Delta()
                            .retain((range && range.index) || 0)
                            .insert({
                                image: src
                            },
                                {
                                    alt: src
                                }));
                    setRange(null)
                }} />
            <div className="editor-content" ref={refEditor}
                dangerouslySetInnerHTML={{ __html: post && post.content || '' }}></div>
        </Content>
    </Layout>

}

const PostPopup = ({ visible, onClose, post, callback }) => {
    const [content, setContent] = useState(() => '')
    const [delta, setDelta] = useState(() => null)
    const [isMobile, setIsMobile] = useState(false)
    const [visiblePostForm, setVisiblePostForm] = useState(() => false)
    useLayoutEffect(() => {
        const x = window.matchMedia("(max-width: 768px)")
        if (x.matches) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    })

    const onClosePostForm = () => {
        setVisiblePostForm(false)
    }
    const onOpenPostForm = () => {
        setVisiblePostForm(true)
    }

    return (
        <Drawer
            title={`${post && Object.keys(post) ? "Chỉnh sửa bài viết" : "Viết bài mới"}`}
            closable={true}
            width="100%"
            onClose={onClose}
            visible={visible}
            destroyOnClose={true}
            keyboard={false}
            bodyStyle={{ padding: 0 }}
        >
            <Layout className="editor-layout">
                <EditorContent
                    post={post}
                    callback={({ content, delta }) => {
                        setContent(content)
                        setDelta(delta)
                    }} />
                {!isMobile && <Sider
                    width={350}
                    className="editor-right-side"
                >
                    <PostForm onClose={onClose} post={post} content={content} delta={delta} callback={callback} />
                </Sider>}
            </Layout>
            {isMobile && <>
                {visiblePostForm && <div className="editor-postform-mobile-overlay" onClick={onClosePostForm}></div>}
                <div className={`editor-postform-mobile ${visiblePostForm ? "active" : ""}`}>
                    <PostForm onClose={() => {
                        onClosePostForm()
                        onClose()
                    }} post={post}
                        content={content}
                        delta={delta}
                        callback={callback} />
                </div>
                <Button type='primary'
                    style={{ width: "100%" }}
                    onClick={onOpenPostForm}>Tiếp theo</Button>
            </>}
        </Drawer>
    )
}

export default PostPopup