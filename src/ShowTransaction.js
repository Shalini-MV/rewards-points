import React, { useState, useEffect } from "react";

function ShowTransaction() {
  const serviceUrl="http://localhost:8080/rewards/api/v1/";
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // State to store selected option for customers

  const [rewardsData, setRewardsData] = useState("");
  const [totalRewards, setTotalRewards] = useState([]);

  const [quartrewardsData, setQuartrewardsData] = useState("");
  const [totalQuartRewards, setTotalQuartRewards] = useState([]);

  const [transactionData, setTransactionData] = useState(null); // State to store the Transaction API response data

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const quarters = ["first", "second", "third", "fourth"];
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const [selectedQuarter, setSelectedQuarter] = useState("");

  const handleQuarChange = (e) => {
    setSelectedQuarter(e.target.value);
  };

  useEffect(() => {
    fetch(serviceUrl+"customers")
      .then((response) => response.json())
      .then((data) => {
        setData(data); // Assuming the API response is an array of objects
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty dependency array ensures this effect runs only once

  // Function to fetch data from the Transaction API based on the selected option
  const fetchTransactionData = async () => {
    try {
      if (selectedOption) {
        const response = await fetch(
            serviceUrl+"/transactions"
        );
        const responseData = await response.json();
        const filteredItems = responseData.filter(
          (item) => item.customer.id === selectedOption
        );
        setTransactionData(filteredItems);
      }
    } catch (error) {
      console.error("Error fetching second API data:", error);
    }
  };

  // Call the fetchTransactionData function when the selected option changes
  useEffect(() => {
    fetchTransactionData();
    setSelectedMonth("");
    setSelectedQuarter("");
    // eslint-disable-next-line
  }, [selectedOption]);

  // Function to fetch data from the Rewards API based on the selected option
  const fetchRewardsData = async () => {
    try {
      if (selectedMonth) {
        const response = await fetch( serviceUrl+"monthlyreport?month=" + selectedMonth ); // Replace with your second API endpoint
        const responseData = await response.json();
        const filteredItems = responseData.filter(
          (item) => item.customer.id === selectedOption
        );

        setRewardsData(filteredItems); // Store second API response data in state
        const totalR = filteredItems.reduce((total, currentItem) => {
          return total + currentItem.totalPoints;
        }, 0);
        if (totalR) {
          setTotalRewards(totalR);
        } else {
          setTotalRewards(0);
        }
      }
    } catch (error) {
      setTotalRewards(0);
      console.log(totalRewards);
      console.error("Error fetching Monthly rewards API data:", error);
    }
  };

  // Call the fetchRewardsData function when the selected option changes
  useEffect(() => {
    fetchRewardsData();
    // eslint-disable-next-line
  }, [selectedMonth]);

  // Function to fetch data from the third API based on the selected option
  const fetchQuartRewardsData = async () => {
    try {
      if (selectedQuarter) {
        const response = await fetch(
            serviceUrl+"quarterlyreport?quarter=" +
            selectedQuarter
        ); // Replace with your third API endpoint
        const responseData = await response.json();
        const filteredItems = responseData.filter(
          (item) => item.customer.id === selectedOption
        );

        setQuartrewardsData(filteredItems); // Store third API response data in state
        const totalR = filteredItems.reduce((total, currentItem) => {
          return total + currentItem.totalPoints;
        }, 0);
        if (totalR) {
          setTotalQuartRewards(totalR);
        } else {
          setTotalQuartRewards(0);
        }
        console.log("Shalini " + totalR);
      }
    } catch (error) {
      setTotalQuartRewards(0);

      console.error("Error fetching Quarterly rewards API data:", error);
    }
  };

  // Call the fetchRewardsData function when the selected option changes
  useEffect(() => {
    fetchQuartRewardsData();
    // eslint-disable-next-line
  }, [selectedQuarter]);

  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "50px",
        fontSize: "20px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Customers Rewards Service</h2>
      <div>
        <label>Select a Customer:</label>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Select an option</option>
          {data.map((item, index) => (
            <option key={index} value={item.id}>
              {item.firstName}
            </option>
          ))}
        </select>
      </div>
      <div></div>
      <div>
        {selectedOption && transactionData && (
          <div>
            <div>
              <table className="customers">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Billing Date</th>
                    <th>Amount</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.customer.firstName}{" "}
                        {transaction.customer.lastName}
                      </td>

                      <td>{transaction.billingDate}</td>
                      <td> {transaction.billingAmount}</td>
                      <td>{transaction.rewardPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <label>Select a month:</label>
              <select value={selectedMonth} onChange={handleMonthChange}>
                <option value="">Select a month</option>
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              {selectedMonth && rewardsData && (
                <div>
                  <table className="customers">
                    <thead>
                      <tr>
                        <th>Month</th>

                        <th>Rewards</th>
                      </tr>
                    </thead>
                    <tbody>
                      <td> {selectedMonth}</td>
                      <td>{totalRewards}</td>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <br></br>
            <div>
              <label>Select a Quarter:</label>
              <select value={selectedQuarter} onChange={handleQuarChange}>
                <option value="">Select a Quarter</option>
                {quarters.map((quarter, index) => (
                  <option key={index} value={quarter}>
                    {quarter}
                  </option>
                ))}
              </select>

              {selectedQuarter && quartrewardsData && (
                <div>
                  <table className="customers">
                    <thead>
                      <tr>
                        <th>Month</th>

                        <th>Rewards</th>
                      </tr>
                    </thead>
                    <tbody>
                      <td> {selectedQuarter}</td>
                      <td>{totalQuartRewards}</td>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowTransaction;
