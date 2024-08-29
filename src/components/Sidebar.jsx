import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { MapIcon, UserCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import logo from "../icon/ug.png";

export function DefaultSidebar() {

  return (
    <Card className="h-screen w-full sm:w-1/4 md:w-1/5 lg:w-1/6 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <div className="mb-6 p-4">
        <img src={logo} className="mx-auto w-24 h-auto rounded-full" alt="Logo" />
        <Typography className="text-center mt-4 text-2xl font-bold text-gray-800">
          Tracking Dashboard
        </Typography>
      </div>

      <List>
        <Link to="/">
          <ListItem className="text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            <ListItemPrefix>
              <MapIcon className="h-6 w-6 text-gray-600" />
            </ListItemPrefix>
            Home
          </ListItem>
        </Link>

        <Link to="/report">
          <ListItem className="text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            <ListItemPrefix>
              <InformationCircleIcon className="h-6 w-6 text-gray-600" />
            </ListItemPrefix>
            Report
          </ListItem>
        </Link>

        <Link to="/about">
          <ListItem className="text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            <ListItemPrefix>
              <UserCircleIcon className="h-6 w-6 text-gray-600" />
            </ListItemPrefix>
            About
          </ListItem>
        </Link>
      </List>
    </Card>
  );
}

export default DefaultSidebar;
