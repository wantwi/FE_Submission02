const logout = () => {
    sessionStorage.setItem("access_token", null);
    sessionStorage.setItem("refresh_token", null);
    window.location.href = "./login.html";
  };
  
  const renderStatus = (status) => {
      switch (status) {
        case "processing":
          return `<span class="danger">${status}</span>`;
        case "delivered":
          return `<span class="success">${status}</span>`;
        default:
          return `<span class="primary">${status}</span>`;
          break;
      }
    };
  
    const renderProductItem = (product) => {
      return (
       ` <div id=${product?.id} class="product-item">
          <img src=${product?.image} />
          <p>${product?.name}</p>
        </div>`
      );
    };
  
  
  document.addEventListener("DOMContentLoaded", () => {
    let access_token = sessionStorage.getItem("access_token");
    let refresh_token = sessionStorage.getItem("refresh_token");
  
    if (!access_token) {
      logout();
    }
  
    //Variables
    const tbody = document.getElementById("tbody");
    const logoutEl = document.getElementById("logout");
    const searchInput = document.getElementById("search");
    const currentPage = document.getElementById("currentPage");
    const totalPage = document.getElementById("totalPage");
    const previousePageBtn = document.getElementById("previousePageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const searchBtn =  document.getElementById("searchBtn");
   
    let pageCount = 1, totalPageCount=0
    /**
     * get regresh token
     * @returns string
     */
    const getRefreshToken = async () => {
      const request = await fetch("https://freddy.codesubmit.io/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refresh_token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (request.status === 200) {
        const response = await request.json();
  
        sessionStorage.setItem("access_token", response?.access_token);
  
        return response?.access_token;
      } else {
        logout();
      }
    };
  
    /**
     * handle user logout
     */
    logoutEl.addEventListener("click", () => {
      logout();
    });
  
    /**
     * Fetch dashboard information
     */
  
    const fetchSearchOrder = async () => {
      try {
        const request = await fetch(`https://freddy.codesubmit.io/orders?page=${pageCount}&q=${searchInput.value}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
  
        if (request.status === 401) {
          const token = getRefreshToken();
  
          console.log({ token, request });
  
          if (token) {
            fetchSearchOrder();
          }
        }
  
        const response = await request.json();
  
        renderTable(response?.orders)
        currentPage.innerText = response?.page
        totalPage.innerText = response?.total
        totalPageCount = response?.total
  
      } catch (error) {
        console.log({ error });
      }
    };
  
    //handle search
    searchBtn.addEventListener("click", ()=>{
      if(searchInput.value.length < 4) return
      fetchSearchOrder()
    })
  
    const canIncreaseCount = () => {
     
          if(totalPageCount <= pageCount ){
              return false
          }
          return true
    }
  
    const canDecreaseCount = () => {
      if( pageCount > 0 ){
          return true
      }
      return false
  }
  
  
  
    //Go to previouse Page
    previousePageBtn.addEventListener("click", ()=>{
      if(searchInput.value.length < 4 || pageCount ===1 ) return
      if(canDecreaseCount() ){
          pageCount = pageCount - 1
          fetchSearchOrder()
      }
    })
  
  
    //Go to next page
  nextPageBtn.addEventListener("click", ()=>{
  
      if(searchInput.value.length < 4  ) return
      if(canIncreaseCount() ){
          pageCount = pageCount + 1
          fetchSearchOrder()
  
      }
      
  })
  
  
  const renderTable = (data) =>{
  
      let temp = "";
      data.forEach((item) => {
        const { product, created_at, total, status } = item;
        temp += `<tr ><td>${renderProductItem(product)}</td><td>${created_at.split("T")[0]}</td><td>${total}</td><td>${renderStatus(status)}</td></tr>`;
      });
    
      tbody.innerHTML = temp;
  }
  
  
  
  });
  
  
  