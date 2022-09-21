var recommendedProducts = [];
var swiper = new Swiper(".mySwiper", {
    slidesPerGroup: 1,
    loop: true,
    speed: 500,
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        // when window width is >= 480px
        480: {
            slidesPerView: 3,
            spaceBetween: 30
        },
        // when window width is >= 640px
        640: {
            slidesPerView: 4,
            spaceBetween: 30
        }
    },
    lazy: {
        loadPrevNext: true,
    },
    realIndex: 4,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

window.addEventListener('load', function () {
    getData().
        then(data => {
            if (data && data.statusCode === "SUCCESS") {
                var userCategories = data.responses[0] &&
                    data.responses[0][0] &&
                    data.responses[0][0].params.userCategories;

                recommendedProducts = data.responses[0] &&
                    data.responses[0][0] &&
                    data.responses[0][0].params.recommendedProducts;

                createUserCategories(userCategories);
                var products = getProductByUserCategoryKey(userCategories[0]);
                setProducts(products);
            }
        });
});

var getData = () => $.getJSON("product-list.json");

var createUserCategories = (userCategories) => {
    var menu = $('#menu');
    menu.html('');
    userCategories.forEach((userCategory, index) => {
        var seperator = userCategory.indexOf('>');
        var categoryName = userCategory.split('>').reverse()[0];
        menu
            .append(`<li class="menu-item ${index == 0 ? 'active' : ''} " onclick="userCategoryClick('${userCategory}', this)">${categoryName}</li>`)
    });
}

var userCategoryClick = (data, element) => {
    var products = getProductByUserCategoryKey(data);
    setProducts(products);
    var userCategoryItems = $('.menu-item');
    userCategoryItems.removeClass('active');
    var element = $(element);
    element.addClass('active');
}

var setProducts = (products) => {
    swiper.removeAllSlides();
    products.forEach((product) => {
        var item = '<div class="swiper-slide">';
        item += '<div class="product-card">';
        item += `<img src="${product.image}" class="img-fluid lazy" loading="lazy" alt="${product.name}">`;
        item += `<h4 class="product-name">${product.name}</h4>`;
        item += `<h1 class="product-price">${product.priceText}</h1>`;
        item += '<h6 class="cargo-text">';
        const { params } = product;
        if (params && params.shippingFee === "FREE") {
            item += '<i class="fa-solid fa-truck text-green"></i><span class="mobil-icon">*</span> <span>Ücretsiz Kargo</span>';
        } else {
            item += '&nbsp;'
        }
        item += '</h6>';
        item += '<div class="btn-add"><button onclick="showPopup()"><span>Sepete Ekle</span></button></div></div>';
        item += '</div>';
        item += '</div>';
        swiper.appendSlide(item);
    });
    swiper.slideTo(4, 0, null);
}

var getProductByUserCategoryKey = (userCategory) => {
    var products = recommendedProducts[userCategory] || [];
    return products;
}
var popup = document.getElementById("add-popup");
var close = document.getElementById("closebtn");

close.addEventListener('click', e => {
    popup.style.display = "none";
  });

var showPopup = () => {
    if (popup.style.display === "none") {
        popup.style.display = "flex";
    } else {
        popup.style.display = "flex";
        setTimeout(() => {
            popup.style.display = "none";
        }, 600);
    }
}