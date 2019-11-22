const cheerio = require('cheerio');
let {get_page} = require('./load');

const REFINEMENTS_MAIN_DIV_ID = "#s-refinements";
const REFINEMENT_KEY_TO_DIV_IDS = {
    'department': 'departments',
    'review': 'reviewsRefinements',
    'brands': 'brandsRefinements',
    'condition': 'condition',
};
const BASE_URI = 'https://www.amazon.com';

async function apply_refinements(html, refinements){
    let url = 'initial';
    for (let refinement_key in refinements){
        if(refinements.hasOwnProperty(refinement_key) && refinement_key in REFINEMENT_KEY_TO_DIV_IDS){
            let refinement_value = refinements[refinement_key];
            try{
                if (Array.isArray(refinement_value)){
                    for (let refinement_one_val of refinement_value){
                        let new_url = await set_refinement(html, refinement_key, refinement_one_val);
                        url = new_url;
                        html = await get_page(new_url);
                    }
                } else {
                    let new_url = await set_refinement(html, refinement_key, refinement_value);
                    url = new_url;
                    html = await get_page(new_url);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    return url;
}

async function set_refinement(html, refinement_key, refinement_value){
    let $ = cheerio.load(html);
    let path = `${REFINEMENTS_MAIN_DIV_ID} #${REFINEMENT_KEY_TO_DIV_IDS[refinement_key]} ul li a`;
    return new Promise((resolve, reject) => {
        $(path).each((i, el) =>{
            let anchor = $(el);
            if (refinement_key == 'review'){
                if (anchor.children('section').attr('aria-label') == refinement_value){
                    resolve(BASE_URI + anchor.attr('href'));
                }
            } else {
                if (anchor.children('span').text() == refinement_value){
                    resolve(BASE_URI + anchor.attr('href'));
                }
            }
            // console.log(anchor.attr('href'))
        });
        reject('Not found');
    });

}

function test(html){
    let $ = cheerio.load(html);
    let path = `${REFINEMENTS_MAIN_DIV_ID} #brandsRefinements ul li a`;
    return new Promise((resolve, reject) => {
        $(path).each((i, el) => {
            let anchor = $(el);
            if (anchor.children('span').text() == 'Apple') {
                console.log(anchor.attr('href'))
                resolve(BASE_URI + anchor.attr('href'));
            }
            reject('Not found');
        });
    });
}

module.exports = {
    test: test,
    apply_refinements: apply_refinements,
};
