const formLogin = document.getElementById("form-login")

formLogin.addEventListener('submit', function(){
    window.location.href = "mainpage.html"
})


    function auth(){
    var fullname = document.getElementById("fullname")
    var email = document.getElementById("email")
    var password = document.getElementById("password")
    var confirmPassword = document.getElementById("confirm-password")

    if(fullname != "" && email != "" && password != "" && confirmPassword != ""){
        window.location.assign("mainpage.html")
    }
}
