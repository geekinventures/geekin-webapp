/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ping(){
    var startDate = new Date();
    var endDate = null;
    $.ajax({
        url:"https://luminous-inferno-8382.firebaseio.com/onlineusers.json",
        type: "get",
        async: false,
        dataType: "json",
        success: function(data){
            console.log(data);
            if(data !== null){
                endDate = new Date();
            }else{
                endDate = null;
            }
        },
        error: function(){
            endDate = null;
        }
    });
    
    if(endDate === null){
        throw "Not Responsive";
        
    }
    return endDate.getTime() - startDate.getTime();
}