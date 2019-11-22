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
        if(refinements.hasOwnProperty(refinement_key)){
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
    return html;
}

async function set_refinement(html, refinement_key, refinement_value){
    let $ = cheerio.load(html);
    let path = `${REFINEMENTS_MAIN_DIV_ID} #${REFINEMENT_KEY_TO_DIV_IDS[refinement_key]} ul li a`;
    // console.log("---")
    // console.log(refinement_key);
    if (!(refinement_key in REFINEMENT_KEY_TO_DIV_IDS)) {
        path = `${REFINEMENTS_MAIN_DIV_ID} #filters div span`;
        $(path).each((i, el) =>{
            let selected_el = $(el);
            if (selected_el.text() == refinement_key){
                let new_id = $(el).parent().attr('id') + '_next';
                $(el).parent().next().attr('id', new_id);
                path = `#${new_id} li a`;
                // console.log(path);
            }
        });
    }
    return new Promise((resolve, reject) => {
        $(path).each((i, el) =>{
            let anchor = $(el);
            if (refinement_key == 'review'){
                if (anchor.children('section').attr('aria-label') == refinement_value){
                    resolve(BASE_URI + anchor.attr('href'));
                }
            } else {
                // console.log(anchor.children('span').text());
                if (anchor.children('span').text() == refinement_value){
                    resolve(BASE_URI + anchor.attr('href'));
                }
            }
            // console.log(anchor.attr('href'))
        });
        reject('Not found');
    });
}

async function parse_results(html){
    $ = cheerio.load(html);
    let res = [];
    $('.s-result-item').each((i, el) => {
       let item_div = $(el);
       let item_obj = {};
       item_obj['image'] = $(el).find('img').attr('src');
       let title_el =  $(el).find('h2').find('a');
       item_obj['href'] = 'https://www.amazon.com' + title_el.attr('href');
       item_obj['title'] = title_el.find('span').text();
       item_obj['price'] = item_div.find('.a-price').first().find('.a-offscreen').text();
       res.push(item_obj);
    });
    return res;
}

module.exports = {
    apply_refinements: apply_refinements,
    parse_results: parse_results
};
