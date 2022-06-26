const axios = require ('axios');
const cheerio = require ('cheerio');

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);



const url = 'https://www.amazon.co.uk/Apple-24-inch-8%E2%80%91core-7%E2%80%91core-ports/dp/B0932Y7SLQ?ref_=ast_slp_dp&th=1';

const product = {name:'', price: '', link:''};

//set interval
const handle = setInterval(scrape, 20000);

async function scrape(){
    
    // fetching the data from amazon website
    const {data} = await axios.get(url);
    
    //load up the html using cheerio
    const $ = cheerio.load(data);
    const item = $('div#dp-container')
    
    //extract the needed data
    product.name = $(item).find('h1 span#productTitle').text();
    product.link = url;
    const price = $(item).find('span .a-price-whole').first().text().replace(/[,.]/g,'');
    // console.log(price)
    const priceNum = parseInt(price);
    product.price = priceNum;
    console.log(product)
    console.log(priceNum);

    //sending an SMS
    if(priceNum < 1000){
        
        client.messages.create({
            body: `the price of ${product.name} went below ${price}. You can buy it at ${product.link}`,
            from :'+12059843470',
            to: '+32497086123',
        }).then((message) => {
            console.log(message);
            clearInterval(handle);
        })
    }
};  

scrape();