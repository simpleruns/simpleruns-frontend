import React from "react";

import { MdBarChart, MdDashboard } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";

import Widget from "components/widget";
import WeeklyRevenue from "components/charts/weeklyRevenue";
import TotalSpent from "components/charts/totalSpent";

const HomePage = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Drivers"}
          subtitle={"10"}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Customers"}
          subtitle={"200"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Vehicles"}
          subtitle={"15"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Total Revenue"}
          subtitle={"$150k"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Today Revenue"}
          subtitle={"$4600"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Weekly Revenue"}
          subtitle={"$10k"}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>
    </>
  )
};

export default HomePage;
