
document.addEventListener("DOMContentLoaded", () => {
  // let access_token = sessionStorage.getItem("access_token");
  // let refresh_token = sessionStorage.getItem("refresh_token");

  // if (!access_token) {
  //   logout();
  // }

  //Variables
  const tbody = document.getElementById("tbody");
  const logoutEl = document.getElementById("logout");
  const searchInput = document.getElementById("search");
  const currentPage = document.getElementById("currentPage");
  const totalPage = document.getElementById("totalPage");
  const previousePageBtn = document.getElementById("previousePageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const searchBtn = document.getElementById("searchBtn");



  let pageCount = 1,
    totalPageCount = 0;
 

  /**
   * handle user logout
   */
  logoutEl.addEventListener("click", () => {
    logout();
  });

  /**
   * Fetch all orders
   */

  const fetchSearchOrder = async (query = "") => {
    try {
      const request = await fetch(
        `https://freddy.codesubmit.io/orders?page=${pageCount}&q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (request.status === 401) {
        const token = getRefreshToken();

       

        if (token) {
          fetchSearchOrder();
        }
      }

      // renderTable([])

      const response = await request.json();

      renderTable(response?.orders);
      currentPage.innerText = response?.page;
      totalPage.innerText = response?.total;
      totalPageCount = response?.total;
    } catch (error) {
     
    }
  };

  //get all orders on page load
  fetchSearchOrder()

  //handle search
  searchBtn.addEventListener("click", () => {
    pageCount = 1;
    totalPageCount = 0;
    fetchSearchOrder(searchInput.value);
  });

  const canIncreaseCount = () => {
    if (totalPageCount <= pageCount) {
      return false;
    }
    return true;
  };

  const canDecreaseCount = () => {
    if (pageCount > 0) {
      return true;
    }
    return false;
  };

  //Go to previouse Page
  previousePageBtn.addEventListener("click", () => {
    
    if (canDecreaseCount()) {
      pageCount = pageCount - 1;
      fetchSearchOrder(searchInput.value);
    }
  });

  //Go to next page
  nextPageBtn.addEventListener("click", () => {
   
    if (canIncreaseCount()) {
      pageCount = pageCount + 1;
      fetchSearchOrder(searchInput.value);
    }
  });

  const renderTable = (data) => {
    let temp = "";
    data.forEach((item) => {
      const { product, created_at, total, status } = item;
      temp += `<tr ><td>${renderProductItem(product)}</td><td>${
        created_at.split("T")[0]
      }</td><td class="text-right">${currentFormater(total)}</td><td>${renderStatus(status)}</td></tr>`;
    });

    tbody.innerHTML = temp;
  };
});
