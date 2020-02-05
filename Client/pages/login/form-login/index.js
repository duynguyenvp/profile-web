import React, { Component } from 'react';
import PropTypes from 'prop-types'
import s from './style.scss'
import withStyles from 'isomorphic-style-loader/withStyles'
class FormLogin extends Component {
    static propTypes = {
        callback: PropTypes.func
    }
    static defaultProps = {
        callback: () => { }
    }
    constructor(props) {
        super(props);
        this.state = {
            validate: {
                username: true,
                password: true
            },
            returnUrl: '/'
        }
    }

    componentDidMount() {
        const signinError = window.signinError
        const search = location.search || ""
        this.setState({
            returnUrl: search.replace('?returnUrl=', '') || "",
            signinError
        })
    }

    handleEnter = (e) => {
        if (e.key === 'Enter') {
            this.login(e)
        }
    }

    login = (e) => {
        e.preventDefault();
        const { validate } = this.state
        const Username = this.refUsername.value
        const Password = this.refPassword.value
        if (!Username) {
            this.setState({ validate: Object.assign({}, validate, { username: false }) })
            return
        }
        if (!Password) {
            this.setState({ validate: Object.assign({}, validate, { password: false }) })
            return
        }

        this.setState({ validate: Object.assign({}, validate, { username: true, password: true }) })

        this.refForm.submit()
    }

    regisger = (e) => {
        console.log("regiter");
        e.preventDefault();
        const { returnUrl } = this.state
        window.location = `/account/register?returnUrl=${returnUrl || '/'}`
    }
    render() {
        const { validate, returnUrl, signinError } = this.state
        return (
            <div className="bg-login">
                <div className="form-login">
                    <div className="title">
                        <span>Đăng nhập</span>
                    </div>
                    {signinError && signinError.message && <div className="error-message">
                        <h4>{signinError.message}</h4>
                    </div>}
                    <form action="/account/signin" method="POST" ref={instance => { this.refForm = instance }} >
                        <div className="field-phone">
                            <input hidden type="text" name="ReturnUrl" value={returnUrl} readOnly={true} />
                            <input type="text"
                                className={`ip-text ${!validate.username ? 'validate-text-field' : ''}`}
                                defaultValue={''}
                                placeholder="Username"
                                name="Username"
                                autoComplete='off'
                                onKeyDown={this.handleEnter}
                                ref={instance => { this.refUsername = instance }} />
                            {
                                !validate.username && <span className="validate-message">Bạn chưa nhập username!</span>
                            }
                        </div>
                        <div className="field-phone">
                            <input type="password"
                                className={`ip-text ${!validate.password ? 'validate-text-field' : ''}`}
                                defaultValue={''}
                                autoComplete='off'
                                placeholder="Password"
                                name="Password"
                                onKeyDown={this.handleEnter}
                                ref={instance => { this.refPassword = instance }} />
                            {
                                !validate.password && <span className="validate-message">Bạn chưa nhập password!</span>
                            }
                        </div>
                        <div className="field-control">
                            <button type="button" className="btn-login" onClick={this.login}>ĐĂNG NHẬP</button>
                            <button type="button" className="btn-register" onClick={this.regisger}>ĐĂNG KÝ</button>
                        </div>
                    </form>
                    <h3>Hoặc đăng nhập với</h3>
                    <a href="/account/auth/google" className="btn-google">
                        <svg height="30" viewBox="0 0 1792 1792" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z" /></svg>
                        <span>Tài khoản Google</span>
                    </a>
                </div>
            </div>
        );
    }
}

export default withStyles(s)(FormLogin);