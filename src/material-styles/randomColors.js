import _ from 'lodash';
const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#3f51b5',
    '#2196f3',
    '#009688',
    '#00838f',
    '#2e7d32',
    '#ffc107',
    '#ef6c00',
    '#5d4037',
    '#546e7a',
    '#8bc34a',
    '#c0ca33',
    '#ff9800',
]

export const getRandomColor = ()=>{
    return _.sample(colors)
}

