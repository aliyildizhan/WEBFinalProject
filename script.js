// Local arrays
let suppliers = [];
let purchases = [];
let categories = {small: 25, medium: 25, large: 29, extra: 36, family: 47, bulk: 45};
let sales = [];
let smallPrice = 1.5, mediumPrice = 2.5, largePrice = 4.0, extraPrice = 7.0, familyPrice = 12.0, bulkPrice = 32.0, premiumPrice = 7.0;

localStorage.setItem("categories", JSON.stringify(categories));

const suppliersTableBody = document.querySelector("#suppliers-table tbody");
const purchasesTableBody = document.querySelector("#purchases-table tbody");

const supplierForm = document.querySelector("#supplier-form");
const purchaseForm = document.querySelector("#purchase-form");
const saleForm = document.querySelector("#sale-form");
const taxForm = document.querySelector("#tax-rate-form")
    if(supplierForm){
        supplierForm.addEventListener("submit", addSupplier);
        purchaseForm.addEventListener("submit", addPurchase);
        saleForm.addEventListener("submit", addSale);
        taxForm.addEventListener("submit", applyTax);
    }
// Fetching initial data from JSON files
fetchSuppliers();
fetchPurchases();
fetchSales();

// Function to fetch and display suppliers from JSON file
async function fetchSuppliers() {
    try {
        const response = await fetch("data/suppliers.json");
        if (!response.ok) {
            throw new Error("Failed to load suppliers data");
        }
        suppliers = await response.json();
        if (suppliersTableBody) {
            displaySuppliers();
        }
    } catch (error) {
        console.error("Error fetching suppliers:", error);
    }
}

// Function to fetch and display purchases from JSON file
async function fetchPurchases() {
    try {
        const response = await fetch("data/purchases.json");
        if (!response.ok) {
            throw new Error("Failed to load purchases data");
        }
        purchases = await response.json();
        if (purchasesTableBody) {
            displayPurchases();
            localStorage.setItem("purchases", JSON.stringify(purchases));
        }
    } catch (error) {
        console.error("Error fetching purchases:", error);
    }
}

// Function to fetch and display sales from JSON file
async function fetchSales() {
    try {
        const response = await fetch("data/sales.json");
        if (!response.ok) {
            throw new Error("Failed to load purchases data");
        }
        sales = await response.json();
        if (salesTableBody) {
            displaySales();
            localStorage.setItem("sales", JSON.stringify(sales));
        }
    } catch (error) {
        console.error("Error fetching purchases:", error);
    }
}

// SUPPLIER MANAGEMENT MODULE

// Function to display suppliers
function displaySuppliers() {
    supplierId = 0;
    suppliersTableBody.innerHTML = ""; // Clear existing table rows

    suppliers.forEach(supplier => {
        supplierId += 1;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${supplier.farmer_id}</td>
            <td onclick="supplierDetails('${supplier.farmer_id}')">${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td>${supplier.location}</td>
            <td><button onclick="updateSupplier('${supplier.farmer_id}')">Update</button></td>
            <td><button onclick="deleteSupplier('${supplier.farmer_id}')">Delete</button></td>
        `;
        suppliersTableBody.appendChild(row);
    });
}

// Functşon to display supplier details
function supplierDetails(id) {
    let totalBerry = 0;
    let totalCost = 0;
    let text = "Id       Date        Quntity   Price per Kg    Total\n";
    purchases.forEach(purchase => {
        if (purchase.farmer_id == id) {
            totalBerry += parseFloat(purchase.quantity);
            totalCost += parseFloat((purchase.quantity * purchase.price_per_kg));
            text += purchase.purchase_id + "    " + purchase.date + "    " + purchase.quantity + 
            "             " + purchase.price_per_kg + "                  " + (purchase.quantity * purchase.price_per_kg + "\n"); 
        }
    });
    text += "\nTotal Quantity: " + totalBerry + "Kg\n" + 
            "Total Cost: " + totalCost + "$";
    alert(text);
}

// Function for searching suppliers by name or location
function searchSupplier() {
    const input = document.getElementById("supplier-search-input").value.toLowerCase();
    const table = document.getElementById("suppliers-table");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName("td")[1];
        const locationCell = rows[i].getElementsByTagName("td")[3];
        if (nameCell || locationCell) {
            const nameText = nameCell.textContent.toLowerCase();
            const locationText = locationCell.textContent.toLowerCase();
            rows[i].style.display = nameText.includes(input) || locationText.includes(input) ? "" : "none";
        }
    }
}

// Function to add a supplier
function addSupplier(event) {
    event.preventDefault();

    const supplierName = document.getElementById("supplier-name").value;
    const supplierContact = document.getElementById("supplier-contact").value;
    const supplierLocation = document.getElementById("supplier-location").value;
    supplierId += 1;

    const newSupplier = {
        farmer_id: supplierId, // Generate a unique ID
        name: supplierName,
        contact: supplierContact,
        location: supplierLocation
    };

    alert("Supplier with name " + supplierName + " added succesfully!")
    suppliers.push(newSupplier); // Add to local array
    displaySuppliers(); // Re-render the table
    supplierForm.reset(); // Clear the form
}


// Function to update a supplier
function updateSupplier(id) {
    const supplierIndex = suppliers.findIndex(supplier => supplier.farmer_id == id);
    if (supplierIndex != -1) {
        const newName = prompt("Enter new name:", suppliers[supplierIndex].name);
        const newContact = prompt("Enter new contact:", suppliers[supplierIndex].contact);
        const newLocation = prompt("Enter new location:", suppliers[supplierIndex].location);

        if (newName) suppliers[supplierIndex].name = newName;
        if (newContact) suppliers[supplierIndex].contact = newContact;
        if (newLocation) suppliers[supplierIndex].location = newLocation;

        displaySuppliers();
    }
}

// Function to delete a supplier
function deleteSupplier(id) {
    const supplierIndex = suppliers.findIndex(supplier => supplier.farmer_id == id);
    if (supplierIndex != -1) {
        suppliers.splice(supplierIndex, 1);
        alert("Supplier with " + id + " removed!");
    }
    displaySuppliers();
}

// Function to display purchases
function displayPurchases() {
    purchasesTableBody.innerHTML = ""; // Clear existing table rows
    purchaseId = 0;

    purchases.forEach(purchase => {
        purchaseId += 1;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${purchase.purchase_id}</td>
            <td>${purchase.farmer_id}</td>
            <td>${purchase.date}</td>
            <td>${purchase.quantity}</td>
            <td>${purchase.price_per_kg}$</td>
            <td>${(purchase.quantity * purchase.price_per_kg).toFixed(2)}$</td>
        `;
        purchasesTableBody.appendChild(row);
    });
}

// Function to sorting purchases
let currentSortDirection = 'asc';
function sortPurchaseTable(columnIndex) {
    const table = document.getElementById("purchases-table");
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    let isNumeric = true;

    if (columnIndex === 0 || columnIndex === 1 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        isNumeric = true;
    } else {
        isNumeric = false;
    }

    rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        if (isNumeric) {
            return currentSortDirection === 'asc' ? 
                parseFloat(cellA) - parseFloat(cellB) : 
                parseFloat(cellB) - parseFloat(cellA);
        } else {
            return currentSortDirection === 'asc' ? 
                cellA.localeCompare(cellB) : 
                cellB.localeCompare(cellA);
        }
    });

    const tbody = table.querySelector("tbody");
    rows.forEach(row => tbody.appendChild(row));

    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
}

// Function to adding a purchase:
function addPurchase(event) {
    event.preventDefault();

    const farmerId = document.getElementById("farmer-id").value;
    const date = document.getElementById("purchase-date").value;
    const quantity = document.getElementById("purchase-quantity").value;
    const price = document.getElementById("purchase-price").value;
    purchaseId += 1;

    const supplierId = suppliers.findIndex(supplier => supplier.farmer_id == farmerId);

    if (supplierId != -1){
        const newPurchase = {
            purchase_id: purchaseId,
            farmer_id: farmerId,
            date: date,
            quantity: quantity,
            price_per_kg: price,
            total_cost: (quantity * price)
        };

        alert("Purchase with ID" + purchaseId + " added succesfully!")
        purchases.push(newPurchase);
        displayPurchases();
        purchaseForm.reset();
        calculateTotalBerry();
        calculateTotalExpense();
    }
    else {
        alert("Supplier with id " + farmerId + " can't be found!")
        purchaseForm.reset();
    }
}

function calculateTotalBerry() {
    let text = document.getElementById("total-berry");
    let totalBerry = 0;
    purchases.forEach(purchase => {
        totalBerry += parseFloat(purchase.quantity);
    });

    sales.forEach(sale => {
        if (sale.product_category == "Small") {
            totalBerry -= (sale.quantity_ordered * 0.1);
        }
        if (sale.product_category == "Medium") {
            totalBerry -= (sale.quantity_ordered * 0.25);
        }
        if (sale.product_category == "Large") {
            totalBerry -= (sale.quantity_ordered * 0.5);
        }
        if (sale.product_category == "Extra Large") {
            totalBerry -= (sale.quantity_ordered * 1);
        }
        if (sale.product_category == "Family Pack") {
            totalBerry -= (sale.quantity_ordered * 2);
        }
        if (sale.product_category == "Bulk Pack") {
            totalBerry -= (sale.quantity_ordered * 5);
        }
        if (sale.product_category == "Premium") {
            totalBerry -= (sale.total_price / premiumPrice);
        }
    });

    totalBerry -= (categories.small * 0.1)
    totalBerry -= (categories.medium * 0.25);
    totalBerry -= (categories.large * 0.5);
    totalBerry -= (categories.extra * 1);
    totalBerry -= (categories.family * 2);
    totalBerry -= (categories.bulk * 5);

    console.log("Total Berry = ", totalBerry.toFixed(2));

    if (totalBerry<= 100) {
        alert("There are less berries than threshold in the inventory, must order new!")
    }

    text.innerHTML = "Total Berry: " + totalBerry.toFixed(2);

    return totalBerry;
}

// PRODUCT CATEGORIZATION AND PACKAGING MODULE

const categoriesTableBody = document.querySelector("#categories-table tbody");

const categoryForm = document.querySelector("#category-form");

if (categoryForm) {
    categoryForm.addEventListener("submit", addCategory);
    displayCategories();
}


// Function to display categories
function displayCategories() {
    categoriesTableBody.innerHTML = "";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${categories.small}</td>
            <td>${categories.medium}</td>
            <td>${categories.large}</td>
            <td>${categories.extra}</td>
            <td>${categories.family}</td>
            <td>${categories.bulk}</td>
        `;
    categoriesTableBody.appendChild(row);
    if (categories.small < 10 || categories.medium < 10 || categories.large < 10 || 
        categories.extra < 10 || categories.family < 10 || categories.bulk < 10) {
            alert("There is a category that under threshold, stock some berries!")
    }
}

//Function to add category
function addCategory(event) {
    event.preventDefault();
    totalBerry = calculateTotalBerry();

    const categorySelect = document.getElementById("category-select").value;
    const categoryNumber = document.getElementById("category-number").value;

    let berryConsumption = 0;

    if (categorySelect == "small") {
        berryConsumption = (0.1 * categoryNumber);
    }
    if(categorySelect == "medium") {
        berryConsumption = (0.25 * categoryNumber);
    }
    if (categorySelect == "large") {
        berryConsumption = (0.5 * categoryNumber);
    }
    if (categorySelect == "extra") {
        berryConsumption = (1 * categoryNumber);
    }
    if (categorySelect == "family") {
        berryConsumption = (2 * categoryNumber);
    }
    if (categorySelect == "bulk") {
        berryConsumption = (5 * categoryNumber);
    }

    if (totalBerry - berryConsumption >= 0){
        categories[categorySelect] += parseInt(categoryNumber);

        alert(categoryNumber + " " + categorySelect + " is added to inventory!");

        displayCategories();
        categoryForm.reset();
        calculateTotalBerry();
        localStorage.setItem("categories", JSON.stringify(categories));
    }
    else {
        alert("There are no such berries in inventory!")
    }
}

// Function setting categories prices
function setPrice() {
    const newSmallPrice = prompt("New price for Small category: ", smallPrice);
    const newMediumPrice = prompt("New price for Medium category: ", mediumPrice);
    const newLargePrice = prompt("New price for Large category: ", largePrice);
    const newExtraPrice = prompt("New price for Extra Large category: ", extraPrice);
    const newFamilyPrice = prompt("New price for Family Pack category: ", familyPrice);
    const newBulkPrice = prompt("New price for Bulk Pack category: ", bulkPrice);
    const newPremiumPrice = prompt("New price for Premium category: ", premiumPrice);

    if (newSmallPrice) smallPrice = newSmallPrice;
    if (newMediumPrice) mediumPrice = newMediumPrice;
    if (newLargePrice) largePrice = newLargePrice;
    if (newExtraPrice) extraPrice = newExtraPrice;
    if (newFamilyPrice) familyPrice = newFamilyPrice;
    if (newBulkPrice) bulkPrice = newBulkPrice;
    if (newPremiumPrice) premiumPrice = newPremiumPrice;
}

// Function to calculate category price
function categoryPrice(category, quantity) {
    if (category == "Small") {
        return (smallPrice * quantity);
    }
    if (category == "Medium") {
        return (mediumPrice * quantity);
    }
    if (category == "Large") {
        return (largePrice * quantity);
    }
    if (category == "Extra Large") {
        return (extraPrice * quantity);
    }
    if (category == "Family Pack") {
        return (familyPrice * quantity);
    }
    if (category == "Bulk Pack") {
        return (bulkPrice * quantity);
    }
    if (category == "Premium") {
        return (premiumPrice * quantity);
    }
    return category;

}

// SALES MANAGEMENT MODULE

const salesTableBody = document.querySelector("#sales-table tbody");

// Function to display sales
function displaySales() {
    salesTableBody.innerHTML = "";
    let index = -1;
    saleId = 0

    sales.forEach(sale => {
        index += 1;
        saleId += 1;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sale.order_id}</td>
            <td>${sale.order_date}</td>
            <td onclick="customerDetails('${sale.name}')">${sale.name}</td>
            <td>${sale.contact}</td>
            <td>${sale.shipping_address}</td>
            <td>${sale.product_category}</td>
            <td>${sale.quantity_ordered}</td>
            <td>${sale.total_price}$</td>
            <td>${sale.order_status}</td>
            <td><button onclick="updateSaleUp('${index}')">Update Up</button></td>
            <td><button onclick="updateSaleDown('${index}')">Update Down</button></td>
        `;
        salesTableBody.appendChild(row);
    });
}

// Function to add sale
function addSale(event) {
    event.preventDefault();

    saleId += 1;
    const date = document.getElementById("sale-date").value;
    const name = document.getElementById("sale-name").value;
    const contact = document.getElementById("sale-contact").value;
    const address = document.getElementById("sale-address").value;
    const category = document.getElementById("sale-category").value;
    const quantity = document.getElementById("sale-quantity").value;

    let category1;
    if (category == "Small") {
        category1 = "small"
    }
    if (category == "Medium") {
        category1 = "medium"
    }
    if (category == "Large") {
        category1 = "large"
    }
    if (category == "Extra Large") {
        category1 = "extra"
    }
    if (category == "Family Pack") {
        category1 = "family"
    }
    if (category == "Bulk Pack") {
        category1 = "bulk"
    }

    if (categories[category1] - parseFloat(quantity) >= 0 || category == "Premium"){
        const newSale = {
            order_id : saleId,
            order_date : date,
            name : name,
            contact : contact,
            shipping_address : address,
            product_category: category,
            quantity_ordered : quantity,
            total_price : categoryPrice(category, parseFloat(quantity)),
            order_status : "Pending"
        }

        if (category == "Premium") {
            const premiumKg = prompt("How many Kg for premium pack: ");
            if (premiumKg !== null && premiumKg > 0){
                newSale.total_price = categoryPrice(category, parseFloat(quantity) * parseFloat(premiumKg));
            }
            else {
                alert("Sale canceled or invalid input!");
                return;
            }
        }

        alert("Sale with id " + newSale.order_id + " added!")
        sales.push(newSale);
        localStorage.setItem("sales", JSON.stringify(sales));
        calculateTotalIncome();
        saleForm.reset();
        displaySales();
        
        categories[category1] -= parseFloat(quantity);
        displayCategories();
        calculateTotalBerry();
        localStorage.setItem("categories", JSON.stringify(categories));
    }
    else {
        alert("There are not that much " + category + " in inventory!")
    }
}

// Function to update sale status to up
function updateSaleUp(id) {

    if (sales[id].order_status == "Pending") {
        sales[id].order_status = "Processed";
        alert("Order with ID " + sales[id].order_id + " status updated to processed!")
        displaySales();
        return;
    }
    if (sales[id].order_status == "Processed") {
        sales[id].order_status = "Shipped";
        alert("Order with ID " + sales[id].order_id + " status updated shipped!")
        displaySales();
        return;
    }
    if (sales[id].order_status == "Shipped") {
        sales[id].order_status = "Delivered";
        alert("Order with ID " + sales[id].order_id + " status updated delivered!")
        displaySales();
        return;
    }
    else {
        alert("Order with ID " + sales[id].order_id + " is already delivered!")
    }
}

// Function to update sale status down
function updateSaleDown(id) {

    if (sales[id].order_status == "Processed") {
        sales[id].order_status = "Pending";
        alert("Order with ID " + sales[id].order_id + " status updated to pending!")
        displaySales();
        return;
    }
    if (sales[id].order_status == "Shipped") {
        sales[id].order_status = "Processed";
        alert("Order with ID " + sales[id].order_id + " status updated to processed!")
        displaySales();
        return;
    }
    if (sales[id].order_status == "Delivered") {
        sales[id].order_status = "Shipped";
        alert("Order with ID " + sales[id].order_id + " status updated to shipped!")
        displaySales();
        return;
    }
    else {
        alert("Order with ID " + sales[id].order_id + " is already pending for customer!")
    }
}

// Function to search sale by name or address
function searchSale() {
    const input = document.getElementById("sale-search-input").value.toLowerCase();
    const table = document.getElementById("sales-table");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName("td")[2];
        const addressCell = rows[i].getElementsByTagName("td")[4];
        if (nameCell || addressCell) {
            const nameText = nameCell.textContent.toLowerCase();
            const addressText = addressCell.textContent.toLowerCase();
            rows[i].style.display = nameText.includes(input) || addressText.includes(input) ? "" : "none";
        }
    }
}

// Function for calculating total unit sold
function totalUnitSold() {
    let smallUnit = 0, mediumUnit = 0, largeUnit = 0, extraUnit = 0, familyUnit = 0, bulkUnit = 0, premiumUnit = 0;

    sales.forEach(sale => {
        if (sale.product_category == "Small") {
            smallUnit += sale.quantity_ordered;
        }
        if (sale.product_category == "Medium") {
            mediumUnit += sale.quantity_ordered;
        }
        if (sale.product_category == "Large") {
            largeUnit += sale.quantity_ordered;
        }
        if (sale.product_category == "Extra Large") {
            extraUnit += sale.quantity_ordered;
        }
        if (sale.product_category == "Family Pack") {
            familyUnit += sale.quantity_ordered;
        }
        if (sale.product_category == "Bulk Pack") {
            bulkUnit += sale.quantity_ordered;
        }
        if (sale.product_category == "Premium") {
            premiumUnit += parseInt(sale.quantity_ordered);
        }
    });

    alert("Total sale per Category:\n" + 
        "Small: " + smallUnit + "\n" + 
        "Medium: " + mediumUnit + "\n" + 
        "Large: " + largeUnit + "\n" + 
        "Extra Large: " + extraUnit + "\n" + 
        "Family Pack: " + familyUnit + "\n" + 
        "Bulk Pack: " + bulkUnit + "\n" + 
        "Premium: " + premiumUnit
    )
}

// Function to sorting sale table
let currentSaleSortDirection = 'asc';
function sortSaleTable(columnIndex) {
    const table = document.getElementById("sales-table");
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    let isNumeric = true;

    if (columnIndex === 0 || columnIndex === 6 || columnIndex === 7) {
        isNumeric = true;
    } else {
        isNumeric = false;
    }

    rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        if (isNumeric) {
            return currentSortDirection === 'asc' ? 
                parseFloat(cellA) - parseFloat(cellB) : 
                parseFloat(cellB) - parseFloat(cellA);
        } else {
            return currentSortDirection === 'asc' ? 
                cellA.localeCompare(cellB) : 
                cellB.localeCompare(cellA);
        }
    });

    const tbody = table.querySelector("tbody");
    rows.forEach(row => tbody.appendChild(row));

    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
}

// Function for display customer details
function customerDetails(name) {
    let totalPrice = 0;
    let text = "    Date          Category    Quantity    Total   Status\n";
    sales.forEach(sale => {
        if (sale.name == name) {
            totalPrice += parseFloat(sale.total_price);
            text += (sale.order_date + "      " + sale.product_category + "           " + sale.quantity_ordered + "          " + 
            sale.total_price + "$    " + sale.order_status + "\n")
        }
    });
    text += "\nTotal Price: " + totalPrice + "$";
    alert(text);
}

//FINANCIAL ANALYSIS MODULE

function applyTax(event) {
    event.preventDefault();

    const newTax = document.getElementById("tax-rate").value;
    taxRate = newTax;
    localStorage.setItem("tax", newTax);

    console.log("Tax rate: " + newTax);
    alert("Tax rate set to " + newTax + "%");
    taxForm.reset();
    
    calculateProfit();
}

// Function for calculating total income
function calculateTotalIncome() {
    let totalIncome = 0;
    let incomeText = document.getElementById("total-income");

    sales.forEach(sale => {
        totalIncome += parseFloat(sale.total_price);
    });

    localStorage.setItem("income", totalIncome);
    console.log("Total Income = ", totalIncome.toFixed(2));
    if (incomeText){
        incomeText.innerHTML = "Total Income: " + totalIncome + "$";
    }
    
    return totalIncome;
}

// Function for calculating total expense
function calculateTotalExpense() {
    let totalExpense = 0;
    let expenseText = document.getElementById("total-expense");

    purchases.forEach(purchase => {
        totalExpense += (parseFloat(purchase.quantity) * parseFloat(purchase.price_per_kg));
    });

    localStorage.setItem("expense", totalExpense);
    console.log("Total Expense = ", totalExpense.toFixed(2));
    if (expenseText){
        expenseText.innerHTML = "Total Expense: " + totalExpense + "$";
    }
    return totalExpense;
}

// Function for calculating total profit
function calculateProfit() {
    const tax = localStorage.getItem("tax");
    let profit = (calculateTotalIncome() - calculateTotalExpense() - (calculateTotalIncome() * tax /100));

    let profitText = document.getElementById("net-profit");
    if (profitText) {
        profitText.innerHTML = "Net Profit: " + profit + "$";
    }

    localStorage.setItem("profit", profit);
    return profit;
}

//REPORT MODULE

const reportForm = document.querySelector("#generate-report-form");
if (reportForm){
    reportForm.addEventListener("submit", generateReport);

    function generateReport(event) {
        event.preventDefault();
        let smallUnit = 0, mediumUnit = 0, largeUnit = 0, extraUnit = 0, familyUnit = 0, bulkUnit = 0, premiumUnit = 0;

        const timeInterval = document.getElementById("time-interval").value;

        const purchases = JSON.parse(localStorage.getItem("purchases"));
        const categories = JSON.parse(localStorage.getItem("categories"));
        const sales = JSON.parse(localStorage.getItem("sales"));
        const tax = localStorage.getItem("tax");
        const income = localStorage.getItem("income");
        const expense = localStorage.getItem("expense");
        const profit = localStorage.getItem("profit");

        const incomeText = document.getElementById("report-income");
        const expenceText = document.getElementById("report-expense");
        const taxText = document.getElementById("report-tax");
        const profitText = document.getElementById("report-profit");
        const remainTableBody = document.querySelector("#report-remain-table tbody")
        const soldTableBody = document.querySelector("#report-sold-table tbody")
        if (timeInterval == "all-time") {
            incomeText.innerHTML = "Total Income: " + income + "$";
            expenceText.innerHTML = "Total Expense: " + expense + "$";
            taxText.innerHTML = "Tax Applied: " + tax + "%";
            profitText.innerHTML = "Net Profit: " + profit + "$";

            sales.forEach(sale => {
                if (sale.product_category == "Small") {
                    smallUnit += parseInt(sale.quantity_ordered);
                }
                if (sale.product_category == "Medium") {
                    mediumUnit += parseInt(sale.quantity_ordered);
                }
                if (sale.product_category == "Large") {
                    largeUnit += parseInt(sale.quantity_ordered);
                }
                if (sale.product_category == "Extra Large") {
                    extraUnit += parseInt(sale.quantity_ordered);
                }
                if (sale.product_category == "Family Pack") {
                    familyUnit += parseInt(sale.quantity_ordered);
                }
                if (sale.product_category == "Bulk Pack") {
                    bulkUnit += parseInt(sale.quantity_ordered);
                }
                if (sale.product_category == "Premium") {
                    premiumUnit += parseInt(sale.quantity_ordered);
                }
            });

            soldTableBody.innerHTML = "";

                const row1 = document.createElement("tr");
                row1.innerHTML = `
                    <td>${smallUnit}</td>
                    <td>${mediumUnit}</td>
                    <td>${largeUnit}</td>
                    <td>${extraUnit}</td>
                    <td>${familyUnit}</td>
                    <td>${bulkUnit}</td>
                    <td>${premiumUnit}</td>
                `;
            soldTableBody.appendChild(row1);

            remainTableBody.innerHTML = "";

                const row2 = document.createElement("tr");
                row2.innerHTML = `
                    <td>${categories.small}</td>
                    <td>${categories.medium}</td>
                    <td>${categories.large}</td>
                    <td>${categories.extra}</td>
                    <td>${categories.family}</td>
                    <td>${categories.bulk}</td>
                `;
        remainTableBody.appendChild(row2);
        }  
    }
}
