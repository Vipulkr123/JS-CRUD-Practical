document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();
    var id = document.getElementById("id").value;
    var productName = document.getElementById("productName").value;
    var imageName = document.getElementById("imageName");
    var price = document.getElementById("price").value;
    var description = document.getElementById("description").value;

    addProduct(id, productName, imageName, price, description)
    console.log('outside' + productList);
});


function addProduct(id, productName, imageName, price, description) {
    var productList;
    if (localStorage.getItem("productList") == null) {
        productList = [];
    }
    else {
        productList = JSON.parse(localStorage.getItem("productList"));
    }

    // Get the file from the event
    const file = imageName.files[0];
    console.log(file);

    // Create a new FileReader instance
    const reader = new FileReader();

    // Set the onload function for the reader
    reader.onload = (e) => {
        // Get the data URL for the file
        const dataURL = e.target.result;
        console.log(dataURL);

        // Store the data URL in local storage
        productList.push({
            id: id,
            productName: productName,
            imageName: dataURL,
            price: price,
            description: description
        });
        localStorage.setItem("productList", JSON.stringify(productList));
        showData();
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
    // });


}

function showData() {
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
          <td>  <!-- Button trigger modal -->
          <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              view
          </button>

          <!-- Modal -->
          <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
              aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                      <img src='${element.imageName}' alt="" class="img-fluid display-img">
                      </div>
                  </div>
              </div>
          </div></td>
          <td>${element.price}</td>
          <td>${element.description}</td>
          <td><button class="btn btn-warning" onclick="updateProduct(${index})">Edit</button></td>
          <td><button class="btn btn-danger" onclick="deleteProduct(${index})">Delete</button></td>`
    });
    document.getElementById("productList").innerHTML = html;
}

showData()