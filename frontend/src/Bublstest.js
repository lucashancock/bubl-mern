import React from 'react';
import { Link } from 'react-router-dom';

function BublsTest({ items }) {
  return (
    <>
      {items.length === 0 ? (
        <>
        <p className="text-center m-3"> No bubls found! </p>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 m-3">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-3xl border flex items-center aspect-[3/4] drop-shadow-xl transition duration-300 transform hover:drop-shadow-lg">
              <div className="p-4">
                <strong>{item.name}</strong>
                <ul>
                  <li>Bubl Id: {item.bubl_id}</li>
                  <li>Role: {item.role}</li>
                  <li>Members: [ {item.members} ]</li>
                  <li>Admins: [ {item.admins} ]</li>
                  <li>Start Date: {item.start_date}</li>
                  <li>End Date: {item.end_date}</li>
                  <li>
                    <Link to={`/gallery/${item.bubl_id}`}><span className="text-red-500">Look Inside!</span></Link>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default BublsTest;
