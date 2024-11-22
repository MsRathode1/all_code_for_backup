import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Invoice from './Invoice';
import { useReactToPrint } from 'react-to-print';
import InvoiceFrom from './InvoiceFrom';
import { FaPrint } from "react-icons/fa";
import { TbSwitchHorizontal } from "react-icons/tb";
import { CgLayoutGrid } from 'react-icons/cg';


const App = () => {
  const invoiceRef = useRef();
  console.log(invoiceRef)

  const [invoiceData, setInvoiceData] = useState(JSON.parse(localStorage.getItem("invoiceData")));
  const [change, setchange] = useState(true)

  useEffect(() => {
    setInvoiceData(JSON.parse(localStorage.getItem("invoiceData")))
  }, [])


  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });


  localStorage.setItem("invoiceData", JSON.stringify({
    CompanyName: "",
    CompanyAddress: "",
    CompanyGST: "",
    CompanyContactNo: "",
    CompanyEmail: "",
    CompanyLocality: "",
    CityStatePIN: "",
    QuotationNo: '',
    QuotationDate: '',
    DeliveryDate: "",
    SalesOfficer: "",
    PurchaseOfficer: "",
    customer: {
      CustomerName: '',
      CustomerAddress: '',
      CustomerEmail: '',
      CustomerGSTIN: "",
      CustomerPhone: "",
      CustomerStateCode: "",
      CustomerCounrty: "",
      ShippingAddress: "",
    },
    items: [

    ],
  }))


  const pages = [];
   console.log(pages)

  if (invoiceData.items.length !== undefined) {

    for (let i = 0; i < invoiceData.items.length; i += 10) {
      pages.push(invoiceData.items.slice(i, i + 10));
    }
  }




  return (
    <div className="app">
      <div style={{ width: "100%", marginBottom: "20px", border: "0px solid red", display: "flex", justifyContent: "center", marginTop: "10px" }}>
        {
          change === false ? <div>
            <button style={{ marginRight: "40px", padding: "10px", borderRadius: "10px", border: 'transparent', boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} onClick={handlePrint}>Print <FaPrint /></button>
          </div> : <></>
        }
        <button style={{ padding: "10px", borderRadius: "10px", border: 'transparent', boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} onClick={() => {
          setchange(!change)
        }}>Switch to {change === false ? "Form" : "Quote"}<TbSwitchHorizontal /></button>
      </div>
      {change == true ? <InvoiceFrom invoiceData={invoiceData} setInvoiceData={setInvoiceData} /> : <div ref={invoiceRef}>
        {pages.map((page, index) => (
          <Invoice
            key={index}
            logo={invoiceData.logo}
            header={invoiceData.header}
            customer={invoiceData.customer}
            items={page}
            invoiceData={invoiceData}
            isLastPage={index === pages.length - 1}
          />
        ))}
      </div>}
    </div>
  );
};

export default App;
