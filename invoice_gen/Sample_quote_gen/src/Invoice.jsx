import React from 'react';
import './Invoice.css'; // Import your CSS file for styling

const Invoice = React.forwardRef(({ logo, header, customer, items, isLastPage, invoiceData }, ref) => {
    const calculateTotal = () => {
        return formatAmount(invoiceData.items.reduce((total, item) => total + item.Amount, 0));
    };
    const calculateTotalQty = () => {
        return invoiceData.items.reduce((total, item) => total + Number(item.Qty), 0);
    };
    function calculateTotalWithTax(taxRate) {
        const subtotal = invoiceData.items.reduce((total, item) => total + item.Amount, 0)
        const totalAmt = subtotal + (subtotal * taxRate / 100)
        return Math.floor(totalAmt);
    }

    function formatAmount(amount) {
        return amount.toLocaleString('en-IN');
    }

    function calculateTaxFromTotal(taxRate) {
        const sub = invoiceData.items.reduce((total, item) => total + item.Amount, 0)
        const txAmt = (sub * taxRate / 100)
        return formatAmount(txAmt);
    }


    function number2text(value) {
        var fraction = Math.round(value % 1 * 100);
        var f_text = "";

        if (fraction > 0) {
            f_text = "AND " + convert_number(fraction) + " PAISE";
        }

        return convert_number(value) + " RUPEE " + f_text + " ONLY";

        function frac(f) {
            return f % 1;
        }

        function convert_number(number) {
            if ((number < 0) || (number > 999999999)) {
                return "NUMBER OUT OF RANGE";
            }
            var Gn = Math.floor(number / 10000000);  /* Crore */
            number -= Gn * 10000000;
            var kn = Math.floor(number / 100000);     /* lakhs */
            number -= kn * 100000;
            var Hn = Math.floor(number / 1000);      /* thousand */
            number -= Hn * 1000;
            var Dn = Math.floor(number / 100);       /* Tens (deca) */
            number = number % 100;               /* Ones */
            var tn = Math.floor(number / 10);
            var one = Math.floor(number % 10);
            var res = "";

            if (Gn > 0) {
                res += (convert_number(Gn) + " CRORE");
            }
            if (kn > 0) {
                res += (((res == "") ? "" : " ") + convert_number(kn) + " LAKH");
            }
            if (Hn > 0) {
                res += (((res == "") ? "" : " ") + convert_number(Hn) + " THOUSAND");
            }

            if (Dn) {
                res += (((res == "") ? "" : " ") + convert_number(Dn) + " HUNDRED");
            }

            var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN");
            var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY");

            if (tn > 0 || one > 0) {
                if (!(res == "")) {
                    res += " AND ";
                }
                if (tn < 2) {
                    res += ones[tn * 10 + one];
                } else {
                    res += tens[tn];
                    if (one > 0) {
                        res += ("-" + ones[one]);
                    }
                }
            }

            if (res == "") {
                res = "zero";
            }
            return res;
        }
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getRandomDateDDMMYYYY() {
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var currentYear = currentDate.getFullYear();
        var randomDay = getRandomNumber(1, getDaysInMonth(currentMonth, currentYear));

        var day = randomDay < 10 ? '0' + randomDay : randomDay;
        var month = (currentMonth + 1) < 10 ? '0' + (currentMonth + 1) : (currentMonth + 1);
        var year = currentYear;

        return day + '/' + month + '/' + year;
    }

    function getRandomQuotationNumber() {
        var randomNumber = getRandomNumber(10000000, 99999999); // Generating a random 8-digit number
        return "QU-" + randomNumber;
    }


    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
        <div ref={ref} className="invoice">
            <div className="header">
                <div className='top_gst_line'>
                    <span>GSTIN : {invoiceData.CompanyGST} </span>
                    <span>Estimate / Quotation</span>
                    <span>Original For Recipient</span>
                </div>
                <div className='logo_and_text'>
                    <div>
                        <img width="140px" src={process.env.PUBLIC_URL + "AMEC-original-logo-01.png"} alt='' />
                    </div>
                    <div className="centered-text">
                        <p>{invoiceData.CompanyName}</p>
                        <p style={{ width: "100%", whiteSpace: "preserve-breaks" }}>{invoiceData.CompanyAddress}</p>
                        <p>{invoiceData.CompanyLocality}</p>
                        <p>{invoiceData.CityStatePIN}</p>
                        <p>{invoiceData.CompanyContactNo} | {invoiceData.CompanyEmail}</p>

                    </div>
                </div>
            </div>
            <div className="customer-details">
                <table style={{ border: "1px solid lightgray" }} className="item-table">
                    <thead>
                        <tr>
                            <th style={{ border: "none", fontSize: "13px", padding: "3px" }} colSpan="5">Quotation No. : {getRandomQuotationNumber()}</th>
                            <th style={{ border: "none", fontSize: "13px", padding: "3px" }} colSpan="5">Quotation Date : {getRandomDateDDMMYYYY()}</th>
                        </tr>
                    </thead>
                    <thead style={{ marginTop: "0px" }}>
                        <tr>
                            <th style={{ border: "none", fontSize: "12px", backgroundColor: "white", fontWeight: "normal", padding: "2px" }} colSpan="5">Payment Term: 100% PAYMENT AGAINST PI</th>
                            <th style={{ border: "none", fontSize: "12px", backgroundColor: "white", fontWeight: "normal", padding: "2px" }} colSpan="5">Delivery Date: {getRandomDateDDMMYYYY()}</th>
                        </tr>
                    </thead>
                    <thead style={{ marginTop: "0px" }}>
                        <tr>
                            <th style={{ fontSize: "12px", backgroundColor: "white", padding: "1px" }} colSpan="5">Name & Address : Customer</th>
                            <th style={{ fontSize: "12px", backgroundColor: "white", padding: "1px" }} colSpan="5">Shipping Address</th>
                        </tr>
                    </thead>
                    <thead style={{ marginTop: "0px" }}>
                        <tr>
                            <th style={{ border: "none", fontSize: "12px", backgroundColor: "white", padding: "1px" }} colSpan="5">{`${customer.CustomerName}`}</th>
                            <th style={{ border: "none", fontSize: "12px", backgroundColor: "white", padding: "1px" }} colSpan="5">{`${customer.CustomerName}`}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: "none", fontSize: "12px", textAlign: "left" }} colSpan="5">
                                <span >
                                    {`${customer.CustomerAddress}`}
                                </span><br></br>
                                <span style={{ marginTop: "5px" }}>GSTIN / UIN : {`${customer.CustomerGSTIN}`}</span><br></br>
                                <span style={{ marginTop: "5px" }}>Phone : {`${customer.CustomerPhone}`}</span><br></br>
                                <span style={{ marginTop: "5px" }}>Email : {`${customer.CustomerEmail}`}</span><br></br>

                            </td>
                            <td style={{ border: "none", fontSize: "12px", textAlign: "left" }} colSpan="5">
                                <span >
                                    {`${customer.ShippingAddress}`}
                                </span><br></br>
                                <span style={{ marginTop: "5px" }}>Phone : {`${customer.CustomerPhone}`}</span><br></br>
                                <span style={{ marginTop: "5px" }}>Email : {`${customer.CustomerEmail}`}</span><br></br>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="item-table">
                    <thead>
                        <tr>
                            <th style={{ fontSize: "x-small" }}>Sales Officer</th>
                            <th>Email</th>
                            <th>Contact No</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td style={{ fontSize: "x-small" }}>{invoiceData.SalesOfficer}</td>
                            <td></td>
                            <td></td>
                        </tr>


                    </tbody>
                </table>
                <table className="item-table">
                    <thead>
                        <tr>
                            <th style={{ fontSize: "x-small" }}>Purchase Officer</th>
                            <th>Email</th>
                            <th>Contact No</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontSize: "x-small" }}>{invoiceData.PurchaseOfficer.Name}</td>
                            <td>{invoiceData.PurchaseOfficer.Email}</td>
                            <td>{invoiceData.PurchaseOfficer.ContactNumber}</td>
                        </tr>


                    </tbody>
                </table>
            </div>
            <table className="item-table">
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
                        <th>Amount ₹
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{ fontSize: "x-small" }}>{item.Description}</td>
                            <td>{item.CATNo}</td>
                            <td>{item.HSN}</td>
                            <td>{item.Qty}</td>
                            <td>{item.UOM}</td>
                            <td>{"₹" + item.ItemRate}</td>
                            <td>{item.Tax + "%"}</td>
                            <td>{"₹" + item.Amount}</td>
                        </tr>
                    ))}

                    {isLastPage && (
                        <tr>
                            <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                Total:
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>

                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>

                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>

                            </td>
                            <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                {calculateTotalQty()}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>

                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>

                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>

                            </td>
                            <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                {"₹" + calculateTotal()}
                            </td>

                        </tr>
                    )}
                </tbody>
            </table>
            {
                isLastPage && <>
                    <div className='total_amt_div'>
                        <div className='total_amt_left_div'>
                            <table className="total_tax_table">
                                <thead>
                                    <tr>
                                        <th>Tax Rate</th>
                                        <th>Taxable Value</th>
                                        <th>Total Tax Amount</th>
                                        <th>Round Off</th>
                                        <th>Total Amount Payable</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td>TAX @ 18%</td>
                                        <td>{"₹" + calculateTotal()}</td>
                                        <td>{"₹" + calculateTaxFromTotal(18)}</td>
                                        <td>-0.06</td>
                                        <td>{"₹" + calculateTotalWithTax(18)}</td>
                                    </tr>

                                    <tr>
                                        <td>Amt in word</td>
                                        <td colSpan="6">{number2text(calculateTotalWithTax(18))}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div className='total_amt_div'>
                        <div className='total_amt_left_div'>
                            <table className="total_tax_table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "center" }} colSpan="6">Bank Details</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td>Bank Name</td>
                                        <td colSpan="6">HDFC BANK LTD</td>
                                    </tr>
                                    <tr>
                                        <td>Account No</td>
                                        <td colSpan="6">59200000001010</td>
                                    </tr>
                                    <tr>
                                        <td>IFSC Code</td>
                                        <td colSpan="6">HDFC0001468</td>
                                    </tr>
                                    <tr>
                                        <td>Branch Address</td>
                                        <td colSpan="6">J.K. Plaza , Gast Ka Tazia , Lashkar , Gwalior , ( M.P ) - 474001</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            }
            <div className='footer'>
                <div>
                    <div className='term_conditon'>
                        <h4>Terms and Conditions:</h4>
                        <p className='term_conditon_text'>FREIGHT: FOR AT SITE ( KEI Policy for FOR Delivery is 20 Lacks + GST Extra )
                        </p>
                        <p className='term_conditon_text' >VALIDITY::2 DAYS OR ANY CHANGE IN PRICE LIST.</p>
                        <p className='term_conditon_text'>TOLERANCE::+/- 5 %</p>
                        <p className='term_conditon_text'>UNLOADING::CLIENT SCOPE
                        </p>
                    </div>
                    <div className='Qr_details'>
                        <h4>scan QRCode for Payment:</h4>
                        <img height="100px" width="100px" src='https://th.bing.com/th/id/OIP.-lQ3zH3uus3kN7QEpaj6zQHaHa?rs=1&pid=ImgDetMain' />
                    </div>
                </div>
                <div className='term_conditon_right' >
                    <h4>For AMEC GLOBAL</h4>
                    <img height="100px" width="100px" src='https://cdn1.vectorstock.com/i/1000x1000/51/45/grunge-blue-signature-word-round-rubber-seal-vector-28025145.jpg' />
                    <h4>Authorised Signatory</h4>
                </div>
            </div>
        </div>
    );
});

export default Invoice;
