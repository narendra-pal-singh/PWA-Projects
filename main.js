//https://newsapi.org/
const apiKey = '2328da66bad843cea695e8e675e90927';

//
const countries = 'ae,ar,at,au,be,bg,br,ca,ch,cn,co,cu,cz,de,eg,fr,gb,gr,hk,hu,id,ie,il,in,it,jp,kr,lt,lv,ma,mx,my,ng,nl,no,nz,ph,pl,pt,ro,rs,ru,sa,se,sg,si,sk,th,tr,tw,ua,us,ve,za'.split(',');


const defaultCountry = 'us';
const defaultChannel = 'bbc-news';

//const apiURL = 'http://newsapi.org/v2/top-headlines?' + 'country='+country+'&' + 'apiKey='+apiKey;

//const apiURL = 'http://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}'; //varables not wokr with single quote


//const apiURL = `http://newsapi.org/v2/everything?&q=abc&sources:abc&domain=abc&apiKey=${apiKey}`;    
//NOTES:Country Perameter not support for everything
//Required Parmas for Everythings: Sources, Q, Domain

const apiURL = `http://newsapi.org/v2/top-headlines?apiKey=2328da66bad843cea695e8e675e90927`;
/**
 * Request parameters: category, language, country, sources, q, pageSize, page,  apiKey
 */


const srcURL = `https://newsapi.org/v2/sources?apiKey=${apiKey}`;


const main = document.querySelector('main');
const sourceList = document.querySelector('#sourceList');
const countryList = document.querySelector('#countryList');


window.addEventListener('load', e => {

    loadCountryDropDownData();

    displayNews();
    displaySource();

    sourceList.addEventListener('change', e => {
        
        //main.innerHTML = 'Loading...';
        //Show alert if Internet not available
        //Show alert if Internet not connect/Network
        //Recall API after 5 seconds if still loading the message due to API issue

        displayNews(e.target.value);
    });

    countryList.value = defaultCountry;

    if('serviceWorker' in navigator){
        try{
            navigator.serviceWorker.register('sw.js');
            console.log('SW registred');
        }catch(e){
            console.log(e);
            console.log('SW failed');
        }
    }
});

var tmpObj;

async function displayNews( sources = defaultChannel ){
    
    const res = await fetch(apiURL+`&sources=${sources}`);
    //console.log('res='+res);
    const jsonData = await res.json();
    //console.log('jsonData'+jsonData);
    tmpObj = jsonData;
    main.innerHTML = jsonData.articles.map(createArticle).join('\n');

}

function createArticle(article){

    const dt = new Date(article.publishedAt);
    

    return `<div class="article">
    <a href="${article.url}"> <h2>${article.title}</h2> </a>
    <img src="${article.urlToImage}"/>
    <p>${article.description}...<br><span>${dt.toDateString()+', '+dt.getHours()+':'+dt.getMinutes()}</span> </p>
    
    </div>
    `;
}

async function displaySource(){

    const res = await fetch(srcURL);
    const jsonData = await res.json();
    sourceList.innerHTML = jsonData.sources.
    map(src => `<option value="${src.id}">${src.name}</option>`)
    .join('\n');

    sourceList.value = defaultChannel;

}

function loadCountryDropDownData(){
    
    for(var key in country_data){

        code = key.toLocaleLowerCase();
        
        if(countries.find( function(element) { if(element == code ) return element; } ) != undefined){
        option = document.createElement('option');
        option.text = country_data[key];
        option.value = code;
        countryList.add(option);
        }
    }

}