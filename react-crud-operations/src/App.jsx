import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import RegisterUser from './components/RegisterUser/RegisterUser';
import UserLogin from './components/UserLogin/Login';
import RegisterBusOperator from './components/RegisterBusOperator/RegisterBusOperator';
import FromAndTo from './components/FromandTo/FromandTo';
import BusDetails from './components/BusDetails/BusDetails';
import { Provider } from 'react-redux';
import store from './components/Redux/Store';
import Bus from './components/Bus/Bus'
import SeatingArrangement from './components/SeatingArrangement/SeatingArrangement';
import Payment from './components/Payment/Payment';
import PaymentSuccess from './components/PaymentSuccess/PaymentSuccess'
import BookingHistory from './components/BookingHistory/BookingHistory';
import AddBus from './components/AddBus/AddBus'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/registerBusOperator" element={<RegisterBusOperator />} />
          <Route path="/fromAndTo" element={<FromAndTo />} />
          <Route path="/busDetails" element={<BusDetails />} />
          <Route path="/bus-list" element={<Bus />} />
          <Route path="/seating/:busId" element={<SeatingArrangement />} />
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/paymentsuccess" element={<PaymentSuccess/>}/> 
          <Route path="/bookinghistory" element={<BookingHistory/>}/>
          <Route path="/addbus" element={<AddBus/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
