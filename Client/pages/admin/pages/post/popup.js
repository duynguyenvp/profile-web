import React, { useEffect, useRef, useState, Fragment } from 'react'
import { addOrUpdatePost } from '../../store/postStore'
import { Form, Drawer, Button, Input, notification, Layout } from 'antd'
const { Header, Footer, Sider, Content } = Layout
import ImageManager from '../../components/image-manager'
import getApiInstance from '../../api/generic-api'

import Quill from 'quill'
import ImageResize from 'quill-image-resize-module'

Quill.register('modules/imageResize', ImageResize)

import 'modules/quill/dist/quill.core.css'
import 'modules/quill/dist/quill.snow.css'
import { getAuthentication } from '../../store/authStore'

const openNotificationWithIcon = (type, content) => {
    notification[type]({
        message: 'Thông báo',
        description: content,
    })
}
const PostForm = ({ onClose, callback, post, content }) => {
    const onFinish = values => {
        let data = { ...values }
        const user = getAuthentication()
        data = { ...data, avatar: "", content }

        if (post && post.id) {
            data = { ...post, ...data }
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
    const [flagOpenImageManager, setFlagOpenImageManager] = useState(false)
    const [emojiPicker, setEmojiPicker] = useState(null)
    const [emojiPickerState, setEmojiPickerState] = useState(false)
    const [range, setRange] = useState(null)
    const [editor, setEditor] = useState(null)
    const refEditor = useRef()
    const closeImageManager = () => {
        setFlagOpenImageManager(false)
    }
    useEffect(() => {
        window.QuillEditor = new Quill(refEditor.current, {
            modules: {
                toolbar: '#toolbar',
                imageResize: {}
            },
            placeholder: 'Nhập nội dung...',
            theme: 'snow'  // or 'bubble'
        })
        setEditor(window.QuillEditor)
    }, [])
    useEffect(() => {
        if (!editor) return
        // quill editor add image handler
        editor.getModule('toolbar').addHandler('image', () => {
            const range = editor.getSelection()
            setRange(range)
            setFlagOpenImageManager(true)
            // push image url to rich editor.
            // editor.insertEmbed(range && range.index || 0, 'image', src)
        })
        editor.on('text-change', function (range, oldRange, source) {
            callback(editor.root.innerHTML)
        })
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
    useEffect(() => {
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
                    editor && editor.insertEmbed(range && range.index || 0, 'image', src)
                    setRange(null)
                }} />
            <div className="editor-content" ref={refEditor}
                dangerouslySetInnerHTML={{ __html: post && post.content || '' }}></div>
        </Content>
    </Layout>

}

const PostPopup = ({ visible, onClose, post, callback }) => {
    const [content, setContent] = useState('')
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
                <EditorContent post={post} callback={text => {
                    setContent(text)
                }} />
                <Sider
                    width={350}
                    className="editor-right-side"
                >
                    <PostForm onClose={onClose} post={post} content={content} callback={callback} />
                </Sider>
            </Layout>
        </Drawer>
    )
}

export default PostPopup