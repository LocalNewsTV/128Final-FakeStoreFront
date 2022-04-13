/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣶⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⣀⡀⣠⣾⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀ Final Assignment for ICS 128 - Web Scripting
⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⡇⠀⠀⠀⠀
⠀⣶⣿⣦⣜⣿⣿⣿⡟⠻⣿⣿⣿⣿⣿⣿⣿⡿⢿⡏⣴⣺⣦⣙⣿⣷⣄⠀⠀⠀
⠀⣯⡇⣻⣿⣿⣿⣿⣷⣾⣿⣬⣥⣭⣽⣿⣿⣧⣼⡇⣯⣇⣹⣿⣿⣿⣿⣧⠀⠀
⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣷⠀*/
/************************************************************************************************************
 * 
 *      Item - @param data {array} takes the object from the fakestoreAPI and parses out its contents into a new object
 *             this class adds the functionality of holding a quantity value and methods to modify the quantity
 * 
 *************************************************************************************************************/
 class Item {
    constructor(data){
        this._category = data.category;
        this._description = data.description;
        this._id = data.id;
        this._price = data.price;
        this._rating = data.rating.rate;
        this._title = data.title
        this._image = data.image;
        this._quantity = 0;
    }
    get category(){
        return this._category;
    }
    get description(){
        return this._description;
    }
    get id(){
        return this._id;
    }
    get price(){
        return this._price;
    }
    get rating(){
        return this.rating;
    }
    get title(){
        return this._title;
    }
    get image(){
        return this._image;
    }
    set quantity(quantity){
        this._quantity = quantity;
    }
    get quantity(){
        return this._quantity;
    }
    add(){
        this._quantity++;
    }
    remove(){
        if(this._quantity > 0){
            this._quantity--;
        }
    }
    removeAll(){
        this._quantity = 0;
    }
}

/************************************************************************************************************
 * 
 *      Global Variables
 * 
 ************************************************************************************************************/
let sameBill = false; //Global Boolean for checking if our Billing information is the same as shipping
let dataSet; //Raw API data from FakeStoreAPI(Or deepblue)
const currency = returnCurrencyData(); //holds extra information pertaining to currencies
const provincialTaxRate = returnTaxValues();
//Three shorthand functions to make life easier
const doc = (id) => document.getElementById(id);
const val = (id) => document.getElementById(id).value;
const newE = (id) => document.createElement(id);
let rawCurrencyData //Currency Data from the Conversion API
let currencyEX = 1; //Base value for our currencyExchange, since we are starting in Canadian and basing things off Canadian
let decimalAmount = 2; //variable for maintaining the "toFixed" methods where money is handled.
let itemCards = []; //Holds the array of class Items
let cartTotal; //Holds the pre-tax/shipping total of our cart. Lots of math based on this

/************************************************************************************************************
 * 
 *  getFakeItemsAPI() - Called at websites load, calls data from fakestoreapi then calls populateCardStack();
 * 
 ************************************************************************************************************/
const getFakeItemsAPI = async () => {
    let cookiePlaceholder = [];
    try{
        const url="https://fakestoreapi.com/products";
        const responseURL = await fetch(url);
        dataSet = await responseURL.json();
    } catch(ex){
            let url="https://deepblue.camosun.bc.ca/~c0180354/ics128/final/fakestoreapi.json";
            let responseURL = await fetch(url);
            dataSet = await responseURL.json();
    } finally {
        
        dataSet = $.extend(dataSet, returnJSON());
        if(get_cookie("shopping_cart_items_matthew2")){
            cookiePlaceholder = get_cookie("shopping_cart_items_matthew2")
        }
        populateCardStack(dataSet);
        setQuantities(cookiePlaceholder, itemCards);
    }
}

/************************************************************************************************************
 * 
 *  setQuantities() - Takes the information pulled from the cookie data and checks it against our new list of items
 *  generated on the page load. when Id's are matched, the quantity is set to the appropriate value
 * 
 ************************************************************************************************************/

setQuantities = (cookies, itemCards) => {
    for(let i = 0; i < itemCards.length; i++){
        for(let j = 0; j < cookies.length; j++){
            if(itemCards[i].id == cookies[j]._id){
                itemCards[i].quantity = cookies[j]._quantity;
            }
        }
    }
}
/************************************************************************************************************
 * 
 *      getCurrenciesFromCAD() - Pulls our currency data from the API, we are basing our 
 *      currency off of Canadian Dollars
 * 
 ************************************************************************************************************/
const getCurrenciesFromCAD = async () => {
    const url="https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad.json";
    const responseURL = await fetch(url);
    rawCurrencyData = await responseURL.json();
}

/************************************************************************************************************
 * 
 *  populateCardStack() - Called after json data is fetched. Parses data taken from the JSON object and turns
 *  it into bootstrap cards. Cards are then placed in a 2D array with their raw JSON data counterparts.
 *  @param data - Raw JSON data taken from makeAPICall();
 * 
 ************************************************************************************************************/
let populateCardStack = (data) => {
    itemCards = [];
    document.getElementById("products").replaceChildren();

    const select = document.getElementById("currency").value;
    currencyIcon = currency[select].symbol; 
    decimalAmount = currency[select].decimal
    currencyEX = parseFloat(rawCurrencyData.cad[select]);

    for(let i = 0; i < data.length; i++){
        const item = new Item(data[i]);
        const currentValue = () => (data[i].price * currencyEX).toFixed(decimalAmount);

        const cardMain = newE(`div`);
        $(cardMain).addClass("col-md-4 mb-5");

        const card = newE("div");
        card.id = item.id;
        $(card).addClass("card border-dark");
        $(card).css({"max-width": "18rem;"});

        const cardImage = newE(`img`);
        cardImage.src = data[i].image;
        $(cardImage).css({"max-height": "350px", "object-fit": "contain"});
        $(cardImage).addClass("card-img-top mt-5");
        $(card).append(cardImage);

        const cardBody = newE(`div`);
        $(cardBody).addClass("card-body");
        $(card).append(cardBody);

        const cardTitle = newE('h5');
        $(cardTitle).addClass("card-title");
        $(cardTitle).html(`${item.title}`);
        $(cardBody).append(cardTitle);
        
        const cardText = newE('p');
        $(cardText).html(`${item.description}`);
        $(cardBody).append(cardText);

        const price = newE("p");
        $(price).addClass("price");
        $(price).html(`${currencyIcon}${currentValue()}`);
        $(cardBody).append(price);
        
        const button = newE('a');
        $(button).addClass("btn btn-secondary");
        $(button).attr("data-bs-toggle", "offcanvas");
        $(button).attr("data-bs-target", "#offcanvas");
        $(button).attr("type", "button");
        $(button).id = item.id + "b";
        $(button).html("Add to cart");
        $(button).on("click", addToCart.bind(this, (item.id)))

        $(cardBody).append(button);
        $(cardMain).append(card);

        $('#products').append(cardMain);
        itemCards.push(item);
    }
}

/************************************************************************************************************
* 
*      convertCurrency() - Triggered by the select menu, the currency is updated across the page by iterating
*      each .class item and giving he new prices 
* 
************************************************************************************************************/
const convertCurrency = () => {
    const select = document.getElementById("currency").value;
    currencyIcon = currency[select].symbol; 
    decimalAmount = currency[select].decimal
    currencyEX = parseFloat(rawCurrencyData.cad[select]);
    const priceUpdate = document.getElementsByClassName("price");
    for(let i = 0; i < priceUpdate.length; i++){
        priceUpdate[i].innerHTML = `${currencyIcon}${(dataSet[i].price * rawCurrencyData.cad[select]).toFixed(decimalAmount)}`
    }
    updateShoppingCart();
}

/************************************************************************************************************
 * 
 *      updateShoppingCart() - Goes through our list of stored data, then generates a table based on items
 *      that have a quantity amounts greater than 0, Data is then appended to the tables inner HTML
 *      Currencies are updated with the shopping card the cart total is a global variable so it can be referenced
 *      and changed as needed.
 * 
 *      with each call to the shoppingcart, the cookie data is rewritten so it is up to date.
 * 
 * **********************************************************************************************************/
const updateShoppingCart= () => {
    let rowContent = `<thead>
                            <tr>
                                <td class="font-weight-bold"></td>
                                <td class="font-weight-bold">Item</td>
                                <td class="font-weight-bold">Qty</td>
                                <td class="font-weight-bold">Price</td>
                                <td class="font-weight-bold">Total</td>
                            </tr>
                        </thead>
                        <tbody>`;
    cartTotal = 0;
    const trashID = [];
    for(let i = 0; i < itemCards.length; i++){
        const trash = `<span id="${itemCards[i].id}b"><i class="bi bi-trash"></i></span>`
        if(itemCards[i].quantity > 0){
            rowContent += `<tr>
                            <td>${trash}</td>
                            <td>${itemCards[i].title}</td>    
                            <td>${itemCards[i].quantity}</td>
                            <td>${currencyIcon}${(itemCards[i].price * currencyEX).toFixed(decimalAmount)}</td>
                            <td>${currencyIcon}${((itemCards[i].price * itemCards[i].quantity) * currencyEX).toFixed(decimalAmount)}</td>
                        </tr>`
            trashID.push(`${itemCards[i].id}`);
            cartTotal += itemCards[i].price * itemCards[i].quantity;
        }
    }
    rowContent += `</tbody>`;
    $(`#cartlist`).html(rowContent);
    $(`#totalCost`).html(`${currencyIcon}${(cartTotal * currencyEX).toFixed(decimalAmount)}`);
    for(items in trashID){
        $(`#${trashID[items]}b`).on("click", removeItem.bind(this, (trashID[items])));
    }
    if(cartTotal == 0){
        $('#checkoutButton').attr("disabled", true);
    }
    else{
        $('#checkoutButton').removeAttr("disabled");
    }
    set_cookie("shopping_cart_items_matthew2", itemCards);
}

/************************************************************************************************************
 * 
 *  emptyCart() - Iterates through all Quantity elements in the itemCards 2D array, and resets them to 0
 *  then calls updateShoppingCart to reflect the new data.
 * 
 ************************************************************************************************************/
const emptyCart = () => {
    for(item in itemCards){
        itemCards[item].removeAll();
    }
    updateShoppingCart();
}

/************************************************************************************************************
 * 
 *      removeItem(@param id) - Iterates through itemCards 2D array looking for an ID match
 *      If one is found, the items quantity is reset to 0 and the shoppingCart is updated.
 * 
 ************************************************************************************************************/
const removeItem = (id) => {
    for(items in itemCards){
        if(id == itemCards[items].id){
            itemCards[items].remove();
        }
    }
    updateShoppingCart();
}

/************************************************************************************************************
 * 
 *      addToCart() - take in @param id representing the ID if the item we wish to purchase
 *      tbe array of inventory is searched for the matching id and its quantity is increased by 1 
 *      the shopping cart is then updated to show our changes. 
 * 
 ************************************************************************************************************/
 addToCart = (id) =>{
    for(cards in itemCards){
        if(itemCards[cards].id === id){
            itemCards[cards].add();
        }
    }
    updateShoppingCart();
}

/************************************************************************************************************
 *      @param arg {Array} 
 *      @param caller {String}
 *      applyStateProvince() - Resets the select menu option to a 
 *      blank slate and populates it with the data corresponding to the selected country
 * 
 *************************************************************************************************************/
const applyStateProvince = (arg, caller) => {
    let country = [];
    let area = [];
    if($(`#${caller}`).val() == "cad"){
        country = returnProvinces();
        area = returnProvinceCodes();
    }
    else if($(`#${caller}`).val() == "usa"){
        country = returnStateNames();
        area = returnStateCodes();
    }
    else{
        country = ["Select"];
        area = ["none"]
    }
    document.getElementById(arg).options.length = 0;
    for(areas in country){
        const option = newE("option");
        option.value = area[areas];
        option.innerHTML = country[areas];
        $(`#${arg}`).append(option);
    }
}
/**************************************************************************************************************
 * 
 *      sameBilling() - Responsible for toggling the interactivity of the Billing form to communicate
 *      meaningfully that the form is [not] necessary. Tied to an event listener on the checkbox 
 * 
 ***************************************************************************************************************/
const sameBilling = () => {
    const form = doc("billingForm");
    if($(`input[id='sameBilling']`).prop("checked")){
        sameBill = true;
        $('fieldset').attr("disabled", "true");
    }
    else{
        sameBill = false;
        $('fieldset').removeAttr("disabled")
    }
}


/**************************************************************************************************************
 * 
 *      Anonymous function() - used to iterate backwards through the checkout menu process, in case
 *      you need to change the details you entered; 
 * 
 ***************************************************************************************************************/
$('#back2, #back3, #back4').on("click", function(){
    const id = $(this).attr('id');
        $('.step').hide();
        switch (true){
            case(id == "back2"):
                $('#shippingDetail').fadeIn("fast");
                break;
            case(id == "back3"):
                $('#billingDetail').fadeIn("fast");
                break;
            case(id == "back4"):
                $('#paymentDetail').fadeIn("fast");
                break;
        }
});
/**************************************************************************************************************
 * 
 *      Anonymous functions() - Used to iterate forwards through the checkout process. Will not iterate if the
 *      current page does not have valid Regex. Calls the regexCheck(id) method to ensure compliance;
 * 
 ***************************************************************************************************************/
$('#next1, #next2, #next3, #next4').on("click", function(){
    const id = $(this).attr('id');
    if(regexCheck(id)){
        $('.step').hide();
        switch (true){
            case(id == "next1"):
                $('#billingDetail').fadeIn("fast");
                break;
            case(id == "next2"):
                $('#paymentDetail').fadeIn("fast");
                break;
            case(id == "next3"):
                taxMan();
                confirmationLoader();
                $('#confirmationDetail').fadeIn("fast");
                break;
            case(id === "next4"):
                sendOrder();
                $('#successFail').fadeIn("fast");
                break;

        }
    }
});  
/**************************************************************************************************************
 *  
 *      @param caller {string} ID of the button that calls the function
 *      regexCheck(caller) - A Large function that pulls in the ID from its caller, and initiates the case in the 
 *      switch tree it correlates to. Depending on stage of form it curates a list of the data it wants to test and
 *      runs each function through the regex checker. After which is checks to ensure that the country/provinces have
 *      been selected.
 * 
 ***************************************************************************************************************/
const regexCheck = (caller) => {
    //All of the Regex for our calls
    const checkName = /^([A-Z][a-z]+[ \\s-][a-z][a-z]+)$/i;
    const checkAddress = /^[0-9]+[a-z ]+[a-z]+$/i
    const checkEmail = /^[\d|\w|-|_.]+[@][\w]+[.][\w]+$/;
    const checkPhone = /^[0-9][0-9][0-9][-\\s ]*[0-9][0-9][0-9][-\\s ]*[0-9][0-9][0-9][0-9]$/;
    const postCode = /^((^[a-cg-hj-npr-tvx-y][0-9][a-ceg-hj-npr-tv-z][-\\s ]*[0-9][a-cg-hj-npr-tv-z][0-9]$)$||^(^[0-9][0-9][0-9][0-9][0-9]$))$/i;
    const checkCity = /^[a-z .]+$/i;
    const checkCCNum = /^[0-9][0-9][0-9][0-9][ ]*[0-9][0-9][0-9][0-9][ ]*[0-9][0-9][0-9][0-9][ ]*[0-9][0-9][0-9][0-9]$/
    const checkSecur = /^[0-9][0-9][0-9]*$/
    const checkExp = /^((^[0-1][0-2])||(^[0][1-9]))[ /]*([2][2-7])$/;
    const regVal = [checkName, checkAddress, checkEmail, checkPhone, postCode, checkCity];
    
    const checkVal = (x, reg, target) => {
        if(reg.test(x)){
            $(`#${target}`).removeClass("border border-danger border-2");
            return true;
        }
        else{
            $(`#${target}`).addClass("border border-danger border-2");
            return false; 
        }
    }
    let valid = true;
    switch (true){ 
        case(caller == "next1"):
        const search = ["name1", "address11", "email1", "phone1", "postalZip1", "city1" ];
            for(i in search){
                if(!checkVal($(`#${search[i]}`).val(), regVal[i], search[i])){
                    valid = false;
                }
            }
                if($('#country1').val() == "none"){
                    $('#country1').addClass("border border-danger border-2");
                    valid = false;
                }
                else{
                    $('#country1').removeClass("border border-danger border-2");
                }
                if($('#province1').val() == "none"){
                    $('#province1').addClass("border border-danger border-2");
                    valid = false;
                }
                else{
                    $('#province1').removeClass("border border-danger border-2");
                }
            break;
        case(caller == "next2"):
            if(!sameBill){
                const search2 = ["name2", "address12", "email2", "phone2", "postalZip2", "city2" ];
                for(i in search2){
                    if(!checkVal($(`#${search2[i]}`).val(), regVal[i], search2[i])){
                        valid = false;
                    }
                }
                if($('#country2').val() == "none"){
                    $('#country2').addClass("border border-danger border-2");
                    valid = false;
                }
                else{
                    $('#country2').removeClass("border border-danger border-2");
                }
                if($('#province2').val() == "none"){
                    $('#province2').addClass("border border-danger border-2");
                    valid = false;
                }
                else{
                    $('#province2').removeClass("border border-danger border-2");
                }
            }
            break;
        case(caller == "next3"):
            const search3 = ["name3", "expiration", "cardnum", "expiration", "security", "postalZip3"];
            const ccReg = [checkName, checkExp, checkCCNum, checkExp, checkSecur, postCode];
            for(i in search3){
                if(!checkVal($(`#${search3[i]}`).val(), ccReg[i], search3[i])){
                    valid = false;
                }
            }
            break;
    }
    return valid;
}

/**************************************************************************************************************
 * 
 *      sendOrder - Async function that will ship off our payload information
 *      - If successful, a modal will display your confirmation message and will reset your cart
 *      - If failure, a modal will display the issues with the current payload information so you can go back and
 *        fix your information
 * 
 ***************************************************************************************************************/
const sendOrder = async () => {
    let response
    try{
        const url = "https://deepblue.camosun.bc.ca/~c0180354/ics128/final/"
        const payload = createPayload();
        const token = new FormData();
        token.append('submission', JSON.stringify(payload));
        const responseURL = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: token
        });
        response = await responseURL.json();
        if(response.status == "NOT SUBMITTED"){
            throw new Error("Uh oh!");
        } 
        const evangelion = newE('img');
        evangelion.src = "images/congratulations-shinji.gif"
        const congratulations = $('<h6></h6>')
        $(congratulations).html("Success!")
        $('#evangelion').css({"overflow": "hidden"});
        const p = $('<p></p>');
        $(p).addClass("text-center");
        $(p).html("Your order has been confirmed, It will be delivered to your dreams in 9-15 business days");
        $('#evangelion, #confirmationOnSend').html("");
        $('#evangelion').append(evangelion);
        const button = newE('button');  
        $('#successFail').removeClass("row justify-content-center")
        $(button).addClass("btn btn-success");
        $(button).html("Thank you");
        $(button).attr("data-dismiss", "modal");
        $('#confirmationOnSend').append(congratulations, p, button);
        emptyCart();

    } catch(ex) {
        $('#evangelion, #confirmationOnSend').html("");
        const myArray = Object.entries(response.error);
        const sorry = $('<h6></h6>');
        $(sorry).html("Sorry, looks like something went wrong processing your order!");
        const steps = $(`<p></p>`);
        $(steps).html("Please fix the following:")
        const table = newE('table');
        $(table).addClass("table table-hover");
        const tbody = newE('tbody');
        $('#successFail').addClass("row justify-content-center");
        $(table).append(tbody);
        $("#confirmationOnSend").append(sorry, steps);
        const button = newE("button")
        $(button).addClass("btn btn-success")
        $(button).html("Go back and correct");
        $(button).on("click", function(){
            $('.step').hide();
            $('#confirmationDetail').fadeIn("fast");
        })
        


        for(let i = 0; i < myArray.length; i++){
            const key = myArray[i][0];
            const errorMess = myArray[i][1];
            const tr = $('<tr></tr>');
            const tdOne = $('<td></td>'); 
            const tdTwo = $('<td></td>');
            const p = $('<p></p>')
            if(typeof errorMess == "object"){
                Object.keys(errorMess).forEach((objKey) => {
                    const value = errorMess[objKey];
                    $(tdOne).html(`${objKey.replace("_", " ")}:`);
                    $(tr).append(tdOne);
                    $(tdTwo).html(`${value}`);
                    $(tr).append(tdTwo);
                    $(tbody).append(tr);
                  });
            }
            else{
                $(tdOne).html(`${key.replace("_", " ")}:`);
                $(tr).append(tdOne);
                $(tdTwo).html(`${errorMess}`);
                $(tr).append(tdTwo);
                $(tbody).append(tr);
            }
        }
        $('#confirmationOnSend').append(table);
        $('#confirmationOnSend').append(button);
    }
}

/**************************************************************************************************************
 * 
 *  taxMan() - This section will Generate our taxes based on the items in our cart, and applies our shipping amounts
 *  I acknowledge that my table is technically incorrect for my bootstrap because it is missing a <tbody> wrapper
 *  but I thought it looked sort of like nutritional information, so I elected to leave it as an homage to my
 *  past life as a red seal chef 👨‍🍳.
 * 
 ***************************************************************************************************************/
const taxMan = () => {
    $('#taxesTotal').html("");
    const taxInfo = returnTaxValues();
    let GST, HST, PST, SHIP, area;
    area = $('#province1').val();
    //We are checking for if we are in Canada to set our HST/GST/PST values
    if(taxInfo[area]){
        GST = ["GST", taxInfo[area].GST];
        HST = ["HST", taxInfo[area].HST];
        PST = ["PST", taxInfo[area].PST];
        SHIP = taxInfo[area].SHIP;
    }
    else{
        GST = ["GST", 0]
        HST = ["HST", 0]
        PST = ["PST", 0];
        SHIP = 5.00
    }
    //This will create the Header for our additional fees section (Taxes/Shipping/Grand Total)
    const tax = [GST, HST, PST];
    const th = $('<thead></thead>');
    const taxes = $('<td></td>');
    $(taxes).text("Fees")
    const amount = $('<td></td>');
    $(amount).text("Amount");
    $(th).append(taxes, amount);
    $('#taxesTotal').append(th);
    //If we are in Canada we will append taxes based on the Province
    if(tax[0][1] != 0 || tax[1][1] != 0 || tax[2][1] != 0 ){
        for(let i = 0; i < tax.length; i++){
            if(tax[i][1] > 0){
                const tr = $('<tr></tr>');
                let taxName = $(`<td></td>`);
                $(taxName).append(tax[i][0]);
                $(tr).append(taxName);
                let taxes = $('<td></td>');
                $(taxes).append(currencyIcon + (tax[i][1] * (cartTotal * currencyEX)).toFixed(decimalAmount))
                $(tr).append(taxes);
                $('#taxesTotal').append(tr);
            }
        }
    }  
    else{
        //If the country is the USA Then there will be no taxes
        const tr = $('<tr></tr>');
        const taxName = $(`<td></td>`);
        $(taxName).append("N/A");
        $(tr).append(taxName);
        const taxes = $('<td></td>');
        $(taxes).append("N/A")
        $(tr).append(taxes);
        $('#taxesTotal').append(tr);
    }
    //Math section to create the Shipping Totals
    let totalQuantity = 0;
    const flatRate = 10
    for(cards in itemCards){
        totalQuantity += itemCards[cards].quantity;
    }
    grandTotal = cartTotal;
    grandTotal += cartTotal * tax[0][1];
    grandTotal += cartTotal * tax[1][1];
    grandTotal += cartTotal * tax[2][1];
    grandTotal *= currencyEX;
    grandTotal += ((totalQuantity * SHIP) + flatRate) * currencyEX;
    grandTotal = parseFloat(grandTotal).toFixed(decimalAmount)
    //Create Total for Shipping Labels
    const shipRow = $('<tr></tr>');
    const shipLabel = $('<td></td>');
    const shipTotal = $('<td></td>');
    $(shipLabel).append("Shipping Fees");
    $(shipTotal).append(`${currencyIcon}${((flatRate + (totalQuantity * SHIP)) * currencyEX).toFixed(decimalAmount)}`)
    $(shipRow).append(shipLabel);
    $(shipRow).append(shipTotal);
    $('#taxesTotal').append(shipRow);
    //Create Row for Grand Total
    const totalRow = $('<tr></tr>');
    const totalLabel = $('<td></td>');
    const totalTotal = $('<td></td>');
    $(totalLabel).append("Grand Total");
    $(totalTotal).append(currencyIcon + grandTotal);
    $(totalRow).append(totalLabel);
    $(totalRow).append(totalTotal);
    $('#taxesTotal').append(totalRow);
}

/**************************************************************************************************************
 * 
 *  ShowPurchases
 * 
 ***************************************************************************************************************/
const confirmationLoader = () => {
    $('#cartPurchase').html("");
    //Build it up
    const th = $('<thead></thead>');
    const tRow = $('<tr></tr>');
    const imageBan = $('<td></td>')
    const tbody = $('<tbody></tbody>')
    $(imageBan).append("Image");
    const itemBan = $('<td></td>')
    $(itemBan).append("Item")
    const priceBan = $('<td></td>')
    $(priceBan).append("Individual Price")
    const quanTot = $('<td></td>')
    $(quanTot).append("Total");
    //Smash it all together
    $(imageBan).addClass("font-weight-bold");
    $(itemBan).addClass("font-weight-bold");
    $(priceBan).addClass("font-weight-bold");
    $(quanTot).addClass("font-weight-bold");
    $(tRow).append(imageBan, itemBan, priceBan, quanTot);
    $(th).append(tRow);
    $('#cartPurchase').append(th, tbody);

    for(cards in itemCards){
        if(itemCards[cards].quantity > 0){
            const tr = $('<tr></tr>');
            const image = $('<td></td>')
            const imageCont = newE("img");
            imageCont.src = itemCards[cards].image;
            $(imageCont).css({"max-height": "50px"})
            $(image).append(imageCont);
            const item = $('<td></td>')
            $(item).append(itemCards[cards].title);
            const price = $('<td></td>')
            $(price).append(currencyIcon, (itemCards[cards].price * currencyEX).toFixed(decimalAmount));
            const quan = $('<td></td>')
            $(quan).append(currencyIcon, ((itemCards[cards].price * itemCards[cards].quantity) * currencyEX).toFixed(decimalAmount));
            $(tr).append(image, item, price, quan);
            $(tbody).append(tr);
        }
    }
}


/**************************************************************************************************************
 * 
 *  createPayload() -  Pulls all the data out of our forms and creates one large object with all the value pairs
 *                     to submit to the server to process our order
 * 
 ***************************************************************************************************************/

const createPayload = () => {
    const payload = {};
    payload.card_number = val("cardnum").replaceAll(" ", "");
    payload.expiry_month = (val("expiration")).substring(0, 2);
    payload.expiry_year = "20" + (val("expiration")).slice(-2);
    payload.security_code = val("security");
    payload.amount = grandTotal;
    payload.currency = val("currency").toLowerCase();
    payload.shipping = {}
    payload.shipping.first_name = (val("name1")).substring(0, val("name1").indexOf(" ")).toUpperCase();
    payload.shipping.last_name = (val("name1")).substring(val("name1").indexOf(" ") + 1).toUpperCase();
    payload.shipping.address_1 = (val("address11")).toUpperCase();
    payload.shipping.address_2 = (val("address21")).toUpperCase() || "";
    payload.shipping.city = val("city1").toUpperCase();
    //Gotta be sure we are looking at either a State or a province!
    if(val("country1") == "cad"){
        payload.shipping.province = (val("province1")).toUpperCase();
    }
    else{
        payload.shipping.state = (val("province1")).toUpperCase();
    }
    payload.shipping.country = val("country1").substring(0, 2).toUpperCase()
    payload.shipping.postal = val("postalZip1").toUpperCase();
    payload.billing = {};
    if(!sameBill){
        payload.billing.first_name = (val("name2")).substring(0, val("name2").indexOf(" ")).toUpperCase();
        payload.billing.last_name = (val("name2")).substring(val("name2").indexOf(" ") + 1).toUpperCase();
        payload.billing.address_1 = (val("address12")).toUpperCase();
        payload.billing.address_2 = (val("address22")).toUpperCase() || "";
        payload.billing.city = val("city2").toUpperCase();
        //Gotta be sure we are looking at either a State or a province!
        if(val("country2") == "cad"){
            payload.billing.province = (val("province2")).toUpperCase();
        }
        else{
            payload.billing.state = (val("province2")).toUpperCase();
        }
        payload.billing.country = (val("country2")).substring(0, 2).toUpperCase(); //This has substring added
        payload.billing.postal = (val("postalZip2")).toUpperCase();
        payload.billing.phone = val("phone2");
        payload.billing.email = val("email2").toUpperCase();
    }
    else{
        payload.billing.first_name = payload.shipping.first_name
        payload.billing.last_name = payload.shipping.last_name
        payload.billing.address_1 = payload.shipping.address_1
        payload.billing.address_2 = payload.shipping.address_2
        payload.billing.city = payload.shipping.city 
        //Gotta be sure we are looking at either a State or a province!
        if(val("country1") == "cad"){
            payload.billing.province = payload.shipping.province;
        }
        else{
            payload.billing.state = payload.shipping.state;
        }
        payload.billing.country = payload.shipping.country
        payload.billing.postal =  payload.shipping.postal
        payload.billing.phone = val("phone1").toUpperCase();
        payload.billing.email = val("email1").toUpperCase();
    }
    return payload;
}

/**************************************************************************************************************
 * 
 *      autoMarkingHelper() - Joe's favourite part of my lab because it saves him time marking
 * 
 ***************************************************************************************************************/

const autoMarkingHelper = () =>{
    $("#country1 select").val("cad").change();
    $("#cardnum").val("4111 1111 1111 1111");
    $("#expiration").val("01/25");
    $("#security").val("645");
    $("#city1, #city2").val("Victoria");
    $("#name1, #name2, #name3").val("Joe Smith");
    $("#address12, #address11").val("322 Some Street");
    $("#address22, #address21").val("");
    $("#city1, #city2").val("St Johns");
    $("#postalZip1, #postalZip2, #postalZip3").val("V9E 2C1");
    $("#phone1, #phone2").val("800-555-3000");
    $("#email1, #email2").val("Joe@JoeSchmos.com");
}

const cartFiller = () => {
    for(items in itemCards){
        let id = itemCards[items].id;
        if(id === 1001 || id === 999 || id === 1002){
            itemCards[items].add(); 
        }
    }
    updateShoppingCart();
}

/**************************************************************************************************************
 * 
 *      Anonymous async function() - On successful load of document,calls getCurrenciesFromCAD to give us the daily
 *      currency conversion rates. calls makeAPICall to get our JSON data
 *      then updates our item cards to update the previously selected quantity via the get_cookie method.
 *      Finally the updateShoppingCart() method is called to show us the users current cart.
 *      
 ***************************************************************************************************************/
 $(document).ready(async function(){
    await getCurrenciesFromCAD();
    await getFakeItemsAPI();
    $("#currency").on("change", convertCurrency);
    updateShoppingCart();
});

/***************************************************************************************************************
 * 
 *  Event Listeners + Quality of life additions
 * 
 ****************************************************************************************************************/

 $('#emptyCart').on("click", emptyCart);
 $('#country1').on("change", applyStateProvince.bind(this, "province1", "country1"));
 $('#country2').on("change", applyStateProvince.bind(this, "province2", "country2"));
 $('#sameBilling').on("change", sameBilling);
 //Adds a random item to cart
 $('#surprise').on("click", function(){
    const choice = Math.floor(Math.random() * itemCards.length);
    itemCards[choice].add();
    updateShoppingCart();
 });
 //Gives us the Curated Joe's Selection added to our cart
 $('#joesSelect').on("click", cartFiller);
 $('#autoComplete').on("click", autoMarkingHelper);
 $('#checkoutButton').on("click", function(){
     //Hides all the checkout screens and reveals to the first to prevent breaking
     $('.step').hide();
     $('#shippingDetail').fadeIn("fast");
 });
 $('#exampleModal').on('shown.bs.modal', function (){
     //Fixes the issue of offCanvas overlapping the modal by closing the offCanvas on open 
     const closeCanvas = document.querySelector('[data-bs-dismiss="offcanvas"]');
     closeCanvas.click();
 });

 /*
 ⢀⡴⠑⡄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠸⡇⠀⠿⡀⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀ It's all ogre now.
⠀⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆⠀⠀⠀⠀⠀⠀⠀   
⠀⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢀⢴⣶⣆ 
⠀⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⠸⣼⡿ 
⠀⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉⠀⠀⠀⠀⠀ 
⠀⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ 
⠀⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉
 */