import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import foto1 from "/src/assets/img/naufal.png";
import foto2 from "/src/assets/img/ghiyats.png";
import foto3 from "/src/assets/img/hauzan.png";
import linkedInIcon from "/src/assets/linkedin.svg";
import githubIcon from "/src/assets/github.svg";

const linkedInLinks = [
  "https://www.linkedin.com/in/irawanaufal29",
  "https://www.linkedin.com/in/ghiyats-ibnu-syahied-883ba121a",
  "https://www.linkedin.com/in/muhammad-hauzan-dini-fakhri/"
];

const githubLinks = [
  "https://github.com/NoisyBoy29",
  "https://github.com/ghiyatssyahied",
  "https://github.com/Shacent"
];

export function ProfileCard() {
  return (
    <div className="w-full p-5 bg-white rounded-lg">
      <Typography variant="h3" color="blue-gray" className="text-center mb-6 font-bold">
        ANGGOTA TIM
      </Typography>
      <div className="flex flex-wrap justify-center">
        {/* ProfileCard 1 */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
          <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader floated={false} className="h-68 rounded-t-lg overflow-hidden">
              <img src={foto1} alt="Naufal Maulana" className="object-cover w-full h-full" />
            </CardHeader>
            <CardBody className="text-center p-4">
              <Typography variant="h4" color="blue-gray" className="mb-2 font-semibold">
                Naufal Maulana
                <br />Al-Ghifari Irawan
              </Typography>
              <Typography color="blue-gray" className="font-medium">
                Team Leader
              </Typography>
            </CardBody>
            <CardFooter className="flex justify-center gap-7 pt-2">
              <Tooltip content="LinkedIn">
                <a
                  href={linkedInLinks[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkedInIcon} alt="LinkedIn" className="w-6 h-6" />
                </a>
              </Tooltip>
              <Tooltip content="GitHub">
                <a
                  href={githubLinks[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={githubIcon} alt="GitHub" className="w-6 h-6" />
                </a>
              </Tooltip>
            </CardFooter>
          </Card>
        </div>

        {/* ProfileCard 2 */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
          <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader floated={false} className="h-68 rounded-t-lg overflow-hidden">
              <img src={foto2} alt="Ghiyats Ibnu Syahied" className="object-cover w-full h-full" />
            </CardHeader>
            <CardBody className="text-center p-4">
              <Typography variant="h4" color="blue-gray" className="mb-2 font-semibold">
                Ghiyats Ibnu
                <br />Syahied
              </Typography>
              <Typography color="blue-gray" className="font-medium">
                Team Member
              </Typography>
            </CardBody>
            <CardFooter className="flex justify-center gap-7 pt-2">
              <Tooltip content="LinkedIn">
                <a
                  href={linkedInLinks[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkedInIcon} alt="LinkedIn" className="w-6 h-6" />
                </a>
              </Tooltip>
              <Tooltip content="GitHub">
                <a
                  href={githubLinks[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={githubIcon} alt="GitHub" className="w-6 h-6" />
                </a>
              </Tooltip>
            </CardFooter>
          </Card>
        </div>

        {/* ProfileCard 3 */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
          <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader floated={false} className="h-68 rounded-t-lg overflow-hidden">
              <img src={foto3} alt="Muhammad Hauzan Dini Fakhri" className="object-cover w-full h-full" />
            </CardHeader>
            <CardBody className="text-center p-4">
              <Typography variant="h4" color="blue-gray" className="mb-2 font-semibold">
                Muhammad Hauzan
                <br />Dini Fakhri
              </Typography>
              <Typography color="blue-gray" className="font-medium">
                Team Member
              </Typography>
            </CardBody>
            <CardFooter className="flex justify-center gap-7 pt-2">
              <Tooltip content="LinkedIn">
                <a
                  href={linkedInLinks[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkedInIcon} alt="LinkedIn" className="w-6 h-6" />
                </a>
              </Tooltip>
              <Tooltip content="GitHub">
                <a
                  href={githubLinks[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={githubIcon} alt="GitHub" className="w-6 h-6" />
                </a>
              </Tooltip>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
