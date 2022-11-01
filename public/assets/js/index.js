const date = new Date(Date.now());
const today = date.getDay();
const currentMonth = date.getMonth();

const logout = () => {
  sessionStorage.clear();
  window.location.href = "./login.html";
};

 /**
   * Check if access token is set
   */
  let access_token = sessionStorage.getItem("access_token");
  let refresh_token = sessionStorage.getItem("refresh_token");
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
  list = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
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
 * return an array of values
 * @param {object} 
 * @returns array
 */

const reOrderValues = (data) => {
  let coppy = Object.keys(data).map((key) => data[key]);
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
          }).replace(".00","")
}

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

document.addEventListener("DOMContentLoaded", () => {

  const tbody = document.getElementById("tbody");
  const logoutEl = document.getElementById("logout");
  const saleSammayDiv = document.getElementById("saleSammayDiv");
  const switchBtn = document.getElementById("switch");
  const chartTitle = document.getElementById("title")
  let SalesOverTimeWeek = [],
    SalesOverTimeYear = [],
    saleSummary = [];
  let isChecked = false;
  let chart;

  /**
   * creating html element for the chart container
   */
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "chart");
  canvas.setAttribute("width", "300");
  canvas.setAttribute("height", "70");
  document.querySelector("#chart-container").appendChild(canvas);

  /**
   * Draw bar chart
   * @param {string[]} labels
   * @param {number[]} data
   */
  const renderChart = (labels, data) => {
    chart = new Chart(canvas, {
      type: "bar",

      data: {
        labels: labels,
        datasets: [
          {
            // label: '# of Votes',
            data: data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
            legend: {
                display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Whom'st let the dogs out",
            },
        }
      },
    });
  };


  /**
   * Get refreshed token
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
 * Process respones for dashboard information display
 * @param {object} response 
 */
  const processResponse = (response) => {
    const { bestsellers, sales_over_time_week, sales_over_time_year } =
      response?.dashboard;

    renderBestSellers(bestsellers);

    SalesOverTimeWeek = convertToArray(sales_over_time_week)

    SalesOverTimeYear = convertToArray(sales_over_time_year) 

    //Get todays sales from sales_over_time_week

    let todaySale = {};
    let todaySaleObj = SalesOverTimeWeek[today];

    todaySale.title = "Today";
    todaySale.orders = todaySaleObj?.orders;
    todaySale.total = currentFormater(todaySaleObj?.total);

    //Get todays sales from sales_over_time_week
    let lastMonthSale = {};
    let lastMonthSaleObj = SalesOverTimeYear[currentMonth];

    lastMonthSale.title = "Last Month";
    lastMonthSale.orders = lastMonthSaleObj?.orders;
    lastMonthSale.total = currentFormater(lastMonthSaleObj?.total)

    saleSummary = [
      todaySale,
      { title: "Last Week", orders: 9, total: currentFormater(30493343) },
      lastMonthSale,
    ];

    console.log({ saleSammayDiv });

    renderSalesSummay(saleSummary);
    renderChart(reOrderDaysList(), reOrderValues(SalesOverTimeWeek));
  };




  /**
   * Fetch dashboard information
   */

  const getDashboardInfo = async () => {
    try {
      const request = await fetch("https://freddy.codesubmit.io/dashboard", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (request.status === 401) {
        const token = getRefreshToken();

        console.log({ token, request });

        if (token) {
          getDashboardInfo();
        }
      }

      const response = await request.json();

      processResponse(response);
    } catch (error) {
      console.log({ error });
    }
  };

  getDashboardInfo();



  const renderSalesSummay = (data) => {
    let template = ``;
    data.forEach((x) => {
      template += `<div class="min-card"><h4>${x?.title}</h4><p>${x?.total}K / ${x?.orders} orders</p></div>`;
    });

    saleSammayDiv.innerHTML = template;
  };

  const renderBestSellers = (data) => {
    const bestSellers = data.map((x) => ({
      product: x.product,
      unit: x.units,
      revenue: x.revenue,
      price: Math.ceil(x.revenue / x.units),
    }));
    let temp = "";
    bestSellers.forEach((item) => {
      const { product, unit, revenue, price } = item;
      temp += `<tr><td>${renderProductItem(
        product
      )}</td><td>${price}</td><td>${unit}</td><td>${revenue}</td></tr>`;
    });

    console.log({ temp });
    tbody.innerHTML = temp;
  };
 

  /**
   * Toggle between weekly and yearly view
   */
  switchBtn.addEventListener("click", () => {
    isChecked = !isChecked;
    chart.destroy();
    if (!isChecked) {
        chartTitle.innerText="Revenue (Last 7 days)"
      renderChart(reOrderDaysList(), reOrderValues(SalesOverTimeWeek));
    } else {
        chartTitle.innerText = "Revenue (Last 12 months)"
      renderChart(reOrderMonthList(), reOrderValues(SalesOverTimeYear));
    }


   
  });

});
