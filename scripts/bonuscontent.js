/**************************************************************************************************
 * 
 *            Script containing all the large datasets I need for my project functionality
 * 
 ***************************************************************************************************/
//Some fake JSON objects I made to increase the selection of my shop
const fakeJSON = [
    {
        "category": "men's clothing",
        "id": 997,
        "title": "Men's Jorts",
        "price": 37.50,
        "rating": {
            "count": 172,
            "rate": 3.4
        },
        "image": "images/jorts.jpg",
        "description": "You know 2022 is bad when the number one clothing trend is jorts. <br>frumpy jean shorts worn by beer-clutching dads behind the barbecue at your cousins birthday party"
    },
    {
        "category": "knick-knacks",
        "id": 998,
        "title": "Dryer Lint",
        "price": 17.89,
        "rating": {
            "count": 4,
            "rate": 5
        },
        "image": "images/lint.png",
        "description": "Use it at a blanket, develop a felting hobby, insulate your walls, the choice is yours!"
    },
    {
        "category": "soup",
        "id": 999,
        "title": "Campbell's Tomato Soup",
        "price": 0.99,
        "rating": {
            "count": 100,
            "rate": 4
        },
        "image": "images/tomatosoup.jpg",
        "description": "May as well, you're already here!<br> Contains 31% of your daily sodium intake, per serving"
    },
    {
        "category": "currency",
        "id": 1000,
        "title": "Old Coins",
        "price": 0.15,
        "rating": {
            "count": 100,
            "rate": 3
        },
        "image": "images/oldcoins.jpg",
        "description": "Jeff found these inbetween his couch cushions. Might be worth something?"
    },
    {
        "category": "consumables",
        "id": 1001,
        "title": "Grilled Cheese Sandwich",
        "price": 7.65,
        "rating": {
            "count": 15,
            "rate": 4
        },
        "image": "images/grilledCheese.png",
        "description": "Kraft singles on Wonderbread. Made recently!"
    },
    {
        "category": "consumables",
        "id": 1002,
        "title": "Feta Cheese",
        "price": 13.99,
        "rating": {
            "count": 15,
            "rate": 4
        },
        "image": "images/feta.jpg",
        "description": "Fresh cow feta, made at a nearby dairy farm!"
    }

];

//Hash map of information related the currency's I was using in the API to make matching data more simple
const currencyInfo = {
    "cad": {
        "symbol": "$",
        "decimal": 2
    },
    "usd": {
        "symbol": "$",
        "decimal": 2
    },
    "brl": {
        "symbol": "R$",
        "decimal": 2
    },
    "jpy": {
        "symbol": "¥",
        "decimal": 0
    },
    "eur": {
        "symbol": "€",
        "decimal": 2
    },
    "gbp": {
        "symbol": "£",
        "decimal": 2
    },
    "cny": {
        "symbol": "¥",
        "decimal": 0
    }
}


//Tax information for each province in a hash map, also has base shipping fees set to arbitrary numbers I selected
const provincialTaxRateInfo = {
    "AB": {
        "GST": 0.05,
        "PST": 0.07,
        "HST": 0,
        "SHIP": 0.50
    },
    "BC": {
        "GST": 0.05,
        "PST": 0.07,
        "HST": 0,
        "SHIP": 0.40
    },
    "MB": {
        "GST": 0.05,
        "PST": 0.07,
        "HST": 0,
        "SHIP": 0.69
    },
    "NB": {
        "GST": 0,
        "PST": 0,
        "HST": 0.15,
        "SHIP": 1.56
    },
    "NL": {
        "GST": 0,
        "PST": 0,
        "HST": 0.15,
        "SHIP": 1.99
    },
    "NT": {
        "GST": 0.05,
        "PST": 0,
        "HST": 0,
        "SHIP": 1.00
    },
    "NS": {
        "GST": 0,
        "PST": 0,
        "HST": 0.15,
        "SHIP": 2.50
    },
    "NU": {
        "GST": 0.05,
        "PST": 0,
        "HST": 0,
        "SHIP": 2.50
    },
    "ON": {
        "GST": 0,
        "PST": 0,
        "HST": 0.13,
        "SHIP": 1.50
    },
    "PE": {
        "GST": 0,
        "PST": 0,
        "HST": 0.,
        "SHIP": 2.25
    },
    "QB": {
        "GST": 0.05,
        "PST": 0.0975,
        "HST": 0,
        "SHIP": 1.33
    }, 
    "SK": {
        "GST": 0.05,
        "PST": 0.06,
        "HST": 0,
        "SHIP": 1.00
    }, 
    "YT": {
        "GST": 0.05,
        "PST": 0,
        "HST": 0,
        "SHIP": 1.00
    }
}

//Array of all State Names
const stateNames = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
    'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 
    'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

//Array of all State Codes
const stateCode = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
                    'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
                    'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV',
                    'WI','WY'];

//Array of All Canadian Provinces
const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland', 'Northwest Territories', 
    'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
    ];
    
//Array of All Canadian Province Codes
const provinceCodes = ["AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QB", "SK", "YT"];

const getFormBaseID = () => {
    const id = ["name", "address1", "address2", "city", "country", "province", "postalZip"];
    return id;
}
//getter methods for the main script file. inspired by the cookie script.
const returnJSON = () => {return fakeJSON;}
const returnTaxValues = () => {return provincialTaxRateInfo;}
const returnCurrencyData = () => {return currencyInfo;}
const returnStateNames = () => {return stateNames;}
const returnStateCodes = () =>{return stateCode;}
const returnProvinces = () => {return provinces;}
const returnProvinceCodes = () => {return provinceCodes;}


console.warn(`⠀%c
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠞⢳⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⠋⠀⢰⠎⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⢆⣤⡞⠃⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⢠⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣀⣾⢳⠀⠀⠀⠀⢸⢠⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣀⡤⠴⠊⠉⠀⠀⠈⠳⡀⠀⠀⠘⢎⠢⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠳⣄⠀⠀⡠⡤⡀⠀⠘⣇⡀⠀⠀⠀⠉⠓⠒⠺⠭⢵⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢹⡆⠀⢷⡇⠁⠀⠀⣸⠇⠀⠀⠀⠀⠀⢠⢤⠀⠀⠘⢷⣆⡀⠀
⠀⠀⠘⠒⢤⡄⠖⢾⣭⣤⣄⠀⡔⢢⠀⡀⠎⣸⠀⠀⠀⠀⠹⣿⡀
⠀⠀⢀⡤⠜⠃⠀⠀⠘⠛⣿⢸⠀⡼⢠⠃⣤⡟⠀⠀⠀⠀⠀⣿⡇
⠀⠀⠸⠶⠖⢏⠀⠀⢀⡤⠤⠇⣴⠏⡾⢱⡏⠁⠀⠀⠀⠀⢠⣿⠃
⠀⠀⠀⠀⠀⠈⣇⡀⠿⠀⠀⠀⡽⣰⢶⡼⠇⠀⠀⠀⠀⣠⣿⠟⠀
⠀⠀⠀⠀⠀⠀⠈⠳⢤⣀⡶⠤⣷⣅⡀⠀⠀⠀⣀⡠⢔⠕⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠫⠿⠿⠿⠛⠋⠁⠀⠀⠀⠀`, 'color: #FFC0CB;')