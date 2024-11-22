import React, { useState } from 'react'
import { GrTableAdd } from "react-icons/gr";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./invoiceForm.css"
import { MdOutlinePersonSearch } from "react-icons/md";


const InvoiceFrom = ({ setInvoiceData, invoiceData }) => {
    const [serachedArr, setserachedArr] = useState([])
    const [SearchedItemArr, setSearchedItemArr] = useState([])
    const [invoiceItem, setinvoiceItem] = useState({
        "Description": "",
        "CATNo": "",
        "HSN": "",
        "Qty": "",
        "UOM": "",
        "ItemRate": "",
        "Tax": "",
        "Amount": ""
    })

    const CompanyData = [
        {
            CompanyName: "AMEC GLOBAL",
            CompanyAddress: "B-17,SECTOR -3",
            CompanyGST: "23AWNPM3003C1Z4",
            CompanyContactNo: "+919425771010",
            CompanyEmail: "amec1010@gmail.com",
            CompanyLocality: "VINAY NAGAR",
            CityStatePIN: "GWALIOR, Madhya Pradesh - 474012, India",
            SalesOfficer: "Rahul Sharma",
        },
        {
            CompanyName: "DXT Technologies",
            CompanyAddress: "1070 Sky Corporate",
            CompanyGST: "23AWNPM3003C1Z4",
            CompanyContactNo: "+918523697412",
            CompanyEmail: "info@dxt-technologies.com",
            CompanyLocality: "Opposite Shalimar Township",
            CityStatePIN: "Indore, Madhya Pradesh - 478569, India",
            SalesOfficer: "Deepak",
        }
    ]

    const ItemData = [
        {
            "Description": "First Item",
            "CATNo": "C-48521",
            "HSN": "HSN-85236",
            "Qty": "852",
            "UOM": "UOM-7899",
            "ItemRate": "200",
            "Tax": "18",
            "Amount": ""
        }, {
            "Description": "Second Item",
            "CATNo": "C-88521",
            "HSN": "HSN-854436",
            "Qty": "36",
            "UOM": "UOM-8899",
            "ItemRate": "96",
            "Tax": "18",
            "Amount": ""
        },
        {
            "Description": "Third Item",
            "CATNo": "C-88521",
            "HSN": "HSN-854436",
            "Qty": "55",
            "UOM": "UOM-1499",
            "ItemRate": "300",
            "Tax": "18",
            "Amount": ""
        },
        {
            "Description": "Forth Item",
            "CATNo": "C-88521",
            "HSN": "HSN-854436",
            "Qty": "58",
            "UOM": "UOM-1499",
            "ItemRate": "300",
            "Tax": "18",
            "Amount": ""
        }
    ]

    const PurchaseOfficerData = [
        {
            "CustomerName": "DXT",
            "Name": "Purchase Officer1",
            "Email": "PurchaseOfficer1@gmail.com",
            "ContactNumber": "8523392569"
        },
        {
            "CustomerName": "Amec",
            "Name": "Purchase Officer2",
            "Email": "PurchaseOfficer2@gmail.com",
            "ContactNumber": "8523391485"
        },
        {
            "CustomerName": "Amec",
            "Name": "Purchase Officer3",
            "Email": "PurchaseOfficer3@gmail.com",
            "ContactNumber": "8945852339"
        },
        {
            "CustomerName": "DXT",
            "Name": "Purchase Officer4",
            "Email": "PurchaseOfficer4@gmail.com",
            "ContactNumber": "7852852339"
        }
    ]



    const SearchCostomer = (name) => {
        const newArr = PurchaseOfficerData.filter((el) => {
            return el.CustomerName == name
        })
        setserachedArr(newArr)
    }

    const SearchItem = (name) => {
        const newArr = ItemData.filter((el) => {
            return el.Description === name
        })
        setSearchedItemArr(newArr)
    }



    const [currentStep, setCurrentStep] = useState(1);

    const goToNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const goToPreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    function calculateTotalAmount(rate, quantity, taxRate) {
        const subtotal = rate * quantity;
        const taxAmount = (subtotal * taxRate) / 100;
        const totalAmount = subtotal + taxAmount;
        return subtotal;
    }




    return (
        <div>
            <div style={{ width: "100%", border: "0px solid red", textAlign: 'center', marginTop: "30px", marginBottom: "20px" }}><h2 style={{ margin: "auto", fontFamily: "sans-serif" }}>{currentStep == 2 ? "Customer Details" : currentStep == 3 ? "Add Item To Table" : "Company Details"}</h2></div>
            <ToastContainer />
            {currentStep === 1 && (
                <div>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", width: "55%", border: "0px solid black", margin: "auto", borderRadius: "10px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", marginBottom: "30px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Select Company</label>
                            <select onChange={(e) => {
                                const fillAry = CompanyData.filter((el) => {
                                    return el.CompanyName === e.target.value
                                })
                                setInvoiceData({
                                    ...invoiceData,
                                    CompanyName: fillAry[0].CompanyName,
                                    CompanyAddress: fillAry[0].CompanyAddress,
                                    CompanyGST: fillAry[0].CompanyGST,
                                    CompanyContactNo: fillAry[0].CompanyContactNo,
                                    CompanyEmail: fillAry[0].CompanyEmail,
                                    CompanyLocality: fillAry[0].CompanyLocality,
                                    CityStatePIN: fillAry[0].CityStatePIN,
                                    SalesOfficer: fillAry[0].SalesOfficer,
                                })
                            }} style={{ width: "74%", height: "20px" }}>
                                <option selected disabled>Select Entity</option>
                                {CompanyData.map((el, index) => {
                                    return <option key={index}>{el.CompanyName}</option>
                                })}
                            </select>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Company Name</label>
                            <input value={invoiceData.CompanyName} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData, CompanyName: e.target.value
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Enity Name'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Street Address</label>
                            <input value={invoiceData.CompanyAddress} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData, CompanyAddress: e.target.value
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Address'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Locality / Area</label>
                            <input value={invoiceData.CompanyLocality} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData, CompanyLocality: e.target.value
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Locality / Area'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>City, State, PIN</label>
                            <input value={invoiceData.CityStatePIN} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData, CityStatePIN: e.target.value
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='City, State, PIN'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Contact No.</label>
                            <input value={invoiceData.CompanyContactNo} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData, CompanyContactNo: e.target.value
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Contact No.'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>E-mail</label>
                            <input value={invoiceData.CompanyEmail} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData, CompanyEmail: e.target.value
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='E-mail'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>GSTIN</label>
                            <input value={invoiceData.CompanyGST} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData, CompanyGST: e.target.value
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='GSTIN'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Sales Officer</label>
                            <input value={invoiceData.SalesOfficer} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData, SalesOfficer: e.target.value
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Sales Officer'></input>
                        </div>
                    </div>


                    <div style={{ marginTop: "15px", width: "100%", display: "flex", "justifyContent": "center" }}>
                        <button style={{ border: "0.1px solid lightgray", padding: "5px", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }} onClick={goToNextStep}>Next <GrCaretNext /></button>
                    </div>
                </div>
            )
            }
            {currentStep === 2 && (
                <div>
                    <div style={{ borderRadius: "10px", width: "28%", border: "0px solid red", margin: "auto", height: "30px", display: "flex", justifyContent: "center", boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", marginBottom: "15px" }}>
                        <input onChange={(e) => {
                            SearchCostomer(e.target.value)
                        }} className='search_coustomer' style={{ borderRight: "none", borderTop: "none", borderLeft: "none", borderBottom: "2px solid lightgray", marginRight: "20px", width: "90%" }} placeholder='Search Coustomer By Name' />
                        {/* <button style={{ width: "50px", border: "none", backgroundColor: "white" }}><MdOutlinePersonSearch style={{ margin: "auto", fontSize: "20px" }} /></button> */}
                    </div>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", width: "55%", border: "0px solid black", margin: "auto", borderRadius: "10px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", marginBottom: "30px" }}>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Name</label>
                            <input value={invoiceData.customer.CustomerName} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData,
                                    customer: {
                                        ...invoiceData.customer,
                                        CustomerName: e.target.value
                                    }
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Name'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Billing Address</label>
                            <input onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData,
                                    customer: {
                                        ...invoiceData.customer,
                                        CustomerAddress: e.target.value
                                    }
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Billing Address'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Shipping Address</label>
                            <input onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData,
                                    customer: {
                                        ...invoiceData.customer,
                                        ShippingAddress: e.target.value
                                    }
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Shipping Address'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>E-mail</label>
                            <input value={invoiceData.customer.CustomerEmail} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData,
                                    customer: {
                                        ...invoiceData.customer,
                                        CustomerEmail: e.target.value
                                    }
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='E-mail'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Phone</label>
                            <input value={invoiceData.customer.CustomerPhone} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData,
                                    customer: {
                                        ...invoiceData.customer,
                                        CustomerPhone: e.target.value
                                    }
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Phone'></input>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>GSTIN</label>
                            <input value={invoiceData.customer.CustomerGSTIN} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData,
                                    customer: {
                                        ...invoiceData.customer,
                                        CustomerGSTIN: e.target.value
                                    }
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='GSTIN'></input>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Counrty</label>
                            <input value={invoiceData.customer.CustomerCounrty} onInput={(e) => {
                                setInvoiceData({
                                    ...invoiceData,
                                    customer: {
                                        ...invoiceData.customer,
                                        CustomerCounrty: e.target.value
                                    }
                                })
                            }} style={{ width: "73%", height: "20px" }} placeholder='Counrty'></input>
                        </div>
                    </div>

                    <div style={{ width: "61%", margin: "auto" }}>
                        {serachedArr.length !== 0 && <table className="item-table">
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th>Purchase Officer</th>
                                    <th>E-mail</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serachedArr.map((ele, index) => (
                                    <tr title="Add Purchas Officer to Quote!!" onClick={() => {
                                        setInvoiceData({
                                            ...invoiceData, PurchaseOfficer: {
                                                Name: ele.Name,
                                                Email: ele.Email,
                                                ContactNumber: ele.ContactNumber
                                            }
                                        })
                                        toast.success(`Purchase Officer:${ele.Name} is added to Quote successfuly!!`)

                                    }} style={{ cursor: "pointer" }}>
                                        <td>{index + 1}</td>
                                        <td>{ele.Name}</td>
                                        <td>{ele.Email}</td>
                                        <td>{ele.ContactNumber}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                    </div>
                    <div style={{ marginTop: "15px", width: "100%", display: "flex", "justifyContent": "center" }}>
                        <button style={{ border: "0.1px solid lightgray", padding: "5px", borderRadius: "5px", marginRight: "20px", boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }} onClick={goToPreviousStep}>Previous <GrCaretPrevious /></button>
                        <button style={{ border: "0.1px solid lightgray", padding: "5px", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }} onClick={goToNextStep}>Next <GrCaretNext /></button>

                    </div>
                </div>
            )
            }
            {
                currentStep === 3 && (
                    <div>
                        <div style={{ borderRadius: "10px", width: "28%", border: "0px solid red", margin: "auto", height: "30px", display: "flex", justifyContent: "center", boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", marginBottom: "15px" }}>
                            <input onChange={(e) => {
                                SearchItem(e.target.value)
                            }} className='search_coustomer' style={{ borderRight: "none", borderTop: "none", borderLeft: "none", borderBottom: "2px solid lightgray", marginRight: "20px", width: "90%" }} placeholder='Search Item By Name/Description' />
                            {/* <button style={{ width: "50px", border: "none", backgroundColor: "white" }}><MdOutlinePersonSearch style={{ margin: "auto", fontSize: "20px" }} /></button> */}
                        </div>
                        <div style={{ padding: "10px", display: "flex", flexDirection: "column", width: "35%", border: "0px solid black", margin: "auto", borderRadius: "10px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px", marginBottom: "20px" }}>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <label>Description</label>
                                <input value={invoiceItem.Description} onInput={(e) => {
                                    setinvoiceItem({ ...invoiceItem, Description: e.target.value })
                                }} style={{ width: "73%", height: "20px" }} placeholder='Description'></input>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <label>CAT No</label>
                                <input value={invoiceItem.CATNo} onInput={(e) => {
                                    setinvoiceItem({ ...invoiceItem, CATNo: e.target.value })
                                }} style={{ width: "73%", height: "20px" }} placeholder='CAT No'></input>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <label>HSN</label>
                                <input value={invoiceItem.HSN} onInput={(e) => {
                                    setinvoiceItem({ ...invoiceItem, HSN: e.target.value })
                                }} style={{ width: "73%", height: "20px" }} placeholder='HSN'></input>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <label>Qty</label>
                                <input value={invoiceItem.Qty} onInput={(e) => {
                                    setinvoiceItem({ ...invoiceItem, Qty: e.target.value })
                                }} type='number' style={{ width: "73%", height: "20px" }} placeholder='Qty'></input>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <label>UOM</label>
                                <input value={invoiceItem.UOM} onInput={(e) => {
                                    setinvoiceItem({ ...invoiceItem, UOM: e.target.value })
                                }} style={{ width: "73%", height: "20px" }} placeholder='UOM'></input>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <label>Item
                                    Rate ₹</label>
                                <input value={invoiceItem.ItemRate} onInput={(e) => {
                                    setinvoiceItem({ ...invoiceItem, ItemRate: e.target.value })
                                }} type='number' style={{ width: "73%", height: "20px" }} placeholder='Item
                                Rate'></input>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <label>Tax</label>
                                <input type='number' value={invoiceItem.Tax} onInput={(e) => {

                                    setinvoiceItem({ ...invoiceItem, Tax: e.target.value })
                                }} style={{ width: "73%", height: "20px" }} placeholder='Tax%'></input>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <label>Amount ₹</label>
                                <input value={invoiceItem.Amount} onClick={(e) => {
                                    setinvoiceItem({ ...invoiceItem, Amount: calculateTotalAmount(invoiceItem.ItemRate, invoiceItem.Qty, invoiceItem.Tax) })
                                }} style={{ width: "73%", height: "20px" }} placeholder='Amount ₹'></input>
                            </div>
                            <div style={{ width: "100%", margin: "auto", border: "0px solid red", display: "flex", justifyContent: "end" }}><button style={{ padding: "5px", borderRadius: "5px", border: "1px solid transparent", backgroundColor: "lightgray" }} onClick={() => {
                                setinvoiceItem({ ...invoiceItem, Amount: calculateTotalAmount(invoiceItem.ItemRate, invoiceItem.Qty, invoiceItem.Tax) })
                            }}>Calculate Amount</button></div>
                            <div style={{ display: "flex", justifyContent: "end", marginBottom: "10px", marginTop: "15px" }}>
                                <button disabled={invoiceItem.Amount === ""} onClick={() => {
                                    if (Object.values(invoiceItem).every(value => {
                                        return value === ""
                                    })) {
                                        toast.warn("Fill all fields before add to table!!")
                                    } else {
                                        setinvoiceItem({
                                            ...invoiceItem,
                                            "SNo": '',
                                            "Description": "",
                                            "CATNo": "",
                                            "HSN": "",
                                            "Qty": "",
                                            "UOM": "",
                                            "ItemRate": "",
                                            "Tax": "",
                                            "Amount": ""
                                        })
                                        setInvoiceData({ ...invoiceData, items: [...invoiceData.items, invoiceItem] })
                                        toast.success("Your row is added successfuly!!")
                                    }


                                }

                                } style={{ padding: "5px", borderRadius: "5px", border: "1px solid transparent", backgroundColor: "lightgreen" }}>Add Item to Table <GrTableAdd /></button>
                            </div>
                        </div>
                        <div style={{ width: "38%", margin: "auto" }}>
                            {
                                SearchedItemArr.length !== 0 && <table className="item-table">
                                    <thead>
                                        <tr>
                                            <th>S No</th>
                                            <th>Description</th>
                                            <th>CAT No</th>
                                            <th>HSN</th>
                                            <th>Qty</th>
                                            <th>UOM</th>
                                            <th>Item
                                                Rate ₹</th>
                                            <th>Tax</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SearchedItemArr.map((item, index) => (
                                            <tr onClick={() => {
                                                setinvoiceItem({
                                                    ...invoiceItem, "Description": item.Description,
                                                    "CATNo": item.CATNo,
                                                    "HSN": item.HSN,
                                                    "Qty": item.Qty,
                                                    "UOM": item.UOM,
                                                    "ItemRate": item.ItemRate,
                                                    "Tax": item.Tax
                                                })
                                            }} style={{ cursor: "pointer" }} title='Click to fill above!!' key={index}>
                                                <td>{index + 1}</td>
                                                <td style={{ fontSize: "x-small" }}>{item.Description}</td>
                                                <td>{item.CATNo}</td>
                                                <td>{item.HSN}</td>
                                                <td>{item.Qty}</td>
                                                <td>{item.UOM}</td>
                                                <td>{item.ItemRate}</td>
                                                <td>{item.Tax}</td>

                                            </tr>
                                        ))}


                                    </tbody>
                                </table>
                            }
                        </div>
                        <div style={{ marginTop: "15px", width: "100%", display: "flex", "justifyContent": "center" }}>
                            <button style={{ border: "0.1px solid lightgray", padding: "5px", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }} onClick={goToPreviousStep}>Previous <GrCaretPrevious /></button>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default InvoiceFrom