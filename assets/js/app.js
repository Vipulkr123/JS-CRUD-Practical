const form = document.getElementById('my-form');

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

    var productIdArray = [];
    productList = JSON.parse(localStorage.getItem("productList"));
    productList.forEach((product) => {
        productIdArray = product.id;
        console.log(productIdArray);
        if (id == product.id) {
            alert("Can't add product with duplicate product id ");
            // form.reset();
        }
        else {



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

                // Get the existing data from local storage, or create an empty array
                // const data = JSON.parse(localStorage.getItem('data') || '[]');

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
    });
});

// Function to display the data on the page
function displayData() {
    var productList;
    if (localStorage.getItem("productList") == null) {
        productList = [];
    }
    else {
        productList = JSON.parse(localStorage.getItem("productList"));
    }

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
          <td><button class="update btn btn-warning" onclick="updateProduct(${index})" data-bs-toggle="modal"
          data-bs-target="#exampleModal">Edit</button></td>
          <td><button class="delete btn btn-danger" onclick="deleteProduct(${index})">Delete</button></td>`
    });
    document.getElementById("productList").innerHTML = html;
}

// Call the displayData function on page load
displayData();

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

function updateProduct(index) {
    var EditProduct = document.querySelectorAll(".update");
    for (let i = 0; i < EditProduct.length; i++) {
        EditProduct[i].onclick = function () {
            var tr = this.parentElement.parentElement;
            var td = tr.getElementsByTagName("td");
            id.value = td[0].innerHTML;
            productName.value = td[1].innerHTML;
            price.value = td[3].innerHTML;
            description.value = td[4].innerHTML;
        }
    }
}

var addProductBtn = document.querySelector('.add-product');
addProductBtn.addEventListener('click', () => { form.reset(); });


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
