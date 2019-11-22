This is crawler for amazon.
How to use:
    run "npm start" - will start the server at port 3000 (by default)
    make POST request to "http://localhost:3000/api" with the following data:
        {
        	"key_word": "iphone x", // *required, key word to search
        	"refinements": { // *required field, but may be empty
        		"brands": ["Apple", "ESR"], // the choosen brands: the list of strings or single string
        		"review": "2 Stars & Up", // reviews in format "n Start & Up", 1<=n<=4
        		"condition": "Renewed", // condition: oe of ['New', 'Renewed', 'Used']
        		// here the custom filters, the name and value mus fit exactly
        		"Cell Phone Internal Storage Memory": "64 GB"
        		// ...
        	}
        }
    The server will response a list of products, satisfying the given conditions, in the format:
        {
            "image": "https://m.media-amazon.com/images/I/51wzC34azRL._AC_UY218_ML3_.jpg",
            "href": "https://www.amazon.com/Apple-iPhone-XR-64GB-Black/dp/B07T1L2SBK/ref=sr_1_1?keywords=iphone+x&qid=1574444224&refinements=p_89%3AApple%7CESR%2Cp_72%3A2661620011%2Cp_n_feature_twelve_browse-bin%3A14674910011%2Cp_n_condition-type%3A16907722011&rnid=14674904011&s=wireless&sr=1-1",
            "title": "Apple iPhone XR, 64GB, Black - For AT&T (Renewed)",
            "price": "$481.84"
        }