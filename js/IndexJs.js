let actionUrl;
let valid = true;

function validate() {
    let rdiChoose = $("input[name='user']:checked").val();
    if (rdiChoose === "expert") {
        $("#register").attr('action', 'http://localhost:8080/api/expert')
        actionUrl = "http://localhost:8080/api/expert";
    } else {
        $("#register").attr('action', 'http://localhost:8080/api/customer')
        actionUrl = "http://localhost:8080/api/customer";
    }

    let pass = document.getElementById("password");
    let username = document.getElementById("username");
    let firstname = document.getElementById("firstname");
    let lastname= document.getElementById("lastname");
    let email =  document.getElementById("email");

    let regex = new RegExp("^(?=.*[a-z])(?=.*[0-9])")
    let emailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (username.value.length === 0){
        username.className = "form-control wrong-input border-danger form-control-lg";
        username.nextElementSibling.innerHTML = "username not be empty!";
        valid = false;
    }else {
        username.className = "form-control border-success form-control-lg";
        username.nextElementSibling.innerHTML = "username";
    }

    if (firstname.value.length === 0){
        firstname.className = "form-control wrong-input border-danger form-control-lg";
        firstname.nextElementSibling.innerHTML = "firstname not be empty!";
        valid = false;
    }else {
        firstname.className = "form-control border-success form-control-lg";
        firstname.nextElementSibling.innerHTML = "firstname";
    }


    if (lastname.value.length === 0){
        lastname.className = "form-control wrong-input border-danger form-control-lg";
        lastname.nextElementSibling.innerHTML = "lastname not be empty!";
        valid = false;
    }else {
        lastname.className = "form-control border-success form-control-lg";
        lastname.nextElementSibling.innerHTML = "lastname";
    }

    if (pass.value.length < 8) {
        pass.className = "form-control wrong-input border-danger form-control-lg";
        pass.nextElementSibling.innerHTML = "password must be 8 char";
        valid = false;
    }else {
        pass.className = "form-control border-success form-control-lg";
        pass.nextElementSibling.innerHTML = "password";
    }

    if (email.value.match(emailValidator)){
        email.className = "form-control border-success form-control-lg";
        email.nextElementSibling.innerHTML = "email";
    }else {
        email.className = "form-control wrong-input border-danger form-control-lg";
        email.nextElementSibling.innerHTML = "invalid email!";
        valid = false;
    }

    if (pass.value.match(regex)){
        pass.className = "form-control border-success form-control-lg";
        pass.nextElementSibling.innerHTML = "password";
    }else {
        pass.className = "form-control wrong-input border-danger form-control-lg";
        pass.nextElementSibling.innerHTML = "Password must be a-z and 0-9!";
        valid = false;
    }

    return valid;
}


$(document).ready(function () {

    $("#register").submit(function (event) {
        event.preventDefault();
        if (valid)
            ajaxPost();
    });

    function ajaxPost() {
        let formData = {
            id: null,
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            email: $("#email").val(),
            userState: null,
            username: $("#username").val(),
            password: $("#password").val(),
            dateOfRegister: null,
            credit: null
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: actionUrl.toString(),
            data: JSON.stringify(formData),
            dataType: "json",
        }).done(function (data) {
            console.log(data);
            $("#massage").addClass("show")
            $("#userAlert").html(data.firstname + ' ' + data.lastname + ' Registration was successful!')
            document.getElementById('firstname').value = '';
            document.getElementById('username').value = '';
            document.getElementById('lastname').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        });
    }
});

function hideMassage(){
    $("#massage").removeClass("show")
}
