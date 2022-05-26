let allServices;
let allSubServices = [];
let allCustomerOrder = [];
let allOrderOffers = [];
let allSuggestedOrderToExpert = [];
let allCustomerOrdersHistory=[];
let allExpertOrderHistory=[];
let customerWallet;
let expertRequests;
let searchGridResults;
let searchGridUrl = "http://localhost:8080/api/expert/search";
let rdiSearchChoose;
let orderId;
let offerIdSelected;
let orderIdSelected;
let suggestedOfferId;

$(document).ready(function () {

    ajaxGetAllServices();
    ajaxGetAllExpertRequest();
    ajaxGetCustomerOrders();
    ajaxGetFindSuggestedOrderForExpert();
    ajaxGetFindCreditByAccountId();

    $("#ServiceSave").submit(function (event) {
        event.preventDefault();
        ajaxPostService();
        allServices = "";
    });

    $("#SubServiceForm").submit(function (event) {
        event.preventDefault();
        ajaxPostSubService();
    });

    $("#RequestsForm").submit(function (event) {
        event.preventDefault();
        ajaxConfirmExpert();
    });

    $("#SearchForm").submit(function (event) {
        event.preventDefault();
        searchGridResults = "";
        ajaxGetSearchGrid();
    });

    $("#TakingOrderForm").submit(function (event) {
        event.preventDefault();
        allServices = "";
        ajaxPostSaveOrder()
    });

    $("#OrderServices").click(function () {
        ajaxGetFindSubServicesById();
    });

    $("#customerOrdersTable").click(function () {
        ajaxGetFindAllOrderOffers();
    });

    $("#orderOffersTable").click(function () {
        ajaxGetSelectAnExpertToOrder();
    });

    $("#addServiceToCareer").submit(function (event) {
        event.preventDefault();
        ajaxGetAddExpertToService();
    })

    $("#suggestedOrderTable").click(function (){
        ajaxPostSaveOffer()
    })

    $("#customerHistoryForm").submit(function (event){
        event.preventDefault();
        ajaxGetFindCustomerOrdersHistory();
    })

    $("#expertHistoryForm").submit(function (event){
        event.preventDefault();
        ajaxGetFindExpertOrders();
    })

    function ajaxPostService() {
        let formData = {
            id: null,
            name: $("#ServiceName").val()
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://localhost:8080/api/services",
            data: JSON.stringify(formData),
            dataType: "json",
        }).done(function (data) {
            console.log(data);
            document.getElementById('ServiceName').value = '';
            $("#massage").addClass("show")
            $("#userAlert").html('Adding the ' + data.name + 'service was successful!')
            ajaxGetAllServices();
            $("#ServicesSelectedForSubService").empty();
        });
    }

    function ajaxPostSubService() {
        let formData = {
            id: null,
            name: $("#SubName").val(),
            basePrice: $("#SubBasePrice").val(),
            description: $("#SubDescription").val(),
            servicesId: $("#ServicesSelectedForSubService").find(":selected").val()
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://localhost:8080/api/subServices",
            data: JSON.stringify(formData),
            dataType: "json",
        }).done(function (data) {
            console.log(data);
            $("#massage").addClass("show")
            $("#userAlert").html('Adding the ' + data.name + 'subService was successful!')

            $("#SubName").val("");
            $("#SubBasePrice").val("");
            $("#SubDescription").val("");
        });
    }

    function ajaxGetAllServices() {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/services/findAll",

        }).done(function (result) {
            allServices = result;
            console.log(result)
        })
    }

    function ajaxConfirmExpert() {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/admin/confirmExpert/" + ($("#ExpertSelectedOption").find(":selected").val()).toString(),
        }).done(function (data) {
            console.log(data);
            $("#massage").addClass("show")
            $("#userAlert").html(`user confirm operation was successful!`)
            expertRequests = "";
            ajaxGetAllExpertRequest();
        });
    }

    function ajaxGetAllExpertRequest() {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/expert/findAllExpertWithWaitingForConfirmationState",
        }).done(function (result) {
            expertRequests = result;
            console.log(result)
        })
    }

    function ajaxGetFindSubServicesById() {
        let id = OrderGetServicesId()
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/subServices/findByServicesId/" + id,
        }).done(function (result) {
            allSubServices = "";
            allSubServices = result;
            console.log(result)
            $("#OrderSubServices").empty();
            setSubServicesForTakingOrder()
        })

    }

    function ajaxGetSearchGrid() {
        let formData;
        if (rdiSearchChoose === "customer") {
            formData = {
                firstname: $("#firstNameGrid").val(),
                lastname: $("#lastNameGrid").val(),
                email: $("#emailGrid").val()
            };
        } else {
            formData = {
                firstname: $("#firstNameGrid").val(),
                lastname: $("#lastNameGrid").val(),
                email: $("#emailGrid").val(),
                serviceName: $("#serviceNameGrid").val(),
                score: $("#scoreGrid").val()
            };
        }
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: searchGridUrl,
            data: JSON.stringify(formData),
            dataType: "json",
        }).done(function (results) {
            console.log(results);
            searchGridResults = results;
            $("#tBodySearchGrid").empty();
            storeSearchGridResultToTable();
        })
    }

    //edit
    function ajaxPostSaveOrder() {
        let formData = {
            id: null,
            price: $("#OrderPrice").val(),
            description: $("#OrderDescription").val(),
            dateOfWork: $("#OrderDate").val(),
            timeOfWork: $("#OrderTime").val(),
            address: $("#OrderAddress").val(),
            customerId: "1",
            subServicesId: $("#OrderSubServices").find(":selected").val(),
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://localhost:8080/api/order",
            data: JSON.stringify(formData),
            dataType: "json",
        }).done(function (data) {
            console.log(data);
            $("#massage").addClass("show")
            $("#userAlert").html('Adding the order was successful!')
        });
    }

    //Edit
    function ajaxGetCustomerOrders() {
        let customerId = "1";
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/order/findCustomerOrders/" + customerId,
        }).done(function (result) {
            allCustomerOrder = [];
            allCustomerOrder = result;
            console.log(result)
            storeCustomerOrdersInTable()
        })
    }

    function ajaxGetFindAllOrderOffers() {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/offer/findOrderOffers/" + orderId,
        }).done(function (result) {
            allOrderOffers = "";
            allOrderOffers = result;
            console.log(result)
            $("#tBodyOrderOffers").empty()
            storeOrderOffersInTable()
        })
    }

    function ajaxGetSelectAnExpertToOrder() {
        alert("http://localhost:8080/api/order/selectAnExpertToOrder/" + orderId + "/" + offerIdSelected)
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/order/selectAnExpertToOrder/" + orderId + "/" + offerIdSelected,
        }).done(function (result) {
            allOrderOffers = "";
            allOrderOffers = result;
            console.log(result)
            $("#tBodyOrderOffers").empty()
            storeOrderOffersInTable()
        })
    }

    //Edit
    function ajaxGetAddExpertToService() {
        let expertIdForAddService = "7";
        let serviceIdSelected = $("#ServicesSelectedForSubService").find(":selected").val();
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/expert/addExpertToService/" + expertIdForAddService + "/" + serviceIdSelected,
        }).done(function (result) {
            console.log(result)
            $("#massage").addClass("show")
            $("#userAlert").html('Adding the service to career was successful!')
        })
    }

    //Edit
    function ajaxGetFindSuggestedOrderForExpert() {
        let expertIdForGetSuggestion = "7";
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/order/findSuggestedOrderForExpert/" + expertIdForGetSuggestion,
        }).done(function (result) {
            console.log(result)
            allSuggestedOrderToExpert = [];
            allSuggestedOrderToExpert = result;
            storeSuggestedOrderInTable();
        })
    }

    //edit
    function ajaxPostSaveOffer(){
        let expertIdForSaveOffer ="7";
        let formData = {
            id :null,
            suggestedPrice : $("#offerSuggestedPrice").val(),
            durationOfWork :$("#offerDurationOfWork").val(),
            timeOfWork : $("#offerTimeOfWork").val(),
            expertId :expertIdForSaveOffer.toString(),
            orderId :suggestedOfferId
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://localhost:8080/api/offer",
            data: JSON.stringify(formData),
            dataType: "json",
        }).done(function (data) {
            console.log(data);
            $("#massage").addClass("show")
            $("#userAlert").html('Adding the offer was successful!')
        });
    }

    //edit
    function ajaxGetFindCustomerOrdersHistory(){
        let customerIdForGetCustomerOrdersHistory = "1";
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/order/findCustomerOrders/"+customerIdForGetCustomerOrdersHistory+"/"+$("#customerOrdersHistory").find(":selected").val().toString(),
        }).done(function (result) {
            console.log(result)
            allCustomerOrdersHistory=[];
            allCustomerOrdersHistory=result;
            $("#tBodyCustomerOrdersHistory").empty()
            storeCustomerOrdersHistory();
        })
    }

    //edit
    function ajaxGetFindExpertOrders(){
        let expertIdForGetCustomerOrdersHistory = "7";
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/order/findExpertOrders/"+expertIdForGetCustomerOrdersHistory,
        }).done(function (result) {
            console.log(result)
            allExpertOrderHistory=[];
            allExpertOrderHistory=result;
            $("#tBodyExpertOrdersHistory").empty()
            storeExpertOrdersHistory();
        })
    }

    //edit
    function ajaxGetFindCreditByAccountId(){
        let customerIdForGetCredit = "1";
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/credit/findByAccountId/"+customerIdForGetCredit,
        }).done(function (result) {
            console.log(result)
            customerWallet = result;
            $("#customerWalletValue").text("balance : "+ result.balance);
        })
    }
});

//admin
function setServicesForAddSubService() {
    $("#ServicesSelectedForSubService").empty();
    for (let i = 0; i < allServices.length; i++) {
        $("#ServicesSelectedForSubService").append(`<option id="${allServices[i].id}" value="${allServices[i].id}">${allServices[i].name}</option>`);
    }
}

function setExpertRequestsToSelectOption() {
    if (expertRequests.length !== 0)
        $("#ExpertSelectedOption").empty();

    for (let i = 0; i < expertRequests.length; i++) {
        $("#ExpertSelectedOption").append(`<option id="${expertRequests[i].id}" value="${expertRequests[i].id}"> ${expertRequests[i].firstname} ${expertRequests[i].lastname}</option>`);
    }
}

function searchType() {
    rdiSearchChoose = $("input[name='gridType']:checked").val();
    if (rdiSearchChoose === "customer") {
        $("#serviceNameGrid").addClass("d-none")
        $("#scoreGrid").addClass("d-none")
        $("#serviceNameGridLBl").addClass("d-none")
        $("#scoreGridLBL").addClass("d-none")
        searchGridUrl = "http://localhost:8080/api/customer/search";
    } else {
        $("#serviceNameGrid").removeClass("d-none")
        $("#scoreGrid").removeClass("d-none")
        $("#serviceNameGridLBl").removeClass("d-none")
        $("#scoreGridLBL").removeClass("d-none")
        searchGridUrl = "http://localhost:8080/api/expert/search";
    }
}

function storeSearchGridResultToTable() {
    for (let i = 0; i < searchGridResults.length; i++) {
        $("#tBodySearchGrid").append(`
                            <tr>
                                    <th scope="row">${i}</th>
                                    <td>${searchGridResults[i].firstname} ${searchGridResults[i].lastname}</td>
                                    <td>${searchGridResults[i].email}</td>
                                    <td>${searchGridResults[i].username}</td>
                                    <td>${searchGridResults[i].userState}</td>
                                    <td>${searchGridResults[i].dateOfRegister}</td>
                            </tr>
        `);
    }
}


//customer
function setServicesForTakingOrder() {
    for (let i = 0; i < allServices.length; i++) {
        $("#OrderServices").append(`<option id="${allServices[i].id}" value="${allServices[i].id}">${allServices[i].name}</option>`);
    }
}

function OrderGetServicesId() {
    return $("#OrderServices").find(":selected").val();
}

function setSubServicesForTakingOrder() {

    for (let i = 0; i < allSubServices.length; i++) {
        $("#OrderSubServices").append(`<option id="${allSubServices[i].id}" value="${allSubServices[i].id}">${allSubServices[i].name}</option>`);
    }
}

function storeCustomerOrdersInTable() {
    for (let i = 0; i < allCustomerOrder.length; i++) {
        $("#tBodyCustomerOrders").append(`
                            <tr>
                                    <th scope="row">${i}</th>
                                    <td>${allCustomerOrder[i].subServicesName}</td>
                                    <td>${allCustomerOrder[i].orderState}</td>
                                    <td>${allCustomerOrder[i].price}</td>
                                    <td>${allCustomerOrder[i].description}</td>
                                    <td>${allCustomerOrder[i].address}</td>
                                    <td><button type="button" class="btn btn-light" onclick="checkRowClicked(${allCustomerOrder[i].id})">Offers</button></td>
                            </tr>
        `);
    }
}

function storeOrderOffersInTable() {
    for (let i = 0; i < allOrderOffers.length; i++) {
        $("#tBodyOrderOffers").append(`
                            <tr>
                                    <th scope="row">${i}</th>
                                    <td>${allOrderOffers[i].expertFirstname} ${allOrderOffers[i].expertLastname}</td>
                                    <td>${allOrderOffers[i].suggestedPrice}</td>
                                    <td>${allOrderOffers[i].offerState}</td>
                                    <td>${allOrderOffers[i].expertScore}</td>
                                    <td>${allOrderOffers[i].timeOfWork}</td>
                                    <td><button type="button" class="btn btn-success" onclick="saveOfferId(${allOrderOffers[i].id})">Accept</button></td>
                                    <td><button type="button" class="btn btn-danger" onclick="checkRowClicked(${allCustomerOrder[i].id})">Regect</button></td>
                            </tr>
        `);
    }
}

function checkRowClicked(id) {
    orderId = id;
}

function saveOfferId(offerId) {
    offerIdSelected = offerId;
}

function storeCustomerOrdersHistory(){
    for (let i = 0; i < allCustomerOrdersHistory.length; i++) {
        $("#tBodyCustomerOrdersHistory").append(`
                            <tr>
                                    <th scope="row">${i}</th>
                                    <td>${allCustomerOrdersHistory[i].subServicesName}</td>
                                    <td>${allCustomerOrdersHistory[i].price}</td>
                                    <td>${allCustomerOrdersHistory[i].dateOfWork}</td>
                                    <td>${allCustomerOrdersHistory[i].timeOfWork}</td>
                                    <td>${allCustomerOrdersHistory[i].orderState}</td>
                                    <td>${allCustomerOrdersHistory[i].description}</td>
                                    <td>${allCustomerOrdersHistory[i].address}</td>
                            </tr>
        `);
    }
}
//expert
function storeSuggestedOrderInTable() {
    for (let i = 0; i < allSuggestedOrderToExpert.length; i++) {
        $("#tBodySuggestedOrderTable").append(`
                            <tr>
                                    <th scope="row">${i}</th>
                                    <td>${allSuggestedOrderToExpert[i].subServicesName}</td>
                                    <td>${allSuggestedOrderToExpert[i].orderState}</td>
                                    <td>${allSuggestedOrderToExpert[i].price}</td>
                                    <td>${allSuggestedOrderToExpert[i].description}</td>
                                    <td>${allSuggestedOrderToExpert[i].address}</td>
                                    <td><button type="button" class="btn btn-light" onclick="checkSuggestedOfferRowClick(${allSuggestedOrderToExpert[i].id})">Offers</button></td>
                            </tr>
        `);
    }
}

function checkSuggestedOfferRowClick(offerId){
    suggestedOfferId = offerId;
}

function storeExpertOrdersHistory(){
    for (let i = 0; i < allExpertOrderHistory.length; i++) {
        $("#tBodyExpertOrdersHistory").append(`
                            <tr>
                                    <th scope="row">${i}</th>
                                    <td>${allExpertOrderHistory[i].subServicesName}</td>
                                    <td>${allExpertOrderHistory[i].price}</td>
                                    <td>${allExpertOrderHistory[i].dateOfWork}</td>
                                    <td>${allExpertOrderHistory[i].timeOfWork}</td>
                                    <td>${allExpertOrderHistory[i].orderState}</td>
                                    <td>${allExpertOrderHistory[i].description}</td>
                                    <td>${allExpertOrderHistory[i].address}</td>
                            </tr>
        `);
    }
}
//general
function hideMassage() {
    $("#massage").removeClass("show")
}
