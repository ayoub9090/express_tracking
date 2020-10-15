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