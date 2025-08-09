import { Button, Switch } from "@mui/material";
import React, { useState } from "react";
import Paypal from "../assets/images/paypal.png";
import Card from "../assets/images/card.png";
import EPS from "../assets/images/eps.png";
import Banks from "../assets/images/banks.png";
import { usePaymentInputs } from "react-payment-inputs";
import { FaCcStripe } from "react-icons/fa";

export default function PaymentPage() {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const {
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    wrapperProps,
    getCardImageProps,
  } = usePaymentInputs();
  const [activeTab, setActiveTab] = useState("Paypal");
  const [country, setCountry] = useState("US");
  const [postalCode, setPostalCode] = useState("");

  const handleSwitchTabs = (name) => {
    console.log(name);
    setActiveTab(name);
  };

  return (
    <section className="main_wrapper">
      <div className="container-fluid ps-5 pe-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
              <h1>Payment</h1>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="payment-method-wrapper bg-white px-3 py-3 mb-5 rounded-1">
              <h5 className="fw-bold mb-3">Payment Method</h5>

              <div className="connection-btn-wrap mb-3">
                <Button
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    px: 2,
                    py: 2,
                  }}
                  className="me-2 rounded-3 
                      payment-active-btn"
                >
                  <div className="payment-mode-wrapper">
                    <FaCcStripe className="stripe-icon" />
                    Stripe
                  </div>
                </Button>
                {/* {[
                  { name: "Paypal", img: Paypal },
                  { name: "Card", img: Card },
                  { name: "EPS", img: EPS },
                ].map((tab, index) => (
                  <Button
                    key={index}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      px: 2,
                      py: 2,
                    }}
                    className={`me-2 payment-method-btns ${
                      activeTab == tab.name ? "payment-active-btn" : ""
                    }`}
                    name={tab.name}
                    onClick={() => handleSwitchTabs(tab.name)}
                  >
                    <div className="payment-mode-wrapper">
                      <img src={tab.img} alt="" />
                      {tab.name}
                    </div>
                  </Button>
                ))}
                <Button className="payment-mode-expand">...</Button> */}
              </div>

              {/* {activeTab == "Paypal" && (
                <>
                  <div className="mb-3 payment-field-wrapper">
                    <label className="form-label fw-600 fs-14">
                      Card Number
                    </label>
                    <div
                      className="d-flex align-items-center payment-border rounded p-2"
                      {...wrapperProps}
                    >
                      <input
                        {...getCardNumberProps({
                          placeholder: "1234 1234 1234 1234",
                        })}
                        className="form-control border-0"
                        style={{ flex: 1, fontSize: "16px" }}
                      />
                      <img src={Banks} alt="" />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-600 fs-14">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="form-control payment-border"
                        placeholder="MM/YY"
                        {...getExpiryDateProps()}
                        maxLength="7"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-600 fs-14">CVC</label>
                      <input
                        type="text"
                        className="form-control payment-border"
                        placeholder="CVC"
                        {...getCVCProps()}
                        maxLength="4"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-600 fs-14">Country</label>
                      <select
                        className="form-select payment-border"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="IE">Ireland</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-600 fs-14">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className="form-control payment-border"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group d-flex align-items-center ">
                      <Switch {...label} size="small" className="me-2" />
                      <label htmlFor="" className="fw-500">
                        Save information to pay faster next time
                      </label>
                    </div>
                  </div>
                </>
              )} */}

              <div className="mb-3 payment-field-wrapper">
                <label className="form-label fw-600 fs-14">Card Number</label>
                <div
                  className="d-flex align-items-center payment-border rounded p-2"
                  {...wrapperProps}
                >
                  <input
                    {...getCardNumberProps({
                      placeholder: "1234 1234 1234 1234",
                    })}
                    className="form-control border-0"
                    style={{ flex: 1, fontSize: "16px" }}
                  />
                  <img src={Banks} alt="" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-600 fs-14">Expiry Date</label>
                  <input
                    type="text"
                    className="form-control payment-border"
                    placeholder="MM/YY"
                    {...getExpiryDateProps()}
                    maxLength="7"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-600 fs-14">CVC</label>
                  <input
                    type="text"
                    className="form-control payment-border"
                    placeholder="CVC"
                    {...getCVCProps()}
                    maxLength="4"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-600 fs-14">Country</label>
                  <select
                    className="form-select payment-border"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="IE">Ireland</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-600 fs-14">Postal Code</label>
                  <input
                    type="text"
                    className="form-control payment-border"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group d-flex align-items-center ">
                  <Switch {...label} size="small" className="me-2" />
                  <label htmlFor="" className="fw-500">
                    Save information to pay faster next time
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="payment-method-wrapper bg-white px-3 py-3 mb-5 rounded-1">
              <h5 className="fw-bold mb-3">Payment Summary</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
