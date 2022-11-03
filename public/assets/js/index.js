
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
      { title: "Last Week", orders: 120, total: currentFormater(34) },
      lastMonthSale,
    ];

   

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

      
        if (token) {
          getDashboardInfo();
        }
      }

      const response = await request.json();

      processResponse(response);
    } catch (error) {
    
    }
  };

  getDashboardInfo();



  const renderSalesSummay = (data) => {
    let template = ``;
    data.forEach((x) => {
      template += `<div class="min-card"><h4>${x?.title}</h4><p>${x?.total.replace(".00","")}K / ${x?.orders} orders</p></div>`;
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
      )}</td><td class="text-right">${currentFormater(price)}</td><td class="text-right">${unit}</td><td class="text-right">${currentFormater(revenue)}</td></tr>`;
    });

   
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
