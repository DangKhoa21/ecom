'use strict'

const helper = {}

helper.createStarList = (stars) => {
    let star = Math.floor(stars);
    let half = stars - star;
    let str = '<div class="d-flex my-3">';

    for (let i = 0; i < star; i++) {
        str += '<i class="fas fa-star text-primary"></i>';
    }

    if (half > 0) {
        str += '<i class="fas fa-star-half-alt text-primary"></i>';
    }

    for (let i = 0; i < 5 - star - half; i++) {
        str += '<i class="fas fa-star"></i>';
    }
    str += '</div>';
    return str;
}

module.exports = helper