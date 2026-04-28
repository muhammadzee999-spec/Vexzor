const products = [];
let productId = 1;

const mainSections = ["Shirts", "Pants", "Caps", "Hoodies", "Shoes", "Glasses", "Coats"];
const subCats = ["Premium", "Classical", "Standard"];

// High-quality unique Unsplash IDs for each category
const shirtIds = [
    "1603252109303-2751441dd157", "1596755094514-f87034a26cc1", "1554568212-3a1625213164", 
    "1620916566398-39f1143ab7be", "1617113948332-15f5c531d04b", "1589310243389-1fc500fb7383"
];
const pantsIds = [
    "1624378439575-d8705ad7ae80", "1541099649105-f69ad21f3246", "1475178626620-a4d074967452", 
    "1584308666744-24d5c474f2ae", "1594633312681-425c7b97ccd1", "1562157873-818bc0726f68"
];
const shoeIds = [
    "1542291026-7eec264c27ff", "1525966222134-fcfa99b8ae77", "1560769629-975ec94e6a86", 
    "1595950653106-6c9ebd614d3a", "1606107557195-0e29a4b5b4aa", "1460353581641-37b673774524"
];
const capIds = [
    "1588850561407-ed78c282e89b", "1576850058072-7639f73770a4", "1534215754734-18e55d13e346", 
    "1521369909029-2afed882baee", "1596450511806-cd8233f47f25", "1575428619101-da4a86f5522c"
];
const hoodieIds = [
    "1556821840-3a63f15732ce", "1509942702682-47344b67d1d5", "1578939662863-5cd416d45a69", 
    "1523381210434-271e8be1f52b", "1618355200234-77f6b987b76a", "1491336477085-c11358f0bc2e"
];
const glassesIds = [
    "1572635196237-14b3f281503f", "1473496169904-658ba7c44d8a", "1511499767390-903390e6fbc1", 
    "1509198397868-475647b2a1e5", "1577803113624-759ffdec5ecf", "1484192858394-220d93266223"
];
const coatIds = [
    "1507679799987-c73779587ccf", "1594938298603-c8148c4dae35", "1593030103066-0a940ff67438", 
    "1617130863739-16a7c365324d", "1598970482036-73595763529e", "1534030339240-6993fe217dd3"
];

const categoryIdMap = {
    "Shirts": shirtIds,
    "Pants": pantsIds,
    "Shoes": shoeIds,
    "Caps": capIds,
    "Hoodies": hoodieIds,
    "Glasses": glassesIds,
    "Coats": coatIds
};

// Helper to get local image if available, else Unsplash
function getProductImage(section, globalIndex, currentId) {
    // Shirts Mapping (8 local images)
    if (section === "Shirts") {
        if (globalIndex < 4) return `images/pre-shirt${globalIndex + 1}.jpeg`;
        if (globalIndex < 8) return `images/shirt-${globalIndex + 1}.jpeg`;
    }
    // Shoes Mapping (4 local images)
    if (section === "Shoes" && globalIndex < 4) {
        return `images/shoes-1 (${globalIndex + 1}).jpeg`;
    }
    // Default to Unsplash
    return `https://images.unsplash.com/photo-${currentId}?auto=format&fit=crop&w=800&q=80`;
}

productId = 1;
mainSections.forEach(section => {
    let sectionItemCount = 0; // To track index within the whole category (across subcats)
    subCats.forEach(sub => {
        const ids = categoryIdMap[section];
        for (let i = 0; i < 6; i++) {
            const currentId = ids[i];
            const baseUrl = getProductImage(section, sectionItemCount, currentId);
            
            // Premium name generator
            const modifiers = ["Onyx", "Zenith", "Aether", "Luxe", "Apex", "Nova"];
            const pName = `${sub} ${modifiers[i]} ${section.slice(0, -1)}`;

            products.push({
                id: productId++,
                category: section,
                subcategory: sub,
                name: pName,
                price: sub === "Premium" ? 299.99 : sub === "Classical" ? 189.99 : 99.99,
                image: baseUrl,
                images: [
                    baseUrl,
                    baseUrl.includes('unsplash') ? `https://images.unsplash.com/photo-${currentId}?auto=format&fit=crop&w=400&q=70&sig=1` : baseUrl,
                    baseUrl.includes('unsplash') ? `https://images.unsplash.com/photo-${currentId}?auto=format&fit=crop&w=400&q=70&sig=2` : baseUrl,
                    baseUrl.includes('unsplash') ? `https://images.unsplash.com/photo-${currentId}?auto=format&fit=crop&w=400&q=70&sig=3` : baseUrl
                ],
                desc: `Experience the peak of urban sophistication with our ${pName}. Crafted from ethically sourced premium materials, this piece offers a perfect blend of durability, comfort, and state-of-the-art design. A true identity statement for the modern individual.`
            });
            sectionItemCount++;
        }
    });
});

// Reusable function to render nested categories (Shop Page)
function renderProductsByCategory(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let htmlContent = "";

    mainSections.forEach(section => {
        htmlContent += `<div class="main-category-section">
            <h1 class="main-category-title">${section.toUpperCase()}</h1>`;
            
        subCats.forEach(sub => {
            const items = products.filter(p => p.category === section && p.subcategory === sub);
            if(items.length > 0) {
                htmlContent += `
                <div class="subcategory-wrapper">
                    <div class="section-header">
                        <h2>${sub} COLLECTION</h2>
                    </div>
                    <div class="horizontal-scroll-container">
                        ${items.map(product => `
                            <div class="product-card" onclick="openModal(${product.id})">
                                <div class="product-image-container">
                                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                                    <div class="card-overlay">
                                        <button class="quick-add-btn"><i class="fa fa-shopping-bag"></i></button>
                                    </div>
                                </div>
                                <div class="product-info">
                                    <span class="product-tag">${product.subcategory}</span>
                                    <h3 class="product-name">${product.name}</h3>
                                    <div class="product-price">$${product.price.toFixed(2)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }
        });

        htmlContent += `</div>`; 
    });

    container.innerHTML = htmlContent;
}

// Function to render a simple list (Home Page)
function renderProducts(productList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = productList.map(product => `
        <div class="product-card" onclick="openModal(${product.id})">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="card-overlay">
                    <button class="quick-add-btn"><i class="fa fa-shopping-bag"></i></button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-tag">${product.subcategory}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}
