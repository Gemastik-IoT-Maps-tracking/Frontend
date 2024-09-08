import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import {
  MapIcon,
  UserCircleIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import logo from "../icon/ug.png";

export function SidebarWithBurgerMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2" />
        )}
      </IconButton>

      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4"
        >
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

            <Link to="/allData">
              <ListItem className="text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <ListItemPrefix>
                  <InformationCircleIcon className="h-6 w-6 text-gray-600" />
                </ListItemPrefix>
                Map All
              </ListItem>
            </Link>

            <Link to="/sos">
              <ListItem className="text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <ListItemPrefix>
                  <InformationCircleIcon className="h-6 w-6 text-gray-600" />
                </ListItemPrefix>
                SOS Track
              </ListItem>
            </Link>

            <Link to="/report">
              <ListItem className="text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <ListItemPrefix>
                  <InformationCircleIcon className="h-6 w-6 text-gray-600" />
                </ListItemPrefix>
                Data
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
      </Drawer>
    </>
  );
}

export default SidebarWithBurgerMenu;
