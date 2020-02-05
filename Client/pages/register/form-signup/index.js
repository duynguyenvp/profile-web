import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './style.scss'


class FormSignup extends Component {
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
        const signupError = window.signupError
        const search = location.search || ""
        this.setState({
            returnUrl: search.replace('?returnUrl=', '') || "",
            signupError
        })
    }

    signup = (e) => {
        e.preventDefault();
        const { validate } = this.state
        const Username = this.refUsername.value
        const Password = this.refPassword.value
        // const Email = this.refEmail.value
        // const Address = this.refAddress.value
        // const Age = this.refAge.value
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
    render() {
        const { validate, returnUrl, signupError } = this.state
        return (
            <div className="bg-login">
                <div className="form-register">
                    <div className="title">
                        <span>Đăng ký tài khoản</span>
                    </div>
                    {signupError && signupError.message && <div className="error-message">
                        <h4>{signupError.message}</h4>
                    </div>}
                    <form action="/account/signup" method="POST" ref={instance => { this.refForm = instance }} >
                        <div className="field-phone">
                            <input hidden type="text" name="ReturnUrl" value={returnUrl} readOnly={true} />
                            <input type="text"
                                className={`ip-text ${!validate.username ? 'validate-text-field' : ''}`}
                                defaultValue={''}
                                placeholder="Username"
                                name="Username"
                                autoComplete='off'
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
                                ref={instance => { this.refPassword = instance }} />
                            {
                                !validate.password && <span className="validate-message">Bạn chưa nhập password!</span>
                            }
                        </div>
                        <div className="field-phone">
                            <input type="email"
                                className={`ip-text`}
                                defaultValue={''}
                                autoComplete='off'
                                placeholder="Email"
                                name="Email"
                                ref={instance => { this.refEmail = instance }} />
                        </div>
                        <div className="field-phone">
                            <input type="number"
                                className={`ip-text `}
                                defaultValue={''}
                                autoComplete='off'
                                placeholder="Tuổi"
                                name="Age"
                                ref={instance => { this.refAge = instance }} />
                        </div>
                        <div className="field-phone">
                            <input type="text"
                                className={`ip-text `}
                                defaultValue={''}
                                autoComplete='off'
                                placeholder="Địa chỉ"
                                name="Address"
                                ref={instance => { this.refAddress = instance }} />

                        </div>
                        <div className="field-control">
                            <button className="btn-register" onClick={this.signup}>ĐĂNG KÝ</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default FormSignup;