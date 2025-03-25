document.addEventListener('DOMContentLoaded', () => {
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: getProductData,
        }, (results) => {
            if (chrome.runtime.lastError) {
                errorDiv.classList.remove('hidden');
                return;
            }

            const productData = results[0].result;
            if (!productData) {
                errorDiv.classList.remove('hidden');
                return;
            }

            loadingDiv.classList.remove('hidden');

            fetchSimilarProducts(productData)
                .then((similarProducts) => {
                    loadingDiv.classList.add('hidden');
                    displayResults(similarProducts);
                })
                .catch((err) => {
                    console.error('Server Error:', err);
                    loadingDiv.classList.add('hidden');
                    errorDiv.textContent = 'Server request failed.';
                    errorDiv.classList.remove('hidden');
                });
        });
    });

    function displayResults(products) {
        if (!products || products.length === 0) {
            resultsDiv.innerHTML = '<p>No similar products found.</p>';
            return;
        }

        products.forEach((product) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');

            productDiv.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ${product.price}</p>
                <a href="${product.link}" target="_blank">View Product</a>
            `;

            resultsDiv.appendChild(productDiv);
        });
    }

    async function fetchSimilarProducts(productData) {
        const apiUrl = 'http://localhost:3000/api/similar'; // Your server's endpoint

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `Find similar products to ${productData.description}. Return an array of objects containing the image url, product name, price, and link.`,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server request failed with status: ${response.status}`);
            }

            const data = await response.json();
            return data.results; // Adjust based on your server's response structure
        } catch (error) {
            console.error('Server Error:', error);
            throw error;
        }
    }

    function getProductData() {
        const name = document.querySelector('h1.product-title')?.textContent;
        const price = document.querySelector('.product-price')?.textContent;
        const imageUrl = document.querySelector('.product-image img')?.src;
        const description = document.querySelector('.product-description')?.textContent;

        return { name, price, imageUrl, description };
    }
});
