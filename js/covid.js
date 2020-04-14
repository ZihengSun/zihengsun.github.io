
/**
 * 
 * COVID Risk Calculation
 * 
 * Author: Jensen Ziheng Sun
 * Date: 4/14/2020
 * 
 * Some rights reserved. 
 * 
 */

var zipcodecsv = "data/uszips.csv"

var covidcsv = "data/04-13-2020.csv"

var popcsv = "data/co-est2019-alldata.csv"

function getPopByFIPS(fipscode){

    fipscode = Number(fipscode)

    $.ajax({
        
        type: "GET",
        
        url: popcsv,
        
        dataType: "text",

        success: function(data) {
            
            var record_num = 15;  // or however many elements there are in each row
            var allTextLines = allText.split(/\r\n|\n/);
            var entries = allTextLines[0].split(',');
            var lines = [];

            var headings = entries.splice(0,record_num);
            while (entries.length>0) {
                var tarr = [];
                for (var j=0; j<record_num; j++) {
                    tarr.push(headings[j]+":"+entries.shift());
                }
                lines.push(tarr);
            }

            console.log(lines)
        
        }
     });

    

}

function getCOVIDByFIPS(fipscode){

    fipscode = Number(fipscode)



}

function getPopByZip(zipcode){

    zipcode = Number(zipcode)



}

function getCOVIDByZip(zipcode){

    zipcode = Number(zipcode)




}

function riskestimate(total_population, store_people_count, potential_covid_cases){

    // calculate no clash probability
    var p = 1
    for(var i=0;i<Number(store_people_count); i+=1){

        p = p*((Number(total_population)-i-Number(potential_covid_cases))/Number(total_population))

    }
        
    console.log("no clash : ", p)
    // get clash probability
    var clashp = 1-p
    // make it percentage
    return Math.round(clashp*100, 4)

}

$("#calc").click(function(){

    var population = $("#population").val()

    var storepeople = $("#storepeople").val()

    var potentials = $("#potentials").val()

    console.log(potentials);

    var risk = riskestimate(population, storepeople, potentials)

    $("#results_own").html("<p>Estimation:</p>"+
    "<p>The probability of meeting people with COVID in the grocery stores/gyms/restaurants/workplaces/recreational areas is <bold style=\"color:red\">" +  risk + "%</bold>.</p>")

})

$("#findfips").click(function(){

    var fipscode = $("#fipscode").val()

    // var zipcode = $("#zipcode").val()

    var popret = getPopByFIPS(fipscode);

    var covidret = getCOVIDByFIPS(fipscode);

    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-13-2020.csv


})
