import { Module } from '../core';
import { HomePage } from './pages';

export function setup(module: Module) {
    console.log('Setup App');
    module.route({
        path: '/',
        exact: true,
        component: HomePage,
    });
}
