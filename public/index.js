var accountdiv = document.querySelector('#accountname');
var accname = accountdiv.getAttribute('accname')

function txbutton(logic, account){
   steem_keychain.requestCustomJson(
    accname,
    "ssc-mainnet1",
    "active",
    logic,
    "",
    function(response) {
     if(response.success === true){
      window.location.pathname = '/reset'
     }
     else{
      console.log(response);
     }
    }
   );
}