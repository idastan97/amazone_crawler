const request = require('request');

async function get_page(url){
    console.log("get page");
    let settings = {
        url: url,
        method: "GET",
        headers: {
            "cache-control": "no-cache"
        }
    };
    return new Promise((resolve, reject) => {
        request(settings, (error, res, html) => {
            if (!error && res.statusCode == 200){
                // return cheerio.load(html);
                resolve(html);
            } else {
                reject(error);
            }
        })
    });
}

async function search(key_word){
    let encoded_key_word = encodeURI(key_word);
    let url = `https://www.amazon.com/s?k=${encoded_key_word}&ref=nb_sb_noss`;
    return get_page(url);
}

module.exports = {
    search: search,
    get_page: get_page
};



// request('http://amazon.com/', (error, response, html) => {
//     if (!error && response.statusCode == 200){
//         const $ = cheerio.load(html);
//         $('#twotabsearchtextbox').text() = "iphone xr";
//         $('')
//         console.log(country.html());
//     }
// });