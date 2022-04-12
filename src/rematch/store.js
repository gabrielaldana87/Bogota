import selectPlugin from '@rematch/select';
import { init } from '@rematch/core';
import { models } from './models';

export const store = init({
    models,
    plugins: [selectPlugin()]
})

export const { dispatch, select } = store;
