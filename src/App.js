import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
//import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const AdminLayout = React.lazy(() => import('./containers/DefaultLayout'));
const KnowledgeBaseLayout = React.lazy(() => import('./views/Pages/KnowledgeBase/DefaultLayout'));

// Pages
// const KnowledgeBase = React.lazy(() => import('./views/Pages/KnowledgeBase'));
const Login = React.lazy(() => import('./views/Pages/Login'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));


class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.dashboardAccess = this.dashboardAccess.bind(this);
        const { cookies } = props;
        this.state = {
            token: cookies.get('token') || null,
        };
    }

    dashboardAccess() {
        const token = this.state.token;
        if (token !== null) {
            return ([
                <Route path="/dashboard" key={'dashboardRoute'} name="Admin Dashboard" render={props => <AdminLayout key={'dashboard'} {...props} />} />,
                <Route exact path="/login" key={'dashboardRedirectRoute'} name="Admin Dashboard" render={props => <AdminLayout key={'dashboardRedirect'} {...props } />} />
            ]);
        }
        return ([
            <Route path="/dashboard" key={'loginRedirectRoute'} name="Login Page" render={props => <Login key={'loginRedirect'} {...props} />}  />,
            <Route exact path="/login" key={'loginRoute'} name="Login Page" render={props => <Login key={'login'} {...props} />}  />
        ]);
    }

    render() {
            return (


                <HashRouter>
                    <React.Suspense fallback={loading()}>
                        <Switch>
                            {this.dashboardAccess()}
                            <Route exact path="/500" name="Page 500" render={props => <Page500 key={'Page500'}{...props} />} />
                            <Route path="/knowledgebase" name="KnowledgeBase" render={props => <KnowledgeBaseLayout key={'KBLayout'}{...props}/>}/>
                            <Route exact path="/" name="KnowledgeBase" render={props => <KnowledgeBaseLayout key={'KBLayoutRoot'}{...props}/>}/>
                            <Route path="/" name="Page 404" render={props => <Page404 key={'Page404'} {...props}/>}/>
                        </Switch>
                    </React.Suspense>
                </HashRouter>
            );
        }
}

export default withCookies(App);
