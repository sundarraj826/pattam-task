let products = [];
const productList = document.getElementById('product-container');
const totalCount = document.getElementById('total-count');
const searchInput = document.getElementById('search-input');
let index = 0;
let itemPerPage = 10;


const spinnerDiv = document.getElementById('loading-spinner');
const bodyScroll = document.getElementsByTagName('body')[0];
const loadMoreBtn = document.getElementById('load-more-btn');

//Fetch data from API
async function fetchProduct() {

    try {
        // Show the spinner and hide the body scroll
        spinnerDiv.style.display = 'block';
        bodyScroll.style.overflow = 'hidden'

        const responseData = await fetch('https://fakestoreapi.com/products');

        if (!responseData.ok) {
            throw new Error(`Error status: ${responseData.status}`)
        }

        const data = await responseData.json();
        console.log(data);
        products = data;
        totalCount.innerHTML = `${data.length} Results`;


        //display the products
        displayFetchProduct(products.slice(index, index + itemPerPage));
        index += itemPerPage;

    } catch (err) {
        console.log('Error fetching products', err);
        alert(`An error occurred while fetching products. Please try again later.`)
    } finally {
        // Hide the spinner and restore the body scroll
        spinnerDiv.style.display = 'none';
        bodyScroll.style.overflow = 'visible';
    }
}

//Display the product in the DOM
function displayFetchProduct(products) {
    productList.innerHTML += products.map(prod =>
        `
    <div class="product-col">
        <div class="product-contain">
            <div class="prod-img">
              <img src="${prod.image}" title="${prod.title}" class="img-responsive"/>
            </div>
            <div class="prod-name">${prod.title}</div>
            <div class="prod-price">$ ${prod.price}</div>
            <div class="prod-like"><i class="fa-regular fa-heart"></i></div>
        </div>
    </div>
    `
    ).join('');

    if (index >= itemPerPage) {
        loadMoreBtn.style.display = 'none';
    }
}

//loadMore 10 more products
loadMoreBtn.addEventListener('click', function () {
    displayFetchProduct(products.slice(index, index + itemPerPage));
    index += itemPerPage;
});

searchInput.addEventListener('input', function () {

    const searchProd = this.value.toLowerCase();

    filterProd = products.filter(prod => prod.title.toLowerCase().includes(searchProd));

    productList.innerHTML = '';
    index = 0;

    displayFetchProduct(filterProd.slice(index, index + itemPerPage));
    index += itemPerPage;

    if (index < filterProd.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }


})

//Handle sorting
document.getElementById('sorting-option').addEventListener('change', function () {
    // console.log(this.value);
    const selectValue = this.value;

    spinnerDiv.style.display = 'block';
    bodyScroll.style.overflow = 'hidden';


    requestAnimationFrame(() => {
        let sortingProducts = [];

        if (selectValue === 'low-to-high') {
            sortingProducts = products.sort((a, b) => a.price - b.price);

        } else if (selectValue === 'high-to-low') {
            sortingProducts = products.sort((a, b) => b.price - a.price);

        }

        //Reset the div and load the first set of sorted products
        productList.innerHTML = '';
        index = 0;
        //display the sorted products
        displayFetchProduct(sortingProducts.slice(index, index + itemPerPage));
        index += itemPerPage;

        //need to show loadmore button for to see next set of products
        loadMoreBtn.style.display = 'block';


        spinnerDiv.style.display = 'none';
        bodyScroll.style.overflow = 'visible';
    });

});

// Handle checkbox filtering
document.querySelectorAll('.checkbox-row input[type="checkbox"]').forEach(checkbox => {
    // console.log(checkbox);
    checkbox.addEventListener('change', function () {
        const selectedCategories = Array.from(document.querySelectorAll('.checkbox-row input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        let filterProd = [];

        if (selectedCategories.length === 0) {
            // If no checkboxes are selected, show all products
            filterProd = products;
        } else {
            // Filter products based on selected categories
            
            filterProd = products.filter(product => selectedCategories.includes(product.category));
            // console.log(filterProd)
        }

        productList.innerHTML = '';

        displayFetchProduct(filterProd);
    });
});

fetchProduct();


//Mobile menu hide show

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
});

