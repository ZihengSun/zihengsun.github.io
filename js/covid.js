
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

var rooturl = "https://zihengsun.github.io/"

var zipcodecsv = rooturl + "data/uszips.csv"

var covidcsv = rooturl + "data/04-13-2020.csv"

var popcsv = rooturl + "data/co-est2019-alldata.csv"

var zip2fipscsv = rooturl + "data/ZIP-COUNTY-FIPS_2011-06.csv"

// parse covid csv

var example_covid_array = []

$.ajax({
        
    type: "GET",
    
    url: covidcsv,
    
    dataType: "text",

    success: function(data) {
        
        var allTextLines = data.split(/\r\n|\n/);

        for(var i=1;i<allTextLines.length;i+=1){
            
            var cols = allTextLines[i].split(',')
            
            example_covid_array.push(cols)

        }

    }
 });

// parse the zipcodecsv

zip2fips = []

$.ajax({
        
    type: "GET",
    
    url: zip2fipscsv,
    
    dataType: "text",

    success: function(data) {
        
        var allTextLines = data.split(/\r\n|\n/);

        for(var i=1;i<allTextLines.length;i+=1){
            
            var cols = allTextLines[i].split(',')
            
            zip2fips.push(cols)

        }

    }
 });

function getInfoByFIPS(fipscode, county_ele, pop_ele, pop2_ele, covid_ele, covid2_ele){

    fipscode = Number(fipscode)

    var statename = "N/A"

    var countyname = "N/A"

    var population = "N/A"

    for(var i=0;i<example_covid_array.length;i+=1){

        if(fipscode==example_covid_array[i][0]){

            statename = example_covid_array[i][2]

            countyname = example_covid_array[i][1]

        }

    }


    $.ajax({
        
        type: "GET",
        
        url: popcsv,
        
        dataType: "text",

        success: function(data) {
            
            // var record_num = 15;  // or however many elements there are in each row
            var allTextLines = data.split(/\r\n|\n/);
            var entries = allTextLines[0].split(',');
            var lines = [];

            var population = ""

            for(var i=0;i<allTextLines.length;i+=1){
                
                var cols = allTextLines[i].split(',')
                
                // console.log(cols)

                if(statename == cols[5] && cols[6].startsWith(countyname)){

                    population = cols[7]

                    console.log("Population : ", population)

                    break;

                }

            }

            county_ele.html(countyname + ", " + statename)

            pop_ele.html(population)

            pop2_ele.html(population)

            // var headings = entries //.splice(0,record_num);
            // while (entries.length>0) {
            //     var tarr = [];
            //     for (var j=0; j<headings.length; j++) {
            //         tarr.push(headings[j]+":"+entries.shift());
            //     }
            //     lines.push(tarr);
            // }
        
        }
     });

    

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

    var population = $("#popu").val()

    var storepeople = $("#storepeople").val()

    var potentials = $("#potentials").val()

    console.log(potentials);

    var risk = riskestimate(population, storepeople, potentials)

    $("#results_own").html("<p>Estimation:</p>"+
    "<p>In this region, the probability of meeting people with COVID in the grocery stores/gyms/restaurants/workplaces/recreational areas is <bold style=\"color:red\">" +  risk + "%</bold>.</p>")

})

$("#findfips").click(function(){

    var fipscode = $("#fipscode").val()

    // var zipcode = $("#zipcode").val()


    getInfoByFIPS(fipscode, $("#county"), $("#popres"), $("#popu"), $("#covid"), $("#potentials"));

    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-13-2020.csv


})

function getFIPSByZip(zipcode){

    var fips = "N/A"

    for(var i=0;i<zip2fips.length;i+=1){

        if(Number(zip2fips[0])==Number(zipcode)){

            fips = zip2fips[1]

        }

    }

    return fips;

}

$("#findzip").click(function(){

    var zipcode = $("#zipcode").val()

    var fips = getFIPSByZip(zipcode)

    getInfoByFIPS(fips, $("#county2"), $("#popres2"), $("#popu"), $("#covid2"), $("#potentials"));

})
