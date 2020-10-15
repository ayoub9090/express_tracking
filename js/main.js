// When the user scrolls the page, execute myFunction
window.onscroll = function () { myFunction() };

// Get the header
var header = document.getElementById("myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

$(document).ready(function () {
    $('.guide .text > p').matchHeight({ byrow: true });

});

var currentLang = 'ar';
//changeLang('load');


function changeLang(t) {
    if (t === 'change') {
        if (currentLang === 'ar') {
            currentLang = 'en';
            $('body').addClass('english');
        } else {
            currentLang = 'ar';
            $('body').removeClass('english');
        }
    }
    i18next
        .use(i18nextXHRBackend)
        .init({
            lng: currentLang,
            getAsync: true,
            selectorAttr: 'data-i18n',
            debug: true,
            fallbackLng: false,
            fallbackToDefaultNS: true,
            i18nextXHRBackend: {
                allowMultiLoading: true,
                loadPath: "locale/" + currentLang + ".json"
            },
        }, function (err, t) {
            // for options see
            // https://github.com/i18next/jquery-i18next#initialize-the-plugin
            jqueryI18next.init(i18next, $);
            // start localizing, details:
            // https://github.com/i18next/jquery-i18next#usage-of-selector-function

            $('body').localize();
        });

}

var providerSlug = "";


function setProvider(t, el) {
    providerSlug = t;
    $('.providers-list li a.active').removeClass('active');
    $(el).addClass('active');
}
var arr = [];
var decNum = "";
function searchCode() {

    var tracking_code = $('#tracking_val').val();
    if (tracking_code !== "" && providerSlug !== "" && tracking_code.length > 4) {



        var url = 'http://192.168.24.70:8050/masar/tracking/shipment/express?slug=' + providerSlug + '&track=' + tracking_code;
        var lang = "EN";
        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
            start: start(),
            "headers": {
                "api-key": "Av549-e756Z-4c29-a16a-287de9c04755",
                "Accept-Language": lang,
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "content-type",
                "Access-Control-Allow-Methods": "*"

            },
        };

        $.ajax(settings).done(function (response) {
            arr = response;
            $('.result-list').empty();

            if (typeof (arr.data.tracking.declaration_number) !== "undefined" && arr.data.tracking.declaration_number > 0) {
                decNum = arr.data.tracking.declaration_number;
                $('.result-list').append('<li class=" bbold">Declaration Number: ' + decNum + '<small>  <a href="javascript:void(0)" onclick="checkDec(' + decNum + ')">link</a></small></li>');
            }

            if (arr.data.tracking.status_history.length > 0) {
                var color = arr.data.tracking.status_history[0].status_key.split('_')[1];
                arr.data.tracking.status_history.forEach(element => {

                    var date = '<span class="date">' + element.historyDate + '</span>';
                    var st = '<div class="status_' + color + '">' + '<img src="./img/icons/' + element.status_key + '.png" /></div>';
                    var val = '<span class="value">' + element.status_value + '</span>';

                    $('.result-list').append('<li>' + date + st + val + '</li>');
                });
                $('#submitSearch').attr('disabled', false);
                console.log(arr.data.tracking.status_history.length);
            } else {
                $('.result-list').append('<li class="text-center bbold">No data found</li>');
                $('#submitSearch').attr('disabled', false);
            }
        });
    } else {
        $('.error').html("Please choose provider & check tracking number");

    }

    return false;
}

function start() {
    $('#submitSearch').attr('disabled', true);
}


function checkDec(num) {
    var settings = {
        "url": "https://tapis.fasah.sa/declaration/v1/desFees?decNo=" + num,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "X-IBM-Client-Id": "1e40cfcb84329e74e1ac33056a22fa89",
            "X-IBM-Client-Secret": "03ebbe3ba4ecd91cae9e07d45576c2f4",
            "Client-Id": "f90a6412fe262db065a95698646473bc",
            "api-key": "Av549-e756Z-4c29-a16a-287de9c04755"
        },
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

setInputFilter(document.getElementById("tracking_val"), function (value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});