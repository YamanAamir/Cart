import { renderToString } from "react-dom/server"

export const categories = [
  {
    id: 1,
    name: "Mobiles",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M12 18H12.01M9.2 21H14.8C15.9201 21 16.4802 21 16.908 20.782C17.2843 20.5903 17.5903 20.2843 17.782 19.908C18 19.4802 18 18.9201 18 17.8V6.2C18 5.0799 18 4.51984 17.782 4.09202C17.5903 3.71569 17.2843 3.40973 16.908 3.21799C16.4802 3 15.9201 3 14.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V17.8C6 18.9201 6 19.4802 6.21799 19.908C6.40973 20.2843 6.71569 20.5903 7.09202 20.782C7.51984 21 8.07989 21 9.2 21Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 2,
    name: "Laptops",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M21 16V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.07989 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.0799 3 7.2V16M2 16H22V16.8C22 17.9201 22 18.4802 21.782 18.908C21.5903 19.2843 21.2843 19.5903 20.908 19.782C20.4802 20 19.9201 20 18.8 20H5.2C4.0799 20 3.51984 20 3.09202 19.782C2.71569 19.5903 2.40973 19.2843 2.21799 18.908C2 18.4802 2 17.9201 2 16.8V16Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 3,
    name: "Led Tv",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M20 3H4C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15V5C22 3.89543 21.1046 3 20 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M8 21H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M12 17V21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <circle cx="19" cy="6" r="1" fill="currentColor"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 4,
    name: "Refrigerator",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M4 10H20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M7 6V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M7 14V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 5,
    name: "Washing Machine",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="13" r="5" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="8" cy="7" r="1" fill="currentColor"></circle> <circle cx="16" cy="7" r="1" fill="currentColor"></circle>{" "}
          <path d="M10 11C10.5 12 11.5 13 12.5 12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 6,
    name: "Air Conditioner",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 4H20C21.1046 4 22 4.89543 22 6V10C22 11.1046 21.1046 12 20 12H4C2.89543 12 2 11.1046 2 10V6C2 4.89543 2.89543 4 4 4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M7 16V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M12 16V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M17 16V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <circle cx="6" cy="8" r="1" fill="currentColor"></circle>{" "}
          <path d="M5 16L9 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M11 16L15 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M17 16L21 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 7,
    name: "Small Appliances",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M16 13H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M16 17H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <circle cx="10" cy="9" r="1" fill="currentColor"></circle> <circle
            cx="8"
            cy="9"
            r="1"
            fill="currentColor"
          ></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 8,
    name: "Microwave Oven",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 6H20C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V8C2 6.89543 2.89543 6 4 6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M5 8H15C15.5523 8 16 8.44772 16 9V15C16 15.5523 15.5523 16 15 16H5C4.44772 16 4 15.5523 4 15V9C4 8.44772 4.44772 8 5 8Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="19" cy="10" r="1" fill="currentColor"></circle> <circle cx="19" cy="14" r="1" fill="currentColor"></circle>{" "}
          <path d="M6 12H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 9,
    name: "Water Dispenser",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M8 2H16C17.1046 2 18 2.89543 18 4V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V4C6 2.89543 6.89543 2 8 2Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path
            d="M10 14H14C14.5523 14 15 14.4477 15 15V16C15 16.5523 14.5523 17 14 17H10C9.44772 17 9 16.5523 9 16V15C9 14.4477 9.44772 14 10 14Z"
            stroke="currentColor"
            strokeWidth="1"
          ></path>{" "}
          <path d="M8 18H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 14V12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 10,
    name: "Fans",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M12 1V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 17V23" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M4.22 4.22L8.93 8.93" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M15.07 15.07L19.78 19.78" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M1 12H7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M17 12H23" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M4.22 19.78L8.93 15.07" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M15.07 8.93L19.78 4.22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 11,
    name: "Bikes",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="18.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="5.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="15" cy="5" r="1" fill="currentColor"></circle>{" "}
          <path d="M14 17L20 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6 17L11 12L16 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path
            d="M16 5L19 8L21 6"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M11 12H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 12,
    name: "Deep Freezer",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M2 12H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6 8V10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6 14V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M2 4H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <rect x="18" y="6" width="2" height="2" fill="currentColor"></rect>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 13,
    name: "Batteries",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M3 6H19C20.1046 6 21 6.89543 21 8V16C21 17.1046 20.1046 18 19 18H3C1.89543 18 1 17.1046 1 16V8C1 6.89543 1.89543 6 3 6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M22 11V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6 11V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 11V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M14 11V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <rect x="4" y="9" width="2" height="6" fill="currentColor"></rect>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 14,
    name: "Mattress",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 8H20C21.1046 8 22 8.89543 22 10V14C22 15.1046 21.1046 16 20 16H4C2.89543 16 2 15.1046 2 14V10C2 8.89543 2.89543 8 4 8Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M6 12H18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 10V14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M14 10V14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 15,
    name: "Tyres",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="12" cy="12" r="2" fill="currentColor"></circle>{" "}
          <path d="M12 2V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 18V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M2 12H6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M18 12H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 16,
    name: "Smart Watches",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M8 7H16C17.1046 7 18 7.89543 18 9V15C18 16.1046 17.1046 17 16 17H8C6.89543 17 6 16.1046 6 15V9C6 7.89543 6.89543 7 8 7Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M9 22L12 19L15 22"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M9 2L12 5L15 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 17,
    name: "Tablet",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="18" r="1" fill="currentColor"></circle>{" "}
          <path
            d="M6 4H18V16H6V4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 18,
    name: "Solar",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M12 2V4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 20V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M2 12H4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M20 12H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="12" cy="12" r="1" fill="currentColor"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 19,
    name: "Fashion",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M20.38 3.46L16 2C16 3.1 15.1 4 14 4H10C8.9 4 8 3.1 8 2L3.62 3.46C2.84 3.69 2.31 4.5 2.46 5.31L3.04 8.78C3.15 9.4 3.69 9.84 4.32 9.84H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9.84H19.68C20.31 9.84 20.85 9.4 20.96 8.78L21.54 5.31C21.69 4.5 21.16 3.69 20.38 3.46Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M8 12H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 20,
    name: "Shoes",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M2 18H3.4C4.7 18 5.9 17.4 6.7 16.3L12.8 7.7C13.5 6.6 14.8 6 16.1 6H22"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M6 14L7.9 11.3C8.2 10.9 8.6 10.7 9 10.7C9.6 10.7 10.2 10.8 10.6 11.5L12.5 13.8C13.3 14.8 14.6 15.2 15.7 15L18.9 14.3"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M12 16L15 15L16 18"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 21,
    name: "Books",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M6.5 2C5.12 2 4 3.12 4 4.5V19.5C4 20.88 5.12 22 6.5 22H20V2H6.5Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M4 19.5C4 18.12 5.12 17 6.5 17H20"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M8 6H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 10H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 14H12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 22,
    name: "Sports",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M12 2C17.5 7 17.5 17 12 22C6.5 17 6.5 7 12 2Z" stroke="currentColor" strokeWidth="1"></path>{" "}
          <path d="M2 12H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 2V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 23,
    name: "Home & Garden",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path d="M3 21H21" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path
            d="M5 21V7L13 3V21"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M19 21V11L13 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <circle cx="9" cy="9" r="1" fill="currentColor"></circle> <circle cx="9" cy="12" r="1" fill="currentColor"></circle>{" "}
          <circle cx="9" cy="15" r="1" fill="currentColor"></circle> <circle cx="9" cy="18" r="1" fill="currentColor"></circle>{" "}
          <path d="M16 14H17V15H16V14Z" fill="currentColor"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 24,
    name: "Beauty",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 3H8C9.1 3 10 3.9 10 5V21C10 21.6 9.4 22 8.8 22H3.2C2.6 22 2 21.6 2 21V5C2 3.9 2.9 3 4 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M20 3H16C14.9 3 14 3.9 14 5V21C14 21.6 14.6 22 15.2 22H20.8C21.4 22 22 21.6 22 21V5C22 3.9 21.1 3 20 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M6 8H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6 12H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 8H18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 12H18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 25,
    name: "Toys",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="12" cy="5" r="3" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="12" cy="19" r="3" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M8.5 8.5L15.5 15.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M15.5 8.5L8.5 15.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M7 12H17" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 26,
    name: "Automotive",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M19 17H21C21.6 17 22 16.6 22 16V13C22 12.1 21.3 11.3 20.5 11.1L18.4 10C18 9.2 17.2 8.7 16.3 8.7H7.7C6.8 8.7 6 9.2 5.6 10L3.5 11.1C2.7 11.3 2 12.1 2 13V16C2 16.6 2.4 17 3 17H5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M9 17H15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M6 13H18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="8" cy="11" r="1" fill="currentColor"></circle> <circle
            cx="16"
            cy="11"
            r="1"
            fill="currentColor"
          ></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 27,
    name: "Jewelry",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M6 3H18L22 9L12 22L2 9L6 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M11 3L8 9L12 22L16 9L13 3"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M2 9H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 9V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 28,
    name: "Cameras",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M14.5 4H9.5L7 7H4C2.9 7 2 7.9 2 9V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V9C22 7.9 21.1 7 20 7H17L14.5 4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="18" cy="9" r="1" fill="currentColor"></circle>{" "}
          <path d="M9 13C9 14.7 10.3 16 12 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 29,
    name: "Headphones",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M3 14H6C7.1 14 8 14.9 8 16V19C8 20.1 7.1 21 6 21H5C3.9 21 3 20.1 3 19V12C3 6.5 7.5 2 13 2S23 6.5 23 12V19C23 20.1 22.1 21 21 21H20C18.9 21 18 20.1 18 19V16C18 14.9 18.9 14 20 14H23"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M8 18H6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M20 18H18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 30,
    name: "Gaming",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 7H20C21.1 7 22 7.9 22 9V15C22 16.1 21.1 17 20 17H4C2.9 17 2 16.1 2 15V9C2 7.9 2.9 7 4 7Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="16" cy="11" r="1" fill="currentColor"></circle> <circle cx="18" cy="13" r="1" fill="currentColor"></circle>{" "}
          <path d="M6 15H10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 13V15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 31,
    name: "Tools",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M14.7 6.3C14.3 5.9 14.3 5.3 14.7 4.9L16.3 6.5C16.7 6.9 17.3 6.9 17.7 6.5L21.47 2.73C22.84 4.1 22.84 6.3 21.47 7.67L14.56 14.58C13.19 15.95 10.99 15.95 9.62 14.58L2.71 7.67C1.34 6.3 1.34 4.1 2.71 2.73L6.48 6.5C6.88 6.9 7.48 6.9 7.88 6.5L9.48 4.9C9.88 5.3 9.88 5.9 9.48 6.3L14.7 6.3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 32,
    name: "Furniture",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M3 20V12C3 10.9 3.9 10 5 10H19C20.1 10 21 10.9 21 12V20"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M5 10V6C5 4.9 5.9 4 7 4H17C18.1 4 19 4.9 19 6V10"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M3 18H21" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M7 14H17" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M5 20V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M19 20V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 33,
    name: "Electronics",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 3H20C21.1 3 22 3.9 22 5V15C22 16.1 21.1 17 20 17H4C2.9 17 2 16.1 2 15V5C2 3.9 2.9 3 4 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M8 21H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 17V21" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M14 9H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M14 13H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <rect x="6" y="7" width="4" height="4" stroke="currentColor" strokeWidth="1"></rect>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 34,
    name: "Kitchen",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M5 2V9C5 10.1 5.9 11 7 11H9C10.1 11 11 10.1 11 9V2"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M7 2V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path
            d="M21 15V2C21 4.8 18.8 7 16 7V13C16 14.1 16.9 15 18 15H21V22"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="5" cy="6" r="1" fill="currentColor"></circle> <circle cx="9" cy="6" r="1" fill="currentColor"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 35,
    name: "Food & Beverages",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M18 8H19C21.2 8 23 9.8 23 12S21.2 16 19 16H18"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M2 8H18V17C18 19.2 16.2 21 14 21H6C3.8 21 2 19.2 2 17V8Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M6 1V4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 1V4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M14 1V4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6 12H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 36,
    name: "Health & Medicine",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M22 12H20L17 21L9 3L6 12H2"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M12 8V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 12H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 37,
    name: "Pet Supplies",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="11" cy="4" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="18" cy="8" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="20" cy="16" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path
            d="M9 10C12.3 10 15 12.7 15 16V18.5C15 20.4 13.4 22 11.5 22C10.2 22 9.1 21.2 8.7 20.1L7.5 16.5C6.8 14.5 5.2 13 3.2 12.8C1.5 12.6 0.5 11.1 1.2 9.5C1.8 8.2 3.2 7.5 4.6 7.8L9 10Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 38,
    name: "Office Supplies",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M16 13H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 17H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="12" cy="15" r="1" fill="currentColor"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 39,
    name: "Travel & Luggage",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M5 6H19C20.1 6 21 6.9 21 8V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V8C3 6.9 3.9 6 5 6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M10 6V4C10 2.9 10.9 2 12 2H12C13.1 2 14 2.9 14 4V6"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M3 10H21" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="8" cy="14" r="1" fill="currentColor"></circle> <circle cx="16" cy="14" r="1" fill="currentColor"></circle>{" "}
          <path d="M7 19V21" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M17 19V21" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 40,
    name: "Music Instruments",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M9 18V5L21 3V16"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M9 9L21 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="6" cy="18" r="1" fill="currentColor"></circle> <circle
            cx="18"
            cy="16"
            r="1"
            fill="currentColor"
          ></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 41,
    name: "Art & Crafts",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M12 9V15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M9 12H15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 42,
    name: "Baby Products",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 3H8C9.1 3 10 3.9 10 5V21C10 21.6 9.4 22 8.8 22H3.2C2.6 22 2 21.6 2 21V5C2 3.9 2.9 3 4 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M20 3H16C14.9 3 14 3.9 14 5V21C14 21.6 14.6 22 15.2 22H20.8C21.4 22 22 21.6 22 21V5C22 3.9 21.1 3 20 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M10 12H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="12" cy="16" r="1" fill="currentColor"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 43,
    name: "Outdoor & Camping",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M3 20H21L12 5L3 20Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M12 15V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6 20H18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 17H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="12" cy="8" r="1" fill="currentColor"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 44,
    name: "Fitness Equipment",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path d="M6.5 6.5H17.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6.5 17.5H17.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6.5 12H17.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M3 6.5V17.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M21 6.5V17.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <rect x="1" y="5" width="4" height="3" stroke="currentColor" strokeWidth="1"></rect>{" "}
          <rect x="19" y="5" width="4" height="3" stroke="currentColor" strokeWidth="1"></rect>{" "}
          <rect x="1" y="16" width="4" height="3" stroke="currentColor" strokeWidth="1"></rect>{" "}
          <rect x="19" y="16" width="4" height="3" stroke="currentColor" strokeWidth="1"></rect>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 45,
    name: "Stationery",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M17 3C18.4 3 19.8 3.6 20.8 4.6C21.8 5.6 22.4 7 22.4 8.4C22.4 9.8 21.8 11.2 20.8 12.2L7.5 20.5L2 22L3.5 16.5L17 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M15 5L19 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="5" cy="19" r="1" fill="currentColor"></circle>{" "}
          <path d="M10 14L14 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 46,
    name: "Cleaning Supplies",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M15 9L9 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path
            d="M4 3H8C9.1 3 10 3.9 10 5V21C10 21.6 9.4 22 8.8 22H3.2C2.6 22 2 21.6 2 21V5C2 3.9 2.9 3 4 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M20 3H16C14.9 3 14 3.9 14 5V21C14 21.6 14.6 22 15.2 22H20.8C21.4 22 22 21.6 22 21V5C22 3.9 21.1 3 20 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="6" cy="8" r="1" fill="currentColor"></circle> <circle
            cx="18"
            cy="16"
            r="1"
            fill="currentColor"
          ></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 47,
    name: "Security & Safety",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M9 12L11 14L15 10"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 48,
    name: "Garden Tools",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path d="M7 20H17" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 20C15.5 17.5 10.8 13.6 13 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path
            d="M9.5 9.4C10.6 10.2 11.3 11.6 11.8 13.1C9.8 13.5 8.3 13.5 7 12.8C5.8 12.2 4.7 10.9 4 8.6C6.8 8.1 8.4 8.6 9.5 9.4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M14.1 6C14 7.3 13.9 8.6 14 10C15.9 9.9 17.3 9.3 18.3 8.6C19.3 7.5 19.9 5.9 20 4C17.3 4.1 16 5 14.1 6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="12" r="1" fill="currentColor"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 49,
    name: "Power Tools",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M18 3C19.7 3 21 4.3 21 6V18C21 19.7 19.7 21 18 21C16.3 21 15 19.7 15 18C15 16.3 16.3 15 18 15H6L3 12L6 9H18"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M6 9H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M6 15H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 50,
    name: "Computer Accessories",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M10 4V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M14 4V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 12V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M14 12V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <rect x="6" y="6" width="2" height="2" fill="currentColor"></rect>{" "}
          <rect x="16" y="6" width="2" height="2" fill="currentColor"></rect>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 51,
    name: "Groceries",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M8 4V2C8 1.4 8.4 1 9 1H15C15.6 1 16 1.4 16 2V4"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M5 4H19L18 11H6L5 4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M9 11V17" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M15 11V17" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M5 15H19" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="7" cy="20" r="1" fill="currentColor"></circle> <circle
            cx="17"
            cy="20"
            r="1"
            fill="currentColor"
          ></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 52,
    name: "Pharmacy",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M12 8V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 12H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 53,
    name: "Cosmetics",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="12" cy="12" r="2" fill="currentColor"></circle>{" "}
          <path d="M8 8L16 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 8L8 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 54,
    name: "Perfumes",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M10 6H14C15.1 6 16 6.9 16 8V18C16 19.1 15.1 20 14 20H10C8.9 20 8 19.1 8 18V8C8 6.9 8.9 6 10 6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M12 2V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 2H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M10 15H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 4V2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 55,
    name: "Watches",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          <path d="M8 2L10 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 2L14 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 22L10 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 22L14 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 56,
    name: "Sunglasses",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <circle cx="6" cy="15" r="4" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <circle cx="18" cy="15" r="4" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path
            d="M14 15C14 13.9 13.1 13 12 13S10 13.9 10 15"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          ></path>{" "}
          <path d="M2 15H2.01" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M22 15H21.99" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="6" cy="15" r="2" fill="currentColor"></circle> <circle
            cx="18"
            cy="15"
            r="2"
            fill="currentColor"
          ></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 57,
    name: "Bags & Backpacks",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M19 7H16V6C16 3.8 14.2 2 12 2S8 3.8 8 6V7H5C3.9 7 3 7.9 3 9V19C3 20.7 4.3 22 6 22H18C19.7 22 21 20.7 21 19V9C21 7.9 20.1 7 19 7ZM10 6C10 4.9 10.9 4 12 4S14 4.9 14 6V7H10V6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M8 11V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 11V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 58,
    name: "Mobile Accessories",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M7 2H17C18.1 2 19 2.9 19 4V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V4C5 2.9 5.9 2 7 2Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="6" r="1" fill="currentColor"></circle> <circle cx="12" cy="18" r="1" fill="currentColor"></circle>{" "}
          <path d="M8 10H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 14H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <rect x="9" y="8" width="6" height="8" stroke="currentColor" strokeWidth="1"></rect>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 59,
    name: "Video Games",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path d="M6 11H10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 9V13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="15" cy="12" r="1" fill="currentColor"></circle> <circle cx="18" cy="10" r="1" fill="currentColor"></circle>{" "}
          <path
            d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6 4 6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M6 18V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M18 18V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 60,
    name: "Movies & TV",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M8 4V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 4V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M2 8H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M2 16H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 10L14 12L10 14V10Z" fill="currentColor"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 61,
    name: "Lighting",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M15 14C15.2 13 15.7 12.3 16.5 11.5C17.5 10.6 18 9.3 18 8C18 4.7 15.3 2 12 2S6 4.7 6 8C6 9 6.2 10.2 7.5 11.5C8.3 12.2 8.8 12.9 9 14"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M9 18H15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 22H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M9 14H15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 62,
    name: "Textiles & Fabrics",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M21 8C21 6.9 20.1 6 19 6L12 2L5 6C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18L12 22L19 18C20.1 18 21 17.1 21 16V8Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M7.5 4.21V19.79" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16.5 4.21V19.79" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 22.08V12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 63,
    name: "Party Supplies",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M6 3H18L22 9L12 22L2 9L6 3Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M11 3L8 9L12 22L16 9L13 3"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M2 9H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="8" cy="6" r="1" fill="currentColor"></circle> <circle cx="16" cy="6" r="1" fill="currentColor"></circle>{" "}
          <circle cx="12" cy="15" r="1" fill="currentColor"></circle>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 64,
    name: "Gift Cards",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="7" cy="15" r="1" fill="currentColor"></circle>{" "}
          <path d="M11 15H13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <circle cx="17" cy="15" r="1" fill="currentColor"></circle>{" "}
          <path d="M6 8H18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M12 4V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 65,
    name: "Educational Materials",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M22 10V16M2 10L12 5L22 10L12 15L2 10Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path
            d="M6 12V17C9 20 15 20 18 17V12"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1"></circle>{" "}
          <path d="M8 8L16 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
        </g>
      </svg>,
    ),
  },
  {
    id: 66,
    name: "Industrial Equipment",
    icon: renderToString(
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M4 6H20C20.6 6 21 6.4 21 7V13C21 13.6 20.6 14 20 14H4C3.4 14 3 13.6 3 13V7C3 6.4 3.4 6 4 6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
          <path d="M17 14V21" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M7 14V21" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M17 3V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M7 3V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M10 14L2.3 6.3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M14 6L21.7 13.7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M8 6H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <path d="M16 10H18" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>{" "}
          <rect x="5" y="8" width="2" height="2" fill="currentColor"></rect>{" "}
        </g>
      </svg>,
    ),
  },
]
