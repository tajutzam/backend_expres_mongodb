function auth(){
    var email = document.getElementById("email")
    var password = document.getElementById("password")

    if(email != "" && password != "" ){
        window.location.assign("mainpage.html")
    }
}