const form = document.getElementById('my-form');

displayData();
// Add an event listener for when the form is submitted
form.addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the input elements from the form
    var id = document.getElementById("id").value;
    var productName = document.getElementById("productName").value;
    var imageName = document.getElementById("imageName");
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    addData(id, productName, imageName, price, description);

});

function addData(id, productName, imageName, price, description) {
    var isAvailData = true;
    var productIdArray = [];
    productList = JSON.parse(localStorage.getItem("productList"));
    console.log(productList);
    if (!productList == []) {
        productList.forEach((product) => {
            productIdArray = product.id;
            if (id == product.id) {
                alert("Can't add product with duplicate product id ");
                isAvailData = false;
            } else {
                isAvailData = true;
            }
        });
    } else {
        isAvailData = true;
    }

    if (isAvailData == true) {
        var productList;
        if (localStorage.getItem("productList") == null) {
            productList = [];
        }
        else {
            productList = JSON.parse(localStorage.getItem("productList"));
        }

        // Get the file from the file input
        const file = imageName.files[0];

        // Create a new FileReader instance
        const reader = new FileReader();

        // Set the onload function for the reader
        reader.onload = (e) => {
            // Get the data URL for the file
            const dataURL = e.target.result;
            // Add the new data to the array
            productList.push({
                id: id,
                productName: productName,
                imageName: dataURL,
                price: price,
                description: description
            });

            // Store the updated data in local storage
            localStorage.setItem('productList', JSON.stringify(productList));

            // Display the data on the page
            displayData();
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);

        // Reset the form
        form.reset();
    }
}

// Update the product list
function updateProduct(index) {
    document.getElementById("submit").style.display = "none";
    document.getElementById("updatse").style.display = "block";
    productList = JSON.parse(localStorage.getItem("productList"));
    productList.forEach((element, index) => {
        id.value = element.id;
        productName.value = element.productName;

        price.value = element.price;
        description.value = element.description;
        // imageName.value = element.imageName;
        console.log(element.imageName);
    });

}

// Function to display the data on the page
function displayData() {
    var productList;
    if (localStorage.getItem("productList") == null) {
        productList = [];
    }
    else {
        productList = JSON.parse(localStorage.getItem("productList"));
    }

    //Binding Dynamic data 
    var html = "";
    productList.forEach((element, index) => {
        html += `<tr>
          <td>${element.id}</td>
          <td>${element.productName}</td>
          <td><!-- Button trigger modal -->
          <button type="button" class="btn btn-success view-modal-btn" data-bs-toggle="modal"
              data-bs-target="#staticBackdrop" value="${element.id}">
              view
          </button>
                </td>
          <td>${element.price}</td>
          <td>${element.description}</td>
          <td><button class="update btn btn-warning" onclick="updateProduct(${element.id})" data-bs-toggle="modal"
          data-bs-target="#exampleModal">Edit</button></td>
          <td><button class="delete btn btn-danger" onclick="deleteProduct(${index})">Delete</button></td>`
    });
    document.getElementById("productList").innerHTML = html;
}

// Display view Image 
var modalViewBtnList = document.querySelectorAll('.view-modal-btn');

productList = JSON.parse(localStorage.getItem("productList"));
modalViewBtnList.forEach(btn =>
    btn.addEventListener('click', (e) => {
        productList = JSON.parse(localStorage.getItem("productList"));
        var product = productList.find((item) => parseInt(item.id) == e.target.value);
        var modalImg = document.querySelector('#staticBackdrop #modalImg');
        modalImg.src = product.imageName;
    })
)
// perferm delete Operation 
function deleteProduct(index) {
    var deleteProduct = document.querySelectorAll(".delete");
    for (let i = 0; i < deleteProduct.length; i++) {
        deleteProduct[i].onclick = function () {
            var tr = this.parentElement.parentElement;
            var td = tr.getElementsByTagName("td");
            var id = td[0].innerHTML;
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this data!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        productList = JSON.parse(localStorage.getItem("productList"));
                        productList.splice(id - 1, 1);
                        localStorage.setItem("productList", JSON.stringify(productList));
                        tr.remove();
                        swal("Poof! Your data has been deleted!", {
                            icon: "success",
                        });
                    } else {
                        swal("Your data is safe!");
                    }
                });
        }
    }
}



function updateproductDetails() {
    var id = document.getElementById("id").value;
    productList = JSON.parse(localStorage.getItem("productList"));
    var data = productList.filter(e => e.id != id);
    localStorage.setItem('productList', JSON.stringify(data));
    var id = document.getElementById("id").value;
    var productName = document.getElementById("productName").value;
    var imageName = document.getElementById("imageName");
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;
    addData(id, productName, imageName, price, description);
    closeBtn = document.getElementById("closeBtn");
    closeBtn.click();
}

var addProductBtn = document.querySelector('.add-product');
addProductBtn.addEventListener('click', () => { form.reset(); });

// Filter the data for the product
function filter() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("filterProduct");
    filter = input.value.toUpperCase();
    table = document.getElementById("productList");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        for (j = 0; j < tr[i].cells.length; j++) {
            td = tr[i].cells[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

// sort the data based on condition 
function sortTable() {
    var sortSelect, table, rows, switching, i, x, y, shouldSwitch;
    sortSelect = document.getElementById("sortDropdown");
    table = document.getElementById("dataTable");
    switching = true;

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[sortSelect.selectedIndex];
            y = rows[i + 1].getElementsByTagName("td")[sortSelect.selectedIndex];

            if (sortSelect.value != "" && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

// Enable disable submit button 
function enableSubmitBtn() {
    document.getElementById("updatse").style.display = "none";
    document.getElementById("submit").style.display = "block ";
}