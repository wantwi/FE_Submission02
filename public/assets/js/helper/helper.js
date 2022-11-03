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
  let list, currentObj, previousObj, current;

  current = currentMonth;
  list = ["Jan", "Feb","Mar","Apr","May","Jun", "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  let copyList = list.slice();

  if (current === 0) {
    previousObj = copyList.pop();
    currentObj = copyList.shift();
  } else {
    currentObj = copyList[current];
    previousObj = copyList[current - 1];
    const removed = copyList.splice(current - 1, 2);
  }
  return ["this month", "last month", ...copyList];
};

/**
 * Reoder week days to start with current day and previous day
 * @returns arry
 */
const reOrderDaysList = () => {
  let list, currentObj, previousObj, current;

  current = today;
  list = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  let copyList = list.slice();

  if (current === 0) {
    previousObj = list.pop();
    currentObj = list.shift();
  } else {
    currentObj = list[current - 1];
    previousObj = list[current - 2];
    const removed = list.splice(current - 1, 2);
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
  const removed = coppy.splice(today - 2, 2).reverse();
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
