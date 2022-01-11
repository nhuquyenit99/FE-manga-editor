import { Module } from '../core';
import { EditPage, HistoryPage, HomePage } from './pages';

export function setup(module: Module) {
    console.log('Setup App');
    module.route({
        path: '/',
        exact: true,
        component: HomePage,
    });
    module.route({
        path: '/history',
        exact: true,
        component: HistoryPage,
    });
    module.route({
        path: '/edit',
        exact: true,
        component: EditPage,
    });
    module.route({
        path: '/edit/:panel',
        exact: false,
        component: EditPage,
    });
    // module.route({
    //     path: '/translate/:id',
    //     exact: false,
    //     component: TranslatePage,
    // });
}
