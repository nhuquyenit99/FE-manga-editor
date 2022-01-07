import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { NotFoundPage, Loading } from './components';
import { Module, RootModule } from './core';
import './App.scss';

const INSTALLED_MODULE: any = {
    'modules': require('./modules'),
};

class RootApplication extends React.Component<{}, { loading: boolean }> {
    rootModule: RootModule;
    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
        };
        this.rootModule = new RootModule();
    }
    componentDidMount() {
        this.init();
        window.addEventListener('beforeunload', e => {
            localStorage.removeItem('imageUrl');
        });
    }

    setupModule() {
        for (let key in INSTALLED_MODULE) {
            const module = new Module(key);
            INSTALLED_MODULE[key].setup(module);
            this.rootModule.register(module);
        }
    }

    async init() {
        this.setState({ loading: true });
        // Setup module
        this.setupModule();
        this.setState({ loading: false }); 
    }

    componentWillUnmount() {
    }

    renderRoute() {
        return Object.entries(this.rootModule.routes()).map(([key, route]) => {
            return <Route key={route.path} {...route} />;
        });
    }

    render() {
        if (this.state.loading) {
            return <Loading />;
        }
        return (
            <BrowserRouter basename="/">
                <Switch>
                    {this.renderRoute()}
                    <Route component={NotFoundPage} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export { RootApplication };
