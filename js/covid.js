
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
