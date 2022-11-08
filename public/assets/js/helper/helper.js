const date = new Date(Date.now());
const today = date.getDay();
const currentMonth = date.getMonth();

let access_token = sessionStorage.getItem("access_token");
let refresh_token = sessionStorage.getItem("refresh_token");

const logout = () => {
  sessionStorage.clear();
  window.location.href = "./login.html";
};

 /**
   * Check if access token is set
   */

  if (
    !access_token ||
    access_token === null ||
    access_token === "null" ||
    access_token === undefined
  ) {
    logout();
  }



/**
 * Reoder months of the year to start with current month and previous month
 * @returns arry
 */
const reOrderMonthList = () => {
  let currentObj, previousObj;

  let list = ["Jan", "Feb","Mar","Apr","May","Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];

  if (currentMonth === 0) {
    previousObj = list.pop();
    currentObj = list.shift();
  } else {
    //currentObj = copyList[currentMonth];
    //previousObj = copyList[currentMonth - 1];
    // const removed = copyList.splice(currentMonth - 1, 2);

    const itemsRemoved  = list.splice(currentMonth - 1, 2).reverse();
    currentObj = itemsRemoved[0]
    previousObj = itemsRemoved[1]
  }
  return ["this month", "last month", ...list];
};

/**
 * Reoder week days to start with current day and previous day
 * @returns arry
 */
const reOrderDaysList = () => {
  let currentObj, previousObj;

  let list = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  if (today === 0) {
    previousObj = list.pop();
    currentObj = list.shift();
  } else {
    const itemsRemoved = list.splice(today - 1, 2).reverse();
    currentObj = itemsRemoved[0]
    previousObj = itemsRemoved[1]
  }
  return ["today", "yesterday", ...list];
};

/**
 * Converting object of array to array of objects
 * @param {object} data 
 */
 const convertToArray =(data)=>{
  return Object.keys(data).map(
      (key) => data[key]
    );
}

/**
 * return an array of values
 * @param {object} 
 * @returns array
 */

const reOrderValues = (data) => {
  let coppy = convertToArray(data);
  const removed = coppy.splice(today - 1, 2).reverse();
  return [...removed, ...coppy].map((x) => x?.total);
};

/**
 * return an array of values
 * @param {object} 
 * @returns array
 */

 const reOrderMonthValues = (data) => {
  let coppy = convertToArray(data);
  const removed = coppy.splice(currentMonth - 1, 2).reverse();
  return [...removed, ...coppy].map((x) => x?.total);
};



/**
 * Formate Currency
 * @param {number} value 
 * @returns string
 */
const currentFormater =  (value) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
}




/**
 * Display product name and image
 * @param {object} product 
 * @returns 
 */
const renderProductItem = (product) => {
    return `<div id=${product?.id} class="product-item">
        <img src=${product?.image} />
        <p>${product?.name}</p>
      </div>`;
  };


  /**
   * Assign diffrent color indication for status 
   * @param {string} status 
   * @returns string
   */
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
