import React, { Fragment } from 'react'
import Header from './navigator/Header'
import Drawer from './navigator/Drawer'
import InitAlert from '../../common/alert'
import InitPopup from '../../common/popup'
import Scrollbars from '../../common/scrollbar'
import loadable from "@loadable/component"
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom'
import getApiInstance from '../../ajax/generic-api'
import { setState, checkAdminRole, subscribe } from '../../services/userService'
import { RComponent } from '../../common/r-component'

const Loading = () => <div>Loading ... </div>
const LoadablePortfolioComponent = loadable(() => import("./portfolio"), {
    fallback: <Loading />
});
const LoadableBlogPostComponent = loadable(() => import("./blog-post"), {
    fallback: <Loading />
});
const LoadableUserComponent = loadable(() => import("./user-area/account"), {
    fallback: <Loading />
});
const LoadableRoleComponent = loadable(() => import("./user-area/roles"), {
    fallback: <Loading />
});
const LoadableServiceComponent = loadable(() => import("./user-area/services"), {
    fallback: <Loading />
});
const LoadableContactComponent = loadable(() => import("./contact"), {
    fallback: <Loading />
});

class App extends RComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }

        this.onMount(() => {
            InitAlert()
            InitPopup()
            this.getUserRoles()
            const app = document.getElementById('app')
            const myTopnav = document.getElementById('myTopnav')
            this.setState({
                maxHeight: app.clientHeight - myTopnav.clientHeight
            })
        })
        this.onMount(() => {
            this.onUnmount(subscribe(() => this.forceUpdate()))
        })
    }
    getUserRoles = () => {
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserGetRoles'
        }).then(res => {
            if (res && res.successful) {
                const roles = res.result
                setState(roles)
            }
        }).catch(err => {
            console.error(err)
        })
    }
    render() {
        const { active, maxHeight } = this.state
        const isAdmin = checkAdminRole()
        return (
            <Router>
                <Header active={active} handleActiveNavigator={(value) => { this.setState({ active: value }) }} />
                <div className="main">
                    <Drawer active={active} />
                    <Scrollbars ref={instance => this.scrollMain = instance} universal autoHeight autoHeightMin={500} height={maxHeight || 500} autoHeightMax={maxHeight || 500}
                        renderView={props => {
                            const { style, ...restOfProps } = props
                            return <div {...restOfProps} style={{ ...style, overflow: 'auto' }} className="scrollbox-wrapper" />
                        }}>
                        <div className="main-content">
                            <Switch>
                                <Route exact path="/quan-tri">
                                    <LoadablePortfolioComponent />
                                </Route>
                                <Route exact path="/quan-tri/blog-post">
                                    <LoadableBlogPostComponent />
                                </Route>
                                {isAdmin && <Fragment>
                                    <Route exact path="/quan-tri/user">
                                        <LoadableUserComponent />
                                    </Route>
                                    <Route exact path="/quan-tri/services">
                                        <LoadableServiceComponent />
                                    </Route>
                                    <Route exact path="/quan-tri/roles">
                                        <LoadableRoleComponent />
                                    </Route>
                                    <Route exact path="/quan-tri/contact">
                                        <LoadableContactComponent />
                                    </Route>
                                </Fragment>}
                            </Switch>
                        </div>
                    </Scrollbars>
                </div>
            </Router>
        );
    }
}

export default App;