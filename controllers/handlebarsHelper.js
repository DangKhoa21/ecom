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

    for (let i = 1; i <= 5 - star - half; i++) {
        str += '<i class="fas fa-star"></i>';
    }
    str += '</div>';
    return str;
}

helper.createSpecTable = (specification) => {
    let specs = specification.split('. ');
    let html = '<div class="px-2"><div class="row g-4"><div class="col-6">';

    specs.forEach(function(spec, index) {
        let parts = spec.split(': ');
        let rowClass = index % 2 === 0 ? 'bg-light' : '';

        html += `<div class="row ${rowClass} align-items-center text-center justify-content-center py-2">`;
        html += `<div class="col-6"><p class="mb-0">${parts[0]}</p></div>`;
        html += `<div class="col-6"><p class="mb-0">${parts[1]}</p></div>`;
        html += `</div>`;
    });

    html += '</div></div></div>';
    return html;
};

helper.increment = (num) => {
    return num + 1;
}

module.exports = helper