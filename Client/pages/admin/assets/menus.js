import React from 'react'
import {
    SettingOutlined,
    WechatOutlined,
    FileTextOutlined,
    UserOutlined
} from '@ant-design/icons';
export default [
    {
        "menuId": "1",
        "parentMenuId": "0",
        "name": "Tất cả",
        "order": 0,
        "path": "#",
        "isRoot": true
    },
    {
        "menuId": "100",
        "icon": <UserOutlined />,
        "parentMenuId": "1",
        "name": "CÁ NHÂN",
        "order": 0,
        "path": "#"
    },
    {
        "menuId": "101",
        "parentMenuId": "100",
        "name": "Thông tin cơ bản",
        "order": 1,
        "path": "/quan-tri/personal-info"
    },
    {
        "menuId": "102",
        "parentMenuId": "100",
        "name": "Resume",
        "order": 2,
        "path": "/quan-tri"
    },
    {
        "menuId": "200",
        "icon": <SettingOutlined />,
        "parentMenuId": "1",
        "name": "HỆ THỐNG",
        "adminOnly": true,
        "order": 0,
        "path": "#"
    },
    {
        "menuId": "201",
        "parentMenuId": "200",
        "name": "Quản trị quyền",
        "order": 1,
        "path": "/quan-tri/role"
    },
    {
        "menuId": "202",
        "parentMenuId": "200",
        "name": "Quản trị tài khoản",
        "order": 0,
        "path": "/quan-tri/account"
    },
    {
        "menuId": "203",
        "parentMenuId": "200",
        "name": "Quản trị dịch vụ",
        "order": 2,
        "path": "/quan-tri/service"
    },
    {
        "menuId": "300",
        "icon": <FileTextOutlined />,
        "parentMenuId": "1",
        "name": "BÀI VIẾT",
        "order": 1,
        "path": "#"
    },
    {
        "menuId": "301",
        "parentMenuId": "300",
        "name": "Quản trị bài viết",
        "order": 0,
        "path": "/quan-tri/post"
    },
    {
        "menuId": "302",
        "parentMenuId": "300",
        "name": "Quản trị chuyên mục",
        "order": 0,
        "disable": true,
        "path": "/quan-tri/category"
    },
    {
        "menuId": "400",
        "icon": <WechatOutlined />,
        "parentMenuId": "1",
        "name": "LIÊN HỆ",
        "adminOnly": true,
        "order": 2,
        "path": "#"
    },
    {
        "menuId": "401",
        "parentMenuId": "400",
        "name": "Góp ý",
        "order": 0,
        "path": "/quan-tri/feedback"
    }
]