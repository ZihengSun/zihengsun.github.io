
/**
 * 
 * COVID Risk Calculation
 * 
 * Author: Jensen Ziheng Sun
 * Date: 12/26/2020
 * 
 * Some rights reserved. 
 * 
 */

function getDateStr(d){

    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

    var str = `${mo}-${da}-${ye}`
    console.log(str)

    return str
}

// const td = new Date()

// var today = getDateStr(td)

// var yd = new Date(td)

// yd.setDate(yd.getDate() - 1)

// var yesterday = getDateStr(yd)

// var yd2 = new Date(td)

// yd2.setDate(yd2.getDate() - 2)

// var twodaysago = getDateStr(yd2)

// https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-13-2020.csv

var latest_covid_array = []

var covid_array_15daysago = []

var onemonthago_covid_array = []

var covid_array_56daysago = []

var all_arrays = [[], [], [], []]

var count = 0

function getLatestCOVID(td, index){

    var today = getDateStr(td)

    // console.log("start to process " + today);
	/**if(is_one_month_ago){
		
		onemonthago_covid_array = []
		
	}else{
		
		latest_covid_array = []
		
	}**/
	
	all_arrays[index] = []

    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-14-2020.csv
    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-04-2020.csv

    var client = new XMLHttpRequest();
    //			client.open('GET', '../temp/ncov_hubei.csv');
    client.open('GET', 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+today + ".csv", false);
	
    client.onload = function() {
        // console.log(client.status)
        if(client.status==200){
			console.log("enter 200");
            var csv = client.responseText;
            var allTextLines = csv.split(/\r\n|\n/);

            for(var i=1;i<allTextLines.length;i+=1){
                
                var cols = allTextLines[i].split(',')
                
                //covid_array.push(cols)
				
				/**if(is_one_month_ago){
		
					onemonthago_covid_array.push(cols)
					
				}else{
					
					latest_covid_array.push(cols)
					
				}**/
				
				all_arrays[index].push(cols)

            }
            // console.log(csv)
        }else{
			console.log("enter non-200");
            // console.log("entry error")
            //file not exists
            count += 1

            if(count < 5){

                var yd = new Date(td)

                yd.setDate(yd.getDate() - 1)

                getLatestCOVID(yd, index)

            }

        }
		
		
		
    }
	
    client.onerror = function(){
		
		console.error("Error occurs when requesting the COVID-19 data.");
        
    }
	
    client.send()
	
}

function getOldDays(num_of_days){
	
	var cd = new Date()
	
	var m = cd.getMonth();
	
	//cd.setMonth(cd.getMonth()-1);
	cd.setDate(cd.getDate()-num_of_days);
	
	//if (cd.getMonth() == m) cd.setDate(0);
	
	cd.setHours(0, 0, 0);
	
	cd.setMilliseconds(0);

	console.log(cd)

	return cd;
	
}

// Active Cases = (100% of new cases from last 14 days + 19% of days 15-30 + 5% of days 31-56) - Death Count

var current_day = getOldDays(1)

var day_15_ago = getOldDays(15)

var day_30_ago = getOldDays(30)

var day_56_ago = getOldDays(56)

getLatestCOVID(current_day, 0)

getLatestCOVID(day_15_ago, 1)

getLatestCOVID(day_30_ago, 2)

getLatestCOVID(day_56_ago, 3)

console.log(all_arrays)

var rooturl = "https://zihengsun.github.io/"

var zipcodecsv = rooturl + "data/uszips.csv"

var covidcsv = rooturl + "data/04-13-2020.csv"

var popcsv = rooturl + "data/co-est2019-alldata.csv"

var zip2fipscsv = rooturl + "data/ZIP-COUNTY-FIPS_2011-06.csv"

// parse covid csv

// var example_covid_array = []

// $.ajax({
        
//     type: "GET",
    
//     url: covidcsv,
    
//     dataType: "text",

//     success: function(data) {
        
//         var allTextLines = data.split(/\r\n|\n/);

//         for(var i=1;i<allTextLines.length;i+=1){
            
//             var cols = allTextLines[i].split(',')
            
//             example_covid_array.push(cols)

//         }

//     }
//  });

// parse the zipcodecsv

var zip2fips = []

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
 
//download population csv
var population_array = []

$.ajax({
        
	type: "GET",
	
	url: popcsv,
	
	dataType: "text",

	success: function(data) {
		
		population_array = data
		
		console.log("population is here.")
	
	}
});

function getPop(statename, countyname){
	
	// var record_num = 15;  // or however many elements there are in each row
	var allTextLines = population_array.split(/\r\n|\n/);
	var entries = allTextLines[0].split(',');
	var lines = [];

	var population = ""

	for(var i=0;i<allTextLines.length;i+=1){
		
		var cols = allTextLines[i].split(',')
		
		// console.log(cols)

		if(cols[5]!=null&&cols[6]!=null
			&&statename.toLowerCase() == cols[5].toLowerCase() 
			&& cols[6].toLowerCase().startsWith(countyname.toLowerCase())){

			//population = cols[7]
			population = cols[18]

			console.log("Population : ", population)

			break;

		}

	}
	
	return population;
	
}


function getCountyNameByFIPS(fipscode){

	fipscode = Number(fipscode)

	var statename = "N/A"

	var countyname = "N/A"
	
	for(var i=0;i<all_arrays[0].length;i+=1){

        if(fipscode==all_arrays[0][i][0]){

            statename = all_arrays[0][i][2]

			countyname = all_arrays[0][i][1]
			
			break;

        }

	}
	
	return [statename, countyname];

}

function getInfoByFIPS(fipscode){

    fipscode = Number(fipscode)

    var statename = "N/A"

    var countyname = "N/A"

    var population = "N/A"

    var confirmed = "N/A"

    var death = "N/A"

    var active = "N/A"

    var recovered = "N/A"

    var lastupdate = "N/A"
	
	var statename_15 = "N/A"

    var countyname_15 = "N/A"

    var population_15 = "N/A"

    var confirmed_15 = "N/A"

    var death_15 = "N/A"

    var active_15 = "N/A"

    var recovered_15 = "N/A"

    var lastupdate_15 = "N/A"
	
	var statename_1m = "N/A"

    var countyname_1m = "N/A"

    var population_1m = "N/A"

    var confirmed_1m = "N/A"

    var death_1m = "N/A"

    var active_1m = "N/A"

    var recovered_1m = "N/A"

    var lastupdate_1m = "N/A"
	
	var statename_56 = "N/A"

    var countyname_56 = "N/A"

    var population_56 = "N/A"

    var confirmed_56 = "N/A"

    var death_56 = "N/A"

    var active_56 = "N/A"

    var recovered_56 = "N/A"

    var lastupdate_56 = "N/A"

    for(var i=0;i<all_arrays[0].length;i+=1){

        if(fipscode==all_arrays[0][i][0]){

            statename = all_arrays[0][i][2]

            countyname = all_arrays[0][i][1]

            confirmed = all_arrays[0][i][7]

            death = all_arrays[0][i][8]

            active = all_arrays[0][i][10]

            recovered = all_arrays[0][i][9]

            lastupdate = all_arrays[0][i][4]

        }

    }
	
	for(var i=0;i<all_arrays[1].length;i+=1){

        if(fipscode==all_arrays[1][i][0]){

            statename_15 = all_arrays[1][i][2]

            countyname_15 = all_arrays[1][i][1]

            confirmed_15 = all_arrays[1][i][7]

            death_15 = all_arrays[1][i][8]

            active_15 = all_arrays[1][i][10]

            recovered_15 = all_arrays[1][i][9]

            lastupdate_15 = all_arrays[1][i][4]

        }

    }
	
	for(var i=0;i<all_arrays[2].length;i+=1){

        if(fipscode==all_arrays[2][i][0]){

            statename_1m = all_arrays[2][i][2]

            countyname_1m = all_arrays[2][i][1]

            confirmed_1m = all_arrays[2][i][7]

            death_1m = all_arrays[2][i][8]

            active_1m = all_arrays[2][i][10]

            recovered_1m = all_arrays[2][i][9]

            lastupdate_1m = all_arrays[2][i][4]

        }

    }
	
	for(var i=0;i<all_arrays[3].length;i+=1){

        if(fipscode==all_arrays[3][i][0]){

            statename_56 = all_arrays[3][i][2]

            countyname_56 = all_arrays[3][i][1]

            confirmed_56 = all_arrays[3][i][7]

            death_56 = all_arrays[3][i][8]

            active_56 = all_arrays[3][i][10]

            recovered_56 = all_arrays[3][i][9]

            lastupdate_56 = all_arrays[3][i][4]

        }

    }
	
	return [statename, countyname, population, confirmed, death, active, recovered, lastupdate,
		 statename_15, countyname_15 , population_15 , confirmed_15 , death_15 , active_15 , recovered_15 , lastupdate_15 ,
		statename_1m , countyname_1m , population_1m , confirmed_1m , death_1m , active_1m , recovered_1m , lastupdate_1m , statename_56 , countyname_56 , population_56 , confirmed_56 , death_56 , active_56 , recovered_56 , lastupdate_56 ];
    

}

function calculate_safe_venue(target_risk, total_population, store_people_count, potential_covid_cases, potential_covid_cases_1m_ago, 
	potential_covid_cases_15_ago, potential_covid_cases_56_ago, deaths){
	
	var safe_venue_number = 25;
	
	try{

		if(!potential_covid_cases_1m_ago){
		
			potential_covid_cases_1m_ago = 0
		
		}
		
		var risk = 0;
		
		if(potential_covid_cases>0){
			
			// (100% of new cases from last 14 days + 19% of days 15-30 + 5% of days 31-56) - Death Count 
			
			var active_cases = Math.floor((potential_covid_cases - potential_covid_cases_15_ago) + 
				0.19*(potential_covid_cases_15_ago-potential_covid_cases_1m_ago) + 
				0.05*(potential_covid_cases_1m_ago-potential_covid_cases_56_ago) - deaths)
				
			if(active_cases>0){
				
				// calculate no clash probability
				var r = 1-Number(target_risk)
				
				var p = 1;
				
				var label = false;
				
				for(var i=1;i<=500; i+=1){    
					
					var next_people_p = (Number(total_population)-Number(active_cases)-i)/(Number(total_population)-i);
					
					//console.log("Probability of next people: " + next_people_p);
					
					var next_two_people_p = (Number(total_population)-Number(active_cases)-i-1)/(Number(total_population)-i-1);

					//console.log("Probability of next two people: " + next_two_people_p);
					
					p = p*(next_people_p);
					
					//console.log("New Probability on the right: " + p);
					
					var p_r_diff = p-r;
					
					//console.log("p_r_difference is " + p_r_diff);
					
					if(p_r_diff<=0){
						
						safe_venue_number = i;
						
						label = true;
						
						break;
					
					}
						
				}
				
				if(!label){
					
					safe_venue_number = 500;
					
				}
				
			}else{
				
				safe_venue_number = "Unlimited";
				
			}
			
		}
		
	}catch(error){
		
		console.log(error);
		
	}
	
	return safe_venue_number;
	
}

function riskestimate(total_population, store_people_count, potential_covid_cases, potential_covid_cases_1m_ago, 
	potential_covid_cases_15_ago, potential_covid_cases_56_ago, deaths){
	
	if(!potential_covid_cases_1m_ago){
	
		potential_covid_cases_1m_ago = 0
	
	}
	
    var risk = 0;
    if(potential_covid_cases>0){
		
		// (100% of new cases from last 14 days + 19% of days 15-30 + 5% of days 31-56) - Death Count 
		
		var active_cases = Math.floor((potential_covid_cases - potential_covid_cases_15_ago) + 
			0.19*(potential_covid_cases_15_ago-potential_covid_cases_1m_ago) + 
			0.05*(potential_covid_cases_1m_ago-potential_covid_cases_56_ago) - deaths)
			
		if(active_cases>0){
			
			// calculate no clash probability
			var p = 1
			
			for(var i=0;i<Number(store_people_count); i+=1){

				p = p*((Number(total_population)-i-Number(active_cases))/(Number(total_population)-i))
				
			}

			// get clash probability
			var clashp = 1-p
			// make it percentage
			risk =  Math.round(clashp*100, 4)
			
		}
	
    }
    return risk

}

function showFIPSSelect(zipcode){

	$("#fips-parent").removeClass("d-none");

	var fipslist = getFIPSByZip(zipcode);

	$("#fips").html("");

	if(fipslist==null || fipslist.length==0){

		$("#fipsalert").html("Cannot find county match for zip code.");

	}else{

		$("#fipsalert").html("");

	}

	for(var i=0;i<fipslist.length;i+=1){
		var names = getCountyNameByFIPS(fipslist[i])
		//add options to the select
		$("#fips").append('<option value="'+fipslist[i]+'">'+names[1] + ", " + names[0]+'</option>');

	}
	

}

$("#zipcode").on('change', function(){
	var input=$(this);
	//do your ajax call here
	// alert('this can be an ajax call');
	// input.next('span.info').html(input.val());
	
	//show the FIPS field
	showFIPSSelect(input.val());


});

$("#calc").on("click", function(){

	var fips = $( "#fips" ).val();

	var storepeople = $("#store_num").val()
	
	var info = getInfoByFIPS(fips);
	// [statename, countyname, population, confirmed, death, active, recovered, lastupdate,
	// 	statename_15, countyname_15 , population_15 , confirmed_15 , death_15 , active_15 , recovered_15 , lastupdate_15 ,
	//    statename_1m , countyname_1m , population_1m , confirmed_1m , death_1m , active_1m , recovered_1m , lastupdate_1m , statename_56 , countyname_56 , population_56 , confirmed_56 , death_56 , active_56 , recovered_56 , lastupdate_56 ]

    var population = getPop(info[0], info[1]);

    var potentials = info[3]
	
	var potentials_15_ago = info[11]
	
	var potentials_1m_ago = info[19]
	
	var potentials_56_ago = info[27]
	
	var deaths = info[4]
	
    console.log(potentials);

    var risk = riskestimate(population, storepeople, potentials, potentials_1m_ago, potentials_15_ago, potentials_56_ago, deaths)
	
	var safe_venue_number_5 = calculate_safe_venue(0.05, population, storepeople, potentials, potentials_1m_ago, potentials_15_ago, potentials_56_ago, deaths);
	
	var safe_venue_number_10 = calculate_safe_venue(0.1, population, storepeople, potentials, potentials_1m_ago, potentials_15_ago, potentials_56_ago, deaths);
	
	var safe_venue_number_25 = calculate_safe_venue(0.25, population, storepeople, potentials, potentials_1m_ago, potentials_15_ago, potentials_56_ago, deaths);
	
	var safe_venue_number_50 = calculate_safe_venue(0.5, population, storepeople, potentials, potentials_1m_ago, potentials_15_ago, potentials_56_ago, deaths);

	var score_renderred = "<span >" + risk + "%</span>";
	
	if(risk < 25 && risk >=0) score_renderred = "<span style=\"color:#008900;\">" + risk + "%</span>";
	if(risk < 50 && risk >=25) score_renderred = "<span style=\"color:#e5e500;\">" + risk + "%</span>";	
	if(risk < 75 && risk >=50) score_renderred = "<span style=\"color:#e59400;\">" + risk + "%</span>";	
	if(risk <= 100 && risk >=75) score_renderred = "<span style=\"color:#990000;\">" + risk + "%</span>";	
	
	$("#cosre_score").html(score_renderred);

	$("#venue_planning").html("");

	$("#venue_planning").append("<li> To reduce the risk under <b>5%</b>, the people in the store/venue should not exceed <b>"+safe_venue_number_5+"</b>. </li>");

	$("#venue_planning").append("<li> To reduce the risk under <b>10%</b>, the people in the store/venue should not exceed <b>"+safe_venue_number_10+"</b>. </li>");

	$("#venue_planning").append("<li> To reduce the risk under <b>25%</b>, the people in the store/venue should not exceed <b>"+safe_venue_number_25+"</b>. </li>");

	$("#venue_planning").append("<li> To reduce the risk under <b>50%</b>, the people in the store/venue should not exceed <b>"+safe_venue_number_50+"</b>. </li>");


})

$("#findfips").click(function(){

    var fipscode = $("#fipscode").val()

    // var zipcode = $("#zipcode").val()

    $("#county").html("")
    $("#popres").html("")
    $("#covid").html("")

    getInfoByFIPS(fipscode, "#county", "#popres", "#popu", "#covid", "#potentials", "#potentials_1m_ago", "#potentials_15_ago", "#potentials_56_ago", "#deaths");

    

})

function getFIPSByZip(zipcode){

    var fipslist = []

    for(var i=0;i<zip2fips.length;i+=1){

        if(Number(zip2fips[i][0])==Number(zipcode)){

            fipslist.push(zip2fips[i][1]) 

        }

    }

    console.log("Find FIPS " + fipslist)

    return fipslist;

}

$("#findzip").click(function(){

    var zipcode = $("#zipcode").val()

    var fipslist = getFIPSByZip(zipcode)

    var content = ""

    $("#county2").html("")
    $("#popres2").html("")
    $("#covid2").html("")

    for(var i=0;i<fipslist.length;i+=1){

        content += "<input onclick=\"getInfoByFIPS('"+fipslist[i]+"', '#county2', '#popres2', '#popu', '#covid2', '#potentials', '#potentials_1m_ago', '#potentials_15_ago', '#potentials_56_ago', '#deaths')\" type=\"button\" value=\""+fipslist[i]+"\" > "

    }

    $("#fipsregion").html(content)


    // getInfoByFIPS(fips, "#county2", "#popres2", "#popu", "#covid2", "#potentials");

})
